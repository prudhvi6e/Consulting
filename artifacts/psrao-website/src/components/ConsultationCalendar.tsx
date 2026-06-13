import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, addMonths, addDays, startOfDay, isBefore, isWeekend, isSameDay, getDaysInMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { isHoliday, getHolidayName } from "@/data/holidays";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ConsultationCalendar({
  value,
  onSelect,
  className,
}: {
  value?: Date;
  onSelect: (d: Date) => void;
  className?: string;
}) {
  const today = startOfDay(new Date());
  // Earliest bookable day: 2 days' lead time (matches the old booking flow).
  const minBookable = addDays(today, 2);
  const [view, setView] = useState<Date>(startOfMonth(value ?? today));

  const isDisabled = (d: Date) => isBefore(d, minBookable) || isWeekend(d) || isHoliday(d);

  const year = view.getFullYear();
  const month = view.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const days = getDaysInMonth(view);
  const canPrev = startOfMonth(today) < view;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));

  return (
    <div className={className}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white">{format(view, "MMMM yyyy")}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canPrev}
            onClick={() => canPrev && setView(addMonths(view, -1))}
            className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:border-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setView(addMonths(view, 1))}
            className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 hover:border-primary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs md:text-sm font-medium text-white/55 py-1">{w}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} aria-hidden />;
          const disabled = isDisabled(d);
          const selected = value && isSameDay(d, value);
          const holiday = getHolidayName(d);
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d)}
              title={holiday ?? (isWeekend(d) ? "Weekend — closed" : undefined)}
              aria-label={`${format(d, "EEEE, MMMM d, yyyy")}${holiday ? ` — ${holiday} (holiday)` : ""}`}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-base md:text-lg font-medium transition-colors",
                selected
                  ? "bg-primary text-primary-foreground border border-primary shadow-[0_0_18px_rgba(14,165,233,0.45)]"
                  : disabled
                    ? "text-white/25 cursor-not-allowed"
                    : "border border-white/15 text-white hover:bg-white/10 hover:border-primary cursor-pointer"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-white/45">Weekends &amp; public holidays are unavailable · bookings open 2 days ahead · all times IST.</p>
    </div>
  );
}
