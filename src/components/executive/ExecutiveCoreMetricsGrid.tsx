'use client';

import React from 'react';
import { ShieldCheck, BookOpen, FileCheck, CheckSquare, Layers, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { ExecutiveCoreMetrics } from '../../types';

interface ExecutiveCoreMetricsGridProps {
  metrics: ExecutiveCoreMetrics;
}

export function ExecutiveCoreMetricsGrid({ metrics }: ExecutiveCoreMetricsGridProps) {
  const cards = [
    {
      label: 'Governance Score',
      value: `${metrics.overall_governance_score}%`,
      subtext: 'Composite governance maturity',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      label: 'Compliance Score',
      value: `${metrics.compliance_score}%`,
      subtext: 'Weighted regulatory conformance',
      icon: CheckSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Residual Risk Index',
      value: `${metrics.risk_score}/100`,
      subtext: 'Down from 68/100 at Baseline',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      label: 'Remediation Velocity',
      value: `${metrics.remediation_progress_pct}%`,
      subtext: 'Actions verified & closed',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      label: 'Regulatory Coverage',
      value: `${metrics.regulatory_coverage_pct}%`,
      subtext: 'In-scope frameworks assessed',
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      label: 'Policy Coverage',
      value: `${metrics.policy_coverage_pct}%`,
      subtext: 'Enterprise policies mapped',
      icon: FileCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      label: 'Control Coverage',
      value: `${metrics.control_coverage_pct}%`,
      subtext: 'Technical controls active',
      icon: Layers,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      label: 'Evidence Coverage',
      value: `${metrics.evidence_coverage_pct}%`,
      subtext: 'Cryptographic proofs verified',
      icon: Activity,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Governance Multi-Layer Health
            </span>
            <h4 className="text-xs font-bold text-white">4-Layer Governance & Conformance Coverage</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          HEALTHY POSTURE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl bg-slate-950/80 border ${c.border} flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase line-clamp-1">
                  {c.label}
                </span>
                <div className={`w-6 h-6 rounded-lg ${c.bg} flex items-center justify-center ${c.color} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-white font-mono">{c.value}</span>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{c.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
