'use client';

import React, { useState } from 'react';
import { RegulatoryProvenance, ComplianceFinding } from '../../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  X, ExternalLink, ShieldCheck, Copy, Check, FileText,
  Calendar, Globe, Building, Hash, Clock, BookOpen, Scale, ArrowRight
} from 'lucide-react';

interface SourceProvenanceModalProps {
  finding?: ComplianceFinding | null;
  provenance?: RegulatoryProvenance | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SourceProvenanceModal({ finding, provenance: directProv, isOpen, onClose }: SourceProvenanceModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const prov = directProv || finding?.provenance;
  if (!prov) return null;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  CANONICAL REGULATORY PROVENANCE RECORD
                </span>
                <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                {prov.framework} — {prov.clause || prov.requirementId}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Top Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Legal Authority Level</span>
              <ProvenanceBadge sourceType={prov.sourceType} size="md" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Requirement Identifier</span>
              <span className="font-mono text-cyan-400 font-bold text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {prov.requirementId} {prov.requirementVersion ? `(v${prov.requirementVersion})` : ''}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 flex items-center space-x-1">
                <Building className="w-3 h-3" />
                <span>Issuing Authority</span>
              </span>
              <span className="font-semibold text-slate-200">{prov.issuingOrganization}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Jurisdiction & Sector</span>
              </span>
              <span className="text-slate-300">{prov.jurisdiction} • {prov.sector}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Version & Effective Date</span>
              </span>
              <span className="text-slate-300">{prov.documentVersion} • Effective: {prov.effectiveDate || 'Enacted'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Knowledge Base Ingestion</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">{prov.kbVersion} ({new Date(prov.retrievedAt).toLocaleDateString()})</span>
            </div>
          </div>

          {/* Exact Statutory / Regulatory Requirement Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Requirement Text</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {prov.section ? `${prov.section} • ` : ''}Page {prov.page || 1}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed font-serif italic selection:bg-blue-600">
              "{prov.requirementText}"
            </div>
          </div>

          {/* Cryptographic SHA-256 Provenance Hashes */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Immutable Cryptographic SHA-256 Hashes</span>
            </span>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">Requirement Hash:</span>
                <div className="flex items-center space-x-2 font-mono text-emerald-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  <span className="truncate max-w-[280px]">{prov.documentHash}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(prov.documentHash)}
                    title="Copy full SHA-256 hash"
                    className="hover:text-white transition-colors"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {prov.sourceDocumentHash && (
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-900">
                  <span className="text-slate-400 font-mono">Source Document Hash:</span>
                  <span className="font-mono text-slate-400 text-[10px] truncate max-w-[280px]">
                    {prov.sourceDocumentHash}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Linked Finding Evidence Traceability */}
          {finding && (
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Aligned Organization Evidence
              </span>
              <p className="text-slate-200 text-xs font-semibold">
                {finding.evidence.documentName} ({finding.evidence.section || `Page ${finding.evidence.pageNumber}`})
              </p>
              <p className="text-slate-400 text-[11px] italic">
                "{finding.evidence.highlightedQuote}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="text-[10px] text-slate-500 font-mono">
            Canonical Source ID: {prov.sourceId}
          </div>

          <div className="flex items-center space-x-3">
            {prov.url && (
              <a
                href={prov.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
              >
                <span>Official Regulatory Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
