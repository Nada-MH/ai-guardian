'use client';

import React, { useRef } from 'react';
import { Lightbulb, ChevronRight, X, Sparkles, Check } from 'lucide-react';
import { WhatIfScenario } from '../../types';

interface PillBarProps {
  scenarios: WhatIfScenario[];
  activeScenarioIds: string[];
  onToggleScenario: (id: string) => void;
  onClearAll: () => void;
}

export function PillBar({ scenarios, activeScenarioIds, onToggleScenario, onClearAll }: PillBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#111827]/90 border border-slate-800 rounded-full px-4 py-2.5 flex items-center space-x-3 shadow-xl backdrop-blur-md sticky top-0 z-20">
      {/* Lightbulb / Sparkles Icon (Matching User's Screenshot) */}
      <div className="flex items-center space-x-1 text-amber-400 shrink-0 pl-1">
        <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
      </div>

      {/* Horizontal Scrollable Pill Chips Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center space-x-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {scenarios.map((sc) => {
          const isActive = activeScenarioIds.includes(sc.id);
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onToggleScenario(sc.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400 shadow-lg shadow-blue-500/25 scale-105'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span>{sc.pillLabel}</span>
              {isActive && (
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Arrow Button (Matching User's Screenshot `>`) */}
      <button
        type="button"
        onClick={handleScrollRight}
        title="Scroll right"
        className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center shrink-0 border border-slate-700 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Clear Active Selections X Button */}
      {activeScenarioIds.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          title="Clear active What-If chips"
          className="w-7 h-7 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
