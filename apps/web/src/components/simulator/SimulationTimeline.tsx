'use client';
import React from 'react';
import { TimelineEvent } from '../../types';

interface SimulationTimelineProps {
  events: TimelineEvent[];
  activeEventId?: string;
  onEventClick?: (id: string) => void;
}

export function SimulationTimeline({ events, activeEventId, onEventClick }: SimulationTimelineProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'DEPLOYMENT': return 'bg-emerald-500';
      case 'INCIDENT': return 'bg-amber-500';
      case 'VIOLATION': return 'bg-rose-500';
      case 'ALERT':
      case 'MITIGATION': return 'bg-blue-500';
      case 'RESOLUTION': return 'bg-emerald-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="relative pl-6 py-4 space-y-6">
      {/* Vertical line connecting dots */}
      <div className="absolute top-6 bottom-6 left-[1.3rem] w-px bg-slate-700" />

      {events.map((event) => {
        const isActive = activeEventId === event.id;
        const colorClass = getEventColor(event.type);

        return (
          <div 
            key={event.id}
            onClick={() => onEventClick?.(event.id)}
            className={`relative flex items-start gap-4 p-3 rounded-lg transition-colors
              ${onEventClick ? 'cursor-pointer hover:bg-slate-800/50' : ''}
              ${isActive ? 'bg-slate-800 border border-slate-700 shadow-sm' : ''}
            `}
          >
            <div className="relative flex-shrink-0 mt-1">
              {isActive && (
                <div className={`absolute -inset-1.5 rounded-full opacity-30 animate-ping ${colorClass}`} />
              )}
              <div className={`w-3 h-3 rounded-full relative z-10 ring-4 ring-[#0B0F17] ${colorClass}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-500">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-300 border border-slate-700`}>
                  {event.type}
                </span>
              </div>
              <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                {event.title}
              </h4>
              {event.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
