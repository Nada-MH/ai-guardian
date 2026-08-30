'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, ShieldCheck, ArrowRight, CheckCircle2, History, AlertCircle, FileKey } from 'lucide-react';

interface HumanOverrideEntry {
  override_id: string;
  finding_id: string;
  original_status: string;
  new_status: string;
  justification_reason: string;
  authorized_user: string;
  user_role: string;
  timestamp: string;
  signature_hash: string;
}

const HUMAN_OVERRIDES_LIST: HumanOverrideEntry[] = [
  {
    override_id: 'OVR-2026-08-001',
    finding_id: 'FND-001 (Human Oversight)',
    original_status: 'NON_COMPLIANT',
    new_status: 'PARTIALLY_COMPLIANT',
    justification_reason: 'Underwriter queue SOP implemented in staging; pending final executive board sign-off.',
    authorized_user: 'Sarah Al-Otaibi',
    user_role: 'Lead AI Compliance Officer',
    timestamp: '2026-08-18T14:30:00Z',
    signature_hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c'
  },
  {
    override_id: 'OVR-2026-08-002',
    finding_id: 'FND-003 (Demographic Parity)',
    original_status: 'NON_COMPLIANT',
    new_status: 'PARTIALLY_COMPLIANT',
    justification_reason: 'Disparate impact ratio improved to 0.84 following regional bias remediation; temporary 30-day monitoring waiver granted.',
    authorized_user: 'Dr. Tariq Al-Ghamdi',
    user_role: 'Chief Risk Officer (CRO)',
    timestamp: '2026-08-19T09:15:00Z',
    signature_hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  },
  {
    override_id: 'OVR-2026-08-003',
    finding_id: 'FND-004 (Third-Party Cloud Egress)',
    original_status: 'PENDING_VERIFICATION',
    new_status: 'VERIFIED_CLOSED',
    justification_reason: 'Cryptographic TLS 1.3 certificate and NDMO cross-border data transfer approval letter validated and sealed.',
    authorized_user: 'Sarah Al-Otaibi',
    user_role: 'Lead AI Compliance Officer',
    timestamp: '2026-08-20T03:00:00Z',
    signature_hash: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d'
  }
];

export function HumanOversightLedger() {
  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Human-in-the-Loop Governance
            </span>
            <h4 className="text-xs font-bold text-white">AI Decision Oversight & Signed Overrides</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          HUMAN-IN-THE-LOOP ACTIVE
        </span>
      </div>

      {/* Human Oversight Pipeline Explanation */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300">
          <span className="px-2 py-1 rounded bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30">1. AI Decision</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2 py-1 rounded bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30">2. Human Review</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/30">3. Approve / Modify</span>
        </div>
        <Link
          href="/audit-trail"
          className="text-xs text-blue-400 hover:text-blue-300 font-bold font-mono inline-flex items-center space-x-1"
        >
          <span>View Audit Trail</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Overrides Table */}
      <div className="space-y-2.5">
        {HUMAN_OVERRIDES_LIST.map((ov) => (
          <div
            key={ov.override_id}
            className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                  {ov.finding_id}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  <span className="text-rose-400 font-bold">{ov.original_status}</span> → <span className="text-emerald-400 font-bold">{ov.new_status}</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(ov.timestamp).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              "{ov.justification_reason}"
            </p>

            <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Signed By: <strong className="text-slate-300">{ov.authorized_user}</strong> ({ov.user_role})</span>
              <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>SHA-256 Sig: {ov.signature_hash.slice(0, 10)}...</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
