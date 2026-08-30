'use client';

import React, { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Search, MessageSquare, AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { EvidenceAnnotation } from '../../types';

interface EvidenceDocumentViewerProps {
  annotation: EvidenceAnnotation | null;
  documentName: string;
  pageNumber: number;
}

export function EvidenceDocumentViewer({ annotation, documentName, pageNumber }: EvidenceDocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(pageNumber || 1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const getAnnotationBadge = (type: string) => {
    switch (type) {
      case 'compliance_violation':
        return { label: '🔴 Compliance Violation', color: 'bg-rose-500/20 border-rose-500/50 text-rose-300', highlight: 'bg-rose-500/30 border-rose-500/60 text-rose-100' };
      case 'risk':
        return { label: '🟠 Risk Identified', color: 'bg-amber-500/20 border-amber-500/50 text-amber-300', highlight: 'bg-amber-500/30 border-amber-500/60 text-amber-100' };
      case 'warning':
        return { label: '🟡 Compliance Warning', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300', highlight: 'bg-yellow-500/30 border-yellow-500/60 text-yellow-100' };
      case 'compliant_evidence':
        return { label: '🟢 Compliant Evidence', color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300', highlight: 'bg-emerald-500/30 border-emerald-500/60 text-emerald-100' };
      default:
        return { label: '🔴 Compliance Violation', color: 'bg-rose-500/20 border-rose-500/50 text-rose-300', highlight: 'bg-rose-500/30 border-rose-500/60 text-rose-100' };
    }
  };

  const badgeStyle = getAnnotationBadge(annotation?.annotationType || 'compliance_violation');

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl flex flex-col h-[82vh] overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2 truncate">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-bold text-slate-200 truncate">{documentName}</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">PDF Document</span>
        </div>

        {/* Page & Zoom Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-200 font-mono">Page <strong>{currentPage}</strong> of 28</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(28, p + 1))}
              disabled={currentPage >= 28}
              className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-400">
            <button onClick={() => setZoomLevel((z) => Math.max(75, z - 10))} className="p-0.5 hover:text-white">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-10 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel((z) => Math.min(150, z + 10))} className="p-0.5 hover:text-white">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-6 flex justify-center">
        <div
          className="bg-slate-900 border border-slate-800 rounded-lg p-8 w-full max-w-2xl min-h-[600px] shadow-2xl relative transition-transform duration-200 text-slate-300 font-serif leading-relaxed text-sm"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center text-xs font-sans text-slate-500">
            <span>FINTRUST AI SYSTEM SPECIFICATION v2.0</span>
            <span>SECTION 4.1 AUTOMATED THRESHOLDS</span>
          </div>

          {/* Dummy Document Context Text */}
          <p className="mb-4 text-slate-400 leading-normal">
            The FinTrust Loan Approval Engine executes real-time risk assessment on incoming consumer credit applications.
            Upon receipt of applicant payload, the pipeline computes applicant default probability using XGBoost decision trees.
          </p>

          {/* Highlighted Evidence Text Box */}
          {annotation && currentPage === annotation.pageNumber ? (
            <div className="my-6 p-4 rounded-xl border relative shadow-xl transition-all animate-pulse-slow">
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold border inline-block mb-3 ${badgeStyle.color}`}>
                {badgeStyle.label}
              </div>

              {/* The Highlighted Sentence */}
              <div className={`p-3 rounded-lg border font-sans font-bold text-base ${badgeStyle.highlight} shadow-md`}>
                "{annotation.extractedText}"
              </div>

              {/* Floating AI Guardian Comment Box */}
              <div className="mt-4 p-3.5 rounded-lg bg-[#0B0F17] border border-blue-500/40 text-xs font-sans text-slate-200 space-y-1.5 shadow-lg">
                <div className="flex items-center space-x-1.5 text-blue-400 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Guardian Audit Comment:</span>
                </div>
                <p className="text-slate-300 italic leading-relaxed">{annotation.aiComment}</p>
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 rounded-xl border border-slate-800 bg-slate-950/50 text-xs text-slate-500 text-center">
              Page {currentPage} - No active evidence annotations on this page. Navigate to Page {annotation?.pageNumber || 4} to view highlighted finding.
            </div>
          )}

          <p className="mt-4 text-slate-400 leading-normal">
            Applications scoring above 80% default threshold are routed to fraud investigation. Model performance is continuously tracked against baseline population distribution.
          </p>

          {/* Page Footer */}
          <div className="mt-12 pt-4 border-t border-slate-800 text-center text-xs font-sans text-slate-600">
            Page {currentPage} of 28 — CONFIDENTIAL & PROPRIETARY
          </div>
        </div>
      </div>
    </div>
  );
}
