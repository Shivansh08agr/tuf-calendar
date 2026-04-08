import { format } from "date-fns";

interface HeroHeaderProps {
  currentMonth: Date;
}

export function HeroHeader({ currentMonth }: HeroHeaderProps) {
  const getSeason = (date: Date) => {
    const month = date.getMonth(); // 0 is Jan
    
    if (month === 11 || month === 0 || month === 1) return "winter";
    if (month === 2 || month === 3) return "spring";
    if (month === 4 || month === 5) return "summer";
    if (month >= 6 && month <= 8) return "rainy";
    if (month === 9 || month === 10) return "autumn";
    
    return "autumn";
  };

  const season = getSeason(currentMonth);
  const heroImage = `/images/${season}.jpg`;

  return (
    <div className="relative w-full h-[160px] md:h-[220px] rounded-t-3xl overflow-hidden border-b border-white/10 shrink-0">
      <img
        src={heroImage}
        alt={`${season} landscape`}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 px-4 py-2 md:px-6 md:py-3 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 transition-all">
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
          {format(currentMonth, "MMMM")}
        </h1>
        <p className="text-white/80 font-medium tracking-wide mt-1 drop-shadow-md text-sm md:text-base">
          {format(currentMonth, "yyyy")} • {season.charAt(0).toUpperCase() + season.slice(1)}
        </p>
      </div>
    </div>
  );
}
