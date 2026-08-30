'use client';

import React, { useState } from 'react';
import {
  X, CheckCircle2, AlertTriangle, XCircle, Clock, User, Users,
  Building, Calendar, FileText, Upload, RefreshCw, ShieldCheck,
  ArrowRight, Sparkles, Plus, Check, ShieldAlert
} from 'lucide-react';
import { RemediationActionItem, ActionStatus, VerificationStatus } from '../../types';

interface ActionDetailModalProps {
  action: RemediationActionItem | null;
  onClose: () => void;
  onUpdateAction?: (updatedAction: RemediationActionItem) => void;
}

export function ActionDetailModal({ action, onClose, onUpdateAction }: ActionDetailModalProps) {
  if (!action) return null;

  // Local State for Evidence Upload Simulation
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceExcerpt, setEvidenceExcerpt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Local State for Verification Sign-Off
  const [verifierName, setVerifierName] = useState('Sarah Al-Otaibi');
  const [verifierRole, setVerifierRole] = useState('Chief Compliance Officer');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'CLOSED':
      case 'VERIFIED':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">CLOSED (RESOLVED)</span>;
      case 'PENDING_VERIFICATION':
        return <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">PENDING VERIFICATION</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold">IN PROGRESS</span>;
      case 'BLOCKED':
        return <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">BLOCKED</span>;
      case 'OPEN':
      default:
        return <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">OPEN</span>;
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">LOW</span>;
    }
  };

  const handleUploadAndReassess = () => {
    if (!evidenceName.trim()) return;
    setIsUploading(true);

    setTimeout(() => {
      const updated: RemediationActionItem = {
        ...action,
        status: 'PENDING_VERIFICATION',
        verificationStatus: 'PENDING_REVIEW',
        evidenceIds: Array.from(new Set([...action.evidenceIds, evidenceName])),
        completedAt: new Date().toISOString(),
        reassessmentStatus: 'COMPLIANT',
        reassessmentScoreDelta: 4.0,
        verificationNotes: 'New evidence uploaded. Automated reassessment completed (+4.0% gain). Awaiting officer sign-off.'
      };

      setIsUploading(false);
      setEvidenceName('');
      setEvidenceExcerpt('');
      if (onUpdateAction) onUpdateAction(updated);
    }, 600);
  };

  const handleVerifyAndClose = () => {
    setIsSubmittingVerification(true);

    setTimeout(() => {
      const updated: RemediationActionItem = {
        ...action,
        status: 'CLOSED',
        verificationStatus: 'VERIFIED_EFFECTIVE',
        verifiedBy: `${verifierName} (${verifierRole})`,
        verifiedAt: new Date().toISOString(),
        verificationNotes: verificationNotes || 'Evidence inspected and verified effective in production environment.'
      };

      setIsSubmittingVerification(false);
      if (onUpdateAction) onUpdateAction(updated);
    }, 500);
  };

  const handleRejectRevision = () => {
    const updated: RemediationActionItem = {
      ...action,
      status: 'IN_PROGRESS',
      verificationStatus: 'FAILED_VERIFICATION',
      verificationNotes: `Verification rejected by ${verifierName}: Evidence provided is insufficient to demonstrate compliance.`
    };
    if (onUpdateAction) onUpdateAction(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 font-mono text-cyan-400 text-xs font-bold border border-slate-800">
                  {action.actionId}
                </span>
                {getPriorityBadge(action.priority)}
                {getStatusBadge(action.status)}
              </div>
              <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                {action.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">

          {/* Lifecycle Step Indicator */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Governance Stage:</span>
            <div className="flex items-center space-x-1.5 font-bold">
              <span className={action.status !== 'OPEN' ? 'text-emerald-400' : 'text-amber-400'}>1. Fix</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className={action.evidenceIds.length > 0 ? 'text-emerald-400' : 'text-slate-500'}>2. Evidence</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className={action.reassessmentScoreDelta ? 'text-emerald-400' : 'text-slate-500'}>3. Reassess</span>
              <ArrowRight className="w-3 h-3 text-slate-600" />
              <span className={action.status === 'CLOSED' ? 'text-emerald-400' : 'text-cyan-400'}>4. Verify & Close</span>
            </div>
          </div>

          {/* Finding & Requirement Overview */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Target Requirement & Remediation Scope
            </span>
            <p className="text-xs text-white leading-relaxed font-medium">
              {action.description}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Requirement ID</span>
                <span className="text-cyan-400 font-bold">{action.requirementId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Framework Clause</span>
                <span className="text-slate-300 truncate block">{action.clause}</span>
              </div>
            </div>
          </div>

          {/* Multi-tier Ownership & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Assigned Owner</span>
              <div className="flex items-center space-x-2 pt-0.5">
                {action.ownerType === 'INDIVIDUAL' ? <User className="w-4 h-4 text-blue-400" /> :
                 action.ownerType === 'TEAM' ? <Users className="w-4 h-4 text-purple-400" /> :
                 <Building className="w-4 h-4 text-amber-400" />}
                <div>
                  <span className="font-bold text-white block">{action.ownerName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{action.ownerType} • {action.department}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Timeline & SLA</span>
              <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                <span className="text-slate-400">Created: {action.createdAt.substring(0, 10)}</span>
                <span className="text-cyan-400 font-bold">Due: {action.dueDate || 'Open'}</span>
              </div>
              {action.completedAt && (
                <span className="text-[10px] text-emerald-400 font-mono block">
                  Completed: {new Date(action.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Evidence Upload & Automated Reassessment Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Supporting Evidence & Automated Reassessment</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {action.evidenceIds.length} Artifact(s) Attached
              </span>
            </div>

            {/* Attached Evidence Pills */}
            <div className="space-y-1.5">
              {action.evidenceIds.length > 0 ? (
                action.evidenceIds.map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                    <span className="text-slate-200 truncate flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ev}</span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">VERIFIED</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No evidence artifact has been attached yet.</p>
              )}
            </div>

            {/* Reassessment Score Gain Indicator */}
            {action.reassessmentScoreDelta ? (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300">
                  ✓ Reassessment Result: <strong>{action.reassessmentStatus}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  +{action.reassessmentScoreDelta}% Compliance Gain
                </span>
              </div>
            ) : null}

            {/* Upload Evidence Simulation Form (if open or in progress) */}
            {action.status !== 'CLOSED' && (
              <div className="pt-2 border-t border-slate-850 space-y-2">
                <span className="text-[11px] text-slate-400 font-bold block">
                  Upload Remediation Artifact:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={evidenceName}
                    onChange={(e) => setEvidenceName(e.target.value)}
                    placeholder="e.g. Underwriting_Queue_Audit_Logs_Aug2026.pdf"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleUploadAndReassess}
                    disabled={!evidenceName.trim() || isUploading}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Reassessing...' : 'Upload & Reassess'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Compliance Officer Verification & Sign-off Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Compliance Officer Verification Sign-Off</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono">
                {action.verificationStatus}
              </span>
            </div>

            {action.status === 'CLOSED' ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">✓ Verified By: {action.verifiedBy}</span>
                    <span className="text-slate-400">{action.verifiedAt ? new Date(action.verifiedAt).toLocaleString() : ''}</span>
                  </div>
                  <p className="text-slate-200 text-xs mt-1">"{action.verificationNotes}"</p>
                </div>
              </div>
            ) : action.status === 'PENDING_VERIFICATION' ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  New evidence is attached and requirement is reassessed. Provide official officer sign-off rationale to close finding:
                </p>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Enter compliance verification rationale (e.g. Verified production queue execution and human review workflow)..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleRejectRevision}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={handleVerifyAndClose}
                    disabled={isSubmittingVerification}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmittingVerification ? 'Signing off...' : 'Verify & Close Finding'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Verification sign-off unlocks after evidence implementation is submitted.
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
