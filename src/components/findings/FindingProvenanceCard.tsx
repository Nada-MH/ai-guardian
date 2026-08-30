'use client';

import React, { useState } from 'react';
import { ComplianceFinding } from '../../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { SourceProvenanceModal } from './SourceProvenanceModal';
import {
  FileText, BookOpen, ExternalLink, ShieldCheck, CheckCircle2,
  Calendar, Globe, Building, ArrowRight, Hash, Clock
} from 'lucide-react';

interface FindingProvenanceCardProps {
  finding: ComplianceFinding;
  compact?: boolean;
}

export function FindingProvenanceCard({ finding, compact = false }: FindingProvenanceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prov = finding.provenance;

  if (!prov) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex items-center justify-between">
        <span className="italic text-slate-500">Source verification unavailable</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3.5 shadow-inner">
        {/* Top Provenance Header: Source Type Badge + Requirement Code + View Source Action */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ProvenanceBadge sourceType={prov.sourceType} size="sm" />
            <span className="font-mono text-cyan-400 font-bold text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {prov.requirementId}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white border border-blue-500/30 text-[11px] font-bold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Source Provenance</span>
          </button>
        </div>

        {/* 8-Point Traceability Chain Breadcrumb */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1 font-mono">
          <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold block">
            8-Point Evidence Traceability Chain
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-slate-300">
            <span className="text-rose-400 font-bold">{finding.id}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-cyan-400 font-bold">{prov.requirementId}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-purple-300 font-semibold">{prov.framework}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-amber-300">{prov.clause || prov.section || 'Clause'}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-blue-300 font-semibold">{finding.evidence.documentName}</span>
            <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="text-emerald-300">Page {finding.evidence.pageNumber}</span>
          </div>
        </div>

        {/* Provenance Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
          <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Issuing Authority</span>
            <span className="font-semibold text-slate-200 truncate block" title={prov.issuingOrganization}>
              {prov.issuingOrganization}
            </span>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Jurisdiction</span>
            <span className="font-semibold text-slate-200 truncate block">{prov.jurisdiction}</span>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Doc Version</span>
            <span className="font-semibold text-slate-200 truncate block">{prov.documentVersion}</span>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-850">
            <span className="text-slate-500 text-[10px] block">Effective Date</span>
            <span className="font-semibold text-slate-200 truncate block">{prov.effectiveDate || 'Enacted'}</span>
          </div>
        </div>

        {/* Statutory / Regulatory Clause Text Excerpt */}
        {!compact && (
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-serif italic">
            "{prov.requirementText}"
          </div>
        )}
      </div>

      {/* Full Modal */}
      <SourceProvenanceModal
        finding={finding}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
