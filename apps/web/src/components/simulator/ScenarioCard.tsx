'use client';
import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SimulationScenario, SimulationChoice } from '../../types';

interface ScenarioCardProps {
  scenario: SimulationScenario;
  onChoiceSelect: (choice: SimulationChoice) => void;
  selectedChoice?: SimulationChoice | null;
  isCompleted: boolean;
}

export function ScenarioCard({ scenario, onChoiceSelect, selectedChoice, isCompleted }: ScenarioCardProps) {
  return (
    <div className="flex flex-col gap-6 bg-[#0F172A] p-6 rounded-xl border border-slate-700 shadow-lg w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-900/40 text-blue-400 px-2 py-1 rounded border border-blue-800/50">
            {scenario.category}
          </span>
          <h3 className="text-xl font-bold text-white">{scenario.title}</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mt-2">{scenario.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        {scenario.choices.map((choice) => {
          const isSelected = selectedChoice?.id === choice.id;
          const showAsDimmed = isCompleted && !isSelected;
          const showAsSelected = isCompleted && isSelected;

          return (
            <button
              key={choice.id}
              onClick={() => !isCompleted && onChoiceSelect(choice)}
              disabled={isCompleted}
              className={`
                flex flex-col text-left p-4 rounded-xl border transition-all duration-200 w-full
                ${showAsSelected 
                  ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : showAsDimmed
                    ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800 cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl mt-1">{choice.icon}</div>
                <div className="flex-1">
                  <h4 className={`text-base font-semibold ${showAsSelected ? 'text-white' : 'text-slate-200'}`}>
                    {choice.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{choice.consequence}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isCompleted && selectedChoice && (
        <div className="mt-4 p-5 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Consequence & Outcome
            </h4>
            <div className="flex gap-2">
              {selectedChoice.isOptimal && (
                <span className="flex items-center text-xs font-semibold bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-800/50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Optimal Decision
                </span>
              )}
              {selectedChoice.mitigationApplied && (
                <span className="flex items-center text-xs font-semibold bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800/50">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Mitigation Applied
                </span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedChoice.consequence}
          </p>

          {selectedChoice.scoreModifier && (
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.entries(selectedChoice.scoreModifier)
                .filter(([_, val]) => val !== 0)
                .map(([key, val]) => (
                  <span 
                    key={key} 
                    className={`text-xs font-medium px-2 py-1 rounded flex items-center border capitalize
                      ${val > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
                  >
                    {key.replace('_', ' ')} {val > 0 ? '+' : ''}{val}
                  </span>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
