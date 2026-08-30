'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IndustrySelector } from '../../components/assessment/IndustrySelector';
import { WorkflowPipeline } from '../../components/assessment/WorkflowPipeline';
import { Industry, AssessmentPipelineStep, AssessmentProfile } from '../../types';
import { ApplicabilityMatrixModal } from '../../components/applicability/ApplicabilityMatrixModal';
import { DEMO_ASSESSMENT_PROFILE, DEMO_APPLICABILITY_MATRIX } from '../../lib/demo_data';
import {
  Upload, FileText, CheckCircle2, ShieldCheck, Sparkles, PlayCircle,
  ArrowRight, Flame, Plus, Trash2, BookOpen, Lock, FileCode, Check,
  Layers, Globe, Building, Scale, AlertOctagon, HelpCircle, RefreshCw
} from 'lucide-react';

const INITIAL_PIPELINE_STEPS: AssessmentPipelineStep[] = [
  { id: '1', label: 'Document Processing Agent', status: 'pending', progress: 0, description: 'Parsing uploaded PDF/DOCX layouts, extracting tables, and verifying SHA-256 hashes.' },
  { id: '2', label: 'AI System Understanding Agent', status: 'pending', progress: 0, description: 'Synthesizing 14-dimension operational profile, model lineage, and feature schemas.' },
  { id: '3', label: 'Regulatory Applicability Engine', status: 'pending', progress: 0, description: 'Deterministically evaluating jurisdiction, sector, use case & decision impact to exclude out-of-scope rules.' },
  { id: '4', label: 'Retrieval Agent (Dual-Layer RAG)', status: 'pending', progress: 0, description: 'Executing Hybrid Dense + BM25 search exclusively across the applicable regulatory subset.' },
  { id: '5', label: 'Governance Mapping Agent', status: 'pending', progress: 0, description: 'Constructing targeted evaluation matrix with verified provenance metadata.' },
  { id: '6', label: 'Compliance Evaluation Agent', status: 'pending', progress: 0, description: 'Reasoning across document evidence vs criteria and attaching exact quote citations.' },
  { id: '7', label: 'Risk Assessment Agent', status: 'pending', progress: 0, description: 'Computing numeric risk scores across 10 risk vectors for applicable requirements only.' },
  { id: '8', label: 'Recommendation Agent', status: 'pending', progress: 0, description: 'Formulating prioritized remediation roadmap mapped to verified regulatory clauses.' },
  { id: '9', label: 'Report Generation Agent', status: 'pending', progress: 0, description: 'Compiling structured JSON audit workpaper and cryptographic PDF report.' },
  { id: '10', label: "Devil's Advocate Agent (Simulator)", status: 'pending', progress: 0, description: 'Generating post-deployment governance failure scenarios & continuous stress-testing.' },
];

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  hash: string;
}

