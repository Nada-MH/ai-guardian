'use client';

import React from 'react';
import {
  CheckCircle2, ShieldAlert, FileText, AlertTriangle, Sparkles,
  Layers, ChevronRight, Info
} from 'lucide-react';
import { AdversarialScenario } from '../../types';

interface ScenarioProvenanceCardProps {
  scenario: AdversarialScenario;
}

export function ScenarioProvenanceCard({ scenario }: ScenarioProvenanceCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Scenario Provenance
            </span>
            <h4 className="text-xs font-bold text-white">Why was this scenario generated?</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          {scenario.generatedBy}
        </span>
      </div>

      {/* Grounding Checklist */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
          Grounding Triggers & Detected Context
        </span>
        <div className="space-y-1">
          {scenario.provenanceExplanation.whyGenerated.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2 rounded-lg bg-slate-950/70 border border-slate-850 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Findings & Regulatory Clauses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        
        {/* Related Findings */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase font-mono block flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Related Findings</span>
          </span>
          <div className="space-y-1 text-[11px] font-mono">
            {scenario.provenanceExplanation.relatedFindingIds.map((fnd, idx) => (
              <div key={idx} className="text-slate-300 font-medium">
                • {fnd}
              </div>
            ))}
          </div>
        </div>

        {/* Related Requirements */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block flex items-center space-x-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Related Requirements</span>
          </span>
          <div className="space-y-1 text-[11px] font-mono">
            {scenario.provenanceExplanation.relatedRegulatoryClauses.map((req, idx) => (
              <div key={idx} className="text-slate-300 font-medium">
                • {req}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Related Evidence Artifacts */}
      {scenario.provenanceExplanation.relatedEvidenceArtifacts.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block flex items-center space-x-1">
            <FileText className="w-3 h-3 text-slate-400" />
            <span>Related Evidence Artifacts</span>
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {scenario.provenanceExplanation.relatedEvidenceArtifacts.map((ev, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                {ev}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Non-Prediction Guardrail Disclaimer */}
      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start space-x-2 text-[10px] text-amber-300/90 font-mono">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>DISCLAIMER:</strong> {scenario.disclaimer}
        </span>
      </div>

    </div>
  );
}
