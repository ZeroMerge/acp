import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFeedback from '../ui/TransactionFeedback';
import { parseMoveAbortCode, suiscanTxUrl } from '../../lib/utils';

interface Panel4RejectionProps {
  capsuleId: string;
}

export default function Panel4Rejection({ capsuleId }: Panel4RejectionProps) {
  const { executeUnauthorizedTransfer } = useTransactions();
  const [txStatus, setTxStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [showRejection, setShowRejection] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const abortCodeRef = useRef<number | null>(null);

  const handleAttempt = async () => {
    if (!capsuleId) return;
    setTxStatus('loading');
    setShowRejection(false);
    setShowExplanation(false);
    setShowLink(false);
    setTxDigest('');

    try {
      await executeUnauthorizedTransfer(capsuleId);
      // If it succeeds unexpectedly, still show error state
      setTxStatus('error');
      setTxError('Transaction succeeded unexpectedly');
    } catch (err: any) {
      const errorMsg = err?.message ?? 'Transaction failed';
      abortCodeRef.current = parseMoveAbortCode(errorMsg);
      setTxStatus('error');
      setTxError(errorMsg);
      if (err.digest) {
        setTxDigest(err.digest);
      }

      // THE REJECTION MOMENT
      setTimeout(() => {
        setShowRejection(true);

        // 3-second pause before explanation
        setTimeout(() => {
          setShowExplanation(true);

          // Show link after explanation
          setTimeout(() => {
            setShowLink(true);
          }, 1000);
        }, 2000);
      }, 500); // 500ms dramatic pause
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: '#ffffff',
        border: `1px solid ${showRejection ? '#cf222e' : '#d0d7de'}`,
        boxShadow: '0 1px 3px rgba(31,35,40,0.08)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Red glow overlay on rejection */}
      <AnimatePresence>
        {showRejection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(207,34,46,0.08)' }}
          />
        )}
      </AnimatePresence>

      {/* Shake animation wrapper */}
      <motion.div
        animate={showRejection ? { x: [0, -6, 6, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: '#eaeef2', background: '#f6f8fa' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#ffebe9', border: '1px solid rgba(207,34,46,0.15)' }}>
              <ExclamationTriangleIcon className="w-4 h-4 text-[#cf222e]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>Step 4 of 4</p>
              <h2 className="text-[15px] font-semibold" style={{ color: '#1f2328' }}>Attempt Unauthorized Transfer</h2>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-6 space-y-5">
          <p className="text-[14px] leading-relaxed" style={{ color: '#57606a' }}>
            The agent tries to transfer tokens to an external wallet. Because this action is <strong>not</strong> granted in its permission capsule, the Sui Move runtime aborts the transaction immediately.
          </p>

          <AnimatePresence>
            {showRejection && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2.5 p-3 rounded-md"
                  style={{ background: '#ffebe9', border: '1px solid rgba(207,34,46,0.25)' }}>
                  <XCircleIcon className="w-5 h-5 text-[#cf222e] shrink-0" strokeWidth={2} />
                  <p className="text-[13px] font-bold text-[#cf222e] uppercase tracking-wider">
                    On-chain execution blocked
                  </p>
                </div>

                {txError && (
                  <div className="p-3 rounded-md border font-mono text-[12px]" style={{ background: '#f6f8fa', borderColor: '#d0d7de', color: '#1f2328' }}>
                    <p className="text-[#cf222e]">
                      {abortCodeRef.current !== null
                        ? `MoveAbort(location, ${abortCodeRef.current})`
                        : txError.slice(0, 150)}
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="p-3 rounded-md border text-[13px] leading-relaxed"
                      style={{ background: '#fff8c5', borderColor: 'rgba(154,103,0,0.25)', color: '#9a6700' }}
                    >
                      <strong>Enforcement Layer:</strong> This rejection is enforced by Sui&apos;s smart contract type system itself, not by frontend client-side validation logic. It is mathematically impossible for the agent to bypass this.
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showLink && txDigest && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-1 text-center"
                    >
                      <a
                        href={suiscanTxUrl(txDigest)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0969da] hover:underline"
                      >
                        View failed transaction on Suiscan →
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {!showRejection && (
            <button
              onClick={handleAttempt}
              disabled={txStatus === 'loading'}
              className="w-full h-10 rounded-md text-[14px] font-semibold transition-colors disabled:opacity-50"
              style={{
                border: '1px solid #cf222e',
                color: '#cf222e',
                background: 'transparent',
              }}
              onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) { e.currentTarget.style.background = '#ffebe9'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {txStatus === 'loading' ? 'Simulating transfer…' : 'Trigger unauthorized transfer'}
            </button>
          )}

          <div className="mt-2">
            <TransactionFeedback status={txStatus} digest={txDigest} error={txError} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}