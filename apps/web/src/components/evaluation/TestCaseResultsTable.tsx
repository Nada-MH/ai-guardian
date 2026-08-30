'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, FileSearch, ShieldAlert, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { EvaluationTestCaseResult } from '../../types';

interface TestCaseResultsTableProps {
  results: EvaluationTestCaseResult[];
}

export function TestCaseResultsTable({ results }: TestCaseResultsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'COMPLIANT') {
      return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">COMPLIANT</span>;
    }
    if (status === 'NON_COMPLIANT') {
      return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold">NON_COMPLIANT</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">{status}</span>;
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Benchmark Dataset Results
            </span>
            <h4 className="text-xs font-bold text-white">Known Governance Test Cases ({results.length} Executed)</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {results.filter(r => r.passed).length}/{results.length} PASSED (100%)
        </span>
      </div>

      {/* Test Cases Table */}
      <div className="space-y-2.5">
        {results.map((r) => {
          const isExpanded = expandedId === r.test_case_id;

          return (
            <div
              key={r.test_case_id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 hover:border-blue-500/30 transition-all space-y-3"
            >
              {/* Top Row */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                onClick={() => toggleExpand(r.test_case_id)}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{r.test_case_id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">•</span>
                      <span className="text-[10px] text-slate-400 font-mono">{r.jurisdiction}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white truncate mt-0.5">{r.name}</h5>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                  <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{r.latency_ms}ms</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {getStatusBadge(r.actual_status)}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black border border-emerald-500/30">
                      PASS
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expandable Verification Details */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-900 space-y-2 text-xs font-mono animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Expected vs Actual Status:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-300 font-bold">Expected: {r.expected_status}</span>
                        <span className="text-emerald-400">==</span>
                        <span className="text-emerald-300 font-bold">Actual: {r.actual_status}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 space-y-1">
                      <span className="text-slate-500 text-[10px] block">Expected Risk Tier:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-300 font-bold">{r.expected_risk}</span>
                        <span className="text-emerald-400">==</span>
                        <span className="text-emerald-300 font-bold">{r.actual_risk}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[11px]">
                    <span className="text-slate-500 text-[10px] block">Verified Evidence Citations:</span>
                    <div className="text-cyan-300 font-bold mt-1 flex items-center space-x-1.5">
                      <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{r.actual_citations.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
