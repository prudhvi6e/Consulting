// Client for the PS Rao booking API (Backend-master: Google Calendar + Meet).
// GET  /available-slots?date=YYYY-MM-DD  -> Slot[]
// POST /create-meeting                   -> { message, meetLink, eventId }
import { format } from "date-fns";

// Same-origin "/api" by default (Vite proxies it to the api-server in dev; a reverse
// proxy serves it in prod). Override with VITE_API_BASE_URL if the API is on another origin.
const API = `${(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")}/api`;

export type SlotTime = {
  hours: number; // 1–12
  minutes: number;
  meridiem: "AM" | "PM";
};

export type Slot = {
  start: SlotTime;
  end: SlotTime;
};

export type CreateMeetingPayload = {
  eventName: string;
  startDateTime: string; // "YYYY-MM-DDTHH:mm:ss" (IST wall-clock)
  endDateTime: string;
  attendees: string[];
  timeZone?: string;
  agenda?: string;
};

export type CreateMeetingResult = {
  message: string;
  meetLink?: string;
  eventId?: string;
};

/** Error carrying the backend's message (and any conflicting emails for the 30-day duplicate guard). */
export class BookingError extends Error {
  emails?: string[];
  constructor(message: string, emails?: string[]) {
    super(message);
    this.name = "BookingError";
    this.emails = emails;
  }
}

/** Fetch the open 30-min slots for a given day (read-only). */
export async function getAvailableSlots(date: string): Promise<Slot[]> {
  const res = await fetch(`${API}/available-slots?date=${encodeURIComponent(date)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new BookingError(body?.error || "Couldn't load available time slots. Please try again.");
  }
  return res.json();
}

/** Create the Google Calendar event (+ Meet link) and email invites. */
export async function createMeeting(payload: CreateMeetingPayload): Promise<CreateMeetingResult> {
  const res = await fetch(`${API}/create-meeting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new BookingError(
      body?.message || body?.error || "Couldn't schedule your meeting. Please try again.",
      body?.emails,
    );
  }
  return body as CreateMeetingResult;
}

/** "11:00 AM" */
export function slotLabel(t: SlotTime): string {
  return `${t.hours}:${String(t.minutes).padStart(2, "0")} ${t.meridiem}`;
}

/** "11:00 AM – 11:30 AM" */
export function slotRangeLabel(slot: Slot): string {
  return `${slotLabel(slot.start)} – ${slotLabel(slot.end)}`;
}

const to24 = (t: SlotTime): number => {
  const h = t.hours % 12;
  return (t.meridiem === "PM" ? h + 12 : h) * 60 + t.minutes;
};

/** Build "YYYY-MM-DDTHH:mm:ss" IST wall-clock strings for the chosen day + slot. */
export function buildStartEnd(slot: Slot, date: Date): { startDateTime: string; endDateTime: string } {
  const day = format(date, "yyyy-MM-dd");
  const fmt = (mins: number) =>
    `${day}T${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}:00`;
  return { startDateTime: fmt(to24(slot.start)), endDateTime: fmt(to24(slot.end)) };
}
