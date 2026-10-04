import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

export type FirmEvent = {
  id: number;
  title: string;
  type: "event" | "duedate";
  date: string; // YYYY-MM-DD
  color: string;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

async function getEvents(): Promise<FirmEvent[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error(`events → ${res.status}`);
  return res.json();
}

const pad = (n: number) => String(n).padStart(2, "0");
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function EventsDueDates() {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [tab, setTab] = useState<"event" | "duedate">("duedate");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: events = [], isError } = useQuery({ queryKey: ["events"], queryFn: getEvents, staleTime: 10 * 60_000 });
  const [autoJumped, setAutoJumped] = useState(false);

  // On first load, if the current month is empty, jump to the nearest month that has entries
  // (next upcoming one, else the most recent past one) so the section never looks blank.
  useEffect(() => {
    if (autoJumped || !events.length) return;
    setAutoJumped(true);
    const cur = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
    if (events.some((e) => e.date.startsWith(cur))) return;
    const months = Array.from(new Set(events.map((e) => e.date.slice(0, 7)))).sort();
    const target = months.find((m) => m > cur) ?? months[months.length - 1];
    if (!target) return;
    const [y, m] = target.split("-").map(Number);
    setCursor({ y, m: m - 1 });
  }, [events, autoJumped]); // eslint-disable-line react-hooks/exhaustive-deps

  const byDay = useMemo(() => {
    const map = new Map<string, FirmEvent[]>();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [events]);

  const monthPrefix = `${cursor.y}-${pad(cursor.m + 1)}`;
  const monthList = useMemo(
    () => events.filter((e) => e.date.startsWith(monthPrefix) && e.type === tab && (!selected || e.date === selected)),
    [events, monthPrefix, tab, selected],
  );

  const first = new Date(cursor.y, cursor.m, 1).getDay();
  const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const move = (delta: number) => {
    setSelected(null);
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <section id="events" className="py-16 md:py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[140px]" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <Reveal>
          <div className="mb-10 md:mb-14 max-w-2xl">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Compliance Calendar</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white">Events &amp; Due Dates</h3>
            <p className="mt-4 text-secondary-foreground/70 text-lg">Statutory deadlines, board-meeting cut-offs and firm events — updated by our team every month so you never miss a filing.</p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Calendar */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => move(-1)} aria-label="Previous month" data-cursor className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="font-display text-xl md:text-2xl font-semibold text-white">{MONTHS[cursor.m]} {cursor.y}</div>
                <button onClick={() => move(1)} aria-label="Next month" data-cursor className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-xs uppercase tracking-widest text-secondary-foreground/50 mb-2">
                {DOW.map((d) => <div key={d} className="py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {cells.map((d, i) => {
                  if (!d) return <div key={`e${i}`} />;
                  const k = key(cursor.y, cursor.m, d);
                  const items = byDay.get(k) ?? [];
                  const isSel = selected === k;
                  const isToday = k === todayKey;
                  return (
                    <button
                      key={k}
                      onClick={() => setSelected(isSel ? null : k)}
                      data-cursor
                      className={cn(
                        "relative aspect-square rounded-xl text-sm md:text-base transition-all flex flex-col items-center justify-center gap-1",
                        items.length ? "bg-white/10 hover:bg-white/15 text-white font-medium" : "text-secondary-foreground/60 hover:bg-white/5",
                        isSel && "ring-2 ring-primary bg-primary/20",
                        isToday && !isSel && "ring-1 ring-sky-400/60",
                      )}
                    >
                      {d}
                      {items.length > 0 && (
                        <span className="flex gap-0.5">
                          {items.slice(0, 3).map((e) => (
                            <span key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* List */}
          <Reveal className="lg:col-span-2" delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-8 h-full flex flex-col">
              <div className="flex rounded-full bg-white/5 p-1 mb-6 text-sm font-medium">
                {([
                  { id: "duedate", label: "Due Dates", Icon: Bell },
                  { id: "event", label: "Events", Icon: CalendarDays },
                ] as const).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    data-cursor
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2 transition-colors",
                      tab === id ? "bg-primary text-primary-foreground shadow" : "text-secondary-foreground/70 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>

              <div className="flex-1 min-h-[280px] max-h-[380px] overflow-y-auto pr-1 space-y-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {isError ? (
                    <p className="text-secondary-foreground/60 text-sm">Calendar is temporarily unavailable.</p>
                  ) : monthList.length === 0 ? (
                    <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-secondary-foreground/60 text-sm">
                      No {tab === "duedate" ? "due dates" : "events"} {selected ? "on this day" : `in ${MONTHS[cursor.m]}`}.
                    </motion.p>
                  ) : (
                    monthList.map((e) => {
                      const d = new Date(e.date + "T00:00:00");
                      return (
                        <motion.div
                          key={e.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="shrink-0 w-12 text-center">
                            <div className="text-2xl font-display font-bold text-white leading-none">{d.getDate()}</div>
                            <div className="text-[10px] uppercase tracking-widest text-secondary-foreground/60 mt-1">{MONTHS[d.getMonth()].slice(0, 3)}</div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: e.color }} />
                              <span className="text-[10px] uppercase tracking-widest text-secondary-foreground/60">{e.type === "duedate" ? "Due date" : "Event"}</span>
                            </div>
                            <p className="text-sm md:text-base text-white leading-snug">{e.title}</p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
