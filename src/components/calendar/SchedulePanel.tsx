import { useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { motion, Reorder } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, Save, GripVertical } from "lucide-react";
import { ScheduleTask } from "@/hooks/useCalendar";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: ScheduleTask;
  hasConflict: boolean;
  onUpdate: (task: ScheduleTask) => void;
  onRemove: (id: string) => void;
}

function TaskItem({ task, hasConflict, onUpdate, onRemove }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [time, setTime] = useState(task.time);

  const handleSave = () => {
    onUpdate({ ...task, text, time });
    setIsEditing(false);
  };

  const handleCancelOrDelete = () => {
    if (task.text.trim() === "" && text.trim() === "") {
        onRemove(task.id);
    } else {
        setText(task.text);
        setTime(task.time);
        setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancelOrDelete();
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md transition-all hover:border-white/20 shadow-sm">
      {!isEditing ? (
          <div className="flex items-center gap-3">
             <div className="cursor-pointer shrink-0">
                <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => onUpdate({ ...task, completed: e.target.checked })}
                className="w-5 h-5 rounded-full border-white/20 bg-black/20 text-[#A7F3D0] focus:ring-[#A7F3D0] focus:ring-offset-0 cursor-pointer"
                />
             </div>

             <div className="flex-1 flex flex-col relative overflow-hidden">
                <span className={cn(
                    "text-sm font-medium pr-2 break-words",
                    task.completed ? "text-white/40" : "text-white"
                )}>
                    {task.text || "Untitled Task"}
                </span>
                {task.completed && (
                <motion.div
                    layoutId={`strikethrough-${task.id}`}
                    className="absolute top-1/2 left-0 h-[1px] bg-white/40 pointer-events-none"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                />
                )}
             </div>

             <div className={cn(
               "text-xs font-semibold px-2 py-1 rounded bg-[#080808]/50 outline outline-1 shrink-0",
               hasConflict ? "text-red-400 outline-red-500" : "text-white/80 outline-white/10"
             )}>
                {task.time}
             </div>

             <button
                onClick={() => setIsEditing(true)}
                className="text-white/30 hover:text-white/80 transition-colors cursor-pointer p-1 shrink-0"
                title="Edit"
             >
                <Edit2 className="w-4 h-4" />
             </button>
             
             <button
                onClick={() => onRemove(task.id)}
                className="text-white/30 hover:text-red-400 transition-colors p-1 cursor-pointer shrink-0"
                title="Delete"
             >
                <Trash2 className="w-4 h-4 cursor-pointer" />
             </button>
          </div>
      ) : (
          <div className="flex flex-col gap-3">
             <div className="flex gap-2 items-center w-full">
                 <input
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     onKeyDown={handleKeyDown}
                     autoFocus
                     placeholder="Task description..."
                     className="flex-1 bg-[#080808]/50 text-white rounded-lg p-2 text-sm border border-white/10 focus:outline-none focus:border-[#C4B5FD] transition-colors w-full min-w-0"
                 />
                 <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-[#080808]/50 text-white rounded-lg px-2 py-1.5 border border-white/10 text-sm focus:outline-none focus:border-[#C4B5FD] cursor-pointer [color-scheme:dark] shrink-0"
                 />
             </div>
             
             <div className="flex justify-end gap-2 w-full">
                 <button
                    onClick={handleCancelOrDelete}
                    className="px-3 py-1.5 bg-white/5 text-white/80 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer whitespace-nowrap"
                 >
                    Cancel
                 </button>
                 <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#C4B5FD] text-[#080808] text-xs font-bold rounded-lg hover:bg-[#a78bfa] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                 >
                    <Save className="w-3.5 h-3.5" /> Save Scheduled Task
                 </button>
             </div>
          </div>
      )}
    </div>
  );
}

interface NoteItemProps {
  note: ScheduleTask;
  onUpdate: (task: ScheduleTask) => void;
  onRemove: (id: string) => void;
}

function NoteItem({ note, onUpdate, onRemove }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(note.text);

  const handleSave = () => {
    onUpdate({ ...note, text });
    setIsEditing(false);
  };

  const handleCancelOrDelete = () => {
    if (note.text.trim() === "" && text.trim() === "") {
        onRemove(note.id);
    } else {
        setText(note.text);
        setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-sm transition-all hover:bg-white/[0.04] shadow-sm select-none group">
      {!isEditing ? (
          <div className="flex items-start gap-3">
             <GripVertical className="w-5 h-5 text-white/10 shrink-0 cursor-grab active:cursor-grabbing group-hover:text-white/40 transition-colors mt-0.5" />
             <div className="flex-1 relative overflow-hidden">
                <span className="text-sm font-medium pr-2 text-white/80 break-words leading-snug wrap-break-word">
                    {note.text || "Empty Note"}
                </span>
             </div>

             <button
                onClick={() => setIsEditing(true)}
                className="text-white/30 hover:text-white/80 transition-colors cursor-pointer p-1 shrink-0"
                title="Edit Note"
             >
                <Edit2 className="w-3.5 h-3.5" />
             </button>
             
             <button
                onClick={() => onRemove(note.id)}
                className="text-white/30 hover:text-red-400 transition-colors p-1 cursor-pointer shrink-0"
                title="Delete Note"
             >
                <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
             </button>
          </div>
      ) : (
          <div className="flex flex-col gap-3">
             <div className="flex gap-2 items-center w-full">
                 <input
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     onKeyDown={(e) => { if(e.key==='Enter') handleSave(); if(e.key==='Escape') handleCancelOrDelete(); }}
                     autoFocus
                     placeholder="Type note or priority..."
                     className="flex-1 bg-[#080808]/50 text-white rounded-lg p-2 text-sm border border-white/10 focus:outline-none focus:border-[#C4B5FD] transition-colors w-full min-w-0"
                 />
             </div>
             
             <div className="flex justify-end gap-2 w-full">
                 <button
                    onClick={handleCancelOrDelete}
                    className="px-3 py-1.5 bg-white/5 text-white/80 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer whitespace-nowrap"
                 >
                    Cancel
                 </button>
                 <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#A7F3D0] text-[#080808] text-xs font-bold rounded-lg hover:bg-[#86efac] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                 >
                    <Save className="w-3.5 h-3.5" /> Save Note
                 </button>
             </div>
          </div>
      )}
    </div>
  );
}


interface SchedulePanelProps {
  selectedDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  schedule: Record<string, ScheduleTask[]>;
  onUpdateSchedule: (dateStr: string, tasks: ScheduleTask[]) => void;
  onAddBulkTasks: (dateStrs: string[], text?: string, time?: string, type?: "task" | "note") => void;
  onClearSelection: () => void;
  lastSynced: string;
}

export function SchedulePanel({ 
  selectedDate, startDate, endDate, schedule, 
  onUpdateSchedule, onAddBulkTasks, onClearSelection, lastSynced 
}: SchedulePanelProps) {
  
  const targetDate = (startDate && endDate) ? startDate : selectedDate;
  const targetDateStr = targetDate ? format(targetDate, "yyyy-MM-dd") : null;
  
  const rawTasks = targetDateStr ? (schedule[targetDateStr] || []) : [];
  
  // --- SEGREGATION LAYER ---
  // Extracts generic nested payloads into two distinct buckets mapping identically to their component capabilities
  const timedTasks = rawTasks.filter(t => t.type !== "note").sort((a, b) => a.time.localeCompare(b.time));
  const priorityNotes = rawTasks.filter(t => t.type === "note").sort((a, b) => a.order - b.order);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [draftType, setDraftType] = useState<"task" | "note">("task");
  const [draftText, setDraftText] = useState("");
  const [draftTime, setDraftTime] = useState("12:00");

  let datesToUpdate: string[] = [];
  if (startDate && endDate) {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    days.forEach(d => datesToUpdate.push(format(d, "yyyy-MM-dd")));
  } else if (targetDateStr) {
    datesToUpdate.push(targetDateStr);
  }

  const handleKeyDownWrapper = (e: React.KeyboardEvent<HTMLDivElement>) => {
     if ((e.target as HTMLElement).tagName === "INPUT") return;
     if (e.key === "Enter" && !isAddingTask && targetDateStr) {
        e.preventDefault();
        setIsAddingTask(true);
     }
  };

  const commitNewItem = () => {
    if (datesToUpdate.length === 0) return;
    onAddBulkTasks(datesToUpdate, draftText || (draftType === "note" ? "Untitled Note" : "Untitled Task"), draftTime, draftType);
    setIsAddingTask(false);
    setDraftText("");
    setDraftTime("12:00");
  };

  const handleUpdateTask = (updated: ScheduleTask) => {
    if (!targetDateStr) return;
    const newSchedule = rawTasks.map(t => t.id === updated.id ? updated : t);
    onUpdateSchedule(targetDateStr, newSchedule);
  };

  const handleRemoveTask = (id: string) => {
    if (!targetDateStr) return;
    const newSchedule = rawTasks.filter(t => t.id !== id);
    onUpdateSchedule(targetDateStr, newSchedule);
  };

  const handleReorderNotes = (reorderedNotes: ScheduleTask[]) => {
    if (!targetDateStr) return;
    const updatedNotes = reorderedNotes.map((n, idx) => ({ ...n, order: idx }));
    onUpdateSchedule(targetDateStr, [...timedTasks, ...updatedNotes]);
  };

  if (!targetDate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/50 bg-white/[0.02] rounded-3xl p-6 border border-white/5 mt-4 md:mt-0">
        <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm text-center">Select a date to view schedule.</p>
      </div>
    );
  }

  const timeCounts = timedTasks.reduce((acc, t) => {
    acc[t.time] = (acc[t.time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div 
        className="flex flex-col h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-5 transition-all flex-1 outline-none focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDownWrapper}
    >
      <div className="mb-4 flex items-start justify-end w-full">
        {!isAddingTask && (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all shadow-sm cursor-pointer whitespace-nowrap text-sm"
            title="Press Enter to add"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 min-h-0">
        
        {isAddingTask && (
          <div className="flex flex-col gap-3 p-3 md:p-4 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/20 rounded-xl shadow-2xl mb-2 items-center w-full">
             
             <div className="flex gap-1 w-full bg-black/40 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setDraftType("task")} 
                  className={cn("flex-1 text-xs py-1.5 rounded-md font-bold transition-all text-white/50", draftType === "task" && "bg-white/10 text-white shadow-sm ring-1 ring-white/10")}
                >
                  Timed Task
                </button>
                <button 
                  onClick={() => setDraftType("note")} 
                  className={cn("flex-1 text-xs py-1.5 rounded-md font-bold transition-all text-white/50", draftType === "note" && "bg-[#A7F3D0]/20 text-[#A7F3D0] shadow-sm ring-1 ring-[#A7F3D0]/30")}
                >
                  Priority Note
                </button>
             </div>

             <div className="flex gap-2 items-center w-full mt-1">
                 <input
                     value={draftText}
                     onChange={(e) => setDraftText(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && commitNewItem()}
                     autoFocus
                     placeholder={draftType === "task" ? "Task description..." : "Read-only priority note..."}
                     className="flex-1 bg-transparent text-white rounded-lg p-2 text-sm border-b border-white/10 focus:outline-none focus:border-[#C4B5FD] transition-colors w-full min-w-0"
                 />
                 {draftType === "task" && (
                    <input
                        type="time"
                        value={draftTime}
                        onChange={(e) => setDraftTime(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && commitNewItem()}
                        className="bg-[#080808]/50 text-white rounded-lg px-2 py-1.5 border border-white/10 text-sm focus:outline-none focus:border-[#C4B5FD] cursor-pointer [color-scheme:dark] shrink-0"
                    />
                 )}
             </div>
             
             <div className="flex justify-end gap-2 w-full mt-2">
                 <button
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 bg-white/5 text-white/80 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer whitespace-nowrap"
                 >
                    Cancel
                 </button>
                 <button
                    onClick={commitNewItem}
                    className={cn("flex items-center gap-2 px-3 py-1.5 text-[#080808] text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap", 
                      draftType === "task" ? "bg-[#C4B5FD] hover:bg-[#a78bfa] shadow-[0_0_15px_rgba(196,181,253,0.3)]" : "bg-[#A7F3D0] hover:bg-[#86efac] shadow-[0_0_15px_rgba(167,243,208,0.3)]"
                    )}
                 >
                    <Save className="w-4 h-4" /> Save {draftType === "task" ? "Task" : "Note"}
                 </button>
             </div>
          </div>
        )}

        {!isAddingTask && rawTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <p className="text-sm text-white/50 font-medium">Clear schedule.</p>
            <p className="text-xs text-white/30 italic mt-1 hidden md:block">Press <kbd className="px-1 bg-white/10 rounded">Enter</kbd> to add items.</p>
          </div>
        ) : (
            <div className="flex flex-col gap-6">
                
                {/* --- RENDER BLOCK 1: FRAGMENTED PHYSICS DRAGGABLES --- */}
                {/* Isolates Reorder hierarchy locally enabling users to manually scramble priorities freely independent of temporal locks */}
                {priorityNotes.length > 0 && (
                   <div className="flex flex-col pt-1">
                     <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#A7F3D0]"></span> Priority Notes
                     </div>
                     <Reorder.Group axis="y" values={priorityNotes} onReorder={handleReorderNotes} className="flex flex-col gap-2">
                        {priorityNotes.map(n => (
                           <Reorder.Item key={n.id} value={n}>
                              <NoteItem note={n} onUpdate={handleUpdateTask} onRemove={handleRemoveTask} />
                           </Reorder.Item>
                        ))}
                     </Reorder.Group>
                   </div>
                )}

                {/* --- RENDER BLOCK 2: STATIC TEMPORAL LOOP --- */}
                {/* Dynamically loads strict timed structures while identifying overlapping collision indices */}
                {timedTasks.length > 0 && (
                   <div className="flex flex-col">
                     <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C4B5FD]"></span> Scheduled Tasks
                     </div>
                     <div className="flex flex-col gap-2">
                        {timedTasks.map(t => (
                          <TaskItem
                            key={t.id}
                            task={t}
                            hasConflict={timeCounts[t.time] > 1}
                            onUpdate={handleUpdateTask}
                            onRemove={handleRemoveTask}
                          />
                        ))}
                     </div>
                   </div>
                )}

            </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 uppercase tracking-wider font-semibold shrink-0">
        <p className="hidden md:flex gap-2">
          <span><kbd className="bg-white/10 px-1 py-0.5 rounded text-white">Enter</kbd> Add Item</span>
        </p>
        <p className="w-full md:w-auto text-right">Last Synced: {lastSynced || "Just now"}</p>
      </div>
    </div>
  );
}
