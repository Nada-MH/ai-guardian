'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const PIPELINE_TIMELINE_STEPS = [
  { label: 'Documents Uploaded', status: 'completed', description: 'PDF/DOCX layout parsing & SHA-256 integrity verification.' },
  { label: 'Text Extraction Complete', status: 'completed', description: 'Structured sectioning and coordinate bounding box extraction.' },
  { label: 'RAG Retrieval Complete', status: 'completed', description: 'Dual-Layer Hybrid search across SAMA, ISO 42001 & PDPL.' },
  { label: 'Compliance Analysis Complete', status: 'completed', description: 'Multi-agent evaluation against regulatory criteria.' },
  { label: 'Risk Scoring Complete', status: 'completed', description: 'Numeric scoring across 10 financial AI risk vectors.' },
  { label: 'Report Generated', status: 'completed', description: 'Cryptographically signed audit workpaper compiled.' },
];

export function AssessmentTimeline() {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Assessment Pipeline Execution Timeline</h3>
          <p className="text-xs text-slate-400">Verifiable automated AI audit pipeline stages.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          Audit Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PIPELINE_TIMELINE_STEPS.map((step, idx) => (
          <div key={step.label} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 relative">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage {idx + 1}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-100">{step.label}</h4>
            <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
