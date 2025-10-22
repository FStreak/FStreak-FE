"use client";

import { useEffect, useState } from "react";
// Image import removed: using inline SVG animation for full control

export default function LoadingSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  // Inline animated flame SVG — morphing + flicker + grow/trim effect
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-flame">
          <svg viewBox="0 0 120 160" width="160" height="210" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <clipPath id="trim">
                {/* rect animated to trim/grow the visible top area of the flame */}
                <rect x="0" y="-40" width="120" height="240">
                  <animate attributeName="y" values="-40;10;-40" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="height" values="240;140;240" dur="1.8s" repeatCount="indefinite" />
                </rect>
              </clipPath>
            </defs>

            <g clipPath="url(#trim)">
              {/* Outer silhouette (grows/trims) */}
              <path id="outer" fill="#ff7a00" d="M60 200 C100 150, 120 110, 110 70 C100 40, 78 30, 68 10 C58 30, 40 40, 30 70 C20 110, 40 150, 60 200Z" filter="url(#glow)">
                <animate attributeName="d" dur="1.8s" repeatCount="indefinite" values='
                  M60 200 C100 150, 120 110, 110 70 C100 40, 78 30, 68 10 C58 30, 40 40, 30 70 C20 110, 40 150, 60 200Z;
                  M60 200 C104 152, 122 108, 108 68 C96 42, 76 28, 66 12 C56 32, 38 44, 28 72 C18 112, 38 152, 60 200Z;
                  M60 200 C100 150, 120 110, 110 70 C100 40, 78 30, 68 10 C58 30, 40 40, 30 70 C20 110, 40 150, 60 200Z' />
              </path>

              {/* Middle flame */}
              <path id="middle" fill="#ff9b3d" d="M60 170 C86 135, 98 110, 94 82 C90 60, 76 50, 66 36 C56 50, 44 60, 40 82 C36 110, 46 135, 60 170Z">
                <animate attributeName="d" dur="1.3s" repeatCount="indefinite" values='
                  M60 170 C86 135, 98 110, 94 82 C90 60, 76 50, 66 36 C56 50, 44 60, 40 82 C36 110, 46 135, 60 170Z;
                  M60 170 C88 136, 100 108, 92 80 C84 60, 74 48, 64 40 C54 52, 42 62, 38 82 C34 110, 46 136, 60 170Z;
                  M60 170 C86 135, 98 110, 94 82 C90 60, 76 50, 66 36 C56 50, 44 60, 40 82 C36 110, 46 135, 60 170Z' />
              </path>

              {/* Inner core */}
              <path id="core" fill="#ffea9a" d="M60 140 C70 125, 76 110, 74 96 C72 84, 66 78, 60 68 C54 78, 48 84, 46 96 C44 110, 50 125, 60 140Z">
                <animate attributeName="d" dur="1.1s" repeatCount="indefinite" values='
                  M60 140 C70 125, 76 110, 74 96 C72 84, 66 78, 60 68 C54 78, 48 84, 46 96 C44 110, 50 125, 60 140Z;
                  M60 140 C72 126, 78 108, 72 94 C66 82, 64 78, 60 72 C56 78, 50 82, 48 94 C46 108, 52 126, 60 140Z;
                  M60 140 C70 125, 76 110, 74 96 C72 84, 66 78, 60 68 C54 78, 48 84, 46 96 C44 110, 50 125, 60 140Z' />
              </path>

              {/* small flicker overlay */}
              <g opacity="0.9">
                <path fill="#ffd27a" d="M60 150 C74 132, 82 118, 80 104 C78 92, 72 86, 68 76 C64 86, 58 92, 56 104 C54 118, 62 132, 60 150Z">
                  <animate attributeName="opacity" values="0.9;0.6;0.9" dur="1s" repeatCount="indefinite" />
                </path>
              </g>
            </g>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold tracking-tight">F‑STREAK</div>
          <div className="text-sm text-muted-foreground mt-1">Keep your flame alive</div>
        </div>
      </div>
      <style jsx>{`
        .animate-flame { width: 220px; height: 290px; display:inline-block; }
        .animate-flame svg { width: 100%; height: 100%; display:block; }
        @media (prefers-reduced-motion: reduce) { .animate-flame, .animate-flame svg { animation: none !important; } }
      `}</style>
    </div>
  );
}
