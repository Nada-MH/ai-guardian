'use client';

import React from 'react';
import { Award, Play, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { EvaluationRunItem } from '../../types';

interface EvaluationPostureBannerProps {
  currentRun: EvaluationRunItem;
  isRunning?: boolean;
  onTriggerEvaluation: () => void;
}

export function EvaluationPostureBanner({ currentRun, isRunning, onTriggerEvaluation }: EvaluationPostureBannerProps) {
  const regDetails = currentRun.regression_details;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl space-y-6">
      
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Left: Overall Quality Score */}
        <div className="flex items-center space-x-5">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 via-emerald-500/10 to-transparent border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
            <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-blue-500 text-white font-mono font-black text-[10px]">
              #{currentRun.run_number}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                AI QUALITY ASSURANCE POSTURE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                PRODUCTION READY
              </span>
            </div>

            <div className="flex items-baseline space-x-3 mt-1">
              <span className="text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                {currentRun.overall_quality_score}%
                <span className="text-xl text-slate-500 font-normal"> / 100</span>
              </span>

              {regDetails && (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{regDetails.quality_score_delta}% vs Run #{currentRun.run_number - 1}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Target Component & Run Action */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-850 text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Evaluated Target</span>
            <span className="text-xs font-bold text-white font-mono">{currentRun.target_component}</span>
          </div>

          <button
            onClick={onTriggerEvaluation}
            disabled={isRunning}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Benchmarking Suite...' : 'Trigger Benchmark Suite'}</span>
          </button>
        </div>

      </div>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Citation Accuracy</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{currentRun.evidence_metrics.citation_accuracy_pct}%</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Evidence Grounding</span>
            <span className="text-xl font-black text-cyan-400 font-mono">{currentRun.evidence_metrics.evidence_grounding_pct}%</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Retrieval Precision</span>
            <span className="text-xl font-black text-blue-400 font-mono">{currentRun.retrieval_metrics.retrieval_precision_pct}%</span>
          </div>
          <Cpu className="w-5 h-5 text-blue-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Hallucination Rate</span>
            <span className="text-xl font-black text-purple-400 font-mono">{currentRun.ai_quality_metrics.hallucination_rate_pct}%</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            &lt; 1% (Safe)
          </span>
        </div>
      </div>

    </div>
  );
}
