import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  hasTasks: boolean;
  isFireStatus: boolean;
  isStreakPath: boolean;
  onClick: (day: Date) => void;
}

export function DayCell({
  day,
  isCurrentMonth,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  hasTasks,
  isFireStatus,
  isStreakPath,
  onClick,
}: DayCellProps) {
  return (
    <button
      onClick={() => onClick(day)}
      className={cn(
        "relative h-14 flex items-center justify-center text-sm font-medium transition-all cursor-pointer",
        
        !isCurrentMonth && "text-white/30",
        isCurrentMonth && "text-white/80 hover:bg-white/5",
        
        (!isInRange && !isSelectedStart && !isSelectedEnd) && "rounded-full",
        
        (isSelectedStart || isSelectedEnd) && "bg-[#F97316] text-white font-bold z-10 shadow-lg",
        
        isSelectedStart && isInRange && "rounded-l-full rounded-r-none",
        isSelectedEnd && isInRange && "rounded-r-full rounded-l-none",
        (isSelectedStart && !isInRange && !isSelectedEnd) && "rounded-full",
        isInRange && !isSelectedStart && !isSelectedEnd && "bg-orange-500/20 text-white rounded-none",

        isStreakPath && "ring-2 ring-[#A7F3D0] ring-inset" 
      )}
    >
      <span>{format(day, "d")}</span>
      
      <div className="absolute bottom-1 right-2 flex gap-1">
        {isFireStatus ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-[10px]"
          >
            🔥
          </motion.span>
        ) : hasTasks ? (
          <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shadow-[0_0_8px_#C4B5FD]" />
        ) : null}
      </div>
    </button>
  );
}
