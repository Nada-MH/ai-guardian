'use client';

import React from 'react';
import { ShieldAlert, BookOpen, Lightbulb, FileText, CheckCircle, ArrowRight, CornerDownRight } from 'lucide-react';
import { EvidenceAnnotation } from '../../types';
import { getSeverityBadgeClass } from '../../lib/utils';

interface AICommentPanelProps {
  annotation: EvidenceAnnotation | null;
  onApplyFix?: () => void;
}

export function AICommentPanel({ annotation, onApplyFix }: AICommentPanelProps) {
  if (!annotation) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center text-slate-500 h-[82vh] flex flex-col items-center justify-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-slate-600" />
        <p className="text-xs">Select any compliance finding to inspect highlighted text evidence and AI explanations.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 h-[82vh] overflow-y-auto space-y-6 shadow-2xl">
      {/* Header Badge */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${getSeverityBadgeClass(annotation.severity)}`}>
            {annotation.severity} SEVERITY
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">AI Evidence Inspector</span>
        </div>
        <h3 className="text-base font-bold text-white leading-snug">Highlighted Compliance Audit Gap</h3>
      </div>

      {/* 1. Evidence Location Reference */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Document Evidence Source</span>
        <div className="flex items-center justify-between text-slate-200 font-medium">
          <span className="truncate">{annotation.documentName}</span>
          <span className="font-mono text-cyan-400 shrink-0">Page {annotation.pageNumber}</span>
        </div>
      </div>

      {/* 2. AI Explanation / Comment */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <CornerDownRight className="w-4 h-4 text-blue-400" />
          <span>AI Explanation & Impact</span>
        </h4>
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-200 leading-relaxed font-medium">
          "{annotation.aiComment}"
        </div>
      </div>

      {/* 3. Related Requirement */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Related Regulatory Requirement</span>
        </h4>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <p className="font-bold text-cyan-300 font-mono">{annotation.requirementReference}</p>
          <p className="text-slate-400 text-[11px] mt-1">Statutory rule enforced under SAMA / SDAIA AI Governance Framework.</p>
        </div>
      </div>

      {/* 4. Actionable Recommendation */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Lightbulb className="w-4 h-4" />
          <span>Recommended Fix</span>
        </h4>
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 font-medium leading-relaxed">
          {annotation.recommendation}
        </div>
      </div>

      {/* Action Button */}
      {onApplyFix && (
        <button
          onClick={onApplyFix}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Apply Recommended Fix & Reassess</span>
        </button>
      )}
    </div>
  );
}
