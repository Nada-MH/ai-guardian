'use client';

import React from 'react';
import { CheckCircle2, XCircle, Info, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { WhatIfAssumption, ConfidenceBand } from '../../types';

interface AssumptionInspectorProps {
  assumptions: WhatIfAssumption[];
  confidenceLevel: ConfidenceBand;
  confidencePct: number;
  confidenceRationale: string;
  onToggleAssumption?: (id: string) => void;
}

export function AssumptionInspector({
  assumptions,
  confidenceLevel,
  confidencePct,
  confidenceRationale,
  onToggleAssumption
}: AssumptionInspectorProps) {

  const getConfidenceBadge = (level: ConfidenceBand) => {
    switch (level) {
      case 'HIGH_CONFIDENCE':
        return (
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
            HIGH CONFIDENCE ({confidencePct}%)
          </span>
        );
      case 'LOW_CONFIDENCE':
        return (
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
            LOW CONFIDENCE ({confidencePct}%)
          </span>
        );
      case 'MEDIUM_CONFIDENCE':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            MEDIUM CONFIDENCE ({confidencePct}%)
          </span>
        );
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
      
      {/* Header with Dynamic Confidence Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Assumption Engine
            </span>
            <h4 className="text-xs font-bold text-white">Explicit Governance Assumptions</h4>
          </div>
        </div>
        <div>
          {getConfidenceBadge(confidenceLevel)}
        </div>
      </div>

      {/* Assumptions Checklist */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
          Toggle Stated Assumptions & Verify Impact
        </span>
        <div className="space-y-1.5">
          {assumptions.map((asm) => (
            <div
              key={asm.id}
              onClick={() => onToggleAssumption && onToggleAssumption(asm.id)}
              className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                asm.fulfilled
                  ? 'bg-slate-950/70 border-slate-800 hover:border-blue-500/40 text-slate-200'
                  : 'bg-rose-950/20 border-rose-500/30 text-slate-400 opacity-75'
              }`}
            >
              <div className="flex items-start space-x-2.5 pr-2">
                {asm.fulfilled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium leading-relaxed">{asm.text}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 shrink-0">
                {asm.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Rationale Note */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block flex items-center space-x-1">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Why Confidence Changes</span>
        </span>
        <p className="text-slate-300 leading-relaxed text-xs">
          {confidenceRationale}
        </p>
      </div>

      {/* Anti-Guarantee Guardrail Banner */}
      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start space-x-2 text-[10px] text-amber-300/90 font-mono">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>UNPAIRED PROJECTION NOTICE:</strong> Projections reflect mathematical potential under the stated assumptions. Unverified assumptions degrade actual compliance realization.
        </span>
      </div>

    </div>
  );
}
