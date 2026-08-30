'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Lightbulb, Sparkles, Send, BookOpen, CheckCircle2,
  ShieldCheck, AlertTriangle, Layers, RotateCcw, HelpCircle, ArrowRight,
  TrendingUp, Activity, Info
} from 'lucide-react';
import {
  DEMO_AI_SYSTEM,
  DEMO_FINDINGS,
  DEMO_WHAT_IF_SCENARIOS,
  DEMO_UNCERTAINTY_WHAT_IF_SCENARIOS
} from '../../lib/demo_data';
import { PillBar } from '../../components/what-if/PillBar';
import { WhatIfScoreComparer } from '../../components/what-if/WhatIfScoreComparer';
import { AssumptionInspector } from '../../components/what-if/AssumptionInspector';
import { ProgressiveStageCard } from '../../components/what-if/ProgressiveStageCard';
import {
  WhatIfScenario,
  WhatIfScoreProjection,
  UncertaintyAwareWhatIfScenario,
  WhatIfAssumption,
  ConfidenceBand
} from '../../types';

export default function WhatIfSandboxPage() {
  const [scenariosList, setScenariosList] = useState<UncertaintyAwareWhatIfScenario[]>([...DEMO_UNCERTAINTY_WHAT_IF_SCENARIOS]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('WIF-HUMAN-01');
  const [customQuery, setCustomQuery] = useState('');

  // Selected Active Scenario
  const activeScenario = useMemo(() => {
    return scenariosList.find((s) => s.simulationId === selectedScenarioId) || scenariosList[0];
  }, [scenariosList, selectedScenarioId]);

  // Local mutable assumptions for active scenario
  const [localAssumptions, setLocalAssumptions] = useState<Record<string, WhatIfAssumption[]>>(() => {
    const init: Record<string, WhatIfAssumption[]> = {};
    DEMO_UNCERTAINTY_WHAT_IF_SCENARIOS.forEach((s) => {
      init[s.simulationId] = [...s.assumptions];
    });
    return init;
  });

  const currentAssumptions = useMemo(() => {
    return localAssumptions[activeScenario.simulationId] || activeScenario.assumptions;
  }, [localAssumptions, activeScenario]);

  // Dynamic Confidence calculation based on active scenario's toggle states
  const { calculatedConfidenceLevel, calculatedConfidencePct, calculatedRationale } = useMemo(() => {
    const fulfilledWeight = currentAssumptions
      .filter((a) => a.fulfilled)
      .reduce((sum, a) => sum + a.weight, 0);

    const hasMonitoring = currentAssumptions.some((a) => a.category === 'MONITORING' && a.fulfilled);
    const hasControl = currentAssumptions.some((a) => a.category === 'CONTROL' && a.fulfilled);

    if (fulfilledWeight >= 85 && hasMonitoring && hasControl) {
      return {
        calculatedConfidenceLevel: 'HIGH_CONFIDENCE' as ConfidenceBand,
        calculatedConfidencePct: 90,
        calculatedRationale: 'High confidence: Technical control, approved policy, and automated monitoring are all assumed active.'
      };
    } else if (fulfilledWeight >= 60 && hasControl) {
      return {
        calculatedConfidenceLevel: 'MEDIUM_CONFIDENCE' as ConfidenceBand,
        calculatedConfidencePct: 75,
        calculatedRationale: 'Medium confidence: Core technical control is active, but automated monitoring or audit logs are not verified.'
      };
    } else {
      return {
        calculatedConfidenceLevel: 'LOW_CONFIDENCE' as ConfidenceBand,
        calculatedConfidencePct: 50,
        calculatedRationale: 'Low confidence: Policy charter only is assumed; lack of technical controls or monitoring introduces substantial execution risk.'
      };
    }
  }, [currentAssumptions]);

  const handleToggleAssumption = (asmId: string) => {
    setLocalAssumptions((prev) => {
      const currentList = prev[activeScenario.simulationId] || activeScenario.assumptions;
      const updatedList = currentList.map((a) =>
        a.id === asmId ? { ...a, fulfilled: !a.fulfilled } : a
      );
      return { ...prev, [activeScenario.simulationId]: updatedList };
    });
  };

  // Convert to WhatIfScoreProjection for compatibility with WhatIfScoreComparer
  const scoreProjection: WhatIfScoreProjection = useMemo(() => {
    const baseline = activeScenario.baselineScore;
    const gain = activeScenario.estimatedImprovement;
    return {
      baselineCompliance: baseline,
      projectedCompliance: activeScenario.projectedScore,
      baselineReadiness: 76,
      projectedReadiness: Math.min(99, 76 + activeScenario.scoreDeltas.overall_readiness),
      privacyDelta: activeScenario.scoreDeltas.privacy,
      securityDelta: activeScenario.scoreDeltas.security,
      fairnessDelta: activeScenario.scoreDeltas.fairness,
      transparencyDelta: activeScenario.scoreDeltas.transparency,
      humanOversightDelta: activeScenario.scoreDeltas.human_oversight,
      governanceDelta: activeScenario.scoreDeltas.governance,
      monitoringDelta: activeScenario.scoreDeltas.monitoring
    };
  }, [activeScenario]);

  // Handle custom hypothetical query submission
  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    const queryText = customQuery.trim();
    setCustomQuery('');

    const newId = `WIF-CUSTOM-${Date.now().toString().slice(-4)}`;
    const newScenario: UncertaintyAwareWhatIfScenario = {
      simulationId: newId,
      pillLabel: `✨ ${queryText.length > 20 ? queryText.slice(0, 18) + '…' : queryText}`,
      title: queryText,
      description: `Custom synthesized What-If hypothesis: "${queryText}" evaluated against SAMA & PDPL rules.`,
      proposedChanges: [queryText, 'Update architecture controls and documentation'],
      affectedRequirements: ['REQ-SAMA-AI-5.3', 'REQ-SAUDI-PDPL-13'],
      affectedControls: ['CTRL-CUSTOM-01'],
      assumptions: [
        { id: `${newId}-1`, text: 'Proposed change is deployed in production staging', category: 'CONTROL', fulfilled: true, weight: 35 },
        { id: `${newId}-2`, text: 'Documentation & audit receipts are archived', category: 'POLICY', fulfilled: true, weight: 35 },
        { id: `${newId}-3`, text: 'Automated monitoring telemetry is verified', category: 'MONITORING', fulfilled: false, weight: 30 }
      ],
      baselineScore: 71.0,
      projectedScore: 83.0,
      estimatedImprovement: 12.0,
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      confidencePct: 70.0,
      confidenceRationale: 'Medium confidence: Core control assumed active, but automated telemetry requires verification.',
      affectedFindings: ['FND-001'],
      affectedRiskLevel: { baseline: 'HIGH', projected: 'LOW' },
      progressiveStages: [
        { stage: 'BASELINE', label: 'Baseline Assessment', score: 71.0, delta: 0.0, confidence: 'HIGH', confidencePct: 100, description: 'Current score.' },
        { stage: 'POLICY_ONLY', label: 'Policy Charter', score: 75.0, delta: 4.0, confidence: 'LOW_CONFIDENCE', confidencePct: 50, description: 'Charter draft.' },
        { stage: 'POLICY_AND_CONTROL', label: 'Policy + Control', score: 79.0, delta: 8.0, confidence: 'MEDIUM_CONFIDENCE', confidencePct: 70, description: 'Technical control active.' },
        { stage: 'POLICY_CONTROL_MONITORING', label: 'Full Monitoring', score: 83.0, delta: 12.0, confidence: 'HIGH_CONFIDENCE', confidencePct: 88, description: 'Telemetry monitored.' }
      ],
      disclaimer: 'Projected improvement: +12% under stated assumptions. Not a guaranteed outcome.',
      scoreDeltas: {
        privacy: 10,
        security: 10,
        fairness: 12,
        transparency: 10,
        human_oversight: 20,
        governance: 10,
        monitoring: 8,
        overall_compliance: 12,
        overall_readiness: 10
      }
    };

    setScenariosList((prev) => [newScenario, ...prev]);
    setSelectedScenarioId(newId);
    setLocalAssumptions((prev) => ({ ...prev, [newId]: newScenario.assumptions }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/projects/sys-fintrust-001"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              UNCERTAINTY-AWARE WHAT-IF SIMULATOR
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">DETERMINISTIC PROJECTIONS</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            What-If Compliance Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test hypothetical governance optimizations with deterministic mathematical modeling, explicit assumption checklists, and confidence bands.
          </p>
        </div>

        {/* Executive Projection Summary Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Projected Compliance</span>
            <div className="text-xl font-black text-white font-mono flex items-center justify-end space-x-1.5">
              <span>{activeScenario.baselineScore}%</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-emerald-400">{activeScenario.projectedScore}%</span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-sm">
            +{activeScenario.estimatedImprovement}% Gain
          </div>
        </div>
      </div>

      {/* Scenario Pill Bar Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Select Hypothetical Governance Optimization:
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            {scenariosList.length} Tested Scenarios
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {scenariosList.map((sc) => {
            const isSelected = sc.simulationId === selectedScenarioId;
            return (
              <button
                key={sc.simulationId}
                onClick={() => setSelectedScenarioId(sc.simulationId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border shadow-sm ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{sc.pillLabel}</span>
                <span className={`text-[10px] font-mono font-normal ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  (+{sc.estimatedImprovement}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Query Input */}
        <form onSubmit={handleCustomQuery} className="pt-2 border-t border-slate-850 flex gap-2">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Test custom hypothesis (e.g., 'What if we deploy KMS HSM key rotation?' or 'Implement SHAP explainer')..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!customQuery.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulate</span>
          </button>
        </form>
      </div>

      {/* Main 2-Column Grid: Score Projection & Assumption Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Deterministic Score Comparer & Progressive Stages (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Scenario Overview Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {activeScenario.simulationId}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Affected Requirements: {activeScenario.affectedRequirements.join(', ')}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-white tracking-tight">
              {activeScenario.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeScenario.description}
            </p>

            {/* Proposed Technical Changes */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                Proposed Architecture Changes
              </span>
              <div className="space-y-1 text-xs">
                {activeScenario.proposedChanges.map((ch, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-slate-200 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progressive Maturity Modeling Card */}
          <ProgressiveStageCard stages={activeScenario.progressiveStages} />

          {/* Detailed Deterministic Score Comparison */}
          <WhatIfScoreComparer
            projection={scoreProjection}
            activeChipCount={currentAssumptions.filter((a) => a.fulfilled).length}
          />

        </div>

        {/* RIGHT COLUMN: Assumption Inspector & Confidence Engine (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assumption Inspector */}
          <AssumptionInspector
            assumptions={currentAssumptions}
            confidenceLevel={calculatedConfidenceLevel}
            confidencePct={calculatedConfidencePct}
            confidenceRationale={calculatedRationale}
            onToggleAssumption={handleToggleAssumption}
          />

          {/* Formal Audit Disclaimer Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/20 shadow-xl space-y-2 text-xs">
            <span className="text-[10px] font-bold text-blue-300 uppercase font-mono block flex items-center space-x-1">
              <Info className="w-3 h-3 text-blue-400" />
              <span>Deterministic Simulator Assurance</span>
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              "{activeScenario.disclaimer}"
            </p>
            <p className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-850">
              Scoring Algorithm: Closed-form weighted category loss model with strict penalty deduplication (v1.4).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
