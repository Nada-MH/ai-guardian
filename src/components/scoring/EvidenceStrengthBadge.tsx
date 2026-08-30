'use client';

import React from 'react';
import { EvidenceStrength } from '../../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';

interface EvidenceStrengthBadgeProps {
  strength?: EvidenceStrength;
  size?: 'sm' | 'md';
}

export function EvidenceStrengthBadge({ strength = 'MODERATE', size = 'sm' }: EvidenceStrengthBadgeProps) {
  const getBadgeStyle = () => {
    switch (strength) {
      case 'STRONG':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck,
          label: 'STRONG EVIDENCE'
        };
      case 'MODERATE':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: ShieldCheck,
          label: 'MODERATE EVIDENCE'
        };
      case 'WEAK':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertTriangle,
          label: 'WEAK EVIDENCE'
        };
      case 'NONE':
      default:
        return {
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: HelpCircle,
          label: 'NO EVIDENCE PROVIDED'
        };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center space-x-1 font-mono font-bold rounded border uppercase tracking-wider ${style.bg} ${
        isSmall ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
      }`}
    >
      <Icon className={isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{style.label}</span>
    </span>
  );
}
