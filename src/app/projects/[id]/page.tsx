'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plus, Search, CheckSquare, Square, FileText, BookOpen, ShieldAlert, 
  FileBarChart, ExternalLink, Sparkles, Send, Download, ArrowLeft, CheckCircle2, AlertOctagon, Share2, Settings, Flame, Lightbulb
} from 'lucide-react';
import {
  DEMO_AI_SYSTEM, DEMO_DOCUMENTS, DEMO_KNOWLEDGE_SOURCES, DEMO_FINDINGS,
  DEMO_WHAT_IF_SCENARIOS, DEMO_APPLICABILITY_MATRIX, DEMO_DETERMINISTIC_SCORE_SNAPSHOT,
  DEMO_REQUIREMENT_EVALUATIONS
} from '../../../lib/demo_data';
import { PillBar } from '../../../components/what-if/PillBar';
import { ProvenanceBadge } from '../../../components/findings/ProvenanceBadge';
import { SourceProvenanceModal } from '../../../components/findings/SourceProvenanceModal';
import { ApplicabilitySummaryCard } from '../../../components/applicability/ApplicabilitySummaryCard';
import { ScoreBreakdownModal } from '../../../components/scoring/ScoreBreakdownModal';
import { EvidenceStrengthBadge } from '../../../components/scoring/EvidenceStrengthBadge';
import { ComplianceFinding } from '../../../types';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'audit' | 'findings' | 'heatmap'>('audit');
  const [selectedSources, setSelectedSources] = useState<string[]>(['doc-001', 'doc-002', 'ks-001', 'ks-004']);
  const [chatQuery, setChatQuery] = useState('');
  const [activeWhatIfChipIds, setActiveWhatIfChipIds] = useState<string[]>(['wif-001', 'wif-002']);
  const [modalFinding, setModalFinding] = useState<ComplianceFinding | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; citation?: string }>>([
    {
      sender: 'ai',
      text: 'AI Guardian Compliance Engine initialized. Analyzed 5 documents and 6 regulatory frameworks. Identified 3 Critical Findings under SAMA AI Guidance Section 5.3 & Saudi PDPL Article 13.',
      citation: 'Loan_Model_Architecture_Spec.pdf (Page 4)'
    }
  ]);

  const handleToggleWhatIfChip = (id: string) => {
    const isAlreadyActive = activeWhatIfChipIds.includes(id);
    const newActiveIds = isAlreadyActive
      ? activeWhatIfChipIds.filter((i) => i !== id)
      : [...activeWhatIfChipIds, id];
    
    setActiveWhatIfChipIds(newActiveIds);

    const scenario = DEMO_WHAT_IF_SCENARIOS.find((s) => s.id === id);
    if (scenario) {
      const actionLabel = isAlreadyActive ? 'Removed' : 'Applied';
      const text = `💡 ${actionLabel} What-If Action: "${scenario.title}". Projected Compliance Impact: +${scenario.scoreDeltas.overall_compliance}% Compliance • +${scenario.scoreDeltas.overall_readiness} Readiness. Satisfies ${scenario.satisfiedClauses[0]?.framework} ${scenario.satisfiedClauses[0]?.clause}.`;
      setChatMessages((prev) => [...prev, { sender: 'ai', text, citation: 'What-If Agent (Agent 10)' }]);
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userText = chatQuery;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatQuery('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Based on your ${selectedSources.length} selected sources, the FinTrust engine automatically rejects credit applications below 60% default probability. This violates SAMA AI Guidance Section 5.3 and SDAIA Principle 5.1 requiring mandatory human review for high-impact decisions.`,
          citation: 'SAMA AI Guidance Section 5.3 & Page 4 of Loan_Model_Spec.pdf'
        }
      ]);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0B0F17] text-slate-100 -m-6 md:-m-8">
      {/* Top Workspace Header (NotebookLM Style - Screenshot 2) */}
      <div className="h-14 border-b border-slate-800/80 bg-[#0F172A] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-extrabold text-white tracking-tight">{DEMO_AI_SYSTEM.name}</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase border border-rose-500/30">
            {DEMO_AI_SYSTEM.risk_level} RISK
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link href="/reports" className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </Link>
        </div>
      </div>

      {/* 3-Panel NotebookLM Workspace Grid (Identical to Screenshot 2) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0 overflow-hidden">
        
        {/* PANEL 1: LEFT - SOURCES & REGULATIONS (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-[#0E1422] flex flex-col h-full min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Sources ({DEMO_DOCUMENTS.length + DEMO_KNOWLEDGE_SOURCES.length})</h2>
              <button className="text-[11px] text-blue-400 hover:underline font-semibold" onClick={() => setSelectedSources(DEMO_DOCUMENTS.map(d=>d.id).concat(DEMO_KNOWLEDGE_SOURCES.map(k=>k.id)))}>
                Select all
              </button>
            </div>

            <Link
              href="/documents"
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add project sources</span>
            </Link>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sources..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sources Checkbox List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Uploaded AI Documents</p>
            {DEMO_DOCUMENTS.map((doc) => {
              const isChecked = selectedSources.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleSource(doc.id)}
                  className={`p-2.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                    isChecked ? 'bg-slate-900/90 border-blue-500/50' : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  {isChecked ? <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-500">{doc.category}</p>
                  </div>
                </div>
              );
            })}

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pt-3">Regulatory Frameworks</p>
            {DEMO_KNOWLEDGE_SOURCES.map((ks) => {
              const isChecked = selectedSources.includes(ks.id);
              return (
                <div
                  key={ks.id}
                  onClick={() => toggleSource(ks.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked ? 'bg-slate-900/90 border-cyan-500/50' : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{ks.title}</p>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <ProvenanceBadge sourceType={ks.sourceType} size="sm" showIcon={false} />
                        <span className="text-[10px] text-slate-400 font-mono">{ks.version}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: CENTER - AUDIT & EVIDENCE STUDIO (6 cols) */}
        <div className="lg:col-span-6 bg-[#0B0F17] flex flex-col h-full min-h-0 overflow-hidden">
          {/* Header KPI Bar */}
          <div className="p-4 border-b border-slate-800 bg-[#0F172A]/80 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Readiness</span>
                <span className="text-lg font-black text-amber-400">{DEMO_AI_SYSTEM.readiness_score}/100</span>
              </div>
              <div
                onClick={() => setIsScoreModalOpen(true)}
                className="cursor-pointer group p-1 -m-1 rounded-lg hover:bg-slate-800/60 transition-colors"
                title="Click to inspect deterministic mathematical calculation & drill-down"
              >
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider block font-bold group-hover:underline">
                    Compliance
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    MATH AUDIT
                  </span>
                </div>
                <span className="text-lg font-black text-blue-400 group-hover:text-cyan-400 transition-colors">
                  {DEMO_AI_SYSTEM.compliance_score}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Gaps</span>
                <span className="text-lg font-black text-rose-400">3 Critical</span>
              </div>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setActiveTab('audit')} className={`px-3 py-1 rounded text-xs font-bold ${activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                Audit Studio
              </button>
              <button onClick={() => setActiveTab('findings')} className={`px-3 py-1 rounded text-xs font-bold ${activeTab === 'findings' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                Findings ({DEMO_FINDINGS.length})
              </button>
            </div>
          </div>

          {/* Central Audit Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {activeTab === 'audit' ? (
              <>
                {/* RAG Synthesis Chat & Evidence Cards */}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600/15 border-blue-500/30 text-blue-100 ml-12'
                        : 'bg-[#111726] border-slate-800 text-slate-200 mr-4 shadow-xl'
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    {msg.citation && (
                      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-cyan-400 font-mono flex items-center justify-between">
                        <span>Cited Evidence: {msg.citation}</span>
                        <Link href="/evidence/find-001" className="hover:underline flex items-center space-x-1">
                          <span>Inspect Evidence</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}

                {/* Highlighted Evidence Card Prompt */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      🔴 CRITICAL EVIDENCE HIGHLIGHT
                    </span>
                    <span className="text-slate-500 font-mono">Page 4 • Loan_Model_Spec.pdf</span>
                  </div>
                  <blockquote className="p-3 rounded-xl bg-slate-950 text-xs italic text-blue-200 border border-blue-500/30">
                    "Applications below 60% are automatically rejected."
                  </blockquote>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Finding: <strong>Automated Loan Rejection Without Human Oversight</strong></span>
                    <Link href="/evidence/find-001" className="text-blue-400 font-bold hover:underline">
                      Open 3-Panel Viewer →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              DEMO_FINDINGS.map((finding) => (
                <div key={finding.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {finding.severity}
                      </span>
                      <ProvenanceBadge sourceType={finding.provenance?.sourceType} size="sm" />
                    </div>
                    <span className="text-cyan-400 font-mono text-[11px] font-bold">{finding.regulationReference}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-white">{finding.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{finding.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setModalFinding(finding)}
                      className="inline-flex items-center space-x-1 text-slate-300 hover:text-white font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors text-[11px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Provenance</span>
                    </button>

                    <Link href={`/evidence/${finding.id}`} className="text-blue-400 font-bold hover:underline inline-flex items-center space-x-1 text-[11px]">
                      <span>Inspect Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Container: What-If Pill Bar + RAG Query Input */}
          <div className="p-3 border-t border-slate-800 bg-[#0E1422] shrink-0 space-y-2">
            <PillBar
              scenarios={DEMO_WHAT_IF_SCENARIOS}
              activeScenarioIds={activeWhatIfChipIds}
              onToggleScenario={handleToggleWhatIfChip}
              onClearAll={() => setActiveWhatIfChipIds([])}
            />

            <form onSubmit={handleSendQuery} className="relative">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder={`Ask a compliance question or query ${selectedSources.length} selected sources...`}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors font-bold shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* PANEL 3: RIGHT - STUDIO ARTIFACTS & REPORTS (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800/80 bg-[#0E1422] flex flex-col h-full min-h-0 overflow-y-auto p-4 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Studio Artifacts</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Generate compliance deliverables from project sources.</p>
          </div>

          {/* Studio Artifact Cards Grid (NotebookLM Studio Screenshot 2) */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/reports" className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all text-left group">
              <FileBarChart className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-bold text-slate-200">Audit Workpaper</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Official PDF</p>
            </Link>

            <Link href="/findings" className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group">
              <ShieldAlert className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-bold text-slate-200">Evidence Matrix</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Cited Quotes</p>
            </Link>

            <Link href="/version-comparison" className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all text-left group">
              <Sparkles className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-bold text-slate-200">Governance Diff</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">v1.0 vs v2.0</p>
            </Link>

            <Link href="/knowledge-base" className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group">
              <BookOpen className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-bold text-slate-200">Regulations</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">SAMA & PDPL</p>
            </Link>
          </div>

          {/* Regulatory Applicability Engine Summary Card */}
          <ApplicabilitySummaryCard matrix={DEMO_APPLICABILITY_MATRIX} />

          {/* Governance Simulator Launch Card */}
          <Link
            href="/simulator"
            className="p-4 rounded-2xl bg-gradient-to-br from-rose-900/30 to-orange-900/20 border border-rose-500/30 hover:border-rose-400/50 transition-all group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Governance Simulator</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Devil&apos;s Advocate — 6 interactive scenarios</p>
            </div>
          </Link>

          {/* What-If Optimization Sandbox Card */}
          <Link
            href="/what-if"
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-900/30 to-blue-900/20 border border-amber-500/30 hover:border-amber-400/50 transition-all group flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">What-If Sandbox (Agent 10)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Generative RAG pill bar & ROI simulator</p>
            </div>
          </Link>

          {/* Quick PDF Report Preview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/30 mt-auto space-y-2">
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report Ready</span>
            </div>
            <p className="text-xs text-slate-300">SAMA & PDPL Audit Report generated with SHA-256 digital signature.</p>
            <Link
              href="/reports"
              className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Global Source Provenance Modal */}
      <SourceProvenanceModal
        finding={modalFinding}
        isOpen={Boolean(modalFinding)}
        onClose={() => setModalFinding(null)}
      />

      {/* Deterministic Score Audit & Drill-Down Modal */}
      <ScoreBreakdownModal
        snapshot={DEMO_DETERMINISTIC_SCORE_SNAPSHOT}
        evaluations={DEMO_REQUIREMENT_EVALUATIONS}
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />
    </div>
  );
}
