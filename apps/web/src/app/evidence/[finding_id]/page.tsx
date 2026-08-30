'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProjectSourcesPanel } from '../../../components/layout/ProjectSourcesPanel';
import { EvidenceDocumentViewer } from '../../../components/evidence/EvidenceDocumentViewer';
import { AICommentPanel } from '../../../components/evidence/AICommentPanel';
import { DEMO_ANNOTATIONS, DEMO_FINDINGS } from '../../../lib/demo_data';
import { ProvenanceBadge } from '../../../components/findings/ProvenanceBadge';
import { SourceProvenanceModal } from '../../../components/findings/SourceProvenanceModal';
import { ArrowLeft, ShieldCheck, BookOpen, ArrowRight, Hash } from 'lucide-react';

export default function EvidenceViewerPage() {
  const params = useParams();
  const router = useRouter();
  const findingId = (params?.finding_id as string) || 'find-001';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const annotation = DEMO_ANNOTATIONS[findingId] || DEMO_ANNOTATIONS['find-001'];
  const finding = DEMO_FINDINGS.find((f) => f.id === findingId) || DEMO_FINDINGS[0];
  const prov = finding.provenance;

  return (
    <div className="flex gap-6 -m-6 md:-m-8">
      {/* Central 2-Panel Area: Document Viewer + AI Analysis Panel */}
      <div className="flex-1 p-6 md:p-8 space-y-4 min-w-0">
        {/* Back Button & Title Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/findings')}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Audit Findings</span>
          </button>

          <div className="flex items-center space-x-2">
            <ProvenanceBadge sourceType={prov?.sourceType} size="sm" />
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">
              <span>{finding.id} • {prov?.requirementId || finding.regulationReference}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>View Source</span>
            </button>
          </div>
        </div>

        {/* 8-Point Traceability Banner */}
        {prov && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>8-Point Regulatory Provenance Traceability Chain</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                KB: {prov.kbVersion}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-300 pt-0.5">
              <span className="text-rose-400 font-bold">{finding.id}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-cyan-400 font-bold">{prov.requirementId}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-purple-300 font-semibold">{prov.framework}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-amber-300">{prov.clause || prov.section}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-blue-300 font-semibold">{finding.evidence.documentName}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-emerald-300">Page {finding.evidence.pageNumber}</span>
            </div>
          </div>
        )}

        {/* 2 Panel Workspace: Document Viewer (Left 2 cols) + AI Comment Panel (Right 1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EvidenceDocumentViewer
              annotation={annotation}
              documentName={annotation?.documentName || 'Loan_Model_Architecture_Spec.pdf'}
              pageNumber={annotation?.pageNumber || 4}
            />
          </div>

          <div>
            <AICommentPanel
              annotation={annotation}
              onApplyFix={() => {
                alert('Remediation action applied! Re-running assessment...');
                router.push('/version-comparison');
              }}
            />
          </div>
        </div>
      </div>

      {/* NotebookLM Project Sources Left/Right Panel */}
      <div className="hidden xl:block">
        <ProjectSourcesPanel />
      </div>

      {/* Global Source Provenance Modal */}
      <SourceProvenanceModal
        finding={finding}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
