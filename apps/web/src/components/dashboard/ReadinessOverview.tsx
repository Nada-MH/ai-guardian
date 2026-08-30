'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, CheckCircle2, Clock, Calendar, Layers, Server } from 'lucide-react';
import { DEMO_AI_SYSTEM } from '../../lib/demo_data';

export function ReadinessOverview() {
  return (
    <div className="space-y-4">
      {/* Top Compact Assessment Header Bar */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">{DEMO_AI_SYSTEM.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {DEMO_AI_SYSTEM.code_identifier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{DEMO_AI_SYSTEM.business_purpose}</p>
          </div>
        </div>

        {/* Compact Attributes Badges */}
        <div className="flex items-center space-x-6 text-xs border-l border-slate-800 pl-6">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Industry</span>
            <span className="font-bold text-slate-200">{DEMO_AI_SYSTEM.industry}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Risk Classification</span>
            <span className="font-bold text-rose-400 uppercase">Tier 1 Critical</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Status</span>
            <span className="font-bold text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Last Assessment</span>
            <span className="font-bold text-slate-300">05 August 2026</span>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. AI Readiness Score */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Readiness</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Needs Improvement
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-white">76</span>
            <span className="text-xs text-slate-500 font-semibold">/ 100</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500">Target: 85+ for Tier 1 Critical</p>
        </div>

        {/* 2. Compliance Score */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compliance Score</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Action Required
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-blue-400">71%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '71%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500">Evaluated against SAMA & PDPL</p>
        </div>

        {/* 3. Critical Findings */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Critical Findings</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">3</div>
          <p className="text-[10px] text-rose-300/80">Requires Immediate Resolution</p>
        </div>

        {/* 4. High Risk Issues */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">High Risk Issues</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">7</div>
          <p className="text-[10px] text-amber-300/80">Schedule for Next Release</p>
        </div>

        {/* 5. Resolved Issues */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Resolved Issues</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">4</div>
          <p className="text-[10px] text-emerald-300/80">Verified in Last Audit</p>
        </div>
      </div>
    </div>
  );
}
