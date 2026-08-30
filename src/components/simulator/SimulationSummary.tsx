'use client';
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { SimulationSummaryData } from '../../types';
import { ScoreAnimator } from './ScoreAnimator';
import { Shield, ShieldAlert, CheckCircle, Activity } from 'lucide-react';

interface SimulationSummaryProps {
  summary: SimulationSummaryData;
}

export function SimulationSummary({ summary }: SimulationSummaryProps) {
  return (
    <div className="relative w-full rounded-2xl bg-[#0F172A] border border-transparent [background:linear-gradient(#0F172A,#0F172A)_padding-box,linear-gradient(to_right,#3b82f6,#06b6d4)_border-box] p-8 shadow-2xl overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Assessment Complete</h2>
          <p className="text-slate-400">Review your final governance posture and performance timeline.</p>
        </div>

        {/* Top row: Score cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B0F17] rounded-xl border border-slate-700/50 p-6 flex flex-col items-center shadow-inner">
            <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Compliance Score
            </h3>
            <div className="flex items-center gap-4 w-full max-w-sm">
              <div className="text-slate-500 text-2xl font-bold">{summary.initialCompliance}%</div>
              <div className="flex-1 h-px bg-slate-700 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-500 rotate-45" />
              </div>
              <ScoreAnimator 
                value={summary.finalCompliance} 
                previousValue={summary.initialCompliance} 
                label="Final" 
                suffix="%" 
                size="sm" 
              />
            </div>
          </div>

          <div className="bg-[#0B0F17] rounded-xl border border-slate-700/50 p-6 flex flex-col items-center shadow-inner">
            <h3 className="text-slate-300 font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Readiness Score
            </h3>
            <div className="flex items-center gap-4 w-full max-w-sm">
              <div className="text-slate-500 text-2xl font-bold">{summary.initialReadiness}%</div>
              <div className="flex-1 h-px bg-slate-700 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-slate-500 rotate-45" />
              </div>
              <ScoreAnimator 
                value={summary.finalReadiness} 
                previousValue={summary.initialReadiness} 
                label="Final" 
                suffix="%" 
                size="sm" 
              />
            </div>
          </div>
        </div>

        {/* Middle: Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/40 p-4 text-center">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Violations</div>
            <div className="text-2xl font-bold text-rose-400 flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              {summary.totalViolations}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/40 p-4 text-center">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Resolved</div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {summary.resolved}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/40 p-4 text-center">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Remaining Risks</div>
            <div className="text-2xl font-bold text-amber-400">
              {summary.remaining}
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/40 p-4 text-center flex flex-col justify-center items-center">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Maturity Level</div>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm">
              {summary.governanceMaturity}
            </span>
          </div>
        </div>

        {/* Bottom: Recharts LineChart */}
        <div className="bg-[#0B0F17] rounded-xl border border-slate-700/50 p-6 shadow-inner h-[350px]">
          <h3 className="text-slate-300 font-semibold mb-6">Score Trajectory</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.scoreHistory} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="step" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="compliance" 
                name="Compliance"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="readiness" 
                name="Readiness"
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
