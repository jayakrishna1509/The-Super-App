import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function NotesWidget() {
  const notes = useStore((state) => state.notes);
  const updateNotes = useStore((state) => state.updateNotes);

  const [localNotes, setLocalNotes] = useState(notes);

  // Keep local text in sync with global store changes (if any)
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  // Debounced auto-saving effect
  useEffect(() => {
    if (localNotes === notes) return;

    const delayDebounceFn = setTimeout(() => {
      updateNotes(localNotes);
    }, 500); // 500ms debounce for fast local state updates

    return () => clearTimeout(delayDebounceFn);
  }, [localNotes, notes, updateNotes]);

  return (
    <div className="bg-[#F1C75B] text-black rounded-[30px] p-8 flex flex-col h-full relative overflow-hidden shadow-2xl select-none">
      {/* Title */}
      <h3 className="font-sans font-extrabold text-[28px] tracking-tight text-neutral-950 mb-5 select-none shrink-0">
        All notes
      </h3>

      {/* Editor Body with custom notes-scrollbar */}
      <div className="flex-1 overflow-hidden">
        <textarea
          id="notes-textarea"
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          placeholder="Write down your thoughts..."
          className="w-full h-full bg-transparent resize-none border-0 focus:ring-0 outline-none placeholder-black/30 text-sm md:text-[15px] font-medium leading-relaxed overflow-y-auto pr-3 notes-scrollbar select-text selection:bg-black/10"
        />
      </div>
    </div>
  );
}
