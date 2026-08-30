'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Plus, Search, Settings, User, Sparkles, Sun, Moon, Briefcase } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { ViewModeSwitcher } from '../executive/ViewModeSwitcher';

interface HeaderProps {
  onRunDemo?: () => void;
  isDemoRunning?: boolean;
}

export function Header({ onRunDemo, isDemoRunning }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isInsideProject = pathname.startsWith('/projects/') || pathname.startsWith('/evidence/');

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Brand & Project Context */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">AI Guardian</span>
        </Link>

        <span className="text-slate-700">|</span>

        {/* Global Search Bar (NotebookLM style) */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI projects, documents, regulations..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Center/Right Actions: View Switcher & User Profile */}
      <div className="flex items-center space-x-3">
        <ViewModeSwitcher currentProjectId="sys-fintrust-001" />
        {onRunDemo && (
          <button
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDemoRunning ? 'Running Audit...' : 'Run Demo Assessment'}</span>
          </button>
        )}

        <Link
          href="/new-assessment"
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-blue-400" />}
        </button>

        <Link href="/settings" className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings className="w-4.5 h-4.5" />
        </Link>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white border border-slate-700 shadow-sm">
          S
        </div>
      </div>
    </header>
  );
}
