import * as React from 'react';
import { cn } from '@/lib/cn';
import { CheckCircle2, ShieldCheck, Award, Phone } from 'lucide-react';
import type { VerificationLevel } from '@/services/types';

interface VerifiedBadgeProps {
  level: VerificationLevel;
  className?: string;
  showLabel?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ level, className, showLabel = true }) => {
  const configs: Record<
    VerificationLevel,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    0: {
      label: 'L0: Phone',
      icon: <Phone className="w-3 h-3 text-muted-foreground" />,
      color: 'text-muted-foreground',
      bg: 'bg-muted border-border',
    },
    1: {
      label: 'L1: Document',
      icon: <CheckCircle2 className="w-3 h-3 text-verify" />,
      color: 'text-verify',
      bg: 'bg-verify-soft border-verify/20',
    },
    2: {
      label: 'L2: State ID',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-verify font-bold" />,
      color: 'text-verify',
      bg: 'bg-verify-soft border-verify/40 font-semibold',
    },
    3: {
      label: 'L3: Licensed Trade',
      icon: <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      color: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400/40 font-semibold',
    },
  };

  const c = configs[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border whitespace-nowrap',
        c.bg,
        c.color,
        className,
      )}
      title={`Verification Level ${level}`}
    >
      {c.icon}
      {showLabel && <span>{c.label}</span>}
    </span>
  );
};
