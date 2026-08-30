'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitCompare, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight,
  Sparkles, Layers, FileText, Filter, Check, XCircle, ArrowUpRight, ArrowDownRight,
  ShieldAlert, ChevronRight, ChevronDown, BookOpen, Clock, Calendar, Database
} from 'lucide-react';
import { DEMO_DETAILED_VERSION_COMPARISON } from '../../lib/demo_data';
import { FindingTransitionState, FindingTransitionItem } from '../../types';
import { EvidenceStateBadge } from '../../components/scoring/EvidenceStateBadge';
import { EvidenceStrengthBadge } from '../../components/scoring/EvidenceStrengthBadge';
import { ProvenanceBadge } from '../../components/findings/ProvenanceBadge';

export default function VersionComparisonPage() {
  const comp = DEMO_DETAILED_VERSION_COMPARISON;
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [expandedReqIds, setExpandedReqIds] = useState<string[]>([
    'REQ-SAMA-AI-5.3',
    'REQ-SAUDI-PDPL-13',
    'REQ-NDMO-DATA-4.3'
  ]);

  const toggleExpand = (id: string) => {
    setExpandedReqIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const transitions = comp.findingTransitions;
  const filteredTransitions = selectedFilter === 'ALL'
    ? transitions
    : transitions.filter((t) => t.transitionState === selectedFilter);

  const getTransitionBadge = (state: FindingTransitionState) => {
    switch (state) {
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>RESOLVED (Remediated)</span>
          </span>
        );
      case 'IMPROVED':
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>IMPROVED (Progress)</span>
          </span>
        );
      case 'NEW':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>NEW GAP (Needs Attention)</span>
          </span>
        );
      case 'REGRESSED':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>REGRESSED</span>
          </span>
        );
      case 'UNCHANGED':
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono font-bold">
            UNCHANGED
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              AUDIT WORKPAPER DIFF ENGINE
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">ID: {comp.comparisonId}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Assessment Versioning & Comparison Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic diff analysis between immutable assessment snapshots. Historical versions remain sealed and reproducible.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/projects/sys-fintrust-001"
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            Back to Project Workspace
          </Link>
        </div>
      </div>

      {/* Version Header Comparison Bar (v1 -> v2) */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Base Version (v1) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold font-mono">
              BASELINE AUDIT
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase">
              {comp.baseVersion.riskLevel} RISK
            </span>
          </div>
          <h3 className="text-sm font-bold text-white leading-tight">
            {comp.baseVersion.versionLabel}
          </h3>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-3xl font-black text-amber-400">{comp.baseVersion.score}%</span>
            <span className="text-xs text-slate-500 font-bold">/ 100%</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono space-y-0.5 pt-2 border-t border-slate-850">
            <div>KB: {comp.baseVersion.kbVersion}</div>
            <div>Engine: {comp.baseVersion.scoringVersion}</div>
            <div>Date: August 10, 2026</div>
          </div>
        </div>

        {/* Transition Delta Arrow & Summary */}
        <div className="flex flex-col items-center justify-center text-center p-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-2 shadow-lg">
            <GitCompare className="w-6 h-6" />
          </div>
          <span className="text-base font-black text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>+{comp.metricsDiff.complianceScore.delta}% Improvement</span>
          </span>
          <span className="text-xs text-slate-300 font-bold mt-1">
            Risk down-regulated: HIGH &rarr; MEDIUM
          </span>
          <span className="text-[11px] text-slate-500 mt-1">
            {comp.metricsDiff.resolvedCount} Resolved • {comp.metricsDiff.improvedCount} Improved • {comp.metricsDiff.newCount} New Gaps
          </span>
        </div>

        {/* Target Version (v2) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-slate-950/70 border border-blue-500/40 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold font-mono border border-blue-500/30">
              REMEDIATED AUDIT
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase">
              {comp.targetVersion.riskLevel} RISK
            </span>
          </div>
          <h3 className="text-sm font-bold text-white leading-tight">
            {comp.targetVersion.versionLabel}
          </h3>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-3xl font-black text-emerald-400">{comp.targetVersion.score}%</span>
            <span className="text-xs text-slate-500 font-bold">/ 100%</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono space-y-0.5 pt-2 border-t border-slate-850">
            <div>KB: {comp.targetVersion.kbVersion}</div>
            <div>Engine: {comp.targetVersion.scoringVersion}</div>
            <div>Date: August 20, 2026</div>
          </div>
        </div>

      </div>

      {/* Quantitative Metric Diff Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Compliance Delta */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Compliance Score</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-black text-white">{comp.metricsDiff.complianceScore.base} &rarr; {comp.metricsDiff.complianceScore.target}</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center space-x-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{comp.metricsDiff.complianceScore.delta}%</span>
          </span>
        </div>

        {/* Critical Findings Delta */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Critical Gaps</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-black text-white">{comp.metricsDiff.criticalFindings.base} &rarr; {comp.metricsDiff.criticalFindings.target}</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center space-x-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-3 Resolved</span>
          </span>
        </div>

        {/* High Findings Delta */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">High Findings</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-black text-white">{comp.metricsDiff.highFindings.base} &rarr; {comp.metricsDiff.highFindings.target}</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center space-x-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-3 Resolved</span>
          </span>
        </div>

        {/* Resolved Count */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Resolved</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {comp.metricsDiff.resolvedCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Verified Remediated</span>
        </div>

        {/* New Gaps */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">New Gaps</span>
          <div className="text-xl font-black text-rose-400 mt-1">
            {comp.metricsDiff.newCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Introduced in v2</span>
        </div>

        {/* Regulatory Coverage */}
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Regulatory Coverage</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-black text-white">{comp.metricsDiff.regulatoryCoverage.base}% &rarr; {comp.metricsDiff.regulatoryCoverage.target}%</span>
          </div>
          <span className="text-xs font-bold text-cyan-400 mt-1 flex items-center space-x-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{comp.metricsDiff.regulatoryCoverage.delta}%</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: `All Requirements (${transitions.length})` },
            { id: 'RESOLVED', label: `Resolved (${comp.metricsDiff.resolvedCount})`, color: 'text-emerald-400' },
            { id: 'IMPROVED', label: `Improved (${comp.metricsDiff.improvedCount})`, color: 'text-cyan-400' },
            { id: 'NEW', label: `New Gaps (${comp.metricsDiff.newCount})`, color: 'text-rose-400' },
            { id: 'UNCHANGED', label: `Unchanged (${comp.metricsDiff.unchangedCount})`, color: 'text-slate-400' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredTransitions.length} transition records
        </span>
      </div>

      {/* Side-by-Side Transition Item Cards */}
      <div className="space-y-4">
        {filteredTransitions.map((item) => {
          const isExpanded = expandedReqIds.includes(item.requirementId);
          return (
            <div
              key={item.requirementId}
              className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all"
            >
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(item.requirementId)}
                className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {item.requirementId}
                      </span>
                      <span className="text-xs font-bold text-white truncate">{item.clause}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.framework}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {getTransitionBadge(item.transitionState)}
                </div>
              </div>

              {/* Side-by-Side Comparison Content */}
              <div className="p-5 space-y-4">
                
                {/* 2-Column Diff: Version 1 vs Version 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Version 1 State */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        Assessment v1 (Baseline)
                      </span>
                      <EvidenceStateBadge state={item.statusBase} size="sm" />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.reasoningBase}
                    </p>

                    {item.evidenceLocationBase && (
                      <div className="pt-2 flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Location: {item.evidenceLocationBase}</span>
                      </div>
                    )}
                  </div>

                  {/* Version 2 State */}
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    item.transitionState === 'RESOLVED'
                      ? 'bg-emerald-950/10 border-emerald-500/30'
                      : item.transitionState === 'IMPROVED'
                      ? 'bg-cyan-950/10 border-cyan-500/30'
                      : item.transitionState === 'NEW'
                      ? 'bg-rose-950/10 border-rose-500/30'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">
                        Assessment v2 (Remediated)
                      </span>
                      <EvidenceStateBadge state={item.statusTarget} size="sm" />
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {item.reasoningTarget}
                    </p>

                    {item.evidenceLocationTarget && (
                      <div className="pt-2 flex items-center space-x-1.5 text-[11px] text-cyan-400 font-mono">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Remediation Evidence: {item.evidenceLocationTarget}</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Remediation Action / Notes Callout */}
                {item.remediationAction && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Remediation Control Action Taken:</span>
                      <span className="text-slate-300">{item.remediationAction}</span>
                    </div>
                  </div>
                )}

                {/* Provenance Tag */}
                {item.provenance && (
                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-850">
                    <div className="flex items-center space-x-2">
                      <ProvenanceBadge sourceType={item.provenance.sourceType} size="sm" />
                      <span>{item.provenance.issuingOrganization} • {item.provenance.jurisdiction}</span>
                    </div>
                    <span className="font-mono">Immutable Version Hash: {item.provenance.documentHash?.substring(0, 16)}...</span>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
