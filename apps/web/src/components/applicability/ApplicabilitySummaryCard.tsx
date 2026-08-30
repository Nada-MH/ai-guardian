'use client';

import React, { useState } from 'react';
import { ApplicabilityMatrixResult } from '../../types';
import { ApplicabilityMatrixModal } from './ApplicabilityMatrixModal';
import { Layers, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApplicabilitySummaryCardProps {
  matrix: ApplicabilityMatrixResult;
}

export function ApplicabilitySummaryCard({ matrix }: ApplicabilitySummaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 space-y-3 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-none">Applicability Engine</h3>
              <span className="text-[10px] text-slate-400">Deterministic Scope Filter</span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
            ACTIVE
          </span>
        </div>

        {/* Counts Breakdown Bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Total KB</span>
            <span className="font-bold text-slate-200">{matrix.totalEvaluated}</span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-bold">Applicable</span>
            <span className="font-black text-emerald-400">{matrix.applicableCount}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Excluded</span>
            <span className="font-bold text-slate-400">{matrix.excludedCount}</span>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-850 space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>{matrix.applicableCount} Requirements In-Scope</span>
          </div>
          <p className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed">
            Filtered by Jurisdiction ({matrix.evaluatedProfile.jurisdiction}), Sector ({matrix.evaluatedProfile.sector}), and AI Use Case ({matrix.evaluatedProfile.aiUseCase}).
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
        >
          <span>View Applicability Matrix & Reasons</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Full Modal */}
      <ApplicabilityMatrixModal
        matrix={matrix}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
