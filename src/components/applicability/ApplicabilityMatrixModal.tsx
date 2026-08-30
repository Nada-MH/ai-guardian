'use client';

import React, { useState } from 'react';
import { ApplicabilityMatrixResult, ApplicabilityEvaluationItem } from '../../types';
import { ProvenanceBadge } from '../findings/ProvenanceBadge';
import {
  X, CheckCircle2, AlertOctagon, Filter, Search, ShieldCheck,
  Building, Globe, Layers, ArrowRight, BookOpen, Check, XCircle, Info
} from 'lucide-react';

interface ApplicabilityMatrixModalProps {
  matrix: ApplicabilityMatrixResult;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicabilityMatrixModal({ matrix, isOpen, onClose }: ApplicabilityMatrixModalProps) {
  const [activeTab, setActiveTab] = useState<'applicable' | 'excluded'>('applicable');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  if (!isOpen) return null;

  const currentList: ApplicabilityEvaluationItem[] =
    activeTab === 'applicable' ? matrix.applicableRequirements : matrix.excludedRequirements;

  const filteredList = currentList.filter((item) => {
    const matchesSearch =
      item.framework.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirementText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  DETERMINISTIC REGULATORY APPLICABILITY ENGINE
                </span>
                <span className="px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                  DYNAMIC CLASSIFICATION
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                Regulatory Applicability & Exclusion Matrix
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

        {/* Profile Context Banner & Stats */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-3 shrink-0">
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Knowledge Base Total</span>
              <span className="text-base font-black text-slate-200">{matrix.totalEvaluated} Rules</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Applicable Requirements</span>
              <span className="text-base font-black text-emerald-400">{matrix.applicableCount} Analyzed</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Excluded Out-of-Scope</span>
              <span className="text-base font-black text-slate-400">{matrix.excludedCount} Omitted</span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30">
              <span className="text-[10px] text-blue-400 uppercase font-bold block">Applicability Ratio</span>
              <span className="text-base font-black text-blue-400">{(matrix.applicabilityRatio * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Assessed System Profile Summary Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Evaluated Against:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              📍 {matrix.evaluatedProfile.jurisdiction}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              🏦 {matrix.evaluatedProfile.sector}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              🎯 {matrix.evaluatedProfile.aiUseCase}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              🔒 Sensitive Data: {matrix.evaluatedProfile.sensitiveData ? 'Yes' : 'No'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              ⚡ {matrix.evaluatedProfile.decisionImpact}
            </span>
          </div>
        </div>

        {/* View Switcher Tabs & Search Filter */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('applicable')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'applicable'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Applicable Requirements ({matrix.applicableCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('excluded')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'excluded'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Excluded Requirements ({matrix.excludedCount})</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by framework or clause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Requirements List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {filteredList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No requirements matching "{searchQuery}" in this view.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.requirementId}
                className={`p-4 rounded-xl border transition-all ${
                  item.applicable
                    ? 'bg-slate-950/70 border-emerald-500/25 hover:border-emerald-500/40'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <ProvenanceBadge sourceType={item.sourceType} size="sm" />
                    <span className="font-mono text-cyan-400 font-bold text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.requirementId}
                    </span>
                    <span className="font-bold text-xs text-slate-200">{item.framework}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      item.applicable
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.applicable ? 'INCLUDED IN SCOPE' : 'EXCLUDED FROM AUDIT'}
                  </span>
                </div>

                {/* Clause Title & Requirement Text */}
                <div className="text-xs mb-3">
                  <h4 className="font-semibold text-slate-100">{item.clause}</h4>
                  <p className="text-slate-400 text-[11px] font-serif italic mt-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                    "{item.requirementText}"
                  </p>
                </div>

                {/* Explainability Section: Why It Applies / Why Excluded */}
                {item.applicable ? (
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Why Does This Requirement Apply?</span>
                    </span>
                    <div className="space-y-1 text-[11px] text-slate-200">
                      {item.applicabilityReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 font-medium">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{reason.replace(/^✓\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1">
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>Why Was This Requirement Excluded?</span>
                    </span>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      {item.exclusionReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5">
                          <span className="text-rose-400 font-bold">✗</span>
                          <span>{reason.replace(/^✗\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 text-[11px]">
            * Only the {matrix.applicableCount} applicable requirements are evaluated and factored into the compliance score denominator.
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
