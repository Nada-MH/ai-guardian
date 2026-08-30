'use client';

import React, { useState } from 'react';
import { DeterministicScoreSnapshot, RequirementEvaluationRecord } from '../../types';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import { EvidenceStrengthBadge } from './EvidenceStrengthBadge';
import { ProvenanceBadge } from '../findings/ProvenanceBadge';
import {
  X, Calculator, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle,
  Copy, Check, FileText, ChevronRight, Layers, HelpCircle, ArrowRight
} from 'lucide-react';

interface ScoreBreakdownModalProps {
  snapshot: DeterministicScoreSnapshot;
  evaluations: RequirementEvaluationRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export function ScoreBreakdownModal({ snapshot, evaluations, isOpen, onClose }: ScoreBreakdownModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(snapshot.inputHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const categories = Object.values(snapshot.categoryScores);

  const filteredEvaluations = selectedCategory === 'ALL'
    ? evaluations
    : evaluations.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  DETERMINISTIC COMPLIANCE SCORING ENGINE
                </span>
                <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 font-mono">
                  {snapshot.scoringEngineVersion}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                Mathematical Score Audit & Drill-Down Workpaper
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

        {/* Top Summary Banner: Overall Score, Formula & Input Hash */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Overall Score Card */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Compliance Score</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-black text-amber-400">{snapshot.overallComplianceScore}%</span>
                  <span className="text-xs font-bold text-slate-400">/ 100%</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase">
                {snapshot.overallRiskLevel} RISK
              </span>
            </div>

            {/* Deterministic Formula Callout */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <span className="text-[10px] text-blue-400 uppercase font-bold block">Pure Mathematical Rule</span>
              <p className="font-mono text-slate-300 text-[10px] leading-tight">
                OCS = &Sigma;(Category_Weight &times; Adjusted_Score) / &Sigma;(Weights)
              </p>
              <p className="text-[10px] text-slate-400">
                * LLMs evaluate evidence; scoring is 100% deterministic and reproducible.
              </p>
            </div>

            {/* Cryptographic Reproducibility Hash */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cryptographic Input Hash (SHA-256)</span>
                <div className="font-mono text-[10px] text-cyan-400 truncate mt-0.5">
                  {snapshot.inputHash}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="self-end flex items-center space-x-1 text-[10px] text-slate-400 hover:text-white font-bold transition-colors mt-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Weightings & Score Cards Grid */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Category Score Breakdown ({categories.length} Financial Risk Domains)
            </span>
            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <span>Filter drill-down by category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category.replace('_', ' ').toUpperCase()} ({(c.weight * 100).toFixed(0)}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === 'ALL' || selectedCategory.toLowerCase() === cat.category.toLowerCase();
              return (
                <div
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                    <span className="capitalize">{cat.category.replace('_', ' ')}</span>
                    <span className="font-mono text-cyan-400">{(cat.weight * 100).toFixed(0)}%</span>
                  </div>

                  <div className="text-base font-black text-white leading-none">
                    {cat.adjustedScore}%
                  </div>

                  <div className="text-[9px] text-slate-400 mt-1.5 flex items-center justify-between">
                    <span>Raw: {cat.rawScore}%</span>
                    {cat.penaltyDeduction > 0 && (
                      <span className="text-rose-400 font-bold">-{cat.penaltyDeduction} pts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Drill-Down Register: Requirement -> Finding -> Evidence -> Source */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              6-Tier Evidence & Requirement Audit Traceability
            </h4>
            <span className="text-[11px] text-slate-400">
              Showing {filteredEvaluations.length} Requirements
            </span>
          </div>

          <div className="space-y-3">
            {filteredEvaluations.map((item) => (
              <div
                key={item.requirementId}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400 font-bold text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.requirementId}
                    </span>
                    <span className="font-bold text-xs text-slate-200">{item.framework}</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">{item.clause}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <EvidenceStateBadge state={item.status} size="sm" />
                    <EvidenceStrengthBadge strength={item.evidenceStrength} size="sm" />
                    {item.reviewRequired && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                        REVIEW REQUIRED
                      </span>
                    )}
                  </div>
                </div>

                {/* Reasoning & Evidence Location */}
                <div className="text-xs space-y-1">
                  <p className="text-slate-300">{item.reasoning}</p>
                  {item.evidenceLocation && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400 font-mono pt-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Evidence Location: {item.evidenceLocation}</span>
                    </div>
                  )}
                </div>

                {/* Provenance Link if available */}
                {item.provenance && (
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center space-x-2">
                      <ProvenanceBadge sourceType={item.provenance.sourceType} size="sm" />
                      <span>{item.provenance.issuingOrganization} • {item.provenance.jurisdiction}</span>
                    </div>
                    <span className="font-mono text-slate-500">Weight: {item.weight.toFixed(1)}x • Conf: {(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 text-[11px]">
            * Scores are 100% deterministic and mathematically verifiable against input hash {snapshot.inputHash.substring(0, 16)}...
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
