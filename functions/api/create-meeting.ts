// POST /api/create-meeting -> { message, meetLink, eventId }
import { type Env, getAccessToken, listEvents, insertEvent, json } from "./_google";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      eventName?: string;
      startDateTime?: string;
      endDateTime?: string;
      attendees?: string[];
      timeZone?: string;
      agenda?: string;
    };
    const { eventName, startDateTime, endDateTime, attendees, timeZone, agenda } = body;

    if (!eventName || !startDateTime || !endDateTime || !Array.isArray(attendees)) {
      return json(
        { message: "eventName, startDateTime, endDateTime, attendees[] required" },
        400,
      );
    }

    const token = await getAccessToken(env);

    // Guard: reject if any attendee already has a meeting in the next 30 days.
    const now = new Date();
    const events = await listEvents(token, {
      timeMin: now.toISOString(),
      timeMax: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: "true",
      maxResults: "2500",
    });

    const requested = new Set(attendees.map((e) => (e || "").toLowerCase()));
    const busy = new Set<string>();
    for (const ev of events) {
      for (const a of ev.attendees || []) {
        const email = (a?.email || "").toLowerCase();
        if (email && requested.has(email)) busy.add(email);
      }
      const organizer = (ev.organizer?.email || "").toLowerCase();
      if (organizer && requested.has(organizer)) busy.add(organizer);
    }

    if (busy.size > 0) {
      const emails = Array.from(busy);
      return json(
        {
          message: `One or more attendees already have scheduled meetings within the next 30 days: ${emails.join(
            ", ",
          )}. Please remove those attendees and try again.`,
          emails,
        },
        400,
      );
    }

    const created = await insertEvent(token, {
      summary: eventName,
      description:
        agenda || "Consultation with PS Rao Corporate Solutions has been scheduled.",
      start: { dateTime: startDateTime, timeZone: timeZone || "Asia/Kolkata" },
      end: { dateTime: endDateTime, timeZone: timeZone || "Asia/Kolkata" },
      attendees: attendees.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${now.getTime()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    });

    return json({
      message: "Meeting created successfully",
      meetLink: created.hangoutLink,
      eventId: created.id,
    });
  } catch (err) {
    console.error("create-meeting failed", err);
    const message = err instanceof Error ? err.message : "Failed to create meeting";
    return json({ message: "Failed to create meeting", error: message }, 500);
  }
};
