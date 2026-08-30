'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, BookOpen, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { DEMO_DOCUMENTS, DEMO_KNOWLEDGE_SOURCES, DEMO_FINDINGS } from '../../lib/demo_data';

export function ProjectSourcesPanel() {
  const [activeTab, setActiveTab] = useState<'evidence' | 'requirements' | 'findings'>('evidence');

  return (
    <aside className="w-80 border-l border-slate-800 bg-[#0A0E17] flex flex-col shrink-0 h-screen sticky top-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Evidence & Intelligence Panel</h2>
        
        {/* 3 Tabs Header */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'evidence' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence ({DEMO_DOCUMENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'requirements' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rules ({DEMO_KNOWLEDGE_SOURCES.length})
          </button>
          <button
            onClick={() => setActiveTab('findings')}
            className={`flex-1 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'findings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gaps ({DEMO_FINDINGS.length})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Tab 1: Evidence Documents */}
        {activeTab === 'evidence' && (
          DEMO_DOCUMENTS.map((doc) => (
            <Link
              key={doc.id}
              href="/documents"
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer group block"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-300">{doc.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
              </div>

              <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{doc.contentSnippet}</p>

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[10px]">
                <span className="text-slate-500">{doc.category}</span>
                <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{doc.status}</span>
                </span>
              </div>
            </Link>
          ))
        )}

        {/* Tab 2: Requirements */}
        {activeTab === 'requirements' && (
          DEMO_KNOWLEDGE_SOURCES.map((ks) => (
            <Link
              key={ks.id}
              href="/knowledge-base"
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group block"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300">{ks.title}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-1">Topic: <strong className="text-slate-300">{ks.topic}</strong></p>

              <div className="flex items-center justify-between mt-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{ks.organization}</span>
                <span className="text-cyan-400 font-mono">{ks.version}</span>
              </div>
            </Link>
          ))
        )}

        {/* Tab 3: Findings */}
        {activeTab === 'findings' && (
          DEMO_FINDINGS.map((finding) => (
            <Link
              key={finding.id}
              href={`/evidence/${finding.id}`}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/50 transition-all cursor-pointer group block space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {finding.severity}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Page {finding.evidence.pageNumber}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-200 group-hover:text-rose-300 leading-tight">{finding.title}</h4>
              <p className="text-[11px] text-slate-400 italic line-clamp-1">"{finding.evidence.highlightedQuote}"</p>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[10px] text-blue-400 font-semibold">
                <span>View Evidence</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
