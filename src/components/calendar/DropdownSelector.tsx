import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface DropdownSelectorProps {
  currentMonth: Date;
  onJump: (month: number, year: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function DropdownSelector({ currentMonth, onJump, onPrev, onNext }: DropdownSelectorProps) {
  const currentM = currentMonth.getMonth();
  const currentY = currentMonth.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(i);
    return format(d, "MMMM");
  });

  const years = Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full p-4 md:p-6 pb-2 border-b border-white/5">
      <div className="flex items-center gap-3">
        <select
          value={currentM}
          onChange={(e) => onJump(Number(e.target.value), currentY)}
          className="bg-white/5 border border-white/10 text-white text-lg font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C4B5FD] cursor-pointer hover:bg-white/10 transition-colors appearance-none"
        >
          {months.map((m, i) => (
            <option key={m} value={i} className="bg-[#080808] text-white">
              {m}
            </option>
          ))}
        </select>

        <select
          value={currentY}
          onChange={(e) => onJump(currentM, Number(e.target.value))}
          className="bg-white/5 border border-white/10 text-white text-lg font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C4B5FD] cursor-pointer hover:bg-white/10 transition-colors appearance-none"
        >
          {years.map((y) => (
            <option key={y} value={y} className="bg-[#080808] text-white">
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
