import { Calendar } from "@/components/calendar/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden flex flex-col lg:justify-center p-2 md:p-4 lg:p-6 selection:bg-[#F97316]/30 selection:text-white pb-10 lg:pb-6">
      
      {/* Ambient glassmorphism glowing blobs for background depth */}
      <div className="absolute top-0 left-0 w-[80vw] lg:w-[40vw] h-[40vh] bg-[#A7F3D0] rounded-full filter blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[80vw] lg:w-[40vw] h-[40vh] bg-[#C4B5FD] rounded-full filter blur-[120px] opacity-20 pointer-events-none" />
      
      {/* Central application wrapper holding the dashboard components */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <Calendar />
      </div>
    </main>
  );
}
