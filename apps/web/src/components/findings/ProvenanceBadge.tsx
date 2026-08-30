'use client';

import React from 'react';
import { SourceType } from '../../types';
import { Scale, ShieldAlert, Compass, CheckCircle, Layers, Sparkles, Building2 } from 'lucide-react';

interface ProvenanceBadgeProps {
  sourceType?: SourceType | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function ProvenanceBadge({ sourceType = 'REGULATORY_GUIDANCE', size = 'sm', showIcon = true }: ProvenanceBadgeProps) {
  const normalizedType = (sourceType as SourceType) || 'REGULATORY_GUIDANCE';

  const configMap: Record<SourceType, { label: string; icon: React.ElementType; style: string }> = {
    LAW: {
      label: 'Statutory Law',
      icon: Scale,
      style: 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25',
    },
    REGULATION: {
      label: 'Binding Regulation',
      icon: ShieldAlert,
      style: 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25',
    },
    REGULATORY_GUIDANCE: {
      label: 'Supervisory Guidance',
      icon: Compass,
      style: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/25',
    },
    STANDARD: {
      label: 'Technical Standard',
      icon: CheckCircle,
      style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
    },
    FRAMEWORK: {
      label: 'National Framework',
      icon: Layers,
      style: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/25',
    },
    ETHICS_PRINCIPLE: {
      label: 'Ethics Principle',
      icon: Sparkles,
      style: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
    },
    INTERNAL_POLICY: {
      label: 'Internal Policy',
      icon: Building2,
      style: 'bg-teal-500/15 text-teal-400 border-teal-500/30 hover:bg-teal-500/25',
    },
  };

  const current = configMap[normalizedType] || configMap.REGULATORY_GUIDANCE;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] space-x-1',
    md: 'px-2.5 py-1 text-xs space-x-1.5',
    lg: 'px-3 py-1.5 text-xs font-bold space-x-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border transition-colors ${current.style} ${sizeClasses}`}
      title={`Regulatory Authority Level: ${current.label} (${normalizedType})`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{current.label}</span>
    </span>
  );
}
