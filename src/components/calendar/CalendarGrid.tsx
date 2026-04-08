import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  format,
} from "date-fns";
import { DayCell } from "./DayCell";
import { ScheduleTask } from "@/hooks/useCalendar";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  schedule: Record<string, ScheduleTask[]>;
  fireDates: Set<string>;
  onDateClick: (day: Date) => void;
}

export function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  schedule,
  fireDates,
  onDateClick,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateOfWeek = startOfWeek(monthStart);
  const endDateOfWeek = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDateOfWeek,
    end: endDateOfWeek,
  });


  while (days.length < 42) {
    const lastDay = days[days.length - 1];
    days.push(new Date(lastDay.getTime() + 86400000));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full p-4 md:p-6 pb-8 overflow-hidden">
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-white/50 uppercase tracking-wider h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={monthStart.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-y-2 relative"
        >
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelectedStart = startDate ? isSameDay(day, startDate) : false;
            const isSelectedEnd = endDate ? isSameDay(day, endDate) : false;
            
            let isInRange = false;
            if (startDate && endDate) {
              isInRange =
                (isAfter(day, startDate) || isSameDay(day, startDate)) &&
                (isBefore(day, endDate) || isSameDay(day, endDate));
            }

            const dateStr = format(day, "yyyy-MM-dd");
            const tasks = schedule[dateStr] || [];
            const hasTasks = tasks.length > 0;
            const isFireStatus = fireDates.has(dateStr);
            
            const prevDateStr = format(new Date(day.getTime() - 86400000), "yyyy-MM-dd");
            const nextDateStr = format(new Date(day.getTime() + 86400000), "yyyy-MM-dd");
            const isStreakPath = isFireStatus && (fireDates.has(prevDateStr) || fireDates.has(nextDateStr));

            return (
              <DayCell
                key={day.toString() + idx}
                day={day}
                isCurrentMonth={isCurrentMonth}
                isSelectedStart={isSelectedStart}
                isSelectedEnd={isSelectedEnd}
                isInRange={isInRange}
                hasTasks={hasTasks}
                isFireStatus={isFireStatus}
                isStreakPath={isStreakPath}
                onClick={onDateClick}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
