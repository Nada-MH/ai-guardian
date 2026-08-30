'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FolderKanban, 
  PlayCircle, 
  BookOpen, 
  ShieldAlert, 
  ShieldCheck,
  CheckSquare,
  FileBarChart, 
  GitCompare, 
  Briefcase,
  Award,
  Activity,
  Settings,
  Layers,
  Flame,
  Lightbulb,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

const NAV_ITEMS = [
  { label: 'Executive Posture', icon: Briefcase, href: '/executive' },
  { label: 'My Assessments', icon: FolderKanban, href: '/' },
  { label: 'Self-Governance', icon: Award, href: '/self-governance' },
  { label: 'Quality QA', icon: Activity, href: '/evaluations' },
  { label: 'New Audit', icon: PlayCircle, href: '/new-assessment' },
  { label: 'Findings', icon: ShieldAlert, href: '/findings' },
  { label: 'Simulator', icon: Flame, href: '/simulator' },
  { label: 'What-If Sandbox', icon: Lightbulb, href: '/what-if' },
  { label: 'Regulations', icon: BookOpen, href: '/knowledge-base' },
  { label: 'Reports', icon: FileBarChart, href: '/reports' },
  { label: 'History', icon: GitCompare, href: '/version-comparison' },
  { label: 'Gap Matrix', icon: Layers, href: '/gap-analysis' },
  { label: 'Remediation', icon: CheckSquare, href: '/governance-lifecycle' },
  { label: 'Audit Trail', icon: ShieldCheck, href: '/audit-trail' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-16 border-r border-slate-800/80 bg-[#0B0F17] flex flex-col justify-between items-center py-4 shrink-0 h-full overflow-y-auto z-30">
      <div className="space-y-6 flex flex-col items-center">
        {/* Navigation Icons */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Theme Toggle + Settings */}
      <div className="space-y-2 flex flex-col items-center">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
        </button>

        <Link
          href="/settings"
          title="Settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}
