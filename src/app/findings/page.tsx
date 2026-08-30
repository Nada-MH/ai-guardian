'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, ShieldAlert, FileText, ExternalLink, CheckCircle2, 
  ChevronRight, ChevronDown, BookOpen, Scale, ArrowRight, ShieldCheck 
} from 'lucide-react';
import {
  DEMO_FINDINGS, DEMO_APPLICABILITY_MATRIX, DEMO_DETERMINISTIC_SCORE_SNAPSHOT,
  DEMO_REQUIREMENT_EVALUATIONS
} from '../../lib/demo_data';
import { getSeverityBadgeClass } from '../../lib/utils';
import { ProvenanceBadge } from '../../components/findings/ProvenanceBadge';
import { FindingProvenanceCard } from '../../components/findings/FindingProvenanceCard';
import { SourceProvenanceModal } from '../../components/findings/SourceProvenanceModal';
import { ApplicabilityMatrixModal } from '../../components/applicability/ApplicabilityMatrixModal';
import { ScoreBreakdownModal } from '../../components/scoring/ScoreBreakdownModal';
import { EvidenceStrengthBadge } from '../../components/scoring/EvidenceStrengthBadge';
import { ComplianceFinding } from '../../types';
import { Layers, Calculator } from 'lucide-react';

export default function FindingsPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFindingIds, setExpandedFindingIds] = useState<string[]>(['find-001']);
  const [modalFinding, setModalFinding] = useState<ComplianceFinding | null>(null);
  const [isApplicabilityModalOpen, setIsApplicabilityModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedFindingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFindings = DEMO_FINDINGS.filter((f) => {
    const matchesSev = filterSeverity === 'ALL' ? true : f.severity === filterSeverity;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.regulationReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.provenance && f.provenance.framework.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (f.provenance && f.provenance.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Compliance Audit Findings Register</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
              PROVENANCE-VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every compliance gap is cryptographically tied to exact statutory clauses, source versions, and document evidence.
          </p>
        </div>

        {/* Right Actions: Scope Matrix Button + Math Score Audit + Severity Filter Tabs */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsScoreModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Inspect deterministic mathematical calculation & category weights"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Score: 71% (Deterministic)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsApplicabilityModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Scope: 37 In-Scope</span>
          </button>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium shrink-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filterSeverity === sev ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search findings by title, authority (SAMA, SDAIA, ISO), source type, or clause..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Audit Data Table with Expandable Provenance */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12 text-center"></th>
                <th className="p-4 w-28">Severity</th>
                <th className="p-4">Compliance Finding</th>
                <th className="p-4 w-40">Source Type</th>
                <th className="p-4 max-w-xs">Cited Evidence Source</th>
                <th className="p-4 w-48">Requirement Reference</th>
                <th className="p-4 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredFindings.map((finding) => {
                const isExpanded = expandedFindingIds.includes(finding.id);
                return (
                  <React.Fragment key={finding.id}>
                    <tr 
                      className={`hover:bg-slate-900/50 transition-colors group cursor-pointer ${
                        isExpanded ? 'bg-slate-900/30' : ''
                      }`}
                      onClick={() => toggleExpand(finding.id)}
                    >
                      {/* Expand Chevron */}
                      <td className="p-4 text-center text-slate-500">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-blue-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 group-hover:text-white transition-colors" />
                        )}
                      </td>

                      {/* Severity Badge */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black border uppercase ${getSeverityBadgeClass(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </td>

                      {/* Finding Title & Description */}
                      <td className="p-4 font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                        <p className="text-xs">{finding.title}</p>
                        <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{finding.description}</p>
                      </td>

                      {/* Source Type Badge */}
                      <td className="p-4">
                        <ProvenanceBadge sourceType={finding.provenance?.sourceType} size="sm" />
                      </td>

                      {/* Evidence Citation */}
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center space-x-1.5 text-[11px] text-blue-400 font-mono">
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{finding.evidence.documentName}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Page {finding.evidence.pageNumber}</p>
                      </td>

                      {/* Regulation Reference */}
                      <td className="p-4 font-mono text-[11px] text-cyan-400">
                        {finding.regulationReference}
                      </td>

                      {/* Action Links */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setModalFinding(finding)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all"
                            title="View Canonical Source Provenance"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span>Source</span>
                          </button>

                          <Link
                            href={`/evidence/${finding.id}`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                            title="Inspect Evidence Document Highlights"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Provenance Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-950/60">
                        <td colSpan={7} className="p-4 pl-12 pr-6 border-b border-slate-800/80">
                          <FindingProvenanceCard finding={finding} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Source Provenance Modal */}
      <SourceProvenanceModal
        finding={modalFinding}
        isOpen={Boolean(modalFinding)}
        onClose={() => setModalFinding(null)}
      />

      {/* Applicability Matrix Modal */}
      <ApplicabilityMatrixModal
        matrix={DEMO_APPLICABILITY_MATRIX}
        isOpen={isApplicabilityModalOpen}
        onClose={() => setIsApplicabilityModalOpen(false)}
      />

      {/* Deterministic Score Audit & Drill-Down Modal */}
      <ScoreBreakdownModal
        snapshot={DEMO_DETERMINISTIC_SCORE_SNAPSHOT}
        evaluations={DEMO_REQUIREMENT_EVALUATIONS}
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />
    </div>
  );
}
