'use client';

import React from 'react';
import {
  X, ShieldCheck, FileText, Settings, Database, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight, Layers, ExternalLink, User,
  Calendar, Clock, Hash, Lock, Sparkles, Check
} from 'lucide-react';
import { RequirementGapMatrixItem, LayerState } from '../../types';

interface LayerCellModalProps {
  item: RequirementGapMatrixItem | null;
  activeLayer: 'REGULATION' | 'POLICY' | 'CONTROL' | 'EVIDENCE' | 'ALL' | null;
  onClose: () => void;
}

export function LayerCellModal({ item, activeLayer, onClose }: LayerCellModalProps) {
  if (!item || !activeLayer) return null;

  const getLayerStateBadge = (state: LayerState) => {
    switch (state) {
      case 'PRESENT':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PRESENT (Covered)</span>
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>PARTIAL (In Progress)</span>
          </span>
        );
      case 'MISSING':
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>MISSING (Gap)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 font-mono text-cyan-400 text-xs font-bold border border-slate-800">
                  {item.requirementId}
                </span>
                <span className="text-xs text-white font-bold truncate max-w-md">
                  {item.clause}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {item.framework} • Category: {item.category}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">

          {/* 4-Layer Chain State Progress Bar */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              4-Layer Governance Chain Verification
            </span>
            
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              
              {/* Layer 1: Regulation */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                item.regulationState === 'PRESENT'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <span className="text-[10px] font-bold uppercase font-mono block">1. Regulation</span>
                <span className="font-bold flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.regulationState}</span>
                </span>
              </div>

              {/* Layer 2: Policy */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                item.policyState === 'PRESENT'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : item.policyState === 'PARTIAL'
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <span className="text-[10px] font-bold uppercase font-mono block">2. Internal Policy</span>
                <span className="font-bold flex items-center justify-center space-x-1">
                  {item.policyState === 'PRESENT' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{item.policyState}</span>
                </span>
              </div>

              {/* Layer 3: Control */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                item.controlState === 'PRESENT'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : item.controlState === 'PARTIAL'
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <span className="text-[10px] font-bold uppercase font-mono block">3. Control</span>
                <span className="font-bold flex items-center justify-center space-x-1">
                  {item.controlState === 'PRESENT' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{item.controlState}</span>
                </span>
              </div>

              {/* Layer 4: Evidence */}
              <div className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                item.evidenceState === 'PRESENT'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : item.evidenceState === 'PARTIAL'
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <span className="text-[10px] font-bold uppercase font-mono block">4. Evidence</span>
                <span className="font-bold flex items-center justify-center space-x-1">
                  {item.evidenceState === 'PRESENT' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{item.evidenceState}</span>
                </span>
              </div>

            </div>

            {item.brokenLayer !== 'NONE' && (
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Root Governance Break:</strong> Chain fails at Layer {item.brokenLayer === 'POLICY' ? '2 (Internal Policy)' : item.brokenLayer === 'CONTROL' ? '3 (Implementation Control)' : '4 (Evidence Verification)'}.
                </span>
              </div>
            )}
          </div>

          {/* Layer 1: Regulatory Requirement Drilldown */}
          {(activeLayer === 'REGULATION' || activeLayer === 'ALL') && item.regulationDetails && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Layer 1: Regulatory Obligation</span>
                </span>
                {getLayerStateBadge(item.regulationState)}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950 p-3 rounded-lg border border-slate-800">
                "{item.regulationDetails.legalObligation}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Jurisdiction: {item.regulationDetails.jurisdiction}</span>
                <span>Source: {item.regulationDetails.sourceId}</span>
              </div>
            </div>
          )}

          {/* Layer 2: Internal Policy Drilldown */}
          {(activeLayer === 'POLICY' || activeLayer === 'ALL') && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              item.policyState === 'PRESENT'
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Layer 2: Internal Enterprise Policy</span>
                </span>
                {getLayerStateBadge(item.policyState)}
              </div>
              {item.policyDetails ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    "{item.policyDetails.policyText}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Document: {item.policyDetails.policyDocument} ({item.policyDetails.section})</span>
                    <span>RAG Match Confidence: {Math.round(item.policyDetails.confidence * 100)}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-300 italic p-3 rounded-lg bg-slate-950 border border-rose-500/30">
                  ✗ No relevant internal policy statement was identified in uploaded organizational charters.
                </p>
              )}
            </div>
          )}

          {/* Layer 3: Implementation Control Drilldown */}
          {(activeLayer === 'CONTROL' || activeLayer === 'ALL') && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              item.controlState === 'PRESENT'
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Layer 3: Implementation & Operational Control</span>
                </span>
                {getLayerStateBadge(item.controlState)}
              </div>
              {item.controlDetails ? (
                <div className="space-y-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-bold text-white block text-xs">{item.controlDetails.controlName}</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {item.controlDetails.implementationMechanism}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Control ID: {item.controlDetails.controlId}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-300 italic p-3 rounded-lg bg-slate-950 border border-rose-500/30">
                  ✗ No technical control or automated workflow has been implemented for this requirement.
                </p>
              )}
            </div>
          )}

          {/* Layer 4: Evidence Verification Drilldown */}
          {(activeLayer === 'EVIDENCE' || activeLayer === 'ALL') && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              item.evidenceState === 'PRESENT'
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span>Layer 4: Verification Evidence & Audit Artifacts</span>
                </span>
                {getLayerStateBadge(item.evidenceState)}
              </div>
              {item.evidenceDetails ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                    {item.evidenceDetails.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
                    <span>Artifact: {item.evidenceDetails.documentName} ({item.evidenceDetails.location})</span>
                    <span>Evidence ID: {item.evidenceDetails.evidenceId}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-300 italic p-3 rounded-lg bg-slate-950 border border-rose-500/30">
                  ✗ No verifiable test output, audit workpaper, or operational log was provided.
                </p>
              )}
            </div>
          )}

          {/* Remediation Action & Owner */}
          {item.remediationAction && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-slate-950 border border-blue-500/30 space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider font-mono block">
                Targeted Remediation Action
              </span>
              <p className="text-xs text-white font-medium">
                {item.remediationAction}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-850">
                <span>Owner: <strong className="text-slate-200">{item.remediationOwner || 'Unassigned'}</strong></span>
                <span>Deadline: <strong className="text-cyan-400">{item.remediationDeadline || 'TBD'}</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
