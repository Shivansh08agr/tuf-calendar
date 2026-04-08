import { Calendar } from "@/components/calendar/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden flex flex-col lg:justify-center p-2 md:p-4 lg:p-6 selection:bg-[#F97316]/30 selection:text-white pb-10 lg:pb-6">
      {/* Central application wrapper holding the dashboard components */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <Calendar />
      </div>
    </main>
  );
}
