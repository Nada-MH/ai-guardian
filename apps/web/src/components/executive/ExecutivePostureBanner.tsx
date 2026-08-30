'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, AlertOctagon, AlertTriangle, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import { ExecutivePostureSummary, ExecutiveKpis } from '../../types';

interface ExecutivePostureBannerProps {
  posture: ExecutivePostureSummary;
  kpis: ExecutiveKpis;
}

export function ExecutivePostureBanner({ posture, kpis }: ExecutivePostureBannerProps) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Top Posture Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Left: Overall Posture Score */}
        <div className="flex items-center space-x-5">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
            <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-mono font-black text-[10px]">
              {posture.assessment_version}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                AI GOVERNANCE POSTURE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                {posture.posture_status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-3 mt-1">
              <span className="text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                {posture.overall_score}
                <span className="text-xl text-slate-500 font-normal"> / 100</span>
              </span>
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{posture.score_delta} vs Baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Board Assurance Status */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
              Residual Risk Tier
            </span>
            <span className="text-sm font-black text-amber-400 font-mono">
              {posture.risk_rating.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
              Remediation Velocity
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {kpis.remediation_rate_pct}% Closed
            </span>
          </div>
        </div>

      </div>

      {/* Bottom KPI Ribbon (5 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Critical Risks */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-rose-500/20 hover:border-rose-500/40 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Critical Risks</span>
            <span className="text-2xl font-black text-rose-400 font-mono">{kpis.critical_risks}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* High Risks */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">High Risks</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{kpis.high_risks}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Open Actions */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Open Actions</span>
            <span className="text-2xl font-black text-blue-400 font-mono">{kpis.open_actions}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Overdue Actions */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/20 hover:border-purple-500/40 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Overdue Actions</span>
            <span className="text-2xl font-black text-purple-400 font-mono">{kpis.overdue_actions}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Resolved Findings */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Resolved Findings</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{kpis.resolved_findings}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

    </div>
  );
}
