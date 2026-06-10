import { getPermissionColor } from '../../constants/permissions';

interface StatusBadgeProps {
  status: 'active' | 'expired' | 'no_capsule' | 'revoked' | 'coming_soon' | 'live';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config: Record<string, { bg: string; text: string; border: string; dot?: string; label: string }> = {
    active:      { bg: '#dafbe1', text: '#1a7f37', border: 'rgba(26,127,55,0.3)',  dot: '#1a7f37', label: 'Active' },
    live:        { bg: '#dafbe1', text: '#1a7f37', border: 'rgba(26,127,55,0.3)',  dot: '#1a7f37', label: 'Live' },
    expired:     { bg: '#fff8c5', text: '#9a6700', border: 'rgba(154,103,0,0.3)',              label: 'Expired' },
    no_capsule:  { bg: '#eaeef2', text: '#57606a', border: 'rgba(31,35,40,0.15)',              label: 'No Capsule' },
    revoked:     { bg: '#ffebe9', text: '#cf222e', border: 'rgba(207,34,46,0.3)',              label: 'Revoked' },
    coming_soon: { bg: '#eaeef2', text: '#57606a', border: 'rgba(31,35,40,0.15)',              label: 'Coming Soon' },
  };

  const s = config[status] ?? config.no_capsule;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-[2px] text-[12px] font-medium rounded-full border ${className}`}
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {s.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
          style={{ background: s.dot }}
        />
      )}
      {s.label}
    </span>
  );
}

interface PermissionBadgeProps {
  type: number;
  active?: boolean;
  className?: string;
}

export function PermissionBadge({ type, active = true, className = '' }: PermissionBadgeProps) {
  const color = getPermissionColor(type);
  const labels = ['Query', 'Swap', 'Supply', 'Collect', 'Stake', 'Transfer', 'Order', 'Delegate'];
  const label = labels[type] ?? 'Unknown';

  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] text-[12px] font-medium rounded-full border ${className}`}
      style={{
        background:  active ? color.bg  : '#eaeef2',
        color:       active ? color.text : '#57606a',
        borderColor: active ? color.bg  : 'rgba(31,35,40,0.12)',
      }}
    >
      {label}
    </span>
  );
}