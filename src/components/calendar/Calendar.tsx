"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { HeroHeader } from "./HeroHeader";
import { DropdownSelector } from "./DropdownSelector";
import { CalendarGrid } from "./CalendarGrid";
import { SchedulePanel } from "./SchedulePanel";
import { ExportImport } from "./ExportImport";

export function Calendar() {
  const {
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToMonthYear,
    startDate,
    endDate,
    handleDateClick,
    schedule,
    updateScheduleForDate,
    addBulkTasks,
    clearSelection,
    selectedDateForNote,
    fireDates,
    currentStreak,
    exportData,
    importData,
    lastSynced,
  } = useCalendar();

  return (
    <div className="w-full lg:h-[760px] flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch min-h-0 flex-1">
      
      {/* ---------------- LEFT PANEL: CALENDAR GRID & SEASONS ---------------- */}
      <div className="w-full lg:w-2/3 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative shadow-black/50 min-h-0 shrink-0 lg:shrink">
        
        {/* Desktop Tools: Top Right Action Buttons */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30 flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">
            <ExportImport onExport={exportData} onImport={importData} />
          </div>

          {/* Flame Streak Indicator Widget */}
          <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1 md:py-1.5 bg-[#080808]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
            <span className="text-lg md:text-xl">🔥</span>
            <span className="text-white font-bold tracking-wide text-xs md:text-base">
              {currentStreak} <span className="text-white/60 font-medium hidden md:inline">Streak</span>
            </span>
          </div>
        </div>

        <HeroHeader currentMonth={currentMonth} />
        
        <div className="flex-1 flex flex-col min-h-0 bg-[#080808]/20 relative z-20">
          <DropdownSelector
            currentMonth={currentMonth}
            onJump={jumpToMonthYear}
            onPrev={prevMonth}
            onNext={nextMonth}
          />
          <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-0 pr-0 md:pr-2 pb-4">
            <CalendarGrid
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                schedule={schedule}
                fireDates={fireDates}
                onDateClick={handleDateClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Tools: Fallback buttons exposed under calendar on small devices */}
      <div className="w-full flex justify-end gap-2 sm:hidden px-2">
        <ExportImport onExport={exportData} onImport={importData} />
      </div>

      {/* ---------------- RIGHT PANEL: DRAGGABLE DATA SCHEDULE ---------------- */}
      <div className="w-full lg:w-1/3 flex flex-col h-[500px] sm:h-[600px] lg:h-auto min-h-0 shrink-0 lg:shrink">
        <SchedulePanel
          selectedDate={selectedDateForNote}
          startDate={startDate}
          endDate={endDate}
          schedule={schedule}
          onUpdateSchedule={updateScheduleForDate}
          onAddBulkTasks={addBulkTasks}
          onClearSelection={clearSelection}
          lastSynced={lastSynced}
        />
      </div>

    </div>
  );
}
