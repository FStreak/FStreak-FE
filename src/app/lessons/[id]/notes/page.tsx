"use client";

import React, { useState } from "react";
import { Pencil, StickyNote } from "lucide-react";

export default function NotesPage() {
  const [note, setNote] = useState("");

  return (
    <div className="space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Notes
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Keep track of your study ideas and key takeaways.
            </p>
          </div>
          <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-xl shadow-sm">
            <StickyNote className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-2xl border border-[#FFEBD2] bg-white/95 shadow-sm p-6">
          <p className="text-sm text-gray-600">
            You have no personal notes yet. Use the editor below to jot down
            important points or reflections.
          </p>
        </div>

        {/* Note Editor */}
        <div className="rounded-2xl border border-[#FFEBD2] bg-white/95 shadow-sm p-6 space-y-3">
          <label
            htmlFor="note"
            className="flex items-center gap-2 text-gray-700 font-semibold text-sm"
          >
            <Pencil className="w-4 h-4 text-orange-500" />
            Write your notes
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={8}
            placeholder="Write your thoughts here..."
            className="w-full p-4 rounded-xl border border-[#FFEBD2] bg-[#FFFDF9] text-gray-700 text-sm placeholder-gray-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 outline-none transition-all resize-none"
          ></textarea>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!note.trim()) return;
                alert("✅ Note saved!");
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium text-sm hover:shadow-[0_0_15px_rgba(255,180,0,0.4)] transition-all flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>
    </div>
  );
}
