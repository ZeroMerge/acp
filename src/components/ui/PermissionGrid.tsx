import React, { useState, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  ShareIcon,
  LockClosedIcon as LockIcon,
} from '@heroicons/react/24/outline';
import { Permission, PERMISSION_META, ALL_PERMISSIONS } from '../../constants/permissions';
import type { PermissionCapsuleObject } from '../../types';
import SpendMeter from './SpendMeter';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MagnifyingGlassIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  ShareIcon,
};

interface PermissionGridProps {
  capsule?: PermissionCapsuleObject | null;
  selectable?: boolean;
  selected?: Permission[];
  onToggle?: (perm: Permission) => void;
  className?: string;
  showMeters?: boolean;
}

export default function PermissionGrid({
  capsule,
  selectable = false,
  selected = [],
  onToggle,
  className = '',
  showMeters = true,
}: PermissionGridProps) {
  const [hoveredDelegate, setHoveredDelegate] = useState(false);

  const isGranted = useCallback(
    (perm: Permission) => {
      if (selectable) return selected.includes(perm);
      return capsule ? capsule.permissions.includes(perm) : false;
    },
    [selectable, selected, capsule]
  );

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {ALL_PERMISSIONS.map((perm) => {
        const meta = PERMISSION_META[perm];
        const granted = isGranted(perm);
        const IconComponent = iconMap[meta.icon];

        return (
          <button
            key={perm}
            onClick={() => selectable && onToggle?.(perm)}
            disabled={!selectable}
            onMouseEnter={() => perm === Permission.DELEGATE && setHoveredDelegate(true)}
            onMouseLeave={() => perm === Permission.DELEGATE && setHoveredDelegate(false)}
            className={`
              relative rounded-lg p-4 text-left transition-all duration-150
              ${granted
                ? 'border border-[rgba(25,0,255,0.3)] bg-[var(--accent-dim)]'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)]'
              }
              ${selectable ? 'cursor-pointer hover:border-[var(--border-active)]' : 'cursor-default'}
            `}
          >
            {!granted && !selectable && (
              <LockIcon className="absolute top-2 right-2 w-3 h-3 text-[var(--text-muted)]" />
            )}

            {IconComponent && (
              <div className={granted ? 'text-[var(--accent)] animate-perm-glow' : 'text-[var(--text-muted)]'}>
                <IconComponent className="w-5 h-5" />
              </div>
            )}

            <div className={`mt-2 text-[12px] font-medium uppercase tracking-wide ${granted ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
              {meta.label}
            </div>

            <div className={`mt-0.5 text-[11px] ${granted ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
              {meta.description}
            </div>

            {granted && showMeters && capsule && capsule.dailyLimit > 0 && (
              <div className="mt-3">
                <SpendMeter
                  spent={capsule.spentToday}
                  limit={capsule.dailyLimit}
                  label="Today"
                />
              </div>
            )}

            {perm === Permission.DELEGATE && selectable && hoveredDelegate && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-md shadow-elevated text-[11px] text-[var(--text-secondary)] max-w-[200px] z-10">
                Granting DELEGATE allows this agent to spawn sub-agents. Sub-agents can only receive a subset of your agent&apos;s permissions.
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}