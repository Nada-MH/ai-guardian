'use client';

import React from 'react';
import { Layers, ArrowRight, TrendingUp, CheckCircle2, Shield, Activity } from 'lucide-react';
import { ProgressiveStageComparison } from '../../types';

interface ProgressiveStageCardProps {
  stages: ProgressiveStageComparison[];
}

export function ProgressiveStageCard({ stages }: ProgressiveStageCardProps) {
  const getConfidenceBadge = (confidence: string, pct: number) => {
    if (pct >= 85) {
      return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">HIGH ({pct}%)</span>;
    }
    if (pct >= 65) {
      return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">MED ({pct}%)</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">LOW ({pct}%)</span>;
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Progressive Maturity Modeling
            </span>
            <h4 className="text-xs font-bold text-white">Policy vs. Control vs. Monitoring Impact</h4>
          </div>
        </div>
      </div>

      {/* 4 Multi-stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border transition-all space-y-2 flex flex-col justify-between ${
              stg.stage === 'POLICY_CONTROL_MONITORING'
                ? 'bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/40 shadow-lg'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                  Stage {idx + 1}
                </span>
                {getConfidenceBadge(stg.confidence, stg.confidencePct)}
              </div>
              <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{stg.label}</h5>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">{stg.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-850 flex items-baseline justify-between">
              <span className="text-lg font-black text-white font-mono">{stg.score}%</span>
              {stg.delta > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                  +{stg.delta}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
