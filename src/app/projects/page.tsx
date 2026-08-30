'use client';

import React from 'react';
import Link from 'next/link';
import { DEMO_AI_SYSTEM } from '../../lib/demo_data';
import { FolderKanban, ShieldAlert, ChevronRight, Layers, Calendar, Plus } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Registered AI Systems Inventory</h2>
          <p className="text-xs text-slate-400">Manage AI models, technical documentation, and compliance audit histories across your organization.</p>
        </div>

        <Link
          href="/new-assessment"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New AI System</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FinTrust AI Loan Approval System */}
        <div className="p-6 rounded-xl bg-[#111827] border border-slate-800 hover:border-blue-500/50 transition-all space-y-4 shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              {DEMO_AI_SYSTEM.code_identifier}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
              {DEMO_AI_SYSTEM.risk_level} RISK
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{DEMO_AI_SYSTEM.name}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{DEMO_AI_SYSTEM.business_purpose}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase">Compliance Score</span>
              <p className="text-lg font-black text-blue-400 mt-0.5">{DEMO_AI_SYSTEM.compliance_score}%</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase">AI Readiness</span>
              <p className="text-lg font-black text-cyan-400 mt-0.5">{DEMO_AI_SYSTEM.readiness_score}/100</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-500">Stage: <strong className="text-emerald-400 font-semibold uppercase">{DEMO_AI_SYSTEM.deployment_status}</strong></span>
            <Link
              href="/projects/sys-fintrust-001"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold group-hover:translate-x-1 transition-transform"
            >
              <span>Open Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
