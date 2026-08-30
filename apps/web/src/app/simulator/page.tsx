'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Flame, Play, SkipForward, RotateCcw, Sparkles,
  Shield, AlertTriangle, CheckCircle2, XCircle, ChevronRight,
  BookOpen, AlertOctagon, Lightbulb, TrendingDown, TrendingUp,
  Activity, Layers, FileText, Info, Filter
} from 'lucide-react';
import {
  DEMO_AI_SYSTEM,
  DEMO_SIMULATION_SCENARIOS,
  DEMO_SIMULATION_TIMELINE,
  DEMO_GROUNDED_ADVERSARIAL_SCENARIOS
} from '../../lib/demo_data';
import { ScoreAnimator } from '../../components/simulator/ScoreAnimator';
import { SimulationTimeline } from '../../components/simulator/SimulationTimeline';
import { ScenarioCard } from '../../components/simulator/ScenarioCard';
import { RecommendationPanel } from '../../components/simulator/RecommendationPanel';
import { SimulationSummary } from '../../components/simulator/SimulationSummary';
import { ScenarioProvenanceCard } from '../../components/simulator/ScenarioProvenanceCard';
import { RiskSimulationPanel } from '../../components/simulator/RiskSimulationPanel';
import {
  SimulationScenario, SimulationChoice, TimelineEvent, ScoreImpact,
  SimulationRecommendation, GovernanceGap, TriggeredPolicy, SimulationScoreSnapshot,
  SimulationSummaryData, AdversarialScenario
} from '../../types';

// --- Initial Scores (matching DEMO_AI_SYSTEM + Risk Vectors) ---
const INITIAL_SCORES = {
  privacy: 72, security: 88, fairness: 54, transparency: 61,
  human_oversight: 43, governance: 58, monitoring: 67,
  overall_compliance: 71, overall_readiness: 76,
};

type ScoreState = typeof INITIAL_SCORES;

function applyImpact(scores: ScoreState, impact: ScoreImpact): ScoreState {
  return {
    privacy: Math.max(0, Math.min(100, scores.privacy + impact.privacy)),
    security: Math.max(0, Math.min(100, scores.security + impact.security)),
    fairness: Math.max(0, Math.min(100, scores.fairness + impact.fairness)),
    transparency: Math.max(0, Math.min(100, scores.transparency + impact.transparency)),
    human_oversight: Math.max(0, Math.min(100, scores.human_oversight + impact.human_oversight)),
    governance: Math.max(0, Math.min(100, scores.governance + impact.governance)),
    monitoring: Math.max(0, Math.min(100, scores.monitoring + impact.monitoring)),
    overall_compliance: Math.max(0, Math.min(100, scores.overall_compliance + impact.overall_compliance)),
    overall_readiness: Math.max(0, Math.min(100, scores.overall_readiness + impact.overall_readiness)),
  };
}

