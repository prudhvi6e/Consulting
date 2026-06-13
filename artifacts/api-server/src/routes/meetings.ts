import { Router, type IRouter } from "express";
import {
  getCalendarService,
  generateDailySlots,
  getMeetingsForDay,
  countMeetingsPerSlot,
  getOpenSlots,
  isOutOfOffice,
} from "../lib/google-calendar";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Read-only: open 30-min slots for a day. ?date=YYYY-MM-DD
router.get("/available-slots", async (req, res) => {
  try {
    const date = String(req.query["date"] || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "date=YYYY-MM-DD is required" });
    }
    const calendar = await getCalendarService();
    const slots = generateDailySlots();
    const events = await getMeetingsForDay(calendar, date);

    if (isOutOfOffice(events)) return res.json([]);

    const counts = countMeetingsPerSlot(slots, events);
    return res.json(getOpenSlots(slots, counts));
  } catch (err) {
    logger.error({ err }, "available-slots failed");
    return res.status(500).json({ error: "Failed to fetch slots" });
  }
});

// Create a Google Calendar event with a Meet link and email invites.
router.post("/create-meeting", async (req, res) => {
  try {
    const { eventName, startDateTime, endDateTime, attendees, timeZone, agenda } = req.body ?? {};

    if (!eventName || !startDateTime || !endDateTime || !Array.isArray(attendees)) {
      return res.status(400).json({
        message: "eventName, startDateTime, endDateTime, attendees[] required",
      });
    }

    const calendar = await getCalendarService();

    // Guard: reject if any attendee already has a meeting in the next 30 days.
    const now = new Date();
    const eventsRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      maxResults: 2500,
    });

    const requested = new Set(
      (attendees as string[]).map((e) => (e || "").toLowerCase()),
    );
    const busy = new Set<string>();
    for (const ev of eventsRes.data.items || []) {
      for (const a of ev.attendees || []) {
        const email = (a?.email || "").toLowerCase();
        if (email && requested.has(email)) busy.add(email);
      }
      const organizer = (ev.organizer?.email || "").toLowerCase();
      if (organizer && requested.has(organizer)) busy.add(organizer);
    }

    if (busy.size > 0) {
      const emails = Array.from(busy);
      return res.status(400).json({
        message: `One or more attendees already have scheduled meetings within the next 30 days: ${emails.join(
          ", ",
        )}. Please remove those attendees and try again.`,
        emails,
      });
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendUpdates: "all", // email invites
      requestBody: {
        summary: eventName,
        description: agenda || "Consultation with PS Rao Corporate Solutions has been scheduled.",
        start: { dateTime: startDateTime, timeZone: timeZone || "Asia/Kolkata" },
        end: { dateTime: endDateTime, timeZone: timeZone || "Asia/Kolkata" },
        attendees: (attendees as string[]).map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${now.getTime()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Meeting created successfully",
      meetLink: response.data.hangoutLink,
      eventId: response.data.id,
    });
  } catch (err: unknown) {
    logger.error({ err }, "create-meeting failed");
    const message = err instanceof Error ? err.message : "Failed to create meeting";
    return res.status(500).json({ message: "Failed to create meeting", error: message });
  }
});

export default router;
