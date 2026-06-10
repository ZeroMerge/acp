import { ShareIcon } from '@heroicons/react/24/outline';

interface DelegationTreeProps {
  agentId: string;
  className?: string;
}

export default function DelegationTree({ className = '' }: DelegationTreeProps) {
  return (
    <div className={`rounded-xl border p-6 ${className}`} style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-3 mb-4">
        <ShareIcon className="w-5 h-5 text-[var(--text-muted)]" />
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Delegation Tree</h3>
      </div>
      <p className="text-[14px] text-[var(--text-secondary)]">
        No sub-agents delegated yet. When this agent uses DELEGATE permission, sub-agents will appear here.
      </p>
    </div>
  );
}