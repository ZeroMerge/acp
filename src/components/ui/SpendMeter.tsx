import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatSui } from '../../lib/utils';

interface SpendMeterProps {
  spent: bigint;
  limit: bigint;
  label: string;
  className?: string;
}

export default function SpendMeter({ spent, limit, label, className = '' }: SpendMeterProps) {
  const pct = limit > 0 ? Math.min(Number((spent * BigInt(100)) / limit), 100) : 0;

  let fillColor = 'var(--accent)';
  let labelText = label;
  let showWarning = false;

  if (pct >= 100) {
    fillColor = 'var(--error)';
    labelText = 'LIMIT REACHED';
  } else if (pct >= 80) {
    fillColor = 'var(--text-warning)';
    showWarning = true;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-secondary)]">
          {labelText}
          {showWarning && (
            <ExclamationTriangleIcon className="w-3 h-3 text-[var(--text-warning)]" />
          )}
        </span>
        <span className="font-mono text-[11px] text-[var(--text-secondary)]">
          {formatSui(spent)} / {formatSui(limit)}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: 'rgba(0,0,0,0.06)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}