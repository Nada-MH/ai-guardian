'use client';

import React from 'react';
import {
  ShieldAlert, CheckCircle2, ShieldCheck, Eye, Lock, FileSearch,
  Activity, Sliders, AlertTriangle, Layers
} from 'lucide-react';
import { AIRiskControlItem } from '../../types';

interface AIRiskControlsGridProps {
  riskControls: AIRiskControlItem[];
}

export function AIRiskControlsGrid({ riskControls }: AIRiskControlsGridProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'HALLUCINATION':
        return <Eye className="w-3.5 h-3.5 text-blue-400" />;
      case 'CITATION_ACCURACY':
        return <FileSearch className="w-3.5 h-3.5 text-cyan-400" />;
      case 'BIAS':
        return <Sliders className="w-3.5 h-3.5 text-purple-400" />;
      case 'PROMPT_INJECTION':
        return <Lock className="w-3.5 h-3.5 text-rose-400" />;
      case 'DATA_LEAKAGE':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'MODEL_DRIFT':
        return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              9-Vector AI Safety Safeguards
            </span>
            <h4 className="text-xs font-bold text-white">AI Guardian Internal Technical Risk Controls</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          9/9 CONTROLS ENFORCING
        </span>
      </div>

      {/* 9 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {riskControls.map((c) => (
          <div
            key={c.control_id}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-2"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono font-bold text-[9px] border border-slate-800 flex items-center space-x-1">
                  {getCategoryIcon(c.risk_category)}
                  <span>{c.risk_category.replace(/_/g, ' ')}</span>
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  {c.status}
                </span>
              </div>

              <h5 className="text-xs font-bold text-white mt-2">{c.title}</h5>
              <p className="text-[11px] text-slate-300 leading-snug mt-1 font-medium">
                {c.technical_mechanism}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Layer: {c.enforcement_layer}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
