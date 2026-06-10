import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFeedback from '../ui/TransactionFeedback';

interface RevokeButtonProps {
  capsuleId: string;
  onSuccess: () => void;
}

export default function RevokeButton({ capsuleId, onSuccess }: RevokeButtonProps) {
  const { revokePermission } = useTransactions();
  const [showConfirm, setShowConfirm] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txError, setTxError] = useState<string | null>(null);

  const handleRevoke = async () => {
    setTxStatus('loading');
    try {
      await revokePermission(capsuleId);
      setTxStatus('success');
      onSuccess();
    } catch (err: any) {
      setTxStatus('error');
      setTxError(err?.message ?? 'Transaction failed');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-5 py-2 rounded-lg border text-[14px] font-medium transition-colors hover:bg-[var(--error-dim)]"
        style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
      >
        Revoke Agent
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="w-full max-w-[420px] rounded-2xl border shadow-modal p-6"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
            >
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                Revoke this agent?
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] mb-6">
                The PermissionCapsule will be permanently deleted. The agent will become structurally incapable of any authorized action.
              </p>

              <TransactionFeedback status={txStatus} error={txError} />

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setTxStatus('idle');
                    setTxError(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg border text-[14px] font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={txStatus === 'loading'}
                  className="flex-1 py-2.5 rounded-lg border text-[14px] font-medium transition-colors disabled:opacity-50 hover:bg-[var(--error-dim)]"
                  style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                >
                  {txStatus === 'loading' ? 'Revoking...' : 'Revoke'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}