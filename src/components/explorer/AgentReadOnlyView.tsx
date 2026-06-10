import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAgentIdentities } from '../../hooks/useAgentIdentities';
import { usePermissionCapsule } from '../../hooks/usePermissionCapsule';
import { useAgentHistory } from '../../hooks/useAgentHistory';
import { StatusBadge, PermissionBadge } from '../ui/Badge';
import AddressDisplay from '../ui/AddressDisplay';
import PermissionGrid from '../ui/PermissionGrid';
import SpendMeter from '../ui/SpendMeter';
import CountdownTimer from '../ui/CountdownTimer';
import { formatRelativeTime, suiscanTxUrl } from '../../lib/utils';
import type { AgentIdentityObject } from '../../types';

interface AgentReadOnlyViewProps {
  agent?: AgentIdentityObject | null;
}

export default function AgentReadOnlyView({ agent: propAgent }: AgentReadOnlyViewProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  // If agent is passed directly, use it; otherwise fetch by ID
  const { agents } = useAgentIdentities();
  const agent = propAgent ?? agents.find(a => a.id === id) ?? null;

  const { capsule } = usePermissionCapsule(agent?.id ?? '', agent?.owner);
  const { events, isLoading: eventsLoading } = useAgentHistory(agent?.id ?? '');

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">Agent not found</p>
        <p className="text-[14px] text-[var(--text-secondary)]">The agent ID you searched for does not exist.</p>
      </div>
    );
  }

  const isOwner = currentAccount?.address === agent.owner;

  const getStatus = (): 'active' | 'expired' | 'no_capsule' => {
    if (!capsule) return 'no_capsule';
    if (capsule.isExpired) return 'expired';
    return 'active';
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </button>

      {/* Read-only banner */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] font-medium" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <EyeIcon className="w-3.5 h-3.5" />
          Read-Only · Public Explorer
        </span>
        {isOwner && (
          <p className="text-[13px] text-[var(--text-secondary)]">
            Connect wallet to manage this agent
          </p>
        )}
      </div>

      {/* Panel 1: Agent Identity */}
      <div className="rounded-xl border p-6 relative" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-bold text-[var(--text-primary)]">{agent.name || 'Unnamed Agent'}</h2>
          <StatusBadge status={getStatus()} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'OBJECT ID', value: <AddressDisplay address={agent.id} /> },
            { label: 'OWNER', value: <AddressDisplay address={agent.owner} /> },
            { label: 'CREATED EPOCH', value: <span className="font-mono text-[14px]">{agent.createdEpoch}</span> },
            { label: 'ACTION COUNT', value: <span className="font-mono text-[14px]">{agent.actionCount}</span> },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
              <div className="text-[var(--text-primary)]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 2: Permission Capsule */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4">Permission Capsule</h3>
        {capsule ? (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-[12px]">
              <span className="font-mono text-[var(--text-secondary)]">
                Capsule: <AddressDisplay address={capsule.id} chars={5} showCopy={false} showLink={false} />
              </span>
              <CountdownTimer expiryEpoch={capsule.expiryEpoch} />
            </div>
            <PermissionGrid capsule={capsule} />
            <div className="mt-4 space-y-2">
              <SpendMeter spent={capsule.spentToday} limit={capsule.dailyLimit} label="Today" />
              <SpendMeter spent={capsule.spentTotal} limit={capsule.lifetimeLimit} label="Lifetime" />
            </div>
          </>
        ) : (
          <p className="text-[14px] text-[var(--text-secondary)]">No permission capsule attached.</p>
        )}
      </div>

      {/* Panel 3: Action History */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4">Action History</h3>
        {eventsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 rounded bg-[var(--bg-elevated)] animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-3">
                <PermissionBadge type={Number(event.data?.permission_type ?? 0)} active={false} />
                <span className="text-[12px] text-[var(--text-muted)]">{formatRelativeTime(event.timestampMs)}</span>
                <a
                  href={suiscanTxUrl(event.txDigest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[12px] text-[var(--accent)] hover:underline"
                >
                  {event.txDigest.slice(0, 8)}...
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-[var(--text-secondary)]">
            No actions recorded yet. Actions appear here as the agent operates.
          </p>
        )}
      </div>
    </div>
  );
}