'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
        <FileQuestion className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-bold text-white tracking-tight">Audit Resource Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested compliance artifact, evidence report, or route could not be located.
        </p>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Link
          href="/"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard Home</span>
        </Link>
      </div>
    </div>
  );
}
