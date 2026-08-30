'use client';

import React from 'react';
import { FileBarChart, Download, ShieldCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { DEMO_AI_SYSTEM } from '../../lib/demo_data';

export default function ReportsPage() {
  const handleDownloadReport = (format: string) => {
    alert(`Downloading AI Guardian Audit Report in ${format.toUpperCase()} format with cryptographic SHA-256 signature.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Audit Report Center</h2>
          <p className="text-xs text-slate-400">Export cryptographically signed compliance workpapers for SAMA and internal board audits.</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleDownloadReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => handleDownloadReport('docx')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* PDF Audit Report Document Preview */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 shadow-2xl space-y-8">
        {/* Report Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 uppercase tracking-wider">
                OFFICIAL AUDIT WORKPAPER
              </span>
              <span className="text-xs text-slate-400">Date: August 5, 2026</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI GUARDIAN - COMPLIANCE & GOVERNANCE REPORT</h1>
            <p className="text-xs text-slate-400 mt-1">Target System: <strong className="text-slate-200">{DEMO_AI_SYSTEM.name} ({DEMO_AI_SYSTEM.code_identifier})</strong></p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SHA-256 Integrity Hash</span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold block mt-0.5">e3b0c44298fc1c14...</span>
            <div className="flex items-center justify-end space-x-1 text-emerald-400 text-[10px] mt-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Signed & Tamper-Proof</span>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-l-2 border-blue-500 pl-3">1. Executive Summary</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            This compliance assessment evaluated the <strong>FinTrust AI Loan Approval System</strong> against mandatory regulatory frameworks including <strong>SAMA AI & Technology Guidance 2024</strong>, <strong>Saudi PDPL</strong>, <strong>ISO/IEC 42001</strong>, and <strong>Model Risk Management SR 11-7</strong>. The system achieved an <strong>Overall Compliance Index (OCI) of 71.00%</strong> with an overall risk rating of <strong>HIGH RISK</strong>, primarily driven by missing human-in-the-loop oversight baselines for rejected loan applicants.
          </p>
        </div>

        {/* 2. Score Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-l-2 border-blue-500 pl-3">2. Domain Score Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px]">Cybersecurity (NCA)</span>
              <p className="text-base font-black text-emerald-400 mt-1">88.0%</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px]">Explainability (SHAP)</span>
              <p className="text-base font-black text-cyan-400 mt-1">61.0%</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px]">Demographic Fairness</span>
              <p className="text-base font-black text-amber-400 mt-1">54.0%</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px]">Human Oversight</span>
              <p className="text-base font-black text-rose-400 mt-1">43.0%</p>
            </div>
          </div>
        </div>

        {/* Audit Verification Footer */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <p>Evaluator: <strong className="text-slate-200">AI Guardian Multi-Agent Engine v0.1</strong></p>
            <p>Approved By: <strong className="text-slate-200">Sarah Al-Mansoor (Chief Compliance Officer)</strong></p>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-semibold">Audit Workpaper Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
