"use client";

import React, { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight || 0}`;
      
      setScrollProgress(Number(scroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 h-[2px] bg-brand-500 shadow-[0_0_10px_rgba(45,212,191,0.8)] z-50 transition-all duration-150 ease-out" 
         style={{ width: `${scrollProgress}%` }} />
  );
}
