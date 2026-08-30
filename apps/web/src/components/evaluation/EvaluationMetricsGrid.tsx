'use client';

import React from 'react';
import { Search, FileSearch, CheckSquare, Eye, Sliders, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { EvaluationRunItem } from '../../types';

interface EvaluationMetricsGridProps {
  run: EvaluationRunItem;
}

export function EvaluationMetricsGrid({ run }: EvaluationMetricsGridProps) {
  const rm = run.retrieval_metrics;
  const em = run.evidence_metrics;
  const cm = run.compliance_metrics;
  const qm = run.ai_quality_metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: Retrieval Performance */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">Retrieval Engine</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              RAG V2.4
            </span>
          </div>

          <div className="space-y-3 pt-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Precision:</span>
                <span className="text-white font-bold">{rm.retrieval_precision_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${rm.retrieval_precision_pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Recall:</span>
                <span className="text-white font-bold">{rm.retrieval_recall_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${rm.retrieval_recall_pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Req Coverage:</span>
                <span className="text-white font-bold">{rm.relevant_requirement_coverage_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rm.relevant_requirement_coverage_pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-850">
          Dense + Sparse Hybrid Retriever
        </p>
      </div>

      {/* CARD 2: Evidence & Citation Grounding */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FileSearch className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">Evidence Grounding</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              8-POINT CHAIN
            </span>
          </div>

          <div className="space-y-3 pt-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Citation Accuracy:</span>
                <span className="text-emerald-400 font-bold">{em.citation_accuracy_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${em.citation_accuracy_pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Evidence Grounding:</span>
                <span className="text-white font-bold">{em.evidence_grounding_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${em.evidence_grounding_pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Evidence Accuracy:</span>
                <span className="text-white font-bold">{em.evidence_accuracy_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${em.evidence_accuracy_pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-850">
          SHA-256 Chunk Anchoring Verified
        </p>
      </div>

      {/* CARD 3: Compliance Classification Matrix */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">Compliance Matrix</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              F1: {cm.f1_score_pct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 text-center font-mono">
            <div className="p-2 rounded-xl bg-slate-950/90 border border-emerald-500/20">
              <span className="text-[9px] text-slate-500 block uppercase">True Pos (TP)</span>
              <span className="text-sm font-black text-emerald-400">{cm.true_positives}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/90 border border-rose-500/20">
              <span className="text-[9px] text-slate-500 block uppercase">False Pos (FP)</span>
              <span className="text-sm font-black text-rose-400">{cm.false_positives}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/90 border border-blue-500/20">
              <span className="text-[9px] text-slate-500 block uppercase">True Neg (TN)</span>
              <span className="text-sm font-black text-blue-400">{cm.true_negatives}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/90 border border-amber-500/20">
              <span className="text-[9px] text-slate-500 block uppercase">False Neg (FN)</span>
              <span className="text-sm font-black text-amber-400">{cm.false_negatives}</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-850">
          Accuracy: <strong>{cm.accuracy_pct}%</strong> (54 Ground-Truth Asserts)
        </p>
      </div>

      {/* CARD 4: AI Safety & Quality */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">AI Safety & Quality</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              STRICT GUARD
            </span>
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Hallucination Rate:</span>
              <span className="text-emerald-400 font-bold">{qm.hallucination_rate_pct}%</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Unsupported Claims:</span>
              <span className="text-blue-300 font-bold">{qm.unsupported_claim_rate_pct}%</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Reasoning Consistency:</span>
              <span className="text-cyan-300 font-bold">{qm.reasoning_consistency_pct}%</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Score Determinism:</span>
              <span className="text-emerald-400 font-bold">{qm.score_consistency_pct}% (0.0 Var)</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-850">
          Deterministic Closed-Form Math Engine
        </p>
      </div>

    </div>
  );
}
