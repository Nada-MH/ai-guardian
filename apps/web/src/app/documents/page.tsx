'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Search, Filter, Eye, ChevronRight } from 'lucide-react';
import { DEMO_DOCUMENTS } from '../../lib/demo_data';
import { DocumentSource } from '../../types';

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentSource>(DEMO_DOCUMENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = DEMO_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">NotebookLM Document Organization Workspace</h2>
        <p className="text-xs text-slate-400">Manage, inspect, and index AI technical documentation into the dual-layer RAG knowledge base.</p>
      </div>

      {/* NotebookLM Style Drag & Drop File Upload Area */}
      <div className="p-8 rounded-xl bg-[#111827] border-2 border-dashed border-slate-700 hover:border-blue-500/60 transition-all text-center group cursor-pointer">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Drag & Drop AI Technical Documentation</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
          Supported formats: <strong>PDF, DOCX, TXT, MD, JSON</strong> (Max 50 MB per file).
        </p>
        <span className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all">
          Browse Local Files
        </span>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List (Left 1 col) */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search uploaded documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 shadow-md'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-100 truncate">{doc.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>{doc.category}</span>
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{doc.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extracted Document Viewer & Metadata (Right 2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                  {selectedDoc.type} DOCUMENT
                </span>
                <span className="text-xs text-slate-400">{selectedDoc.category}</span>
              </div>
              <h3 className="text-base font-bold text-white">{selectedDoc.name}</h3>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>Size: <strong className="text-slate-200">{selectedDoc.fileSize}</strong></p>
              <p>Pages: <strong className="text-slate-200">{selectedDoc.pageCount || 1} Pages</strong></p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parsed Document Text & RAG Index Snippet</h4>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed space-y-3">
              <p className="text-blue-400 font-semibold">// Section 1: Executive Overview & Model Lineage</p>
              <p>{selectedDoc.contentSnippet}</p>
              <p className="text-slate-500 italic">// Text extracted cleanly via pypdfium2. Indexed in Qdrant Vector Store under collection 'uploaded_documents'.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">SHA-256 Checksum:</span>
              <p className="font-mono text-[11px] text-slate-300 truncate mt-1">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Associated Findings:</span>
              <p className="font-bold text-amber-400 mt-1">{selectedDoc.findingsCount || 0} Compliance Gaps Detected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
