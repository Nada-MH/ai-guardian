'use client';

import React from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';
import { AssessmentPipelineStep } from '../../types';

interface WorkflowPipelineProps {
  steps: AssessmentPipelineStep[];
  currentStepIndex: number;
}

export function WorkflowPipeline({ steps, currentStepIndex }: WorkflowPipelineProps) {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Real-Time Multi-Agent Assessment Pipeline</h3>
          <p className="text-xs text-slate-400">Live execution of the 8 specialized AI audit agents.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isFailed = step.status === 'failed';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10'
                  : isFailed
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="shrink-0">
                  {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isCurrent && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                  {isFailed && <AlertCircle className="w-5 h-5 text-rose-400" />}
                  {!isDone && !isCurrent && !isFailed && <Circle className="w-5 h-5 text-slate-600" />}
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${isDone || isCurrent ? 'text-slate-100' : 'text-slate-500'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.description}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold">
                  {isDone ? '100%' : isCurrent ? `${step.progress}%` : '0%'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
