'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Cpu, Lock, Sliders, CheckCircle2, Award, FileCode,
  ArrowRight, Activity, Terminal, Shield, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { DEMO_SELF_GOVERNANCE_MANIFEST } from '../../lib/demo_data';
import { ComponentRegistryCard } from '../../components/self_governance/ComponentRegistryCard';
import { PromptGovernancePanel } from '../../components/self_governance/PromptGovernancePanel';
import { AIRiskControlsGrid } from '../../components/self_governance/AIRiskControlsGrid';
import { HumanOversightLedger } from '../../components/self_governance/HumanOversightLedger';

export default function SelfGovernancePage() {
  const manifest = DEMO_SELF_GOVERNANCE_MANIFEST;
  const sa = manifest.self_assessment;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              AI GUARDIAN SELF-GOVERNANCE MANIFEST
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">PLATFORM {manifest.platform_version}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            How AI Guardian Is Governed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI Guardian is itself an auditable AI system. Transparently inspect internal LLM models, immutable prompt versions, 9 AI risk safeguards, human oversight ledgers, and self-assessment scores.
          </p>
        </div>

        <Link
          href="/projects/sys-fintrust-001"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 self-start md:self-auto"
        >
          <span>Open System Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Self-Assessment Posture Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/20 via-blue-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
              <Award className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  SELF-ASSESSMENT POSTURE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                  {sa.governance_status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                  {sa.compliance_score}%
                  <span className="text-xl text-slate-500 font-normal"> / 100</span>
                </span>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                  Readiness: {sa.readiness_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-center">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Rules Evaluated</span>
              <span className="text-lg font-black text-white font-mono">{sa.total_requirements_assessed}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-center">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Compliant</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{sa.compliant_count}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-center">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Non-Compliant</span>
              <span className="text-lg font-black text-blue-400 font-mono">{sa.non_compliant_count}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850 text-center">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Human Overrides</span>
              <span className="text-lg font-black text-purple-400 font-mono">{sa.human_overrides_logged}</span>
            </div>
          </div>

        </div>

        {/* Assessed Frameworks Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[10px] font-bold uppercase">
            Governed Under:
          </span>
          {sa.assessed_frameworks.map((fw, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{fw}</span>
            </span>
          ))}
        </div>

      </div>

      {/* AI Component Registry Card */}
      <ComponentRegistryCard components={manifest.components} />

      {/* 2-Column Split: Prompt Governance & Human-in-the-Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <PromptGovernancePanel prompts={manifest.prompts} />
        </div>
        <div className="lg:col-span-6">
          <HumanOversightLedger />
        </div>
      </div>

      {/* 9-Vector AI Risk Controls Grid */}
      <AIRiskControlsGrid riskControls={manifest.risk_controls} />

    </div>
  );
}
