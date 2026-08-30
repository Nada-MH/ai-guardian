'use client';

import React from 'react';
import { FileCode, ShieldCheck, CheckCircle2, Lock, GitCommit, AlertTriangle } from 'lucide-react';
import { PromptVersionItem } from '../../types';

interface PromptGovernancePanelProps {
  prompts: PromptVersionItem[];
}

export function PromptGovernancePanel({ prompts }: PromptGovernancePanelProps) {
  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Prompt Versioning & Immutability
            </span>
            <h4 className="text-xs font-bold text-white">Cryptographically Signed Prompt Registry</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          ZERO SILENT OVERWRITES
        </span>
      </div>

      {/* Prompts Table / Cards */}
      <div className="space-y-3">
        {prompts.map((p) => (
          <div
            key={`${p.prompt_id}-${p.version}`}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                  {p.prompt_id}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px] border border-slate-800">
                  {p.version}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                  {p.approval_status}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Author: {p.author}
              </span>
            </div>

            {/* Change Reason */}
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              <strong>Change Reason:</strong> {p.change_reason}
            </p>

            {/* Cryptographic SHA-256 Hash */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-500">SHA-256:</span>
                <span className="text-cyan-300 font-bold">{p.content_hash.slice(0, 24)}...</span>
              </div>
              <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Active in Production</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
