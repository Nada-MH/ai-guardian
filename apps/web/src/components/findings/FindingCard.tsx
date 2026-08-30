'use client';

import React from 'react';
import { ShieldAlert, FileText, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ComplianceFinding } from '../../types';
import { getSeverityBadgeClass } from '../../lib/utils';

import Link from 'next/link';

interface FindingCardProps {
  finding: ComplianceFinding;
  onSelect: (finding: ComplianceFinding) => void;
}

export function FindingCard({ finding, onSelect }: FindingCardProps) {
  return (
    <div
      onClick={() => onSelect(finding)}
      className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${getSeverityBadgeClass(finding.severity)}`}>
            {finding.severity}
          </span>
          <span className="text-xs font-semibold text-slate-400">{finding.category}</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">{finding.regulationReference}</span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition-colors">{finding.title}</h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{finding.description}</p>
      </div>

      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
        <p className="text-[10px] font-semibold text-blue-400 mb-1 flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>EVIDENCE CITATION ({finding.evidence.documentName}, Page {finding.evidence.pageNumber}):</span>
        </p>
        <p className="text-slate-300 italic line-clamp-1">"{finding.evidence.highlightedQuote}"</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        <span className="text-slate-500 text-[11px]">Confidence: <strong className="text-slate-300">{(finding.confidenceScore * 100).toFixed(0)}%</strong></span>
        <Link
          href={`/evidence/${finding.id}`}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all font-semibold"
        >
          <span>View Evidence</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
