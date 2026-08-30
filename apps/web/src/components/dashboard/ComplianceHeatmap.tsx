'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const HEATMAP_CATEGORIES = [
  {
    level: 'CRITICAL RISK',
    color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    badge: 'bg-rose-500 text-white',
    icon: AlertOctagon,
    count: 1,
    items: [
      { code: 'CRIT-SAMA-5.3', title: 'Automated Loan Rejection Without Human Oversight Baseline', domain: 'Human Oversight' }
    ]
  },
  {
    level: 'HIGH RISK',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    badge: 'bg-amber-500 text-black',
    icon: AlertTriangle,
    count: 2,
    items: [
      { code: 'CRIT-SAMA-3.1', title: 'Missing Feature Attribution Explainer for Rejected Applicants', domain: 'Transparency' },
      { code: 'CRIT-SAMA-4.1', title: 'Demographic Disparate Impact Ratio Below SAMA 0.80 Rule', domain: 'Fairness' }
    ]
  },
  {
    level: 'MEDIUM RISK',
    color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    badge: 'bg-cyan-500 text-black',
    icon: Info,
    count: 3,
    items: [
      { code: 'CRIT-MRM-2.1', title: 'Annual Model Re-Validation Schedule Overdue', domain: 'Governance' },
      { code: 'CRIT-PDPL-13', title: 'Training Data Retention Policy Exceeds Standard Window', domain: 'Privacy' },
      { code: 'CRIT-NCA-2.7', title: 'Model Poisoning Penetration Test Pending Annual Renewal', domain: 'Cybersecurity' }
    ]
  },
  {
    level: 'LOW RISK',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    badge: 'bg-emerald-500 text-black',
    icon: CheckCircle2,
    count: 12,
    items: [
      { code: 'CRIT-NCA-2.3', title: 'AES-256 Data Encryption at Rest Verified', domain: 'Cybersecurity' },
      { code: 'CRIT-ISO-A.5', title: 'Corporate AI Policy Approved by Board', domain: 'Governance' }
    ]
  }
];

export function ComplianceHeatmap() {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Compliance Risk Heatmap</h3>
          <p className="text-xs text-slate-400">Categorized risk matrix to rapidly answer: "What areas need immediate attention?"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {HEATMAP_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.level} className={`p-4 rounded-xl border ${cat.color} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider">{cat.level}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black ${cat.badge}`}>
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  {cat.items.map((item) => (
                    <div key={item.code} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono">{item.code}</span>
                        <span className="text-slate-300 font-semibold">{item.domain}</span>
                      </div>
                      <p className="text-slate-200 font-medium line-clamp-2 leading-tight">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
