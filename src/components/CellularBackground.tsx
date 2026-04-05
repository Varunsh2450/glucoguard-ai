"use client";

import React, { useEffect, useState } from 'react';

// Random number generator within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

export default function CellularBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on random positions

  // Generate 15 distinct cellular/molecular shapes
  const cells = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    type: Math.random() > 0.5 ? 'red-blood-cell' : 'glucose-hexagon',
    size: random(30, 120),
    left: random(0, 100),
    top: random(0, 100),
    duration: random(20, 40),
    delay: random(0, 20),
    opacity: random(0.05, 0.25),
  }));

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none -z-20">
      {/* Ambient background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 blur-[120px] rounded-[100%] animate-pulse-glow"></div>
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-red-900/10 blur-[100px] rounded-full animate-float-slow"></div>

      {cells.map((cell) => (
        <div
          key={cell.id}
          className="absolute"
          style={{
            left: `${cell.left}%`,
            top: `${cell.top}%`,
            width: cell.size,
            height: cell.size,
            opacity: cell.opacity,
            animation: `float ${cell.duration}s ease-in-out infinite ${cell.delay}s`,
          }}
        >
          {cell.type === 'red-blood-cell' ? (
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <defs>
                <radialGradient id={`grad-rbc-${cell.id}`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="40%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill={`url(#grad-rbc-${cell.id})`} />
              <circle cx="50" cy="50" r="25" fill="#991b1b" opacity="0.6" filter="blur(4px)" />
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(45,212,191,0.3)] animate-[spin_60s_linear_infinite]">
              <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" fill="none" stroke="#2dd4bf" strokeWidth="3" />
              <circle cx="50" cy="50" r="10" fill="#14b8a6" opacity="0.5" />
              {/* Connecting molecular bonds */}
              <line x1="50" y1="50" x2="50" y2="5" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="50" y1="50" x2="93" y2="73" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="50" y1="50" x2="7" y2="73" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4,4" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
