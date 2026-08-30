'use client';

import React from 'react';
import { FileText, BookOpen, Lightbulb, ShieldAlert, CheckCircle, ExternalLink, X } from 'lucide-react';
import { ComplianceFinding } from '../../types';

import Link from 'next/link';

interface EvidenceViewerProps {
  finding: ComplianceFinding;
  onClose?: () => void;
  onResolve?: (id: string) => void;
}

export function EvidenceViewer({ finding, onClose, onResolve }: EvidenceViewerProps) {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {finding.severity} SEVERITY
              </span>
              <span className="text-xs text-slate-400 font-semibold">{finding.category} Domain</span>
            </div>
            <h3 className="text-lg font-bold text-white">{finding.title}</h3>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Finding Description</h4>
        <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
          {finding.description}
        </p>
      </div>

      {/* Cited Evidence Panel (NotebookLM Style) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4" />
            <span>Document Evidence Citation</span>
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {finding.evidence.documentName} • Page {finding.evidence.pageNumber}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
          <p className="text-xs text-slate-400 font-mono mb-2">EXTRACTED TEXT EXCERPT:</p>
          <blockquote className="text-sm text-blue-200 italic font-medium leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-blue-500/20">
            "{finding.evidence.highlightedQuote}"
          </blockquote>
          <p className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
            {finding.evidence.contextExcerpt}
          </p>
        </div>
      </div>

      {/* Relevant Regulatory Requirement */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4" />
          <span>Relevant Regulatory Clause</span>
        </h4>

        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-300 font-mono">{finding.regulationReference}</span>
            <p className="text-xs text-slate-300 mt-1">SAMA AI Guidance & SDAIA AI Ethics Mandatory Rule</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            Statutory Rule
          </span>
        </div>
      </div>

      {/* Actionable Recommendation */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Lightbulb className="w-4 h-4" />
          <span>Actionable Remediation Roadmap</span>
        </h4>

        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <p className="text-xs text-emerald-200 font-medium leading-relaxed">{finding.recommendation}</p>
          {finding.assignedOwner && (
            <p className="text-[11px] text-slate-400 mt-2">Suggested Owner: <strong className="text-slate-200">{finding.assignedOwner}</strong></p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-3">
        <Link
          href={`/evidence/${finding.id}`}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Interactive Evidence Viewer</span>
        </Link>
        
        {onResolve && !finding.isResolved && (
          <button
            onClick={() => onResolve(finding.id)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Resolved</span>
          </button>
        )}
      </div>
    </div>
  );
}
