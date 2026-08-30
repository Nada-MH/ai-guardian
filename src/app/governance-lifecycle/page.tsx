'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, User,
  Users, Building, Search, Filter, Plus, ArrowRight, LayoutGrid,
  List, Sparkles, TrendingUp, ShieldAlert, ArrowUpDown, ChevronRight,
  TrendingDown, Upload
} from 'lucide-react';
import { DEMO_REMEDIATION_ACTIONS, DEMO_GOVERNANCE_METRICS } from '../../lib/demo_data';
import { RemediationActionItem, ActionStatus, OwnerType } from '../../types';
import { ActionDetailModal } from '../../components/governance/ActionDetailModal';

export default function GovernanceLifecyclePage() {
  const [actions, setActions] = useState<RemediationActionItem[]>(DEMO_REMEDIATION_ACTIONS);
  const [metrics, setMetrics] = useState(DEMO_GOVERNANCE_METRICS);
  
  // Selected Action for Inspection & Sign-off Modal
  const [selectedAction, setSelectedAction] = useState<RemediationActionItem | null>(null);

  // Filters & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');

  // Filtered Actions
  const filteredActions = useMemo(() => {
    return actions.filter((act) => {
      if (selectedStatus !== 'ALL' && act.status !== selectedStatus) return false;
      if (selectedDepartment !== 'ALL' && act.department !== selectedDepartment) return false;
      if (selectedPriority !== 'ALL' && act.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = act.actionId.toLowerCase().includes(q);
        const m2 = act.title.toLowerCase().includes(q);
        const m3 = act.ownerName.toLowerCase().includes(q);
        const m4 = act.requirementId.toLowerCase().includes(q);
        const m5 = act.department.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4 && !m5) return false;
      }
      return true;
    });
  }, [actions, selectedStatus, selectedDepartment, selectedPriority, searchQuery]);

  const handleUpdateAction = (updated: RemediationActionItem) => {
    setActions((prev) => prev.map((a) => (a.actionId === updated.actionId ? updated : a)));
    setSelectedAction(updated);

    // Recalculate closed actions & metrics
    const closedCount = actions.filter((a) => (a.actionId === updated.actionId ? updated.status === 'CLOSED' : a.status === 'CLOSED')).length;
    const pendingCount = actions.filter((a) => (a.actionId === updated.actionId ? updated.status === 'PENDING_VERIFICATION' : a.status === 'PENDING_VERIFICATION')).length;
    setMetrics((m) => ({
      ...m,
      resolvedFindings: closedCount,
      pendingVerification: pendingCount
    }));
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase font-mono">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase font-mono">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase font-mono">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">LOW</span>;
    }
  };

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'CLOSED':
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">CLOSED</span>;
      case 'PENDING_VERIFICATION':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">PENDING VERIFICATION</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">IN PROGRESS</span>;
      case 'BLOCKED':
        return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">BLOCKED</span>;
      case 'OPEN':
      default:
        return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">OPEN</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-500/20">
              CONTINUOUS GOVERNANCE
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">GAP-TO-CLOSURE LIFECYCLE</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Remediation & Governance Lifecycle
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace remediation from gap detection through fix implementation, evidence upload, automated reassessment, and compliance officer sign-off.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'TABLE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'KANBAN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Lifecycle Visual Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-3">
          Closed-Loop Governance Pipeline
        </span>
        <div className="flex items-center justify-between min-w-[700px] text-xs font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-[10px] font-bold">1</div>
            <span className="text-slate-300 font-bold">Detect Gap</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">2</div>
            <span className="text-slate-300 font-bold">Action Plan</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold">3</div>
            <span className="text-slate-300 font-bold">Assign Owner</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold">4</div>
            <span className="text-slate-300 font-bold">Upload Evidence</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold">5</div>
            <span className="text-slate-300 font-bold">Reassess</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">6</div>
            <span className="text-emerald-400 font-bold">Verify & Close</span>
          </div>
        </div>
      </div>

      {/* Governance KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">Open Actions</span>
          <div className="text-xl font-black text-amber-300 mt-0.5">{metrics.openActions}</div>
          <span className="text-[9px] text-slate-500 font-mono">In Progress</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-rose-400 uppercase font-mono block">Overdue</span>
          <div className="text-xl font-black text-rose-400 mt-0.5">{metrics.overdueActions}</div>
          <span className="text-[9px] text-slate-500 font-mono">SLA Breached</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">Pending Review</span>
          <div className="text-xl font-black text-cyan-300 mt-0.5">{metrics.pendingVerification}</div>
          <span className="text-[9px] text-slate-500 font-mono">Evidence Uploaded</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">Resolved</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{metrics.resolvedFindings}</div>
          <span className="text-[9px] text-slate-500 font-mono">Verified Closed</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-blue-400 uppercase font-mono block">Avg Resolution</span>
          <div className="text-xl font-black text-blue-300 mt-0.5">{metrics.averageResolutionTimeDays}d</div>
          <span className="text-[9px] text-slate-500 font-mono">SLA Performance</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">Risk Reduction</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">-{metrics.riskReductionPct}%</div>
          <span className="text-[9px] text-slate-500 font-mono">High Risk Remediated</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">Score Gain</span>
          <div className="text-xl font-black text-cyan-300 mt-0.5">+{metrics.complianceImprovementPct}%</div>
          <span className="text-[9px] text-slate-500 font-mono">71% → 84% Target</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search remediation actions by ID, title, owner, or requirement..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="CLOSED">Closed (Verified)</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments</option>
              <option value="Risk & Compliance">Risk & Compliance</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Machine Learning Engineering">ML Engineering</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI Governance">AI Governance</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
          <span>Showing {filteredActions.length} of {actions.length} tracked lifecycle actions</span>
          <span>SLA Protocol: Multi-tier Continuous Attestation</span>
        </div>
      </div>

      {/* Main Content: Table View vs Kanban Board View */}
      {viewMode === 'TABLE' ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              
              {/* Header */}
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-4 w-[120px]">Action ID</th>
                  <th className="py-3 px-3">Remediation Action & Requirement</th>
                  <th className="py-3 px-3 w-[160px]">Assigned Owner</th>
                  <th className="py-3 px-2 w-[90px] text-center">Priority</th>
                  <th className="py-3 px-3 w-[130px] text-center">Status</th>
                  <th className="py-3 px-3 w-[100px] text-center">Due Date</th>
                  <th className="py-3 px-3 w-[80px] text-right">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-slate-800/80">
                {filteredActions.map((act) => (
                  <tr
                    key={act.actionId}
                    onClick={() => setSelectedAction(act)}
                    className="hover:bg-slate-850/40 transition-colors cursor-pointer group"
                  >
                    {/* Action ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {act.actionId}
                    </td>

                    {/* Title & Requirement */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold text-xs block group-hover:text-blue-400 transition-colors line-clamp-1">
                          {act.title}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                          <span className="text-slate-300">{act.requirementId}</span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{act.clause}</span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2">
                        {act.ownerType === 'INDIVIDUAL' ? <User className="w-3.5 h-3.5 text-blue-400 shrink-0" /> :
                         act.ownerType === 'TEAM' ? <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" /> :
                         <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <div className="truncate">
                          <span className="text-white font-medium text-xs block truncate">{act.ownerName}</span>
                          <span className="text-[10px] text-slate-500 font-mono truncate block">{act.department}</span>
                        </div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-2 text-center">
                      {getPriorityBadge(act.priority)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      {getStatusBadge(act.status)}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-3 text-center font-mono text-[11px] text-slate-300">
                      {act.dueDate || 'Open'}
                    </td>

                    {/* Action Trigger */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAction(act);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white text-xs font-bold transition-all border border-slate-700"
                      >
                        Inspect
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Column 1: OPEN */}
          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">Open Actions</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold">
                {filteredActions.filter((a) => a.status === 'OPEN').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActions.filter((a) => a.status === 'OPEN').map((act) => (
                <div
                  key={act.actionId}
                  onClick={() => setSelectedAction(act)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{act.actionId}</span>
                    {getPriorityBadge(act.priority)}
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{act.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-850">
                    <span>{act.ownerName}</span>
                    <span>Due: {act.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: IN_PROGRESS */}
          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-400 font-mono uppercase">In Progress</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono font-bold">
                {filteredActions.filter((a) => a.status === 'IN_PROGRESS').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActions.filter((a) => a.status === 'IN_PROGRESS').map((act) => (
                <div
                  key={act.actionId}
                  onClick={() => setSelectedAction(act)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{act.actionId}</span>
                    {getPriorityBadge(act.priority)}
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{act.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-850">
                    <span>{act.ownerName}</span>
                    <span>Due: {act.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: PENDING_VERIFICATION */}
          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 font-mono uppercase">Pending Review</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold">
                {filteredActions.filter((a) => a.status === 'PENDING_VERIFICATION').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActions.filter((a) => a.status === 'PENDING_VERIFICATION').map((act) => (
                <div
                  key={act.actionId}
                  onClick={() => setSelectedAction(act)}
                  className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{act.actionId}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 text-[9px] font-mono font-bold">
                      +{act.reassessmentScoreDelta}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{act.title}</h4>
                  <p className="text-[10px] text-cyan-300 font-mono">Evidence Attached • Awaiting Signoff</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-850">
                    <span>{act.ownerName}</span>
                    <span className="text-cyan-400 font-bold">Verify</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: CLOSED */}
          <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase">Verified Closed</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono font-bold">
                {filteredActions.filter((a) => a.status === 'CLOSED').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {filteredActions.filter((a) => a.status === 'CLOSED').map((act) => (
                <div
                  key={act.actionId}
                  onClick={() => setSelectedAction(act)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer space-y-2 shadow-sm opacity-80 hover:opacity-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{act.actionId}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">{act.title}</h4>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ✓ Closed: {act.verifiedBy?.split('(')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Action Detail, Evidence Upload & Verification Modal */}
      <ActionDetailModal
        action={selectedAction}
        onClose={() => setSelectedAction(null)}
        onUpdateAction={handleUpdateAction}
      />

    </div>
  );
}
