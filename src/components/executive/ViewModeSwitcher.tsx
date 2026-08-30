'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Microscope, ChevronRight } from 'lucide-react';

interface ViewModeSwitcherProps {
  currentProjectId?: string;
}

export function ViewModeSwitcher({ currentProjectId = 'sys-fintrust-001' }: ViewModeSwitcherProps) {
  const pathname = usePathname();
  const isExecutive = pathname === '/executive';

  return (
    <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
      <Link
        href="/executive"
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          isExecutive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Briefcase className="w-3.5 h-3.5" />
        <span>Executive View</span>
      </Link>

      <Link
        href={`/projects/${currentProjectId}`}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          !isExecutive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Microscope className="w-3.5 h-3.5" />
        <span>Investigation Workspace</span>
      </Link>
    </div>
  );
}
