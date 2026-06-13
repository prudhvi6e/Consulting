// Google Calendar booking service (self-contained — no external repo dependency).
// Uses a Google Workspace service account with domain-wide delegation, impersonating
// a Workspace user, to read availability and create events with a Meet link.
import { readFileSync } from "node:fs";
import path from "node:path";
import { google, type calendar_v3 } from "googleapis";
import { logger } from "./logger";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Workspace user whose calendar holds the appointments (overridable via env).
const IMPERSONATE_USER = process.env["CALENDAR_IMPERSONATE_USER"] || "appointments@psrao.co.in";

// Service-account credentials: a JSON file path (default: alongside this server),
// or the raw JSON in GOOGLE_SERVICE_ACCOUNT_JSON.
function loadCredentials(): { client_email: string; private_key: string } {
  const inline = process.env["GOOGLE_SERVICE_ACCOUNT_JSON"];
  if (inline) return JSON.parse(inline);
  const credsPath =
    process.env["GOOGLE_APPLICATION_CREDENTIALS"] ||
    path.resolve(process.cwd(), "service-account-creds.json");
  return JSON.parse(readFileSync(credsPath, "utf8"));
}

let cachedKey: { client_email: string; private_key: string } | null = null;
function getKey() {
  if (!cachedKey) cachedKey = loadCredentials();
  return cachedKey;
}

export async function getCalendarService(): Promise<calendar_v3.Calendar> {
  const key = getKey();
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: SCOPES,
    subject: IMPERSONATE_USER, // required for domain-wide delegation
  });
  await auth.authorize();
  return google.calendar({ version: "v3", auth });
}

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

export async function getMeetingsForDay(
  calendar: calendar_v3.Calendar,
  date: string,
): Promise<calendar_v3.Schema$Event[]> {
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: `${date}T00:00:00+05:30`,
    timeMax: `${date}T23:59:59+05:30`,
    singleEvents: true,
  });
  return res.data.items || [];
}

export function countMeetingsPerSlot(
  slots: MinuteSlot[],
  events: calendar_v3.Schema$Event[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const slot of slots) counts.set(`${slot.start}-${slot.end}`, 0);
  for (const event of events) {
    if (!event.start?.dateTime || !event.end?.dateTime) continue;
    const eventStart = new Date(event.start.dateTime);
    const minutes = eventStart.getHours() * 60 + eventStart.getMinutes();
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
export function isOutOfOffice(events: calendar_v3.Schema$Event[]): boolean {
  return events.some(
    (ev) =>
      ev?.eventType === "outOfOffice" ||
      (!!ev?.summary && ev.summary.toLowerCase().includes("out of office")),
  );
}

export { IMPERSONATE_USER, logger };
