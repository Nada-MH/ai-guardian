'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Hash, RefreshCw, AlertTriangle } from 'lucide-react';

interface AuditChainIntegrityBannerProps {
  totalEvents: number;
  isVerified: boolean;
  latestHash: string;
  onReverify?: () => void;
}

export function AuditChainIntegrityBanner({
  totalEvents,
  isVerified,
  latestHash,
  onReverify
}: AuditChainIntegrityBannerProps) {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start md:items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC AUDIT CHAIN VERIFIED</span>
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono font-bold">
              {totalEvents} / {totalEvents} SEQUENTIAL EVENTS SEALED
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Append-only tamper-evident SHA-256 hash chaining active. Historical records cannot be silently altered or deleted.
          </p>
          <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400 font-mono truncate">
            <Hash className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-slate-400">Head Hash:</span>
            <span className="text-cyan-400 truncate">{latestHash}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {onReverify && (
          <button
            onClick={onReverify}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verify Ledger</span>
          </button>
        )}
      </div>
    </div>
  );
}
