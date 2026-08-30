'use client';

import React, { useState } from 'react';
import { Shield, Eye, Scale, UserCheck, Lock, Activity, FileCheck2, ChevronRight, X } from 'lucide-react';
import { DEMO_FINDINGS } from '../../lib/demo_data';
import { RiskVector, ComplianceFinding } from '../../types';

interface RiskOverviewItem {
  domain: string;
  label: string;
  score: number;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  icon: any;
  findingCount: number;
  description: string;
}

const RISK_ASSESSMENT_ITEMS: RiskOverviewItem[] = [
  { domain: 'privacy', label: 'Privacy Risk', score: 62, status: 'MEDIUM', icon: Lock, findingCount: 2, description: 'Saudi PDPL consent & statutory retention rules.' },
  { domain: 'security', label: 'Security Risk', score: 81, status: 'LOW', icon: Shield, findingCount: 1, description: 'SAMA CSF & NCA ECC encryption and API tokens.' },
  { domain: 'fairness', label: 'Fairness Risk', score: 48, status: 'HIGH', icon: Scale, findingCount: 4, description: 'Disparate impact & proxy demographic bias.' },
  { domain: 'transparency', label: 'Transparency Risk', score: 55, status: 'MEDIUM', icon: Eye, findingCount: 3, description: 'SHAP / LIME explainability for rejected loans.' },
  { domain: 'human_oversight', label: 'Human Oversight', score: 42, status: 'CRITICAL', icon: UserCheck, findingCount: 5, description: 'Mandatory human-in-the-loop review baseline.' },
  { domain: 'governance', label: 'Governance Risk', score: 51, status: 'HIGH', icon: FileCheck2, findingCount: 3, description: 'SAMA MRM annual model validation schedule.' },
  { domain: 'monitoring', label: 'Monitoring Risk', score: 64, status: 'MEDIUM', icon: Activity, findingCount: 2, description: 'Population Stability Index (PSI) drift tracking.' },
];

export function RiskOverviewCards() {
  const [selectedItem, setSelectedItem] = useState<RiskOverviewItem | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'LOW':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score < 50) return 'bg-rose-500';
    if (score < 70) return 'bg-amber-500';
    if (score < 85) return 'bg-cyan-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Risk Assessment Overview</h3>
          <p className="text-xs text-slate-400">Click any risk vector to inspect associated evidence, criteria, and recommendations.</p>
        </div>
      </div>

      {/* Structured Risk Vector List */}
      <div className="space-y-3">
        {RISK_ASSESSMENT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.domain}
              onClick={() => setSelectedItem(item)}
              className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3 shrink-0 w-48">
                <div className="p-2 rounded-md bg-slate-800 text-slate-300 group-hover:text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white">{item.label}</h4>
                  <span className="text-[10px] text-slate-500">{item.findingCount} Findings</span>
                </div>
              </div>

              {/* Progress Bar & Percentage */}
              <div className="flex-1 max-w-md mx-4">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400 truncate">{item.description}</span>
                  <span className="font-bold text-slate-200 font-mono">{item.score}% Compliance</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getProgressBarColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Associated Findings Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedItem.label} Inspector</h3>
                  <p className="text-xs text-slate-400">Score: {selectedItem.score}% • Status: {selectedItem.status}</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associated Findings & Evidence</h4>

              {DEMO_FINDINGS.map((finding) => (
                <div key={finding.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {finding.severity} SEVERITY
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">{finding.regulationReference}</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100">{finding.title}</h5>
                  <p className="text-xs text-slate-400">{finding.description}</p>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                    <p className="text-[10px] font-semibold text-blue-400 mb-1">CITED EVIDENCE ({finding.evidence.documentName}, Page {finding.evidence.pageNumber}):</p>
                    <p className="text-slate-300 italic">"{finding.evidence.highlightedQuote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
