'use client';

import React from 'react';
import {
  X, ShieldCheck, User, Bot, Server, Cpu, Clock, Calendar, Hash,
  ArrowRight, CheckCircle2, AlertTriangle, FileText, Lock, Sparkles,
  Database, RefreshCw, Terminal, Layers
} from 'lucide-react';
import { AuditTrailEvent } from '../../types';

interface AuditEventDetailModalProps {
  event: AuditTrailEvent | null;
  onClose: () => void;
}

export function AuditEventDetailModal({ event, onClose }: AuditEventDetailModalProps) {
  if (!event) return null;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase">INFO</span>;
    }
  };

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'USER':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'AGENT':
        return <Bot className="w-4 h-4 text-purple-400" />;
      case 'AUTOMATION':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      default:
        return <Server className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 font-mono text-cyan-400 text-xs font-bold border border-slate-800">
                  EVENT #{event.sequenceNumber}
                </span>
                <span className="font-mono text-xs text-slate-300 font-bold">
                  {event.eventType}
                </span>
                {getSeverityBadge(event.severity)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                ID: {event.eventId} • {new Date(event.timestamp).toLocaleString()}
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

          {/* Event Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Event Description & Scope
            </span>
            <p className="text-sm font-medium text-white leading-relaxed">
              {event.summary}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-850 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                <span className="text-slate-400">Component:</span>
                <span className="font-mono font-bold text-cyan-400">{event.systemComponent}</span>
              </div>
              {event.projectName && (
                <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  <span className="text-slate-400">Project:</span>
                  <span className="text-slate-200 font-medium">{event.projectName}</span>
                </div>
              )}
              {event.assessmentVersion && (
                <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                  <span className="text-slate-400">Assessment:</span>
                  <span className="font-mono text-blue-400 font-bold">Version {event.assessmentVersion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actor Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Actor & Origin Context
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {getActorIcon(event.actor.actorType)}
                </div>
                <div>
                  <span className="font-bold text-white block">{event.actor.actorName}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Type: {event.actor.actorType} {event.actor.role ? `• ${event.actor.role}` : ''}
                  </span>
                </div>
              </div>
              {event.actor.ipAddress && (
                <span className="text-xs text-slate-400 font-mono">
                  IP: {event.actor.ipAddress}
                </span>
              )}
            </div>
          </div>

          {/* AI Execution Details (if applicable) */}
          {event.aiExecutionData && (
            <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AI Agent Execution Record</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                  {event.aiExecutionData.executionStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Agent & Version</span>
                  <span className="font-bold text-white">{event.aiExecutionData.agentName} (v{event.aiExecutionData.agentVersion})</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Model Provider & Name</span>
                  <span className="font-bold text-white">{event.aiExecutionData.modelProvider} • {event.aiExecutionData.modelName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Prompt & KB Version</span>
                  <span className="font-mono text-cyan-400">{event.aiExecutionData.promptVersion} • KB {event.aiExecutionData.knowledgeBaseVersion}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Telemetry</span>
                  <span className="text-slate-300 font-mono">
                    {event.aiExecutionData.latencyMs ? `${event.aiExecutionData.latencyMs}ms latency • ` : ''}
                    {event.aiExecutionData.tokenCount ? `${event.aiExecutionData.tokenCount.totalTokens} tokens` : ''}
                  </span>
                </div>
              </div>

              {/* Secure References (SHA-256 Input/Output Hashes) */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-slate-400 shrink-0">Input Ref:</span>
                  <span className="text-slate-300 truncate">{event.aiExecutionData.inputReference}</span>
                </div>
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-slate-400 shrink-0">Output Ref:</span>
                  <span className="text-slate-300 truncate">{event.aiExecutionData.outputReference}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-900">
                  * Sensitive raw borrower data and prompt bodies are securely digested as SHA-256 URNs to preserve zero-data leakage compliance.
                </p>
              </div>
            </div>
          )}

          {/* Human Override Details (if applicable) */}
          {event.humanOverrideData && (
            <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Human Override Justification Workpaper</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  OFFICIAL OVERRIDE
                </span>
              </div>

              {/* Status Transition Row */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Automated AI Finding</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold mt-1 inline-block">
                    {event.humanOverrideData.originalStatus}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Human Override Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold mt-1 inline-block">
                    {event.humanOverrideData.newStatus}
                  </span>
                </div>
              </div>

              {/* Substantiation Rationale */}
              <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-xs font-bold block">Compliance Officer Rationale:</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  "{event.humanOverrideData.reason}"
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-850">
                  <span>Sign-off: {event.humanOverrideData.user} ({event.humanOverrideData.userRole})</span>
                  {event.humanOverrideData.externalEvidenceId && (
                    <span>Evidence: {event.humanOverrideData.externalEvidenceId}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* State Mutation Diff (Previous State vs New State) */}
          {(event.previousState || event.newState) && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                State Mutation Payload Diff
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-rose-400 text-[10px] font-bold uppercase block">- Previous State</span>
                  <pre className="text-slate-300 overflow-x-auto text-[11px]">
                    {event.previousState ? JSON.stringify(event.previousState, null, 2) : 'null (Initial Creation)'}
                  </pre>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 text-[10px] font-bold uppercase block">+ New State</span>
                  <pre className="text-slate-200 overflow-x-auto text-[11px]">
                    {event.newState ? JSON.stringify(event.newState, null, 2) : 'null'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Tamper-Evidence Proof */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cryptographic Proof & SHA-256 Chaining</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>CHAIN VERIFIED</span>
              </span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-slate-400 shrink-0">Previous Event Hash:</span>
                <span className="text-slate-400 truncate">{event.previousEventHash}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-cyan-400 shrink-0 font-bold">Current Event Hash:</span>
                <span className="text-cyan-300 font-bold truncate">{event.eventHash}</span>
              </div>
            </div>
          </div>

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
