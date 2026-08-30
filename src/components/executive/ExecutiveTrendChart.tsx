'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { GitCompare, TrendingUp, ShieldCheck } from 'lucide-react';
import { ExecutiveTrendPoint } from '../../types';

interface ExecutiveTrendChartProps {
  trendHistory: ExecutiveTrendPoint[];
}

export function ExecutiveTrendChart({ trendHistory }: ExecutiveTrendChartProps) {
  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Governance Trajectory
            </span>
            <h4 className="text-xs font-bold text-white">Assessment Progression Over Time</h4>
          </div>
        </div>

        {/* Progression Pills: 71 -> 78 -> 84 */}
        <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 text-xs font-mono">
          <span className="text-slate-400 font-bold">Progression:</span>
          {trendHistory.map((t, idx) => (
            <React.Fragment key={t.version}>
              <span className="text-white font-bold">{t.governance_score}%</span>
              {idx < trendHistory.length - 1 && <span className="text-cyan-400">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendHistory} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="version"
              stroke="#64748B"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748B"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="governance_score"
              name="Governance Score (%)"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#0B0F17' }}
              activeDot={{ r: 7, fill: '#60A5FA' }}
            />
            <Line
              type="monotone"
              dataKey="risk_score"
              name="Risk Index (/100)"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ fill: '#F59E0B', r: 4, strokeWidth: 1, stroke: '#0B0F17' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
