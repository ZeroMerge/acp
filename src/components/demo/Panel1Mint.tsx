import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFeedback from '../ui/TransactionFeedback';
import { CheckCircleIcon, CpuChipIcon } from '@heroicons/react/24/outline';

interface Panel1MintProps {
  onComplete: (agentId: string) => void;
}

export default function Panel1Mint({ onComplete }: Panel1MintProps) {
  const currentAccount = useCurrentAccount();
  const { mintAgentIdentity } = useTransactions();
  const [name, setName] = useState('LiveTradingAgent_01');
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const handleMint = async () => {
    if (!currentAccount?.address) return;
    setTxStatus('loading');
    try {
      const result = await mintAgentIdentity(name, currentAccount.address);
      setTxStatus('success');
      setTxDigest(result.digest);
      setTimeout(() => onComplete(result.digest), 2500);
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
            style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}>
            <CpuChipIcon className="w-4 h-4 text-[#0969da]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>Step 1 of 4</p>
            <h2 className="text-[15px] font-semibold" style={{ color: '#1f2328' }}>Mint Agent Identity</h2>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-6 space-y-5">
        <p className="text-[14px] leading-relaxed" style={{ color: '#57606a' }}>
          Deploy a permanent on-chain identity object for your agent. This object is the root of all future permissions and audit trails.
        </p>

        <div>
          <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#1f2328' }}>
            Agent name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={txStatus === 'success'}
            className="w-full h-10 px-3 rounded-md text-[14px] outline-none transition-all"
            style={{ background: '#f6f8fa', border: '1px solid #d0d7de', color: '#1f2328' }}
            onFocus={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#0969da'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,218,0.3)'; }}
            onBlur={e => { e.currentTarget.style.background = '#f6f8fa'; e.currentTarget.style.borderColor = '#d0d7de'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <p className="text-[12px] mt-1" style={{ color: '#6e7781' }}>Stored on-chain as a UTF-8 field on the AgentIdentity object.</p>
        </div>

        <button
          onClick={handleMint}
          disabled={txStatus === 'loading' || txStatus === 'success' || !currentAccount}
          className="w-full h-10 rounded-md text-[14px] font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: txStatus === 'success' ? '#1a7f37' : '#0969da' }}
          onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0550ae'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = txStatus === 'success' ? '#1a7f37' : '#0969da'; }}
        >
          {txStatus === 'loading' ? 'Minting on Sui…' : txStatus === 'success' ? '✓ Minted — advancing…' : 'Mint agent identity'}
        </button>

        <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />

        {txStatus === 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 rounded-md"
            style={{ background: '#dafbe1', border: '1px solid rgba(26,127,55,0.25)' }}>
            <CheckCircleIcon className="w-4 h-4 text-[#1a7f37] shrink-0" strokeWidth={2} />
            <p className="text-[13px] font-medium" style={{ color: '#1a7f37' }}>
              Agent identity minted. Proceeding to capsule…
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}