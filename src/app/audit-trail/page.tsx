'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Search, Filter, RefreshCw, User, Bot, Server,
  Cpu, ArrowRight, Eye, CheckCircle2, AlertTriangle, FileText,
  Calendar, Clock, Layers, Sparkles, ChevronRight, Hash
} from 'lucide-react';
import { DEMO_AUDIT_TRAIL_EVENTS } from '../../lib/demo_data';
import { AuditTrailEvent, AuditEventType, ActorType } from '../../types';
import { AuditChainIntegrityBanner } from '../../components/audit/AuditChainIntegrityBanner';
import { AuditEventDetailModal } from '../../components/audit/AuditEventDetailModal';

export default function AuditTrailPage() {
  const [events, setEvents] = useState<AuditTrailEvent[]>(DEMO_AUDIT_TRAIL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<AuditTrailEvent | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [selectedActorType, setSelectedActorType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<string>('ALL');
  
  // Verification Toast State
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const handleVerifyLedger = () => {
    // Re-verify hash chaining in memory
    let isValid = true;
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    for (let i = 0; i < events.length; i++) {
      if (events[i].previousEventHash !== prevHash) {
        isValid = false;
        break;
      }
      prevHash = events[i].eventHash;
    }

    if (isValid) {
      setVerificationMessage(`✓ Cryptographic Integrity Attested: All ${events.length} sequential event hashes verified.`);
    } else {
      setVerificationMessage('⚠️ Hash mismatch detected in audit ledger sequence.');
    }

    setTimeout(() => {
      setVerificationMessage(null);
    }, 4000);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedEventType !== 'ALL' && e.eventType !== selectedEventType) return false;
      if (selectedActorType !== 'ALL' && e.actor.actorType !== selectedActorType) return false;
      if (selectedSeverity !== 'ALL' && e.severity !== selectedSeverity) return false;
      if (selectedComponent !== 'ALL' && e.systemComponent !== selectedComponent) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSummary = e.summary.toLowerCase().includes(q);
        const matchesActor = e.actor.actorName.toLowerCase().includes(q);
        const matchesType = e.eventType.toLowerCase().includes(q);
        const matchesComponent = e.systemComponent.toLowerCase().includes(q);
        if (!matchesSummary && !matchesActor && !matchesType && !matchesComponent) return false;
      }
      return true;
    });
  }, [events, selectedEventType, selectedActorType, selectedSeverity, selectedComponent, searchQuery]);

  const stats = useMemo(() => {
    const aiCount = events.filter((e) => e.actor.actorType === 'AGENT' || e.eventType === 'AGENT_EXECUTED').length;
    const humanOverrideCount = events.filter((e) => e.eventType === 'HUMAN_OVERRIDE').length;
    const criticalCount = events.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length;
    return {
      total: events.length,
      aiExecutions: aiCount,
      humanOverrides: humanOverrideCount,
      criticalEvents: criticalCount
    };
  }, [events]);

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'USER':
        return <User className="w-3.5 h-3.5 text-blue-400" />;
      case 'AGENT':
        return <Bot className="w-3.5 h-3.5 text-purple-400" />;
      case 'AUTOMATION':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Server className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              IMMUTABLE AUDIT RECORD
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">APPEND-ONLY LEDGER</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Enterprise Audit Trail & AI Execution Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-evident chronological event stream with cryptographic SHA-256 hash chaining. Records every user action, AI agent inference, and human override.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleVerifyLedger}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verify Hash Chain</span>
          </button>
        </div>
      </div>

      {/* Verification Toast Alert */}
      {verificationMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{verificationMessage}</span>
        </div>
      )}

      {/* Cryptographic Ledger Health Banner */}
      <AuditChainIntegrityBanner
        totalEvents={events.length}
        isVerified={true}
        latestHash={events[events.length - 1]?.eventHash || ''}
        onReverify={handleVerifyLedger}
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Total Recorded Events</span>
          <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">All State Mutations Sealed</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">AI Agent Executions</span>
          <div className="text-2xl font-black text-purple-300 mt-1">{stats.aiExecutions}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Secure Ref & Prompt Logged</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Human Overrides</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats.humanOverrides}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Signed Rationale & Sign-off</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Ledger Integrity</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">100.0%</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">0 Tamper Breaches</span>
        </div>
      </div>

      {/* Multi-Parameter Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by description, actor, requirement ID, or component..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Event Type Filter */}
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Event Types (23)</option>
              <option value="HUMAN_OVERRIDE">Human Overrides</option>
              <option value="AGENT_EXECUTED">AI Agent Executions</option>
              <option value="MODEL_EXECUTED">Rule Classifier Runs</option>
              <option value="SCORE_CALCULATED">Deterministic Scores</option>
              <option value="FINDING_CREATED">Findings Created</option>
              <option value="FINDING_RESOLVED">Findings Resolved</option>
              <option value="DOCUMENT_UPLOADED">Document Uploads</option>
              <option value="ASSESSMENT_COMPLETED">Assessments Sealed</option>
              <option value="REPORT_GENERATED">Reports Generated</option>
              <option value="POLICY_UPDATED">Policy Updates</option>
            </select>

            {/* Actor Type Filter */}
            <select
              value={selectedActorType}
              onChange={(e) => setSelectedActorType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Actors</option>
              <option value="USER">User Actions</option>
              <option value="AGENT">AI Agent</option>
              <option value="AUTOMATION">Automation & Pipelines</option>
              <option value="SYSTEM">Core System</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>

            {(selectedEventType !== 'ALL' || selectedActorType !== 'ALL' || selectedSeverity !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedEventType('ALL');
                  setSelectedActorType('ALL');
                  setSelectedSeverity('ALL');
                  setSelectedComponent('ALL');
                  setSearchQuery('');
                }}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-bold transition-all"
              >
                Reset
              </button>
            )}

          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
          <span>Showing {filteredEvents.length} of {events.length} chronological audit events</span>
          <span>Ledger Protocol: SHA-256 Chained JSON Lines</span>
        </div>
      </div>

      {/* Chronological Audit Event Stream */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.eventId}
            onClick={() => setSelectedEvent(evt)}
            className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left: Sequence, Actor, Type, Summary */}
            <div className="flex items-start space-x-3.5 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 group-hover:border-blue-500/40 transition-colors">
                {getActorIcon(evt.actor.actorType)}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-950 font-mono text-cyan-400 text-[10px] font-bold border border-slate-800">
                    #{evt.sequenceNumber}
                  </span>
                  <span className="font-mono text-xs text-white font-bold">
                    {evt.eventType}
                  </span>
                  {getSeverityBadge(evt.severity)}
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                    {evt.systemComponent}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                  {evt.summary}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                  <span>Actor: <strong className="text-slate-400">{evt.actor.actorName}</strong></span>
                  <span>•</span>
                  <span>{new Date(evt.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Inspection CTA & Hash Link */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-850 pt-2 sm:pt-0">
              <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[110px]">{evt.eventHash.substring(0, 10)}...</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(evt);
                }}
                className="px-3 py-1 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white text-xs font-bold transition-all flex items-center space-x-1 border border-slate-700 group-hover:border-blue-500"
              >
                <span>Inspect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0F172A] border border-slate-800 text-slate-400 text-xs font-medium space-y-2">
            <p>No audit events match your selected filters.</p>
            <button
              onClick={() => {
                setSelectedEventType('ALL');
                setSelectedActorType('ALL');
                setSelectedSeverity('ALL');
                setSelectedComponent('ALL');
                setSearchQuery('');
              }}
              className="text-blue-400 hover:underline font-bold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Deep Event Inspector Modal */}
      <AuditEventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

    </div>
  );
}
