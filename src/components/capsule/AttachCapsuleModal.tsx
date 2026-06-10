import { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Permission } from '../../constants/permissions';
import { useTransactions } from '../../hooks/useTransactions';
import PermissionGrid from '../ui/PermissionGrid';
import TransactionFeedback from '../ui/TransactionFeedback';

interface AttachCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  onSuccess: () => void;
}

export default function AttachCapsuleModal({ isOpen, onClose, agentId, onSuccess }: AttachCapsuleModalProps) {
  const { attachPermissionCapsule } = useTransactions();

  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([]);
  const [spendPerTx, setSpendPerTx] = useState(20);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [lifetimeLimit, setLifetimeLimit] = useState(1000);
  const [expiryHours, setExpiryHours] = useState(24);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [whitelistInput, setWhitelistInput] = useState('');

  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const togglePerm = (perm: Permission) => {
    setSelectedPerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const addWhitelist = () => {
    if (whitelistInput && !whitelist.includes(whitelistInput)) {
      setWhitelist([...whitelist, whitelistInput]);
      setWhitelistInput('');
    }
  };

  const removeWhitelist = (addr: string) => {
    setWhitelist(whitelist.filter(a => a !== addr));
  };

  const handleSubmit = async () => {
    if (!agentId || selectedPerms.length === 0) return;
    setTxStatus('loading');
    try {
      const nowEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
      const result = await attachPermissionCapsule({
        agentId,
        permissions: selectedPerms,
        protocolWhitelist: whitelist,
        spendPerTxSui: spendPerTx,
        dailyLimitSui: dailyLimit,
        lifetimeLimitSui: lifetimeLimit,
        expiryEpoch: nowEpoch + Math.ceil(expiryHours / 24),
      });
      setTxStatus('success');
      setTxDigest(result.digest);
      onSuccess();
    } catch (err: any) {
      setTxStatus('error');
      setTxError(err?.message ?? 'Transaction failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(240,238,232,0.65)] backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[600px] border shadow-modal bg-[var(--bg-elevated)] border-[var(--border-subtle)] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <h2 className="text-[18px] font-display font-bold text-[var(--text-primary)]">
            Attach Permission Capsule
          </h2>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          {/* Permissions */}
          <div className="space-y-2">
            <label className="block text-[12px] font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Grant Permissions
            </label>
            <PermissionGrid selectable selected={selectedPerms} onToggle={togglePerm} showMeters={false} />
          </div>

          {/* Spend Limits */}
          <div className="space-y-4">
            <label className="block text-[12px] font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Spend Limits (SUI)
            </label>
            {[
              { label: 'Per Transaction Limit', value: spendPerTx, setter: setSpendPerTx },
              { label: 'Daily Limit Amount', value: dailyLimit, setter: setDailyLimit },
              { label: 'Lifetime Limit Amount', value: lifetimeLimit, setter: setLifetimeLimit },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[12px] font-sans font-bold text-[var(--text-secondary)] w-36">{label}</span>
                <input
                  type="range" min={0.1} max={1000} step={0.1}
                  value={value}
                  onChange={(e) => setter(parseFloat(e.target.value))}
                  className="flex-1 accent-[var(--accent)]"
                />
                <span className="text-[12px] font-mono font-bold text-[var(--text-primary)] w-16 text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <label className="block text-[12px] font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Capsule Expiry
            </label>
            <select
              value={expiryHours}
              onChange={(e) => setExpiryHours(Number(e.target.value))}
              className="w-full h-11 px-3 border text-[13px] font-sans outline-none focus:border-[var(--accent)]"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
            >
              <option value={1}>1 hour</option>
              <option value={24}>24 hours</option>
              <option value={168}>7 days</option>
              <option value={720}>30 days</option>
            </select>
          </div>

          {/* Protocol Whitelist */}
          <div className="space-y-2">
            <label className="block text-[12px] font-display font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Protocol Address Whitelist
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={whitelistInput}
                onChange={(e) => setWhitelistInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addWhitelist()}
                placeholder="0x..."
                className="flex-1 h-11 px-3 border text-[13px] font-mono outline-none focus:border-[var(--accent)]"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={addWhitelist}
                className="px-5 border border-[var(--border-subtle)] text-[12px] font-sans font-bold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
            {whitelist.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {whitelist.map((addr) => (
                  <span
                    key={addr}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    {addr.slice(0, 8)}...{addr.slice(-6)}
                    <button onClick={() => removeWhitelist(addr)} className="text-[var(--text-muted)] hover:text-[var(--text-error)]">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-subtle)]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-[var(--border-default)] text-[12px] font-sans font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors bg-transparent"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedPerms.length === 0 || txStatus === 'loading'}
              className="px-5 py-2.5 border border-[var(--border-subtle)] text-[12px] font-sans font-bold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {txStatus === 'loading' ? 'Attaching...' : 'Attach Capsule'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}