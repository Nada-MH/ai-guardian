'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Users, Clock } from 'lucide-react';
import { ExecutiveRecommendationItem } from '../../types';

interface ExecutiveRecommendationsCardProps {
  recommendations: ExecutiveRecommendationItem[];
}

export function ExecutiveRecommendationsCard({ recommendations }: ExecutiveRecommendationsCardProps) {
  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              Strategic Interventions
            </span>
            <h4 className="text-xs font-bold text-white">Highest-Impact Executive Recommendations</h4>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">
          Ranked by Posture Gain
        </span>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.priority_rank}
            className={`p-4 rounded-2xl border transition-all space-y-3 ${
              rec.priority_rank === 1
                ? 'bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950 border-blue-500/30 shadow-lg'
                : 'bg-slate-950/80 border-slate-850'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px]">
                    Priority #{rec.priority_rank}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                    <Users className="w-3 h-3 text-slate-400 inline" />
                    <span>{rec.owner_department}</span>
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white mt-1">{rec.title}</h5>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs shrink-0 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+{rec.expected_governance_gain}% Posture Gain</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {rec.description}
            </p>

            {/* Metrics Ribbon & Action Link */}
            <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
                <span>
                  <strong>{rec.affected_requirements_count}</strong> Requirements Remediated
                </span>
                <span>•</span>
                <span>
                  <strong>{rec.open_findings_count}</strong> Open Findings Resolved
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{rec.estimated_effort}</span>
                </span>
              </div>

              <Link
                href={rec.action_link}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm self-start sm:self-auto"
              >
                <span>Execute Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
