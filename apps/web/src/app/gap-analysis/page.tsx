'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers, ShieldCheck, FileText, Settings, Database, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight, Search, Filter, RefreshCw,
  Eye, Sparkles, ChevronRight, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { DEMO_GAP_ANALYSIS_MATRIX } from '../../lib/demo_data';
import { RequirementGapMatrixItem, LayerState, OverallGapStatus } from '../../types';
import { LayerCellModal } from '../../components/gap_analysis/LayerCellModal';

export default function GapAnalysisPage() {
  const [matrixData, setMatrixData] = useState(DEMO_GAP_ANALYSIS_MATRIX);
  
  // Interactive Modal State
  const [selectedItem, setSelectedItem] = useState<RequirementGapMatrixItem | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<'REGULATION' | 'POLICY' | 'CONTROL' | 'EVIDENCE' | 'ALL' | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGapStatus, setSelectedGapStatus] = useState<string>('ALL');
  const [selectedBrokenLayer, setSelectedBrokenLayer] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [sortByPriority, setSortByPriority] = useState<boolean>(true);

  const filteredItems = useMemo(() => {
    let list = matrixData.matrix.filter((item) => {
      if (selectedGapStatus !== 'ALL' && item.overallGapStatus !== selectedGapStatus) return false;
      if (selectedBrokenLayer !== 'ALL' && item.brokenLayer !== selectedBrokenLayer) return false;
      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = item.requirementId.toLowerCase().includes(q);
        const m2 = item.clause.toLowerCase().includes(q);
        const m3 = item.framework.toLowerCase().includes(q);
        const m4 = item.category.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });

    if (sortByPriority) {
      list = [...list].sort((a, b) => b.prioritizationScore - a.prioritizationScore);
    }

    return list;
  }, [matrixData, selectedGapStatus, selectedBrokenLayer, selectedSeverity, searchQuery, sortByPriority]);

  const handleCellClick = (item: RequirementGapMatrixItem, layer: 'REGULATION' | 'POLICY' | 'CONTROL' | 'EVIDENCE' | 'ALL') => {
    setSelectedItem(item);
    setSelectedLayer(layer);
  };

  const renderLayerPill = (state: LayerState, item: RequirementGapMatrixItem, layer: 'REGULATION' | 'POLICY' | 'CONTROL' | 'EVIDENCE') => {
    switch (state) {
      case 'PRESENT':
        return (
          <button
            onClick={() => handleCellClick(item, layer)}
            className="w-full py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center space-x-1 transition-all shadow-sm group"
            title="Click to view verified layer details"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="truncate">PRESENT</span>
          </button>
        );
      case 'PARTIAL':
        return (
          <button
            onClick={() => handleCellClick(item, layer)}
            className="w-full py-1.5 px-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center space-x-1 transition-all shadow-sm group"
            title="Click to view partial layer progress"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="truncate">PARTIAL</span>
          </button>
        );
      case 'MISSING':
      default:
        return (
          <button
            onClick={() => handleCellClick(item, layer)}
            className="w-full py-1.5 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold flex items-center justify-center space-x-1 transition-all shadow-sm group"
            title="Click to inspect missing gap & upload action"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span className="truncate">MISSING</span>
          </button>
        );
    }
  };

  const getOverallStatusBadge = (status: OverallGapStatus) => {
    switch (status) {
      case 'COVERED':
        return <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">COVERED</span>;
      case 'EVIDENCE_GAP':
        return <span className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold">EVIDENCE GAP</span>;
      case 'CONTROL_GAP':
        return <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">CONTROL GAP</span>;
      case 'MAJOR_GAP':
        return <span className="px-2 py-1 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/30 text-[11px] font-mono font-bold">MAJOR GAP</span>;
      case 'CRITICAL_GAP':
        return <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[11px] font-mono font-bold">CRITICAL GAP</span>;
      default:
        return <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono font-bold">PARTIAL</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              4-LAYER GOVERNANCE MODEL
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">STANDARDS & POLICY GAP MATRIX</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Policy, Control & Evidence Gap Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Determine exactly where the governance chain breaks. Click on any cell in the matrix to inspect regulatory mandates, matched internal policies, operational controls, or verified evidence artifacts.
          </p>
        </div>
      </div>

      {/* 4-Layer Visual Chain Diagram */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-3">
          Governance Chain Architecture
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-xs font-bold font-mono">1</div>
            <span className="font-bold text-white text-xs block">Regulatory Mandate</span>
            <span className="text-[10px] text-slate-400">Laws, guidance, and standards</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-xs font-bold font-mono">2</div>
            <span className="font-bold text-white text-xs block">Internal Policy</span>
            <span className="text-[10px] text-slate-400">Documented enterprise charters</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xs font-bold font-mono">3</div>
            <span className="font-bold text-white text-xs block">Implementation Control</span>
            <span className="text-[10px] text-slate-400">Technical workflows & configs</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xs font-bold font-mono">4</div>
            <span className="font-bold text-white text-xs block">Evidence Verification</span>
            <span className="text-[10px] text-slate-400">Substantiated audit logs & tests</span>
          </div>

        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">In-Scope Rules</span>
          <div className="text-2xl font-black text-white mt-1">{matrixData.totalRequirements}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Evaluated by Engine</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Fully Covered</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{matrixData.metrics.coveredCount}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">{(matrixData.metrics.coverageRatio * 100).toFixed(1)}% End-to-End</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Evidence Gaps</span>
          <div className="text-2xl font-black text-cyan-300 mt-1">{matrixData.metrics.evidenceGapCount}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Missing Test Artifacts</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Control Gaps</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{matrixData.metrics.controlGapCount}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Missing System Rules</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold text-rose-400 uppercase font-mono">Policy Gaps</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{matrixData.metrics.policyGapCount}</div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Missing Policy Text</span>
        </div>
      </div>

      {/* Filter & Prioritization Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matrix by requirement ID, clause, framework, or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Gap Status Filter */}
            <select
              value={selectedGapStatus}
              onChange={(e) => setSelectedGapStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Gap Statuses</option>
              <option value="COVERED">Covered (All 4 Layers)</option>
              <option value="EVIDENCE_GAP">Evidence Gap (Missing Artifact)</option>
              <option value="CONTROL_GAP">Control Gap (Missing Control)</option>
              <option value="MAJOR_GAP">Major Gap (Missing Policy)</option>
              <option value="CRITICAL_GAP">Critical Gap</option>
              <option value="PARTIAL_COVERAGE">Partial Coverage</option>
            </select>

            {/* Broken Layer Filter */}
            <select
              value={selectedBrokenLayer}
              onChange={(e) => setSelectedBrokenLayer(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Broken Layers</option>
              <option value="POLICY">Breaks at Layer 2 (Policy)</option>
              <option value="CONTROL">Breaks at Layer 3 (Control)</option>
              <option value="EVIDENCE">Breaks at Layer 4 (Evidence)</option>
              <option value="NONE">Unbroken (Covered)</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortByPriority(!sortByPriority)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                sortByPriority
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortByPriority ? 'Prioritized' : 'Default Order'}</span>
            </button>

          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
          <span>Displaying {filteredItems.length} requirement rows • Click any cell for drilldown</span>
          <span>Legend: ✓ PRESENT • ⚡ PARTIAL • ✗ MISSING</span>
        </div>
      </div>

      {/* Interactive Clickable Matrix Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4 w-[280px]">Requirement & Framework</th>
                <th className="py-3 px-2 w-[110px] text-center">1. Regulation</th>
                <th className="py-3 px-2 w-[110px] text-center">2. Internal Policy</th>
                <th className="py-3 px-2 w-[110px] text-center">3. Control</th>
                <th className="py-3 px-2 w-[110px] text-center">4. Evidence</th>
                <th className="py-3 px-3 w-[130px] text-center">Overall Status</th>
                <th className="py-3 px-2 w-[80px] text-center">Priority</th>
                <th className="py-3 px-3 w-[80px] text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => (
                <tr key={item.requirementId} className="hover:bg-slate-850/40 transition-colors">
                  
                  {/* Requirement Cell */}
                  <td className="py-3.5 px-4 min-w-[280px]">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] text-cyan-400 font-bold">
                          {item.requirementId}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                          item.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                          item.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-white font-medium line-clamp-1 text-xs">
                        {item.clause}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.framework}
                      </p>
                    </div>
                  </td>

                  {/* 1. Regulation Cell (Clickable) */}
                  <td className="py-3.5 px-2">
                    {renderLayerPill(item.regulationState, item, 'REGULATION')}
                  </td>

                  {/* 2. Policy Cell (Clickable) */}
                  <td className="py-3.5 px-2">
                    {renderLayerPill(item.policyState, item, 'POLICY')}
                  </td>

                  {/* 3. Control Cell (Clickable) */}
                  <td className="py-3.5 px-2">
                    {renderLayerPill(item.controlState, item, 'CONTROL')}
                  </td>

                  {/* 4. Evidence Cell (Clickable) */}
                  <td className="py-3.5 px-2">
                    {renderLayerPill(item.evidenceState, item, 'EVIDENCE')}
                  </td>

                  {/* Overall Status Cell */}
                  <td className="py-3.5 px-3 text-center">
                    {getOverallStatusBadge(item.overallGapStatus)}
                  </td>

                  {/* Prioritization Score */}
                  <td className="py-3.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-black ${
                      item.prioritizationScore >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      item.prioritizationScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.prioritizationScore}
                    </span>
                  </td>

                  {/* Actions (Inspect Full Chain) */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleCellClick(item, 'ALL')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all border border-slate-700"
                      title="Inspect full 4-layer governance breakdown"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>

                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs">
                    No requirements match your selected gap status or filters.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Deep Layer Inspection & Drilldown Modal */}
      <LayerCellModal
        item={selectedItem}
        activeLayer={selectedLayer}
        onClose={() => {
          setSelectedItem(null);
          setSelectedLayer(null);
        }}
      />

    </div>
  );
}
