'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  PlayCircle, 
  FileText, 
  BookOpen, 
  ShieldAlert, 
  FileBarChart, 
  GitCompare, 
  Settings, 
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'AI Projects', icon: FolderKanban, href: '/projects' },
  { label: 'New Assessment', icon: PlayCircle, href: '/new-assessment' },
  { label: 'Documents', icon: FileText, href: '/documents' },
  { label: 'Knowledge Base', icon: BookOpen, href: '/knowledge-base' },
  { label: 'Compliance Findings', icon: ShieldAlert, href: '/findings' },
  { label: 'Reports', icon: FileBarChart, href: '/reports' },
  { label: 'Version History', icon: GitCompare, href: '/version-comparison' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0E1420] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Logo & Platform Title */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide leading-none">AI Guardian</h1>
            <span className="text-[11px] text-cyan-400 font-medium tracking-wider uppercase">Governance Platform</span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tenant Context Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B0F17]/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 border border-slate-700">
            AR
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">Al-Rajhi Financial Corp</p>
            <p className="text-[10px] text-slate-500">Tier 1 Licensed Entity</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
