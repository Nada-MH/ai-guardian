'use client';

import React from 'react';
import {
  ShieldAlert, ShieldCheck, Activity, ArrowRight, TrendingDown,
  Percent, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { AdversarialScenario } from '../../types';

interface RiskSimulationPanelProps {
  scenario: AdversarialScenario;
}

export function RiskSimulationPanel({ scenario }: RiskSimulationPanelProps) {
  const { likelihood, impact, inherentRisk, existingControls, controlEffectivenessPct, residualRisk } =
    scenario.riskSimulation;

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (score >= 8) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Quantitative Risk Simulation
            </span>
            <h4 className="text-xs font-bold text-white">Inherent vs. Residual Risk Modeling</h4>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Gauges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        
        {/* Inherent Risk */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
            Inherent Risk
          </span>
          <div className={`text-base font-black px-2 py-0.5 rounded-md border font-mono ${getRiskColor(inherentRisk)}`}>
            {inherentRisk} / 25
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            L: {likelihood}/5 × I: {impact}/5
          </span>
        </div>

        {/* Control Effectiveness */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
            Controls Efficacy
          </span>
          <div className="text-base font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md font-mono">
            {controlEffectivenessPct}%
          </div>
          <span className="text-[9px] text-slate-500 font-mono block">
            {existingControls.length} Controls
          </span>
        </div>

        {/* Residual Risk */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
            Residual Risk
          </span>
          <div className={`text-base font-black px-2 py-0.5 rounded-md border font-mono ${getRiskColor(residualRisk)}`}>
            {residualRisk} / 25
          </div>
          <span className="text-[9px] text-emerald-400 font-mono block">
            -{(inherentRisk - residualRisk).toFixed(1)} Pts Mitigated
          </span>
        </div>

      </div>

      {/* Existing Controls */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
          Existing Production Controls
        </span>
        <div className="space-y-1">
          {existingControls.length > 0 ? (
            existingControls.map((ctrl, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950/60 border border-slate-850 text-[11px] font-mono text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{ctrl}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No existing controls documented.</p>
          )}
        </div>
      </div>

      {/* Recommended Mitigations */}
      <div className="space-y-1.5 pt-1 border-t border-slate-850">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
          Recommended Mitigations & Impact
        </span>
        <div className="space-y-1.5">
          {scenario.mitigations.map((mit, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-medium">{mit.action}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                -{mit.riskReduction} Risk
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
