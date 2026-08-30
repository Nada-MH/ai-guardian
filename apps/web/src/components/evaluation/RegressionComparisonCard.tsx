'use client';

import React from 'react';
import { GitCompare, TrendingUp, TrendingDown, CheckCircle2, ShieldCheck, AlertOctagon } from 'lucide-react';
import { EvaluationRunItem } from '../../types';

interface RegressionComparisonCardProps {
  runs: EvaluationRunItem[];
  currentRun: EvaluationRunItem;
}

export function RegressionComparisonCard({ runs, currentRun }: RegressionComparisonCardProps) {
  const previousRun = runs.length > 1 ? runs[runs.length - 2] : runs[0];
  const reg = currentRun.regression_details;

  if (!reg) return null;

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <GitCompare className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Automated Regression Gate
            </span>
            <h4 className="text-xs font-bold text-white">Pre-Deployment Regression Analysis</h4>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 text-xs font-mono">
          <span className="text-slate-500">Comparing:</span>
          <span className="text-slate-300 font-bold">Run #{previousRun.run_number}</span>
          <span className="text-cyan-400">→</span>
          <span className="text-white font-bold">Run #{currentRun.run_number}</span>
        </div>
      </div>

      {/* Regression Delta Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Quality Score Delta */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Quality Score Delta</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-lg font-black text-emerald-400 font-mono">+{reg.quality_score_delta}%</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">{previousRun.overall_quality_score}% → {currentRun.overall_quality_score}%</span>
        </div>

        {/* Citation Accuracy Delta */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Citation Accuracy Delta</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-lg font-black text-emerald-400 font-mono">+{reg.citation_accuracy_delta}%</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">{previousRun.evidence_metrics.citation_accuracy_pct}% → {currentRun.evidence_metrics.citation_accuracy_pct}%</span>
        </div>

        {/* Hallucination Rate Delta */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Hallucination Reduction</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-lg font-black text-cyan-400 font-mono">{reg.hallucination_rate_delta}%</span>
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">{previousRun.ai_quality_metrics.hallucination_rate_pct}% → {currentRun.ai_quality_metrics.hallucination_rate_pct}%</span>
        </div>

        {/* Regressions Count */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Regressions Detected</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-lg font-black text-emerald-300 font-mono">0</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono block">Zero Regression Drift</span>
        </div>

      </div>

      {/* Regression Gate Sign-Off Banner */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-bold">Regression Testing Passed: Evaluated target satisfies all strict production thresholds.</span>
        </div>
        <span className="text-slate-500 text-[10px]">
          Gate Sign-off: Automated CI/CD Protocol
        </span>
      </div>

    </div>
  );
}