export default function SimulatorPage() {
  // --- Core State ---
  const [isStarted, setIsStarted] = useState(false);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scores, setScores] = useState<ScoreState>({ ...INITIAL_SCORES });
  const [previousScores, setPreviousScores] = useState<ScoreState>({ ...INITIAL_SCORES });
  const [selectedChoices, setSelectedChoices] = useState<Record<string, SimulationChoice>>({});
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([...DEMO_SIMULATION_TIMELINE]);
  const [scoreHistory, setScoreHistory] = useState<SimulationScoreSnapshot[]>([
    { eventLabel: 'Deployment', compliance: 71, readiness: 76, ...INITIAL_SCORES },
  ]);
  const [activeRightTab, setActiveRightTab] = useState<'provenance' | 'risk_model' | 'policies' | 'gaps' | 'recommendations'>('provenance');
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState<SimulationRecommendation[]>([]);

  const scenarios = DEMO_SIMULATION_SCENARIOS;
  const currentScenario = scenarios[currentScenarioIndex];
  const currentChoice = currentScenario ? selectedChoices[currentScenario.id] : undefined;

  // Grounded Adversarial Scenarios for Provenance Tracking
  const groundedScenarios = DEMO_GROUNDED_ADVERSARIAL_SCENARIOS;
  const activeGroundedScenario = useMemo(() => {
    return groundedScenarios[currentScenarioIndex % groundedScenarios.length];
  }, [currentScenarioIndex, groundedScenarios]);

  // --- Event Handlers ---
  const handleStart = useCallback(() => {
    setIsStarted(true);
    const firstScenario = scenarios[0];
    setPreviousScores({ ...scores });
    const newScores = applyImpact(scores, firstScenario.immediateImpact);
    setScores(newScores);
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${firstScenario.id}`,
        timestamp: firstScenario.timestamp,
        title: firstScenario.title,
        description: 'Adversarial governance incident detected. Awaiting decision.',
        type: 'INCIDENT',
        severity: 'HIGH',
        scenarioId: firstScenario.id,
      },
    ]);
    setScoreHistory((prev) => [
      ...prev,
      {
        eventLabel: firstScenario.title.slice(0, 20) + '…',
        compliance: newScores.overall_compliance,
        readiness: newScores.overall_readiness,
        privacy: newScores.privacy,
        security: newScores.security,
        fairness: newScores.fairness,
        transparency: newScores.transparency,
        human_oversight: newScores.human_oversight,
        governance: newScores.governance,
        monitoring: newScores.monitoring,
      },
    ]);
  }, [scores, scenarios]);

  const handleChoiceSelect = useCallback((choice: SimulationChoice) => {
    if (!currentScenario) return;
    setSelectedChoices((prev) => ({ ...prev, [currentScenario.id]: choice }));
    setPreviousScores({ ...scores });
    const newScores = applyImpact(scores, choice.scoreModifier);
    setScores(newScores);

    const eventType = choice.mitigationApplied ? 'MITIGATION' : (choice.isOptimal ? 'RESOLUTION' : 'VIOLATION');
    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-choice-${currentScenario.id}`,
        timestamp: currentScenario.timestamp,
        title: `Decision: ${choice.label}`,
        description: choice.consequence.slice(0, 120) + '...',
        type: eventType,
        severity: choice.isOptimal ? 'LOW' : 'HIGH',
        scenarioId: currentScenario.id,
      },
    ]);

    setScoreHistory((prev) => [
      ...prev,
      {
        eventLabel: choice.label.slice(0, 15) + '…',
        compliance: newScores.overall_compliance,
        readiness: newScores.overall_readiness,
        privacy: newScores.privacy,
        security: newScores.security,
        fairness: newScores.fairness,
        transparency: newScores.transparency,
        human_oversight: newScores.human_oversight,
        governance: newScores.governance,
        monitoring: newScores.monitoring,
      },
    ]);

    setAllRecommendations((prev) => [...prev, ...currentScenario.recommendations]);
  }, [currentScenario, scores]);

  const handleNextScenario = useCallback(() => {
    const nextIndex = currentScenarioIndex + 1;
    if (nextIndex >= scenarios.length) {
      setIsSimulationComplete(true);
      return;
    }
    setCurrentScenarioIndex(nextIndex);
    const nextScenario = scenarios[nextIndex];
    setPreviousScores({ ...scores });
    const newScores = applyImpact(scores, nextScenario.immediateImpact);
    setScores(newScores);

    setTimelineEvents((prev) => [
      ...prev,
      {
        id: `evt-${nextScenario.id}`,
        timestamp: nextScenario.timestamp,
        title: nextScenario.title,
        description: 'New adversarial stress scenario initiated.',
        type: 'INCIDENT',
        severity: 'HIGH',
        scenarioId: nextScenario.id,
      },
    ]);

    setScoreHistory((prev) => [
      ...prev,
      {
        eventLabel: nextScenario.title.slice(0, 20) + '…',
        compliance: newScores.overall_compliance,
        readiness: newScores.overall_readiness,
        privacy: newScores.privacy,
        security: newScores.security,
        fairness: newScores.fairness,
        transparency: newScores.transparency,
        human_oversight: newScores.human_oversight,
        governance: newScores.governance,
        monitoring: newScores.monitoring,
      },
    ]);
  }, [currentScenarioIndex, scenarios, scores]);

  const handleRestart = useCallback(() => {
    setIsStarted(false);
    setCurrentScenarioIndex(0);
    setScores({ ...INITIAL_SCORES });
    setPreviousScores({ ...INITIAL_SCORES });
    setSelectedChoices({});
    setTimelineEvents([...DEMO_SIMULATION_TIMELINE]);
    setScoreHistory([
      { eventLabel: 'Deployment', compliance: 71, readiness: 76, ...INITIAL_SCORES },
    ]);
    setIsSimulationComplete(false);
    setAllRecommendations([]);
    setActiveRightTab('provenance');
  }, []);

  const handleResolveRecommendation = useCallback((id: string) => {
    setAllRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'RESOLVED' as const } : r))
    );
  }, []);

  const summaryData: SimulationSummaryData = useMemo(() => {
    const lowestCompliance = Math.min(...scoreHistory.map((s) => s.compliance));
    return {
      initialCompliance: INITIAL_SCORES.overall_compliance,
      finalCompliance: lowestCompliance,
      recoveredCompliance: scores.overall_compliance,
      initialReadiness: INITIAL_SCORES.overall_readiness,
      finalReadiness: Math.min(...scoreHistory.map((s) => s.readiness)),
      recoveredReadiness: scores.overall_readiness,
      totalViolations: allRecommendations.length,
      resolved: allRecommendations.filter((r) => r.status === 'RESOLVED').length,
      remaining: allRecommendations.filter((r) => r.status !== 'RESOLVED').length,
      governanceMaturity: scores.overall_compliance > INITIAL_SCORES.overall_compliance ? 'IMPROVED' : scores.overall_compliance === INITIAL_SCORES.overall_compliance ? 'UNCHANGED' : 'DEGRADED',
      scoreHistory,
    };
  }, [scores, scoreHistory, allRecommendations]);

  // =============================================
  // PRE-START LANDING
  // =============================================
  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-rose-500/30">
          <Flame className="w-10 h-10 text-white" />
        </div>
        <div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold uppercase">
              EXPLAINABLE ADVERSARIAL SIMULATOR
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Adversarial Governance Simulator</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-lg mx-auto">
            The <strong className="text-rose-400">Devil's Advocate Engine</strong> generates realistic, fully explainable failure scenarios grounded in <strong className="text-blue-400">{DEMO_AI_SYSTEM.name}</strong> assessment findings, policies, controls, and architecture.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left w-full max-w-lg space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
            Adversarial Grounding Guarantee:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="text-slate-300">✓ Grounded in Findings (FND-001…008)</div>
            <div className="text-slate-300">✓ Linked to SAMA, SDAIA, PDPL</div>
            <div className="text-slate-300">✓ Inherent vs. Residual Risk Math</div>
            <div className="text-slate-300">✓ Zero Hallucinated Edge Cases</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs w-full max-w-md">
          <div className="p-4 rounded-2xl bg-[#111726] border border-slate-800 text-center">
            <p className="text-2xl font-black text-blue-400">{scenarios.length}</p>
            <p className="text-slate-400 mt-1">Simulated Scenarios</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#111726] border border-slate-800 text-center">
            <p className="text-2xl font-black text-amber-400">10</p>
            <p className="text-slate-400 mt-1">Failure Categories</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#111726] border border-slate-800 text-center">
            <p className="text-2xl font-black text-cyan-400">100%</p>
            <p className="text-slate-400 mt-1">Audit Traceability</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-sm shadow-2xl shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5" />
          <span>Launch Adversarial Governance Simulator</span>
        </button>

        <p className="text-[10px] text-slate-500 font-mono">
          NOTICE: Simulated scenarios evaluate governance stress boundaries and do not constitute guaranteed predictions.
        </p>
      </div>
    );
  }

  // =============================================
  // SIMULATION COMPLETE — SUMMARY VIEW
  // =============================================
  if (isSimulationComplete) {
    return (
      <div className="space-y-6 -m-6 md:-m-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Adversarial Simulation Complete</h1>
              <p className="text-xs text-slate-400">All {scenarios.length} grounded governance failure scenarios evaluated.</p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Simulation</span>
          </button>
        </div>

        <SimulationSummary summary={summaryData} />

        <div className="mt-6">
          <h2 className="text-base font-bold text-white mb-3">Full Recommendations Register</h2>
          <RecommendationPanel recommendations={allRecommendations} onResolve={handleResolveRecommendation} />
        </div>
      </div>
    );
  }

  // =============================================
  // ACTIVE SIMULATION — 3-PANEL LAYOUT
  // =============================================
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0B0F17] text-slate-100 overflow-hidden -m-6 md:-m-8">
      
      {/* Top Header Bar */}
      <div className="h-14 border-b border-slate-800/80 bg-[#0F172A] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Link href="/projects/sys-fintrust-001" className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-extrabold text-white tracking-tight">Adversarial Simulator</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase border border-amber-500/30">
            Scenario {currentScenarioIndex + 1} / {scenarios.length}
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
            {activeGroundedScenario.riskCategory}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRestart}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT PANEL — Timeline (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-[#0E1422] flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">Adversarial Timeline</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{timelineEvents.length} events logged</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SimulationTimeline
              events={timelineEvents}
              activeEventId={currentScenario ? `evt-${currentScenario.id}` : undefined}
            />
          </div>
        </div>

        {/* CENTER PANEL — Scenario Engine (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B0F17] flex flex-col h-full overflow-hidden">
          
          {/* KPI Score Bar */}
          <div className="p-4 border-b border-slate-800 bg-[#0F172A]/80 shrink-0">
            <div className="grid grid-cols-4 gap-4">
              <ScoreAnimator label="Compliance" value={scores.overall_compliance} previousValue={previousScores.overall_compliance} suffix="%" />
              <ScoreAnimator label="Readiness" value={scores.overall_readiness} previousValue={previousScores.overall_readiness} suffix="/100" />
              <ScoreAnimator label="Privacy" value={scores.privacy} previousValue={previousScores.privacy} suffix="%" size="sm" />
              <ScoreAnimator label="Governance" value={scores.governance} previousValue={previousScores.governance} suffix="%" size="sm" />
            </div>
          </div>

          {/* Active Scenario */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentScenario && (
              <ScenarioCard
                scenario={currentScenario}
                onChoiceSelect={handleChoiceSelect}
                selectedChoice={currentChoice || null}
                isCompleted={!!currentChoice}
              />
            )}

            {/* Next Scenario Button */}
            {currentChoice && (
              <button
                onClick={handleNextScenario}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
              >
                {currentScenarioIndex + 1 < scenarios.length ? (
                  <>
                    <SkipForward className="w-4 h-4" />
                    <span>Continue to Scenario {currentScenarioIndex + 2}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Simulation & View Summary</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Explainable Provenance & Intelligence (4 cols) */}
        <div className="lg:col-span-4 border-l border-slate-800/80 bg-[#0E1422] flex flex-col h-full overflow-hidden">
          
          {/* Tab Header */}
          <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Adversarial Intelligence
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Grounded
              </span>
            </div>
            
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setActiveRightTab('provenance')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${activeRightTab === 'provenance' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Provenance
              </button>
              <button
                onClick={() => setActiveRightTab('risk_model')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${activeRightTab === 'risk_model' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Risk Math
              </button>
              <button
                onClick={() => setActiveRightTab('policies')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${activeRightTab === 'policies' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Policies
              </button>
              <button
                onClick={() => setActiveRightTab('gaps')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${activeRightTab === 'gaps' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Gaps
              </button>
              <button
                onClick={() => setActiveRightTab('recommendations')}
                className={`flex-1 py-1.5 rounded-md font-bold transition-all ${activeRightTab === 'recommendations' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Actions
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* Provenance & Grounding Inspector */}
            {activeRightTab === 'provenance' && (
              <ScenarioProvenanceCard scenario={activeGroundedScenario} />
            )}

            {/* Risk Simulation Panel */}
            {activeRightTab === 'risk_model' && (
              <RiskSimulationPanel scenario={activeGroundedScenario} />
            )}

            {/* Policies */}
            {activeRightTab === 'policies' && currentScenario?.triggeredPolicies.map((policy) => (
              <div key={policy.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-bold text-white">{policy.policyName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                    {policy.confidence}% Confidence
                  </span>
                </div>
                <p className="text-xs text-blue-300 font-mono">{policy.clause}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{policy.requirement}</p>
                <p className="text-[10px] text-slate-500">Source: <strong className="text-slate-300">{policy.source}</strong></p>
              </div>
            ))}

            {/* Gaps */}
            {activeRightTab === 'gaps' && currentScenario?.governanceGaps.map((gap) => (
              <div key={gap.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${gap.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                    {gap.severity}
                  </span>
                  <span className="text-[10px] text-slate-500">{gap.category}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{gap.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{gap.description}</p>
              </div>
            ))}

            {/* Recommendations / Actions */}
            {activeRightTab === 'recommendations' && currentScenario?.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${rec.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                    {rec.priority}
                  </span>
                  <div className="flex space-x-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      +{rec.expectedComplianceGain} Comp
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      +{rec.expectedReadinessGain} Ready
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">{rec.issue}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.action}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>{rec.estimatedEffort} • {rec.owner}</span>
                  <span className="text-cyan-400 font-mono">{rec.relatedPolicy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Risk Vector Bar */}
          <div className="p-4 border-t border-slate-800 shrink-0">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">All Risk Vectors</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                { label: 'Privacy', val: scores.privacy, prev: previousScores.privacy },
                { label: 'Security', val: scores.security, prev: previousScores.security },
                { label: 'Fairness', val: scores.fairness, prev: previousScores.fairness },
                { label: 'Transparency', val: scores.transparency, prev: previousScores.transparency },
                { label: 'Human Oversight', val: scores.human_oversight, prev: previousScores.human_oversight },
                { label: 'Governance', val: scores.governance, prev: previousScores.governance },
                { label: 'Monitoring', val: scores.monitoring, prev: previousScores.monitoring },
              ].map((item) => {
                const delta = item.val - item.prev;
                return (
                  <div key={item.label} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/50">
                    <span className="text-slate-400">{item.label}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-200">{item.val}%</span>
                      {delta !== 0 && (
                        <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {delta > 0 ? '+' : ''}{delta}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
