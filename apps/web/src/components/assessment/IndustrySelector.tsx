'use client';

import React from 'react';
import { Landmark, Stethoscope, GraduationCap, Sprout, CheckCircle } from 'lucide-react';
import { Industry } from '../../types';

interface IndustrySelectorProps {
  selectedIndustry: Industry;
  onSelectIndustry: (ind: Industry) => void;
}

const INDUSTRIES = [
  {
    id: 'Finance' as Industry,
    name: 'Finance & Banking',
    icon: Landmark,
    description: 'Banks, Fintechs, Insurance, Algorithmic Trading, Underwriting, AML.',
    regulations: ['SAMA AI Guidance', 'SAMA CSF', 'Saudi PDPL', 'ISO 42001', 'Basel Committee', 'MRM SR 11-7'],
    highlighted: true,
  },
  {
    id: 'Healthcare' as Industry,
    name: 'Healthcare & Biotech',
    icon: Stethoscope,
    description: 'Diagnostic AI, Medical Imaging, Patient Data Privacy, Clinical Decisioning.',
    regulations: ['Saudi MOH AI Guidance', 'HIPAA / PDPL', 'FDA Software as Medical Device'],
    highlighted: false,
  },
  {
    id: 'Education' as Industry,
    name: 'Education & Academia',
    icon: GraduationCap,
    description: 'Automated Grading, Student Profiling, Admissions Scoring, Academic Integrity.',
    regulations: ['MoE AI Policy', 'Saudi PDPL Student Privacy', 'UNESCO AI Ethics'],
    highlighted: false,
  },
  {
    id: 'Agriculture' as Industry,
    name: 'Agriculture & Agritech',
    icon: Sprout,
    description: 'Crop Yield Prediction, Autonomous Farming, Environmental Risk Assessment.',
    regulations: ['MEWA Environmental AI Policy', 'NDMO Data Governance Framework'],
    highlighted: false,
  },
];

export function IndustrySelector({ selectedIndustry, onSelectIndustry }: IndustrySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">Step 1: Select Industry Scope</h3>
        <p className="text-xs text-slate-400">Selecting an industry dynamically configures regulatory frameworks and compliance checks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDUSTRIES.map((ind) => {
          const Icon = ind.icon;
          const isSelected = selectedIndustry === ind.id;

          return (
            <button
              key={ind.id}
              type="button"
              onClick={() => onSelectIndustry(ind.id)}
              className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}

              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ind.name}</h4>
                  {ind.highlighted && (
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Primary MVP Scope</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ind.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Target Regulations:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.regulations.map((reg) => (
                    <span key={reg} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
