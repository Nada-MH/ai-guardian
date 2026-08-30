'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
        <AlertOctagon className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-bold text-white tracking-tight">Project Workspace Exception Recovered</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error?.message || 'An error occurred while rendering the project workspace.'}
        </p>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <button
          onClick={() => reset()}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Workspace State</span>
        </button>

        <Link
          href="/"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard Home</span>
        </Link>
      </div>
    </div>
  );
}
