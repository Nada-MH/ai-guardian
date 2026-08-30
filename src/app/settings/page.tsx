'use client';

import React from 'react';
import { Settings, Shield, Sliders, Server, UserCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Organization & Governance Settings</h2>
        <p className="text-xs text-slate-400">Configure corporate regulatory scopes, role-based access policies, and model risk parameters.</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Active Framework Subscriptions</h3>
          <div className="space-y-3">
            {[
              { code: 'SAMA_AI_GUIDANCE_2024', name: 'SAMA AI and Technology Guidance', status: 'Mandatory Active' },
              { code: 'ISO_IEC_42001', name: 'ISO/IEC 42001 AI Management System (AIMS)', status: 'Active' },
              { code: 'SAUDI_PDPL', name: 'Saudi Personal Data Protection Law (PDPL)', status: 'Mandatory Active' },
              { code: 'MRM_SR_11_7', name: 'Model Risk Management Principles (SR 11-7)', status: 'Active' },
            ].map((fw) => (
              <div key={fw.code} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200">{fw.name}</span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{fw.code}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-semibold text-[11px] border border-blue-500/20">
                  {fw.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Model Risk Thresholds</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Critical Risk Trigger Score:</span>
              <p className="text-lg font-bold text-rose-400 mt-1">&lt; 50% Compliance</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Demographic Disparate Impact Rule:</span>
              <p className="text-lg font-bold text-amber-400 mt-1">4/5ths Rule (0.80 Ratio)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
