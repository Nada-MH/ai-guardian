'use client';

import React from 'react';
import { Cpu, CheckCircle2, ShieldCheck, FileCode, Layers, Info } from 'lucide-react';
import { AIComponentItem } from '../../types';

interface ComponentRegistryCardProps {
  components: AIComponentItem[];
}

export function ComponentRegistryCard({ components }: ComponentRegistryCardProps) {
  const getRiskBadge = (risk: string) => {
    if (risk === 'HIGH') {
      return (
        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
          HIGH RISK
        </span>
      );
    }
    if (risk === 'MEDIUM') {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
          MEDIUM RISK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
        LOW RISK
      </span>
    );
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Internal Architecture Registry
            </span>
            <h4 className="text-xs font-bold text-white">AI Guardian Internal Components & Models</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {components.length} Active Workers
        </span>
      </div>

      {/* Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {components.map((c) => (
          <div
            key={c.component_id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-blue-500/30 transition-all space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold block">{c.component_id}</span>
                  <h5 className="text-xs font-bold text-white mt-0.5">{c.name}</h5>
                </div>
                <div>{getRiskBadge(c.risk_level)}</div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mt-2 font-medium">
                {c.purpose}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-900 space-y-1.5 text-[10px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Model / Provider:</span>
                <span className="text-slate-200 font-bold">{c.model} ({c.provider})</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Agent Worker:</span>
                <span className="text-blue-300 font-bold">{c.agent_name} {c.agent_version}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Data Boundary:</span>
                <span className="text-emerald-400 truncate max-w-[200px]" title={c.data_used}>{c.data_used}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
