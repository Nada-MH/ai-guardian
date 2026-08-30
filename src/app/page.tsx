'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck, Landmark, FileText, CheckCircle2, Clock, MoreVertical, Sparkles, AlertTriangle } from 'lucide-react';
import { DEMO_AI_SYSTEM } from '../lib/demo_data';

const NOTEBOOK_PROJECTS = [
  {
    id: 'self-governance',
    title: 'AI Guardian Platform Self-Governance',
    date: '20 Aug 2026',
    sourcesCount: 9,
    complianceScore: 96,
    readinessScore: 98,
    riskLevel: 'LOW',
    industry: 'Enterprise AI',
    iconBg: 'bg-cyan-500/20 text-cyan-300',
    description: 'Autonomous self-assessment of AI Guardian itself against SAMA, PDPL, SDAIA, and ISO 42001.',
    framework: 'SAMA, PDPL, SDAIA, ISO 42001',
    customLink: '/self-governance'
  },
  {
    id: 'sys-fintrust-001',
    title: 'FinTrust AI Loan Approval System',
    date: '05 Aug 2026',
    sourcesCount: 5,
    complianceScore: 71,
    readinessScore: 76,
    riskLevel: 'HIGH',
    industry: 'Finance',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    description: 'Automated retail loan application decisioning and credit scoring engine.',
    framework: 'SAMA AI Guidance & PDPL',
  },
  {
    id: 'sys-openbanking-002',
    title: 'SAMA Open Banking Security Gateway',
    date: '28 Jul 2026',
    sourcesCount: 8,
    complianceScore: 88,
    readinessScore: 92,
    riskLevel: 'LOW',
    industry: 'Finance',
    iconBg: 'bg-blue-500/20 text-blue-400',
    description: 'API OAuth2 & Mutual TLS security validation framework.',
    framework: 'SAMA Open Banking v1.2',
  },
  {
    id: 'sys-healthcare-003',
    title: 'Diagnostic Medical Imaging AI Assistant',
    date: '14 May 2026',
    sourcesCount: 4,
    complianceScore: 64,
    readinessScore: 70,
    riskLevel: 'HIGH',
    industry: 'Healthcare',
    iconBg: 'bg-purple-500/20 text-purple-400',
    description: 'Radiology image classification and patient data privacy model.',
    framework: 'MOH AI Policy & Saudi PDPL',
  },
  {
    id: 'sys-fraud-004',
    title: 'Real-Time AML Fraud Detection Engine',
    date: '02 Apr 2026',
    sourcesCount: 6,
    complianceScore: 82,
    readinessScore: 85,
    riskLevel: 'MEDIUM',
    industry: 'Finance',
    iconBg: 'bg-amber-500/20 text-amber-400',
    description: 'Transaction monitoring and suspicious activity report generation.',
    framework: 'FATF & SAMA AML Guidance',
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('My Assessments');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Filter Bar (NotebookLM Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-full border border-slate-800/80 text-xs font-semibold">
          {['All', 'My Assessments', 'Featured Frameworks', 'Collections'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          href="/new-assessment"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assessment</span>
        </Link>
      </div>

      {/* Executive vs Investigation View Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                Executive Governance Posture
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                84 / 100 (+13)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Looking for high-level board risk metrics & strategic recommendations?
            </p>
          </div>
        </div>

        <Link
          href="/executive"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 self-start sm:self-auto shrink-0"
        >
          <span>Open Executive View</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">My AI System Assessments</h2>
        <p className="text-xs text-slate-400 mt-1">Select an AI system notebook to inspect document evidence, RAG findings, and audit workpapers.</p>
      </div>

      {/* Notebook Cards Grid (Identical layout to NotebookLM Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Create New Notebook Card */}
        <Link
          href="/new-assessment"
          className="p-8 rounded-3xl border-2 border-dashed border-slate-800 hover:border-blue-500/60 bg-slate-900/30 hover:bg-blue-600/5 transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-7 h-7" />
          </div>
          <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400">Create New AI Assessment</span>
          <span className="text-[11px] text-slate-500 mt-1">Upload docs & assess compliance</span>
        </Link>

        {/* Notebook Cards */}
        {NOTEBOOK_PROJECTS.map((proj) => (
          <Link
            key={proj.id}
            href={proj.customLink || `/projects/${proj.id}`}
            className="p-6 rounded-3xl bg-[#111726] border border-slate-800/90 hover:border-blue-500/50 transition-all flex flex-col justify-between group cursor-pointer shadow-xl relative overflow-hidden min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${proj.iconBg} flex items-center justify-center font-bold text-lg shadow-sm`}>
                  <Landmark className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                  proj.riskLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {proj.riskLevel} RISK
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{proj.date} • <strong>{proj.sourcesCount} sources</strong></span>
              <span className="font-bold text-blue-400">{proj.complianceScore}% Score</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
