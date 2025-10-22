"use client";
import React from "react";

export default function NotesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notes</h2>
      <div className="p-4 rounded border bg-card">
        <p className="text-sm text-muted-foreground">You have no personal notes yet. Use the editor to jot down important points.</p>
      </div>
      <textarea className="w-full p-3 rounded border bg-background text-foreground" rows={6} placeholder="Write your notes here..."></textarea>
    </div>
  );
}
