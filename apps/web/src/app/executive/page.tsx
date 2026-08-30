'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase, Microscope, FileText, ArrowRight, Download, ShieldCheck,
  TrendingUp, Activity, Layers, HelpCircle
} from 'lucide-react';
import { DEMO_EXECUTIVE_POSTURE, DEMO_AI_SYSTEM } from '../../lib/demo_data';
import { ViewModeSwitcher } from '../../components/executive/ViewModeSwitcher';
import { ExecutivePostureBanner } from '../../components/executive/ExecutivePostureBanner';
import { ExecutiveCoreMetricsGrid } from '../../components/executive/ExecutiveCoreMetricsGrid';
import { ExecutiveTrendChart } from '../../components/executive/ExecutiveTrendChart';
import { ExecutiveTopRisksList } from '../../components/executive/ExecutiveTopRisksList';
import { ExecutiveRecommendationsCard } from '../../components/executive/ExecutiveRecommendationsCard';

export default function ExecutiveDashboardPage() {
  const data = DEMO_EXECUTIVE_POSTURE;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header Row with View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              BOARD-READY EXECUTIVE DASHBOARD
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">FINTRUST AI LOAN APPROVAL</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Enterprise AI Governance Posture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Executive strategic overview of AI risk exposure, multi-layer governance coverage, and top remediation priorities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <ViewModeSwitcher currentProjectId="sys-fintrust-001" />
          
          <Link
            href="/reports"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Board PDF</span>
          </Link>
        </div>
      </div>

      {/* Main Posture Banner (84/100, +13, KPIs) */}
      <ExecutivePostureBanner posture={data.posture} kpis={data.summary_kpis} />

      {/* 4-Layer Governance & Conformance Health Grid */}
      <ExecutiveCoreMetricsGrid metrics={data.core_metrics} />

      {/* 2-Column Split: Analytics, Risks & Strategic Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Trend Chart & Top Risks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <ExecutiveTrendChart trendHistory={data.trend_history} />
          <ExecutiveTopRisksList topRisks={data.top_risks} />
        </div>

        {/* RIGHT COLUMN: Strategic Interventions & Investigation Quick-Launch (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ExecutiveRecommendationsCard recommendations={data.executive_recommendations} />

          {/* Forensic Deep Dive Quick Launch */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Microscope className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white">Compliance Investigation Workspaces</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drill down into raw citations, RAG chunks, multi-agent evaluation transcripts, and cryptographic audit ledgers.
            </p>

            <div className="space-y-2 pt-1">
              <Link
                href="/projects/sys-fintrust-001"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-blue-500/40 transition-all text-xs font-medium text-slate-200 group"
              >
                <span>Investigation Notebook (Findings & Citations)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </Link>
              <Link
                href="/gap-analysis"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-cyan-500/40 transition-all text-xs font-medium text-slate-200 group"
              >
                <span>4-Layer Policy & Control Gap Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
              <Link
                href="/audit-trail"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-emerald-500/40 transition-all text-xs font-medium text-slate-200 group"
              >
                <span>Tamper-Evident SHA-256 Audit Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
