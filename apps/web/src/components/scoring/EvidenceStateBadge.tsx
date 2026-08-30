'use client';

import React from 'react';
import { ComplianceEvidenceState } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, MinusCircle } from 'lucide-react';

interface EvidenceStateBadgeProps {
  state: ComplianceEvidenceState | string;
  size?: 'sm' | 'md';
}

export function EvidenceStateBadge({ state, size = 'sm' }: EvidenceStateBadgeProps) {
  const getStyle = () => {
    switch (state.toUpperCase()) {
      case 'COMPLIANT':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'COMPLIANT'
        };
      case 'PARTIALLY_COMPLIANT':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: AlertTriangle,
          label: 'PARTIALLY COMPLIANT'
        };
      case 'NON_COMPLIANT':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: XCircle,
          label: 'NON-COMPLIANT'
        };
      case 'INSUFFICIENT_EVIDENCE':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: HelpCircle,
          label: 'INSUFFICIENT EVIDENCE'
        };
      case 'NOT_APPLICABLE':
      default:
        return {
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: MinusCircle,
          label: 'NOT APPLICABLE'
        };
    }
  };

  const config = getStyle();
  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center space-x-1 font-mono font-bold rounded border uppercase tracking-wider ${config.bg} ${
        isSmall ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'
      }`}
    >
      <Icon className={isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      <span>{config.label}</span>
    </span>
  );
}
