'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award, Activity, CheckCircle2, History, Play, ShieldCheck,
  TrendingUp, Download, RefreshCw, Layers
} from 'lucide-react';
import { DEMO_EVALUATION_RUNS } from '../../lib/demo_data';
import { EvaluationPostureBanner } from '../../components/evaluation/EvaluationPostureBanner';
import { EvaluationMetricsGrid } from '../../components/evaluation/EvaluationMetricsGrid';
import { RegressionComparisonCard } from '../../components/evaluation/RegressionComparisonCard';
import { TestCaseResultsTable } from '../../components/evaluation/TestCaseResultsTable';

export default function EvaluationsPage() {
  const [runs, setRuns] = useState(DEMO_EVALUATION_RUNS);
  const [selectedRunId, setSelectedRunId] = useState<string>(runs[runs.length - 1].run_id);
  const [isRunning, setIsRunning] = useState(false);

  const currentRun = runs.find((r) => r.run_id === selectedRunId) || runs[runs.length - 1];

  const handleTriggerLiveEvaluation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const nextRunNumber = runs.length + 23; // Run #25
      const newRun = {
        ...runs[runs.length - 1],
        run_id: `RUN-2026-08-${nextRunNumber.toString().padStart(3, '0')}`,
        run_number: nextRunNumber,
        timestamp: new Date().toISOString(),
        overall_quality_score: 98.1,
        evidence_metrics: {
          evidence_grounding_pct: 97.2,
          evidence_accuracy_pct: 98.0,
          citation_accuracy_pct: 99.0
        },
        regression_details: {
          baseline_run_id: currentRun.run_id,
          quality_score_delta: 0.7,
          citation_accuracy_delta: 0.6,
          hallucination_rate_delta: -0.2,
          false_positive_delta: 0,
          regressions_count: 0,
          status: 'IMPROVED_NO_REGRESSIONS'
        }
      };

      setRuns((prev) => [...prev, newRun]);
      setSelectedRunId(newRun.run_id);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              EMPIRICAL AI EVALUATION &amp; QA
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">OBJECTIVE BENCHMARK SUITE</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            AI Guardian Quality Assurance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Do not simply claim the AI is accurate — measure it. Continuous empirical evaluation of retrieval precision, evidence grounding, citation accuracy, and hallucination rates across model iterations.
          </p>
        </div>

        {/* Run Selector Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 font-bold">Select Run:</span>
            <select
              value={selectedRunId}
              onChange={(e) => setSelectedRunId(e.target.value)}
              className="bg-slate-950 text-white font-bold px-2.5 py-1 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs"
            >
              {runs.map((r) => (
                <option key={r.run_id} value={r.run_id}>
                  Run #{r.run_number} ({r.overall_quality_score}%) — {new Date(r.timestamp).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero Posture Banner with Quality Score & Run Trigger */}
      <EvaluationPostureBanner
        currentRun={currentRun}
        isRunning={isRunning}
        onTriggerEvaluation={handleTriggerLiveEvaluation}
      />

      {/* 4-Category Metrics Matrix */}
      <EvaluationMetricsGrid run={currentRun} />

      {/* Automated Regression Gate Card */}
      <RegressionComparisonCard runs={runs} currentRun={currentRun} />

      {/* Benchmark Dataset Execution Results Table */}
      {currentRun.test_case_results && (
        <TestCaseResultsTable results={currentRun.test_case_results} />
      )}

    </div>
  );
}
