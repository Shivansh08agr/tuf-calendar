import { Download, UploadCloud } from "lucide-react";
import { useRef } from "react";

interface ExportImportProps {
  onExport: () => void;
  onImport: (data: string) => void;
}

export function ExportImport({ onExport, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        onImport(event.target.result);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-all shadow-lg cursor-pointer"
        title="Export Schedule as CSV"
      >
        <Download className="w-4 h-4" /> Export CSV
      </button>

      <input
        type="file"
        accept=".json,.csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-semibold text-[#A7F3D0] hover:bg-[#A7F3D0]/10 transition-all shadow-lg cursor-pointer"
        title="Import Schedule CSV/JSON"
      >
        <UploadCloud className="w-4 h-4" /> Import Data
      </button>
    </div>
  );
}
