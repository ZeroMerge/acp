// CapsuleVisualizer component
import PermissionGrid from '../ui/PermissionGrid';
import SpendMeter from '../ui/SpendMeter';
import CountdownTimer from '../ui/CountdownTimer';
import AddressDisplay from '../ui/AddressDisplay';
import type { PermissionCapsuleObject } from '../../types';

interface CapsuleVisualizerProps {
  capsule: PermissionCapsuleObject;
  className?: string;
}

export default function CapsuleVisualizer({ capsule, className = '' }: CapsuleVisualizerProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Capsule header info */}
      <div className="flex flex-wrap items-center gap-3 text-[12px]">
        <span className="font-mono text-[var(--text-secondary)]">
          Capsule: <AddressDisplay address={capsule.id} chars={5} showCopy={false} showLink={false} />
        </span>
        <span className="text-[var(--text-muted)]">·</span>
        <span className="font-mono text-[var(--text-secondary)]">
          Issuer: <AddressDisplay address={capsule.issuer} chars={5} showCopy={false} showLink={false} />
        </span>
        <span className="text-[var(--text-muted)]">·</span>
        <CountdownTimer expiryEpoch={capsule.expiryEpoch} />
      </div>

      {/* Permission Grid */}
      <PermissionGrid capsule={capsule} />

      {/* Spend Meters */}
      <div className="space-y-3">
        <SpendMeter spent={capsule.spendPerTx} limit={capsule.spendPerTx} label="Per Transaction" />
        <SpendMeter spent={capsule.spentToday} limit={capsule.dailyLimit} label="Today" />
        <SpendMeter spent={capsule.spentTotal} limit={capsule.lifetimeLimit} label="Lifetime" />
      </div>

      {/* Protocol Whitelist */}
      {capsule.protocolWhitelist.length > 0 && (
        <div>
          <p className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Whitelisted Protocols
          </p>
          <div className="flex flex-wrap gap-2">
            {capsule.protocolWhitelist.map((addr) => (
              <span
                key={addr}
                className="inline-flex items-center px-2.5 py-1 rounded-sm text-[11px] font-mono border"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {addr.length > 10 ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : addr}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}