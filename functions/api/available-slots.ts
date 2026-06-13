// GET /api/available-slots?date=YYYY-MM-DD  -> Slot[]
import {
  type Env,
  getAccessToken,
  listEvents,
  generateDailySlots,
  countMeetingsPerSlot,
  getOpenSlots,
  isOutOfOffice,
  json,
} from "./_google";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const date = new URL(request.url).searchParams.get("date") || "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "date=YYYY-MM-DD is required" }, 400);
    }

    const token = await getAccessToken(env);
    const events = await listEvents(token, {
      timeMin: `${date}T00:00:00+05:30`,
      timeMax: `${date}T23:59:59+05:30`,
      singleEvents: "true",
    });

    if (isOutOfOffice(events)) return json([]);

    const slots = generateDailySlots();
    const counts = countMeetingsPerSlot(slots, events);
    return json(getOpenSlots(slots, counts));
  } catch (err) {
    console.error("available-slots failed", err);
    return json({ error: "Failed to fetch slots" }, 500);
  }
};
