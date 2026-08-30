'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, AlertTriangle, ArrowRight, FileSearch, ShieldAlert } from 'lucide-react';
import { ExecutiveTopRiskItem } from '../../types';

interface ExecutiveTopRisksListProps {
  topRisks: ExecutiveTopRiskItem[];
}

export function ExecutiveTopRisksList({ topRisks }: ExecutiveTopRisksListProps) {
  const getSeverityBadge = (sev: string) => {
    if (sev === 'CRITICAL') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold font-mono">
          CRITICAL
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
        HIGH
      </span>
    );
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Priority Risk Register
            </span>
            <h4 className="text-xs font-bold text-white">Top Enterprise AI Governance Risks</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Ranked by Severity & Exposure
        </span>
      </div>

      {/* Ranked List */}
      <div className="space-y-3">
        {topRisks.map((r) => (
          <div
            key={r.rank}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-blue-500/30 transition-all space-y-2.5 group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-300 font-mono">
                  {r.rank}
                </span>
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    {r.title}
                  </h5>
                  <span className="text-[10px] text-slate-500 font-mono">{r.framework}</span>
                </div>
              </div>
              <div>
                {getSeverityBadge(r.severity)}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {r.description}
            </p>

            {/* Evidence Link Footer */}
            <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
                <FileSearch className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{r.evidence_name}</span>
              </div>

              <Link
                href={r.evidence_url}
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-bold font-mono text-xs transition-colors shrink-0"
              >
                <span>Drill Into Evidence</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
