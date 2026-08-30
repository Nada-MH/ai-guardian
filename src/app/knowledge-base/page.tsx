'use client';

import React, { useState } from 'react';
import { Search, Filter, BookOpen, Globe, CheckCircle2, ChevronRight } from 'lucide-react';
import { DEMO_KNOWLEDGE_SOURCES } from '../../lib/demo_data';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  const filteredSources = DEMO_KNOWLEDGE_SOURCES.filter((source) => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'ALL' || source.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Searchable Regulatory Knowledge Base</h2>
        <p className="text-xs text-slate-400">Core AI Governance and Finance-Specific Regulatory Library indexed in the RAG retrieval engine.</p>
      </div>

      {/* Search & Topic Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search regulations by title, organization, code (SAMA, ISO, PDPL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Risk Topics</option>
            <option value="AI Governance">AI Governance</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data Privacy">Data Privacy</option>
            <option value="Model Risk">Model Risk</option>
            <option value="AI Ethics">AI Ethics</option>
          </select>
        </div>
      </div>

      {/* Regulatory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((ks) => (
          <div
            key={ks.id}
            className="p-5 rounded-xl bg-[#111827] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                {ks.code}
              </span>
              <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Indexed in RAG</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">{ks.title}</h3>
              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{ks.country}</span>
                <span>•</span>
                <span>{ks.organization}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px]">
                {ks.documentType}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{ks.version}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
