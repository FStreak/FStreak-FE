"use client";
import React from "react";
import Navbar from "@/components/Navbar";
export default function MessagesPage(){
  return (
    <div className="space-y-4">
      <Navbar />
      <h2 className="text-lg font-semibold">Messages</h2>
      <div className="p-4 rounded border bg-card">
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between items-center">
            <div>
              <div className="font-medium">Instructor</div>
              <div className="text-muted-foreground">Reminder: office hours tomorrow</div>
            </div>
            <div className="text-xs text-muted-foreground">New</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
