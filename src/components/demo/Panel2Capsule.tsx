import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFeedback from '../ui/TransactionFeedback';
import { PermissionBadge } from '../ui/Badge';
import { PACKAGE_ID } from '../../constants/package';
import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Panel2CapsuleProps {
  agentId: string;
  onComplete: (capsuleId: string) => void;
}

export default function Panel2Capsule({ agentId, onComplete }: Panel2CapsuleProps) {
  const { attachPermissionCapsule } = useTransactions();
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const handleAttach = async () => {
    if (!agentId) return;
    setTxStatus('loading');
    try {
      const nowEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
      const result = await attachPermissionCapsule({
        agentId,
        permissions: [6], // ORDER only
        protocolWhitelist: [PACKAGE_ID], // DeepBook placeholder
        spendPerTxSui: 20,
        dailyLimitSui: 100,
        lifetimeLimitSui: 1000,
        expiryEpoch: nowEpoch + 1, // ~24h
      });
      setTxStatus('success');
      setTxDigest(result.digest);
      setTimeout(() => onComplete(result.capsuleId), 2500);
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
        border: `1px solid ${txStatus === 'success' ? '#1a7f37' : '#d0d7de'}`,
        boxShadow: '0 1px 3px rgba(31,35,40,0.08)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Card header */}
      <div className="px-6 py-5 border-b" style={{ borderColor: '#eaeef2', background: '#f6f8fa' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#dafbe1', border: '1px solid rgba(26,127,55,0.15)' }}>
            <ShieldCheckIcon className="w-4 h-4 text-[#1a7f37]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>Step 2 of 4</p>
            <h2 className="text-[15px] font-semibold" style={{ color: '#1f2328' }}>Attach Permission Capsule</h2>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-6 space-y-5">
        <p className="text-[14px] leading-relaxed" style={{ color: '#57606a' }}>
          Define granular execution permissions and safety parameters. The capsule regulates exactly what actions the agent can perform.
        </p>

        {/* Configuration summary table */}
        <div className="rounded-md border text-[13px]" style={{ borderColor: '#eaeef2', background: '#ffffff' }}>
          <div className="flex justify-between items-center px-4 py-2.5 border-b" style={{ borderColor: '#eaeef2' }}>
            <span style={{ color: '#57606a' }}>Permission type</span>
            <PermissionBadge type={6} active />
          </div>
          <div className="flex justify-between items-center px-4 py-2.5 border-b" style={{ borderColor: '#eaeef2', background: '#f6f8fa' }}>
            <span style={{ color: '#57606a' }}>Spend limits</span>
            <span className="font-mono font-medium text-[#1f2328]">20 SUI per Tx</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5 border-b" style={{ borderColor: '#eaeef2' }}>
            <span style={{ color: '#57606a' }}>Authorized protocol</span>
            <span className="font-medium text-[#1f2328]">DeepBook Protocol</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5" style={{ background: '#f6f8fa' }}>
            <span style={{ color: '#57606a' }}>Expiry duration</span>
            <span className="font-medium text-[#1f2328]">24 hours</span>
          </div>
        </div>

        <button
          onClick={handleAttach}
          disabled={txStatus === 'loading' || txStatus === 'success'}
          className="w-full h-10 rounded-md text-[14px] font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: txStatus === 'success' ? '#1a7f37' : '#0969da' }}
          onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0550ae'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = txStatus === 'success' ? '#1a7f37' : '#0969da'; }}
        >
          {txStatus === 'loading' ? 'Attaching on Sui…' : txStatus === 'success' ? '✓ Attached — advancing…' : 'Attach permission capsule'}
        </button>

        <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />

        {txStatus === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 rounded-md"
            style={{ background: '#dafbe1', border: '1px solid rgba(26,127,55,0.25)' }}>
            <CheckCircleIcon className="w-4 h-4 text-[#1a7f37] shrink-0" strokeWidth={2} />
            <p className="text-[13px] font-medium" style={{ color: '#1a7f37' }}>
              Capsule attached. Proceeding to authorized execution…
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}