export default function NewAssessmentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyPolicyInputRef = useRef<HTMLInputElement>(null);

  // 14 Operational Dimensions Profile State
  const [profile, setProfile] = useState<AssessmentProfile>(DEMO_ASSESSMENT_PROFILE);
  const [autoInfer, setAutoInfer] = useState(true);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // Uploaded AI System Documentation Files
  const [systemFiles, setSystemFiles] = useState<UploadedFileItem[]>([
    {
      id: 'f-001',
      name: 'Loan_Model_Architecture_Spec.pdf',
      size: '4.2 MB',
      type: 'PDF',
      category: 'AI System Specification',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    {
      id: 'f-002',
      name: 'Credit_Training_Dataset_Metadata.docx',
      size: '1.8 MB',
      type: 'DOCX',
      category: 'Dataset Documentation',
      hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
    }
  ]);

  // Uploaded Custom Internal Company Regulations
  const [companyPolicies, setCompanyPolicies] = useState<UploadedFileItem[]>([
    {
      id: 'pol-001',
      name: 'Bank_Internal_AI_Risk_Policy_2026.pdf',
      size: '2.1 MB',
      type: 'PDF',
      category: 'Internal Governance Standard',
      hash: '8f4e2c1a9b0d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f'
    }
  ]);

  const [customPolicyText, setCustomPolicyText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState(INITIAL_PIPELINE_STEPS);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamically calculate applicable counts based on active profile filters
  const applicabilityMetrics = useMemo(() => {
    let applicable = 37;
    let excluded = 99;

    if (profile.jurisdiction !== 'Saudi Arabia (KSA)' && profile.jurisdiction !== 'Global') {
      applicable -= 18;
      excluded += 18;
    }
    if (profile.sector !== 'Banking & Finance') {
      applicable -= 12;
      excluded += 12;
    }
    if (!profile.sensitiveData) {
      applicable -= 5;
      excluded += 5;
    }

    applicable = Math.max(12, applicable);
    excluded = 136 - applicable;

    return {
      total: 136,
      applicable,
      excluded,
      ratio: (applicable / 136) * 100
    };
  }, [profile]);

  // File Upload Handlers
  const handleSystemFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newFile: UploadedFileItem = {
      id: `f-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      category: 'AI System Specification',
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
    setSystemFiles((prev) => [...prev, newFile]);
  };

  const handleCompanyPolicyAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newFile: UploadedFileItem = {
      id: `pol-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      category: 'Internal Company Policy',
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
    setCompanyPolicies((prev) => [...prev, newFile]);
  };

  const removeSystemFile = (id: string) => {
    setSystemFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeCompanyPolicy = (id: string) => {
    setCompanyPolicies((prev) => prev.filter((f) => f.id !== id));
  };

  // Assessment Pipeline Execution
  const handleStartAssessment = () => {
    setIsExecuting(true);
    setIsFinished(false);
    setCurrentStepIdx(0);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < INITIAL_PIPELINE_STEPS.length) {
        setPipelineSteps((prevSteps) =>
          prevSteps.map((step, idx) => {
            if (idx < stepIndex) return { ...step, status: 'completed', progress: 100 };
            if (idx === stepIndex) return { ...step, status: 'in_progress', progress: 85 };
            return { ...step, status: 'pending', progress: 0 };
          })
        );
        setCurrentStepIdx(stepIndex);
        stepIndex++;
      } else {
        setPipelineSteps((prevSteps) =>
          prevSteps.map((step) => ({ ...step, status: 'completed', progress: 100 }))
        );
        clearInterval(interval);
        setIsExecuting(false);
        setIsFinished(true);
      }
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Configure New AI Governance Assessment</h2>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
            APPLICABILITY ENGINE ENABLED
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure the 14-dimension AI system profile to dynamically determine and explain applicable vs excluded regulations.
        </p>
      </div>

      {/* Step 1: 14-Dimension Assessment Intake & Scope Classifier */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Step 1: AI System Operational Profile (14 Dimensions)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The Regulatory Applicability Engine uses these dimensions to deterministically filter the knowledge base.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAutoInfer(!autoInfer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              autoInfer
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 hover:bg-blue-600/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{autoInfer ? 'Auto-Infer from Docs (Active)' : 'Manual Configuration'}</span>
          </button>
        </div>

        {/* 14 Dimension Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Dimension 1: Jurisdiction */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Jurisdiction</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.jurisdiction}
              onChange={(e) => setProfile({ ...profile, jurisdiction: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Saudi Arabia (KSA)">Saudi Arabia (KSA)</option>
              <option value="European Union">European Union (EU)</option>
              <option value="United States">United States (US)</option>
              <option value="Singapore">Singapore (MAS)</option>
              <option value="Hong Kong">Hong Kong (HKMA)</option>
              <option value="Global">Global / Multi-Jurisdiction</option>
            </select>
          </div>

          {/* Dimension 2: Sector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Sector & Industry</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.sector}
              onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Banking & Finance">Banking & Financial Services</option>
              <option value="Healthcare">Healthcare & Life Sciences</option>
              <option value="Telecommunications">Telecommunications & IT</option>
              <option value="Government">Government & Public Sector</option>
              <option value="Retail">Retail & E-Commerce</option>
              <option value="Cross-Sector">Cross-Sector General</option>
            </select>
          </div>

          {/* Dimension 3: Organization Type */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Organization Type</label>
            <select
              value={profile.organizationType}
              onChange={(e) => setProfile({ ...profile, organizationType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Commercial Bank (Tier 1)">Commercial Bank (Tier 1)</option>
              <option value="Fintech / Digital Payments">Fintech / Digital Payments</option>
              <option value="Insurance Provider">Insurance Provider</option>
              <option value="Digital Brokerage / Trading">Digital Brokerage / Trading</option>
              <option value="Enterprise SaaS">Enterprise SaaS Provider</option>
            </select>
          </div>

          {/* Dimension 4: AI Use Case */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>AI Use Case</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.aiUseCase}
              onChange={(e) => setProfile({ ...profile, aiUseCase: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Credit Scoring & Loan Decisioning">Credit Scoring & Loan Decisioning</option>
              <option value="Real-Time Fraud Detection">Real-Time Fraud Detection</option>
              <option value="AML Transaction Monitoring">AML Transaction Monitoring</option>
              <option value="Customer Service Chatbot / LLM">Customer Service Chatbot / LLM</option>
              <option value="Algorithmic Trading & Execution">Algorithmic Trading & Execution</option>
              <option value="Biometric Verification">Biometric ID Verification</option>
            </select>
          </div>

          {/* Dimension 5: Decision Impact */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Decision Impact</label>
            <select
              value={profile.decisionImpact}
              onChange={(e) => setProfile({ ...profile, decisionImpact: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="High Impact (Binding Financial Denial/Approval)">High Impact (Binding Financial Denial/Approval)</option>
              <option value="Medium Impact (Human Advisory Recommendation)">Medium Impact (Human Advisory Recommendation)</option>
              <option value="Low Impact (Informational / Content Output)">Low Impact (Informational / Content Output)</option>
            </select>
          </div>

          {/* Dimension 6: Human Oversight */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Human Oversight Level</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.humanOversight}
              onChange={(e) => setProfile({ ...profile, humanOversight: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Fully Autonomous (Automatic Denial below 60%)">Fully Autonomous (No routine underwriter review)</option>
              <option value="Human-in-the-Loop (Mandatory Underwriter Approval)">Human-in-the-Loop (Mandatory underwriter approval)</option>
              <option value="Human-on-the-Loop (Post-hoc Anomaly Monitoring)">Human-on-the-Loop (Post-hoc monitoring)</option>
            </select>
          </div>

          {/* Dimension 7: Deployment Stage */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Deployment Stage</label>
            <select
              value={profile.deploymentStage}
              onChange={(e) => setProfile({ ...profile, deploymentStage: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Production">Live Production</option>
              <option value="Staging">Staging / Pilot</option>
              <option value="Validation">Independent Model Validation</option>
              <option value="Development">Development (Pre-Validation)</option>
            </select>
          </div>

          {/* Dimension 8: Sensitive Data */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Sensitive Customer Data</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.sensitiveData ? 'yes' : 'no'}
              onChange={(e) => setProfile({ ...profile, sensitiveData: e.target.value === 'yes' })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="yes">Yes — Ingests National ID, SIMAH & Financial Data</option>
              <option value="no">No — Anonymized / Aggregated Data Only</option>
            </select>
          </div>

          {/* Dimension 9: Third Party Components */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Third-Party AI Models</span>
              {autoInfer && <span className="text-[9px] text-cyan-400 font-mono">Inferred</span>}
            </label>
            <select
              value={profile.thirdPartyComponents ? 'yes' : 'no'}
              onChange={(e) => setProfile({ ...profile, thirdPartyComponents: e.target.value === 'yes' })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="yes">Yes — Incorporates Vendor / Open-Source GBDT</option>
              <option value="no">No — 100% In-House Proprietary Code</option>
            </select>
          </div>
        </div>

        {/* Live Scope Applicability Preview Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-blue-950/30 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <span className="text-emerald-400">{applicabilityMetrics.applicable} Requirements In-Scope</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{applicabilityMetrics.excluded} Out-of-Scope Rules Omitted</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluated deterministically based on {profile.jurisdiction} • {profile.sector} • {profile.aiUseCase}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMatrixModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all shrink-0"
          >
            View Scope Matrix & Reasons →
          </button>
        </div>
      </div>

      {/* Step 2: Upload AI System Technical Documentation */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Step 2: Upload AI System Technical Files</h3>
            <p className="text-xs text-slate-400">Upload architecture specs, dataset schemas, training logs, or validation reports.</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            {systemFiles.length} Files Attached
          </span>
        </div>

        {/* File Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.json,.txt,.md"
          onChange={handleSystemFileAdd}
          className="hidden"
        />
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-blue-500/60 transition-all text-center group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-white">Click or drag & drop AI System Documentation</p>
          <p className="text-[11px] text-slate-400 mt-1">Supported: <strong>PDF, DOCX, TXT, MD, JSON</strong> (Max 50 MB)</p>
        </div>

        {/* Attached System Files List */}
        <div className="space-y-2 pt-2">
          {systemFiles.map((file) => (
            <div key={file.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400">{file.category} • {file.size}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Parsed & Indexed</span>
                </span>
                <button
                  onClick={() => removeSystemFile(file.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Custom Internal Company Regulations */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Step 3: Internal Organization Policies & AI Standards</span>
            </h3>
            <p className="text-xs text-slate-400">Add proprietary internal rules, model risk policies, or ethics guidelines to include alongside national regulations.</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
            {companyPolicies.length} Custom Policies
          </span>
        </div>

        <input
          ref={companyPolicyInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleCompanyPolicyAdd}
          className="hidden"
        />

        <div
          onClick={() => companyPolicyInputRef.current?.click()}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <Plus className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Attach Internal Organization Policy File (PDF/DOCX)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Source Type: INTERNAL_POLICY</span>
        </div>

        {companyPolicies.map((pol) => (
          <div key={pol.id} className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 truncate">{pol.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono">Source Type: INTERNAL_POLICY • SHA-256 Verified</p>
              </div>
            </div>
            <button
              onClick={() => removeCompanyPolicy(pol.id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Step 4: Multi-Agent Execution & Workflow Pipeline */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Step 4: Launch Multi-Agent Assessment Pipeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Executes all 10 specialized compliance agents with deterministic applicability filtering.</p>
          </div>

          <button
            onClick={handleStartAssessment}
            disabled={isExecuting}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-lg ${
              isExecuting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 hover:scale-[1.02] shadow-blue-500/20'
            }`}
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Executing Agents ({currentStepIdx + 1}/10)...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 text-white" />
                <span>Start Assessment Run</span>
              </>
            )}
          </button>
        </div>

        {/* Workflow Pipeline Step Tracker */}
        <WorkflowPipeline
          steps={pipelineSteps}
          currentStepIndex={currentStepIdx}
        />

        {/* Completion Action Banner */}
        {isFinished && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Assessment Pipeline Completed Successfully</h4>
                <p className="text-[11px] text-slate-300">37 applicable requirements evaluated • 3 critical findings identified.</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/projects/sys-fintrust-001')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
            >
              <span>Open Project Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Applicability Matrix Modal */}
      <ApplicabilityMatrixModal
        matrix={DEMO_APPLICABILITY_MATRIX}
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />
    </div>
  );
}
