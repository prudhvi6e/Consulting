// Google Calendar helpers for the Cloudflare Pages Functions runtime.
//
// The original Express backend used the `googleapis` Node SDK. That SDK does not
// run on the Workers runtime, so this module reimplements exactly what the booking
// endpoints need using only Web-standard APIs (fetch + Web Crypto):
//   - mint a service-account JWT and exchange it for an access token
//     (domain-wide delegation: the JWT impersonates a Workspace user via `sub`)
//   - call the Calendar REST API directly
//
// Filenames prefixed with "_" are not routed by Pages, so this is a plain module.

export type Env = {
  GOOGLE_SERVICE_ACCOUNT_JSON: string; // raw service-account JSON (a Pages secret)
  CALENDAR_IMPERSONATE_USER?: string; // Workspace user whose calendar holds the appointments
};

const SCOPE = "https://www.googleapis.com/auth/calendar";
const DEFAULT_IMPERSONATE = "appointments@psrao.co.in";

// --- base64url helpers (no Node Buffer on Workers) ---------------------------

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function strToBase64Url(str: string): string {
  return bytesToBase64Url(new TextEncoder().encode(str));
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// --- service-account auth -----------------------------------------------------

type ServiceAccount = { client_email: string; private_key: string };

function loadCredentials(env: Env): ServiceAccount {
  const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured.");
  }
  const creds = JSON.parse(raw) as ServiceAccount;
  if (!creds.client_email || !creds.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email/private_key.");
  }
  return creds;
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Service-account keys are PKCS#8 PEM ("-----BEGIN PRIVATE KEY-----").
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  return crypto.subtle.importKey(
    "pkcs8",
    base64ToBytes(body),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

// Cache the access token across invocations of a warm isolate.
let tokenCache: { token: string; exp: number } | null = null;

export async function getAccessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.token;

  const creds = loadCredentials(env);
  const impersonate = env.CALENDAR_IMPERSONATE_USER || DEFAULT_IMPERSONATE;

  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: creds.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    sub: impersonate, // domain-wide delegation
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${strToBase64Url(JSON.stringify(header))}.${strToBase64Url(
    JSON.stringify(claims),
  )}`;
  const key = await importPrivateKey(creds.private_key);
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${bytesToBase64Url(new Uint8Array(sig))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Google token exchange failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Google token exchange returned no access_token.");

  tokenCache = { token: data.access_token, exp: now + (data.expires_in ?? 3600) };
  return data.access_token;
}

// --- Calendar REST ------------------------------------------------------------

const CAL_BASE = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export type CalendarEvent = {
  summary?: string;
  eventType?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  attendees?: { email?: string }[];
  organizer?: { email?: string };
  hangoutLink?: string;
  id?: string;
};

export async function listEvents(
  token: string,
  params: Record<string, string>,
): Promise<CalendarEvent[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${CAL_BASE}?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Calendar list failed (${res.status}): ${detail}`);
  }
  const data = (await res.json()) as { items?: CalendarEvent[] };
  return data.items || [];
}

export async function insertEvent(
  token: string,
  body: unknown,
): Promise<{ hangoutLink?: string; id?: string }> {
  const res = await fetch(`${CAL_BASE}?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Calendar insert failed (${res.status}): ${detail}`);
  }
  return (await res.json()) as { hangoutLink?: string; id?: string };
}

// --- slot math (ported verbatim from the Express server) ----------------------

export type SlotTime = { hours: number; minutes: number; meridiem: "AM" | "PM" };
export type Slot = { start: SlotTime; end: SlotTime };
type MinuteSlot = { start: number; end: number };

/** Working hours: 11:00–17:00 IST, 30-min slots, lunch 13:00–14:00 excluded. */
export function generateDailySlots(): MinuteSlot[] {
  const slots: MinuteSlot[] = [];
  const dayStart = 11 * 60;
  const dayEnd = 17 * 60;
  const lunchStart = 13 * 60;
  const lunchEnd = 14 * 60;
  for (let start = dayStart; start < dayEnd; start += 30) {
    const end = start + 30;
    if (start >= lunchStart && end <= lunchEnd) continue;
    slots.push({ start, end });
  }
  return slots;
}

// The Workers runtime is fixed to UTC, so we compute the IST wall-clock minute
// of an event explicitly (UTC minutes + 5h30m) rather than relying on the host
// timezone the way the original `new Date(...).getHours()` did.
function istMinutesOfDay(dateTime: string): number {
  const d = new Date(dateTime);
  return (d.getUTCHours() * 60 + d.getUTCMinutes() + 330) % 1440;
}

export function countMeetingsPerSlot(
  slots: MinuteSlot[],
  events: CalendarEvent[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const slot of slots) counts.set(`${slot.start}-${slot.end}`, 0);
  for (const event of events) {
    if (!event.start?.dateTime || !event.end?.dateTime) continue;
    const minutes = istMinutesOfDay(event.start.dateTime);
    for (const slot of slots) {
      if (minutes >= slot.start && minutes < slot.end) {
        const key = `${slot.start}-${slot.end}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
  }
  return counts;
}

function formatSlot(minutes: number): SlotTime {
  let h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const meridiem: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return { hours: h, minutes: m, meridiem };
}

/** Slots with fewer than 3 bookings are still open. */
export function getOpenSlots(slots: MinuteSlot[], counts: Map<string, number>): Slot[] {
  return slots
    .filter((slot) => (counts.get(`${slot.start}-${slot.end}`) || 0) < 3)
    .map((slot) => ({ start: formatSlot(slot.start), end: formatSlot(slot.end) }));
}

/** True if any event on the day marks the office as out of office. */
export function isOutOfOffice(events: CalendarEvent[]): boolean {
  return events.some(
    (ev) =>
      ev?.eventType === "outOfOffice" ||
      (!!ev?.summary && ev.summary.toLowerCase().includes("out of office")),
  );
}

// --- shared JSON response helper ---------------------------------------------

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
