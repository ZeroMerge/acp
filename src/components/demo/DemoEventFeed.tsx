// DemoEventFeed component
import { useAgentHistory } from '../../hooks/useAgentHistory';
import { PermissionBadge } from '../ui/Badge';
import { formatRelativeTime } from '../../lib/utils';

interface DemoEventFeedProps {
  agentId: string;
}

export default function DemoEventFeed({ agentId }: DemoEventFeedProps) {
  const { events, isLoading } = useAgentHistory(agentId);

  if (isLoading || events.length === 0) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 h-[44px] flex items-center px-4 border-t z-30"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
      >
        <span className="text-[12px] text-[var(--text-muted)] font-mono">
          {isLoading ? 'Loading events...' : 'No events yet'}
        </span>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[44px] flex items-center border-t z-30 overflow-hidden"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-4 px-4 animate-scroll-left">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="flex items-center gap-2 flex-shrink-0">
            <PermissionBadge type={0} active={false} />
            <span className="text-[11px] font-mono text-[var(--text-secondary)] truncate max-w-[120px]">
              {event.txDigest.slice(0, 10)}...
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {formatRelativeTime(event.timestampMs)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}