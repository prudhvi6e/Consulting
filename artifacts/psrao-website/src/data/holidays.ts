// Indian national + Telangana state holidays (office closed → not bookable).
// Fixed-date holidays are exact; festival dates that follow lunar/Islamic
// calendars are best-known estimates and should be confirmed against the
// official Telangana government holiday list each year.
export const HOLIDAYS: Record<string, string> = {
  // ---- 2026 ----
  "2026-01-01": "New Year's Day",
  "2026-01-14": "Makar Sankranti / Pongal",
  "2026-01-15": "Kanuma",
  "2026-01-26": "Republic Day",
  "2026-02-15": "Maha Shivaratri",
  "2026-03-04": "Holi",
  "2026-03-19": "Ugadi",
  "2026-03-21": "Eid al-Fitr (Ramzan)",
  "2026-03-26": "Sri Rama Navami",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. B. R. Ambedkar Jayanti",
  "2026-05-01": "May Day",
  "2026-05-27": "Bakrid (Eid al-Adha)",
  "2026-06-02": "Telangana Formation Day",
  "2026-06-26": "Muharram",
  "2026-08-15": "Independence Day",
  "2026-09-04": "Krishna Janmashtami",
  "2026-09-14": "Ganesh Chaturthi",
  "2026-09-25": "Eid Milad-un-Nabi",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Dussehra (Vijayadashami)",
  "2026-10-21": "Bathukamma",
  "2026-11-08": "Diwali (Deepavali)",
  "2026-12-25": "Christmas",
  // ---- 2027 (fixed dates exact; lunar/Islamic festivals are estimates) ----
  "2027-01-01": "New Year's Day",
  "2027-01-13": "Bhogi",
  "2027-01-14": "Makar Sankranti / Pongal",
  "2027-01-15": "Kanuma",
  "2027-01-26": "Republic Day",
  "2027-03-06": "Maha Shivaratri",
  "2027-03-11": "Eid al-Fitr (Ramzan)",
  "2027-03-22": "Holi",
  "2027-03-26": "Good Friday",
  "2027-04-07": "Ugadi",
  "2027-04-14": "Dr. B. R. Ambedkar Jayanti",
  "2027-04-15": "Sri Rama Navami",
  "2027-05-01": "May Day",
  "2027-05-17": "Bakrid (Eid al-Adha)",
  "2027-06-02": "Telangana Formation Day",
  "2027-06-16": "Muharram",
  "2027-08-15": "Independence Day",
  "2027-08-25": "Krishna Janmashtami",
  "2027-09-03": "Ganesh Chaturthi",
  "2027-09-14": "Eid Milad-un-Nabi",
  "2027-10-02": "Gandhi Jayanti",
  "2027-10-09": "Dussehra (Vijayadashami)",
  "2027-10-10": "Bathukamma",
  "2027-10-29": "Diwali (Deepavali)",
  "2027-12-25": "Christmas",
};

const key = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const isHoliday = (d: Date): boolean => key(d) in HOLIDAYS;
export const getHolidayName = (d: Date): string | undefined => HOLIDAYS[key(d)];
