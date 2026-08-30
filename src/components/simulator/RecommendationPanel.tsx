'use client';
import React from 'react';
import { SimulationRecommendation } from '../../types';

interface RecommendationPanelProps {
  recommendations: SimulationRecommendation[];
  onResolve?: (id: string) => void;
}

export function RecommendationPanel({ recommendations, onResolve }: RecommendationPanelProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'HIGH': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'MEDIUM': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="px-2 py-1 text-xs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Open</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">In Progress</span>;
      case 'RESOLVED': return <span className="px-2 py-1 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  return (
    <div className="w-full bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Priority</th>
              <th className="px-4 py-3 font-medium">Issue</th>
              <th className="px-4 py-3 font-medium">Why It Matters</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Expected Improvement</th>
              <th className="px-4 py-3 font-medium">Policy</th>
              <th className="px-4 py-3 font-medium">Effort</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              {onResolve && <th className="px-4 py-3 font-medium"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 bg-[#0B0F17]">
            {recommendations.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium text-slate-200 min-w-[200px]">{rec.issue}</td>
                <td className="px-4 py-4 text-slate-400 min-w-[200px]">{rec.whyItMatters}</td>
                <td className="px-4 py-4 text-slate-200 min-w-[250px]">{rec.action}</td>
                <td className="px-4 py-4 min-w-[180px]">
                  <div className="flex flex-col gap-1">
                    {rec.expectedComplianceGain ? (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded w-max border border-emerald-500/20">
                        +{rec.expectedComplianceGain} Compliance
                      </span>
                    ) : null}
                    {rec.expectedReadinessGain ? (
                      <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded w-max border border-blue-500/20">
                        +{rec.expectedReadinessGain} Readiness
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400 text-xs min-w-[150px]">{rec.relatedPolicy}</td>
                <td className="px-4 py-4 text-slate-400 text-xs">{rec.estimatedEffort}</td>
                <td className="px-4 py-4 text-slate-400 text-xs">{rec.owner}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(rec.status)}
                </td>
                {onResolve && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    {rec.status === 'OPEN' && (
                      <button
                        onClick={() => onResolve(rec.id)}
                        className="text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {recommendations.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500 italic">
                  No recommendations at this time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
