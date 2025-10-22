"use client";
import React from "react";
import Navbar from "@/components/Navbar";
export default function ResourcesPage(){
  return (
    <div className="space-y-4">
      <Navbar />
      <h2 className="text-lg font-semibold">Resources</h2>
      <div className="p-4 rounded border bg-card">
        <ul className="space-y-2 text-sm">
          <li><a className="text-primary" href="#">Course slides (PDF)</a></li>
          <li><a className="text-primary" href="#">Supplemental reading</a></li>
        </ul>
      </div>
    </div>
  );
}
