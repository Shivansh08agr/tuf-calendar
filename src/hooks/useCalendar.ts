import { useState, useEffect } from "react";
import { addMonths, subMonths, isSameDay, isBefore, setMonth, setYear, parseISO, differenceInDays } from "date-fns";

export interface ScheduleTask {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  order: number;
  type?: "task" | "note";
}

export type ScheduleData = Record<string, ScheduleTask[]>;

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const [schedule, setSchedule] = useState<ScheduleData>({});
  
  const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
  const [lastSynced, setLastSynced] = useState<string>("");

  const SCHEDULE_KEY = "productive_calendar_v3_schedule";
  const RANGE_KEY = "productive_calendar_v3_range";

  // --- CORE SYSTEM: State Persistence ---
  // Hooks into native local storage to automatically bootstrap saved schedule blocks and active calendar cursor memory
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SCHEDULE_KEY);
      if (stored) {
        setSchedule(JSON.parse(stored));
      }
      const storedRange = localStorage.getItem(RANGE_KEY);
      if (storedRange) {
        const { start, end } = JSON.parse(storedRange);
        if (start) setStartDate(new Date(start));
        if (end) setEndDate(new Date(end));
      }
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(RANGE_KEY, JSON.stringify({
      start: startDate?.toISOString() || null,
      end: endDate?.toISOString() || null,
    }));
  }, [startDate, endDate]);

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const jumpToMonthYear = (month: number, year: number) => {
    let date = new Date(currentMonth);
    date = setMonth(date, month);
    date = setYear(date, year);
    setCurrentMonth(date);
  };

  const handleDateClick = (date: Date) => {
    if (startDate && !endDate && !isBefore(date, startDate) && !isSameDay(date, startDate)) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
    setSelectedDateForNote(date);
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDateForNote(null);
  };

  const updateScheduleForDate = (dateStr: string, newTasks: ScheduleTask[]) => {
    setSchedule(prev => ({
      ...prev,
      [dateStr]: newTasks,
    }));
    setLastSynced(new Date().toLocaleTimeString());
  };

  // --- ACTION: Data Insertion Engine ---
  // Batch injects elements securely to multiple dates concurrently. Utilizes discriminators to split generic priority notes from rigid deadline tasks.
  const addBulkTasks = (dateStrs: string[], text: string = "", time: string = "12:00", itemType: "task" | "note" = "task") => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      dateStrs.forEach(dateStr => {
        const existing = newSchedule[dateStr] || [];
        const newTask: ScheduleTask = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          text,
          time: itemType === "note" ? "" : time,
          completed: false,
          order: existing.length,
          type: itemType,
        };
        newSchedule[dateStr] = [...existing, newTask];
      });
      return newSchedule;
    });
    setLastSynced(new Date().toLocaleTimeString());
  };

  // --- ALGORITHM: Fire Emoji Eligibility ---
  // Aggressively scans all blocks locally, manually ripping out text-notes to verify strictly that 100% of the timeline deadlines are completed
  const fireDates = new Set<string>();
  Object.keys(schedule).forEach(dateStr => {
    const allItems = schedule[dateStr] || [];
    const tasks = allItems.filter(t => t.type !== "note");
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      fireDates.add(dateStr);
    }
  });

  // --- ALGORITHM: Streak Calculation ---
  // Maps backwards temporally from today strictly requiring consecutive day connections globally to accumulate current ongoing integer streak score
  const getStreak = () => {
    if (fireDates.size === 0) return 0;
    const sorted = Array.from(fireDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mostRecentStr = sorted[0];
    const mostRecentDate = parseISO(mostRecentStr);
    mostRecentDate.setHours(0, 0, 0, 0);

    const diffToToday = differenceInDays(today, mostRecentDate);
    if (diffToToday > 1) {
      return 0; 
    }

    let currentStreak = 0;
    let expected = mostRecentDate;

    for (let i = 0; i < sorted.length; i++) {
       const cd = parseISO(sorted[i]);
       cd.setHours(0,0,0,0);
       if (isSameDay(cd, expected)) {
          currentStreak++;
          expected.setDate(expected.getDate() - 1);
       } else {
         break;
       }
    }
    return currentStreak;
  };

  // --- UTILITY: Database Portability ---
  // Destructures the full deep nested node state and forces valid generic CSV formatting (appending the 5th type schema identifier)
  const exportData = () => {
    // Generate CSV string using a standard RFC 4180 format
    let csvContent = "Date,Time,Task,Completed,Type\n";
    Object.keys(schedule).forEach(dateStr => {
      schedule[dateStr].forEach(task => {
        const safeText = task.text.replace(/"/g, '""');
        csvContent += `${dateStr},${task.time},"${safeText}",${task.completed},${task.type || "task"}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.download = `calendar_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (dataStr: string) => {
    try {
      if (dataStr.startsWith("Date,Time,Task,Completed")) {
        const lines = dataStr.split("\n").slice(1);
        const newSchedule: ScheduleData = {};
        
        lines.forEach(line => {
          if (!line.trim()) return;
          const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
          const match = line.match(regex);
          if (match && match.length >= 4) {
            const dateStr = match[0].replace(/(^"|"$)/g, '');
            const time = match[1].replace(/(^"|"$)/g, '');
            const text = match[2].replace(/(^"|"$)/g, '').replace(/""/g, '"');
            const completed = match[3] === "true";
            const type = (match[4] ? match[4].replace(/(^"|"$)/g, '') : "task") as "task" | "note";
            
            if (!newSchedule[dateStr]) newSchedule[dateStr] = [];
            newSchedule[dateStr].push({
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
              time, text, completed, order: newSchedule[dateStr].length, type
            });
          }
        });
        setSchedule(newSchedule);
      } else {
        const parsed = JSON.parse(dataStr);
        if (parsed.schedule) setSchedule(parsed.schedule);
        if (parsed.startDate) setStartDate(new Date(parsed.startDate));
        if (parsed.endDate) setEndDate(new Date(parsed.endDate));
      }
      setLastSynced(new Date().toLocaleTimeString());
    } catch(err) {
      console.error("Failed to import", err);
      alert("Failed to parse import file.");
    }
  };

  return {
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToMonthYear,
    startDate,
    endDate,
    handleDateClick,
    clearSelection,
    schedule,
    updateScheduleForDate,
    addBulkTasks,
    selectedDateForNote,
    setSelectedDateForNote,
    fireDates,
    currentStreak: getStreak(),
    exportData,
    importData,
    lastSynced,
  };
}
