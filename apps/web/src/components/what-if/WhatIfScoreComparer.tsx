'use client';

import React from 'react';
import { ArrowUp, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { WhatIfScoreProjection } from '../../types';

interface WhatIfScoreComparerProps {
  projection: WhatIfScoreProjection;
  activeChipCount: number;
}

export function WhatIfScoreComparer({ projection, activeChipCount }: WhatIfScoreComparerProps) {
  const complianceDelta = projection.projectedCompliance - projection.baselineCompliance;
  const readinessDelta = projection.projectedReadiness - projection.baselineReadiness;

  const vectorDeltas = [
    { label: 'Fairness', delta: projection.fairnessDelta },
    { label: 'Human Oversight', delta: projection.humanOversightDelta },
    { label: 'Privacy', delta: projection.privacyDelta },
    { label: 'Transparency', delta: projection.transparencyDelta },
    { label: 'Governance', delta: projection.governanceDelta },
    { label: 'Monitoring', delta: projection.monitoringDelta },
    { label: 'Security', delta: projection.securityDelta },
  ].filter((v) => v.delta > 0);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-950/40 border border-slate-800 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Generative Score Projection</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time projection based on {activeChipCount} active What-If action {activeChipCount === 1 ? 'chip' : 'chips'}.
          </p>
        </div>

        {complianceDelta > 0 && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center space-x-1">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>+{complianceDelta}% Projected Gain</span>
          </span>
        )}
      </div>

      {/* Main Dual Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compliance Gauge */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compliance Posture Score</span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-slate-400">{projection.baselineCompliance}%</span>
            <span className="text-slate-600 text-lg font-bold">→</span>
            <span className="text-4xl font-black text-emerald-400">{projection.projectedCompliance}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
            <div style={{ width: `${projection.baselineCompliance}%` }} className="bg-slate-600 h-full" />
            {complianceDelta > 0 && (
              <div style={{ width: `${complianceDelta}%` }} className="bg-emerald-500 h-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Readiness Gauge */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Governance Readiness</span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-slate-400">{projection.baselineReadiness}/100</span>
            <span className="text-slate-600 text-lg font-bold">→</span>
            <span className="text-4xl font-black text-cyan-400">{projection.projectedReadiness}/100</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
            <div style={{ width: `${projection.baselineReadiness}%` }} className="bg-slate-600 h-full" />
            {readinessDelta > 0 && (
              <div style={{ width: `${readinessDelta}%` }} className="bg-cyan-500 h-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Vector Score Deltas Grid */}
      {vectorDeltas.length > 0 && (
        <div className="pt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
            Risk Vector Score Improvements
          </span>
          <div className="flex flex-wrap gap-2">
            {vectorDeltas.map((v) => (
              <div
                key={v.label}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-200 flex items-center space-x-2"
              >
                <span>{v.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                  +{v.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
