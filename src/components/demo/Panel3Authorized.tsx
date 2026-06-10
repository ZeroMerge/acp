import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFeedback from '../ui/TransactionFeedback';
import PermissionGrid from '../ui/PermissionGrid';
import SpendMeter from '../ui/SpendMeter';
import type { PermissionCapsuleObject } from '../../types';

interface Panel3AuthorizedProps {
  capsuleId: string;
  onComplete: () => void;
}

// Mock capsule for display - ORDER only
const mockCapsule: PermissionCapsuleObject = {
  id: '0x...',
  agentId: '0x...',
  issuer: '0x...',
  permissions: [6], // ORDER
  protocolWhitelist: [],
  spendPerTx: BigInt(20_000_000_000),
  dailyLimit: BigInt(100_000_000_000),
  lifetimeLimit: BigInt(1000_000_000_000),
  spentToday: BigInt(0),
  spentTotal: BigInt(0),
  lastResetEpoch: 0,
  expiryEpoch: 0,
  isExpired: false,
  isActive: true,
};

export default function Panel3Authorized({ capsuleId, onComplete }: Panel3AuthorizedProps) {
  const { executeAuthorizedTrade } = useTransactions();
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTrade = async () => {
    if (!capsuleId) return;
    setTxStatus('loading');
    try {
      const result = await executeAuthorizedTrade(capsuleId);
      setTxStatus('success');
      setTxDigest(result.digest);
      setShowSuccess(true);
      setTimeout(() => onComplete(), 2500);
    } catch (err: any) {
      setTxStatus('error');
      setTxError(err?.message ?? 'Transaction failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: `1px solid ${showSuccess ? '#1a7f37' : '#d0d7de'}`,
        boxShadow: '0 1px 3px rgba(31,35,40,0.08)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Card header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#eaeef2', background: '#f6f8fa' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}>
            <CpuChipIcon className="w-4 h-4 text-[#0969da]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>Step 3 of 4</p>
            <h2 className="text-[15px] font-semibold" style={{ color: '#1f2328' }}>Execute Authorized Trade</h2>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-6 space-y-5">
        <p className="text-[14px] leading-relaxed" style={{ color: '#57606a' }}>
          The agent triggers a trade on DeepBook. Because the capsule explicitly grants the <strong>ORDER</strong> permission, the transaction is verified and approved on-chain.
        </p>

        {/* Permission Grid */}
        <div className="p-3 rounded-lg border" style={{ borderColor: '#eaeef2', background: '#f6f8fa' }}>
          <p className="text-[12px] font-semibold mb-2" style={{ color: '#57606a' }}>Attached permissions</p>
          <PermissionGrid capsule={mockCapsule} showMeters={false} />
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-md border space-y-3"
            style={{ background: '#dafbe1', border: '1px solid rgba(26,127,55,0.25)' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#1a7f37]" strokeWidth={2.5} />
              <span className="text-[14px] font-bold text-[#1a7f37] uppercase tracking-wider">
                Authorized trade executed
              </span>
            </div>
            <SpendMeter spent={BigInt(10_000_000_000)} limit={BigInt(100_000_000_000)} label="Spent Today" />
          </motion.div>
        )}

        <button
          onClick={handleTrade}
          disabled={txStatus === 'loading' || showSuccess}
          className="w-full h-10 rounded-md text-[14px] font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: showSuccess ? '#1a7f37' : '#0969da' }}
          onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0550ae'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = showSuccess ? '#1a7f37' : '#0969da'; }}
        >
          {txStatus === 'loading' ? 'Executing trade on-chain…' : showSuccess ? '✓ Executed successfully' : 'Execute trade on DeepBook'}
        </button>

        <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />
      </div>
    </motion.div>
  );
}