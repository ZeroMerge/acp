import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Permission } from '../../constants/permissions';
import { useTransactions } from '../../hooks/useTransactions';
import PermissionGrid from '../ui/PermissionGrid';
import TransactionFeedback from '../ui/TransactionFeedback';

interface MintAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = ['Name', 'Permissions', 'Spend Limits', 'Expiry', 'Review'];
const EXPIRY_LABELS = ['1 hour', '24 hours', '7 days', '30 days'];
const EXPIRY_VALUES = [1, 24, 168, 720];

export default function MintAgentModal({ isOpen, onClose, onSuccess }: MintAgentModalProps) {
  const currentAccount = useCurrentAccount();
  const { mintAgentIdentity } = useTransactions();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([]);
  const [spendPerTx, setSpendPerTx] = useState(20);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [lifetimeLimit, setLifetimeLimit] = useState(1000);
  const [expiryHours, setExpiryHours] = useState(24);
  const [agentAddress, setAgentAddress] = useState(currentAccount?.address ?? '');
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);

  const togglePerm = useCallback((perm: Permission) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  }, []);

  const reset = () => {
    setStep(1); setName(''); setSelectedPerms([]);
    setSpendPerTx(20); setDailyLimit(100); setLifetimeLimit(1000); setExpiryHours(24);
    setAgentAddress(currentAccount?.address ?? '');
    setTxStatus('idle'); setTxDigest(''); setTxError(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!agentAddress) return;
    setTxStatus('loading');
    try {
      const result = await mintAgentIdentity(name || 'Unnamed Agent', agentAddress);
      setTxStatus('success');
      setTxDigest(result.digest);
      onSuccess();
    } catch (err: any) {
      setTxStatus('error');
      setTxError(err?.message ?? 'Transaction failed');
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%', height: '32px', padding: '0 12px',
    fontSize: '14px', outline: 'none', transition: 'all 0.15s',
    background: '#ffffff', border: '1px solid #d0d7de',
    borderRadius: '6px', color: '#1f2328', fontFamily: 'inherit',
    boxShadow: '0 1px 0 rgba(31,35,40,0.04)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(31,35,40,0.5)' }}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-[540px] overflow-hidden"
        style={{
          background: '#ffffff', borderRadius: '12px',
          border: '1px solid #d0d7de',
          boxShadow: '0 1px 3px rgba(31,35,40,0.12), 0 8px 24px rgba(66,74,83,0.12)',
          maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid #d0d7de' }}
        >
          <h2 className="text-[16px] font-semibold" style={{ color: '#1f2328' }}>
            {step === 5 ? 'Review & Deploy' : 'Create New Agent'}
          </h2>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[#f6f8fa]"
            style={{ color: '#6e7781' }}
          >
            <XMarkIcon className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="flex items-center px-5 py-3 gap-1 shrink-0" style={{ borderBottom: '1px solid #eaeef2', background: '#f6f8fa' }}>
          {STEPS.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold transition-colors"
                    style={{
                      background: done ? '#1a7f37' : active ? '#0969da' : '#eaeef2',
                      color: (done || active) ? '#ffffff' : '#57606a',
                    }}
                  >
                    {done ? <CheckIcon className="w-3 h-3" strokeWidth={2.5} /> : s}
                  </div>
                  <span
                    className="text-[11px] font-medium hidden sm:block truncate"
                    style={{ color: active ? '#1f2328' : '#6e7781' }}
                  >
                    {label}
                  </span>
                </div>
                {s < STEPS.length && (
                  <div
                    className="flex-1 h-px mx-2 shrink-0"
                    style={{ background: done ? '#1a7f37' : '#d0d7de' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* Step 1 — Name */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#1f2328' }}>
                  Agent name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  maxLength={50}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. LiveTradingAgent_01"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#0969da'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,218,0.3)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#d0d7de'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(31,35,40,0.04)'; }}
                />
                <p className="mt-1.5 text-[12px]" style={{ color: '#6e7781' }}>{name.length}/50</p>
              </motion.div>
            )}

            {/* Step 2 — Permissions */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <p className="text-[12px] font-semibold mb-3" style={{ color: '#1f2328' }}>Select permissions</p>
                <PermissionGrid selectable selected={selectedPerms} onToggle={togglePerm} showMeters={false} />
              </motion.div>
            )}

            {/* Step 3 — Spend Limits */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="space-y-5">
                <p className="text-[12px] font-semibold" style={{ color: '#1f2328' }}>Spend limits (SUI)</p>
                {[
                  { label: 'Max per transaction', value: spendPerTx, set: setSpendPerTx },
                  { label: 'Daily limit', value: dailyLimit, set: setDailyLimit },
                  { label: 'Lifetime limit', value: lifetimeLimit, set: setLifetimeLimit },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <label className="block text-[13px] mb-1.5" style={{ color: '#57606a' }}>{label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min={0.1} max={1000} step={0.1} value={value}
                        onChange={e => set(parseFloat(e.target.value))}
                        className="flex-1 accent-[#0969da]"
                      />
                      <input
                        type="number" min={0.1} max={1000} step={0.1} value={value}
                        onChange={e => set(Math.max(0.1, Math.min(1000, parseFloat(e.target.value) || 0)))}
                        style={{ ...inputStyle, width: '80px', textAlign: 'right', fontFamily: 'monospace' }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#0969da'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,218,0.3)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#d0d7de'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(31,35,40,0.04)'; }}
                      />
                      <span className="text-[12px] font-medium w-8 shrink-0" style={{ color: '#6e7781' }}>SUI</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 4 — Expiry */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <p className="text-[12px] font-semibold mb-3" style={{ color: '#1f2328' }}>Expiry duration</p>
                <div className="grid grid-cols-2 gap-2">
                  {EXPIRY_VALUES.map((hrs, i) => {
                    const sel = expiryHours === hrs;
                    return (
                      <button
                        key={hrs}
                        onClick={() => setExpiryHours(hrs)}
                        className="px-4 py-3 rounded-md text-[13px] font-medium text-left transition-all"
                        style={{
                          background: sel ? '#ddf4ff' : '#f6f8fa',
                          border: `1px solid ${sel ? '#0969da' : '#d0d7de'}`,
                          color: sel ? '#0969da' : '#1f2328',
                        }}
                      >
                        {EXPIRY_LABELS[i]}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 5 — Review */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="space-y-4">
                <div className="rounded-md overflow-hidden border divide-y text-[13px]" style={{ borderColor: '#d0d7de' }}>
                  {[
                    { l: 'Name',           v: name || 'Unnamed', mono: false },
                    { l: 'Permissions',    v: `${selectedPerms.length} selected`, mono: false },
                    { l: 'Per-tx limit',   v: `${spendPerTx} SUI`, mono: true },
                    { l: 'Daily limit',    v: `${dailyLimit} SUI`, mono: true },
                    { l: 'Expiry',         v: `${expiryHours}h`, mono: true },
                  ].map(({ l, v, mono }, idx) => (
                    <div
                      key={l}
                      className="flex justify-between items-center px-3 py-2.5"
                      style={{ background: idx % 2 === 0 ? '#ffffff' : '#f6f8fa' }}
                    >
                      <span style={{ color: '#57606a' }}>{l}</span>
                      <span
                        className={`font-medium ${mono ? 'font-mono' : ''}`}
                        style={{ color: '#1f2328' }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-1.5" style={{ color: '#1f2328' }}>
                    Agent address
                  </label>
                  <input
                    type="text"
                    value={agentAddress}
                    onChange={e => setAgentAddress(e.target.value)}
                    style={{ ...inputStyle, height: '36px', fontFamily: 'monospace', fontSize: '12px' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#0969da'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,218,0.3)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#d0d7de'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(31,35,40,0.04)'; }}
                  />
                </div>
                <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid #eaeef2' }}>
            <button
              onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
              className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] font-medium transition-colors"
              style={{ background: '#f6f8fa', border: '1px solid #d0d7de', color: '#57606a' }}
            >
              {step > 1 && <ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={2} />}
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={() => step < 5 ? setStep(step + 1) : handleSubmit()}
              disabled={(step === 1 && !name.trim()) || txStatus === 'loading'}
              className="inline-flex items-center gap-1.5 px-4 py-[5px] rounded-md text-[13px] font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#0969da', border: '1px solid rgba(31,35,40,0.15)' }}
              onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0550ae'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0969da'; }}
            >
              {step === 5 ? (txStatus === 'loading' ? 'Deploying…' : 'Create agent') : 'Continue'}
              {step < 5 && <ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}