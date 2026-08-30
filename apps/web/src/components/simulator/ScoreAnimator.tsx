'use client';
import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ScoreAnimatorProps {
  value: number;
  previousValue?: number;
  label: string;
  suffix?: string;
  size?: 'sm' | 'lg';
}

export function ScoreAnimator({ value, previousValue, label, suffix = '', size = 'lg' }: ScoreAnimatorProps) {
  const [displayValue, setDisplayValue] = useState(previousValue ?? value);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    if (startValue === endValue) return;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(endValue);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const delta = previousValue !== undefined ? value - previousValue : 0;

  let colorClass = 'text-emerald-400';
  if (value < 50) colorClass = 'text-rose-400';
  else if (value < 70) colorClass = 'text-amber-400';
  else if (value < 85) colorClass = 'text-blue-400';

  return (
    <div className="text-center">
      <span className={`text-[10px] text-slate-400 uppercase tracking-wider block font-medium`}>{label}</span>
      <div className="flex items-center justify-center space-x-1.5">
        <span className={`font-black tabular-nums ${size === 'lg' ? 'text-lg' : 'text-base'} ${colorClass}`}>
          {displayValue}{suffix}
        </span>
        {delta !== 0 && (
          <span className={`flex items-center text-[10px] font-bold px-1 py-0.5 rounded ${delta > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {delta > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
            {Math.abs(delta)}
          </span>
        )}
      </div>
    </div>
  );
}
