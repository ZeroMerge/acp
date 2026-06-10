import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { suiscanTxUrl, parseMoveAbortCode } from '../../lib/utils';

interface TransactionFeedbackProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  digest?: string;
  error?: string | null;
  className?: string;
}

export default function TransactionFeedback({ status, digest, error, className = '' }: TransactionFeedbackProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (digest) {
      navigator.clipboard.writeText(digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`flex items-center gap-3 p-4 rounded-lg border border-[var(--accent-dim)] bg-[var(--accent-dim)] ${className}`}
        >
          <ArrowPathIcon className="w-5 h-5 text-[var(--accent)] animate-spin-slow" />
          <span className="text-[14px] text-[var(--text-secondary)]">Submitting to Sui testnet...</span>
        </motion.div>
      )}

      {status === 'success' && digest && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`p-4 rounded-lg border border-[rgba(25,0,255,0.2)] bg-[var(--accent-dim)] ${className}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <CheckCircleIcon className="w-5 h-5 text-[var(--accent)]" />
            </motion.div>
            <span className="text-[14px] font-medium text-[var(--accent)]">Transaction confirmed</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[12px] text-[var(--text-secondary)]">
            <span>{digest.slice(0, 8)}...{digest.slice(-8)}</span>
            <button onClick={handleCopy} className="p-0.5 hover:bg-[rgba(0,0,0,0.04)] rounded transition-colors">
              {copied ? <CheckIcon className="w-3.5 h-3.5 text-[var(--accent)]" /> : <DocumentDuplicateIcon className="w-3.5 h-3.5" />}
            </button>
            <a
              href={suiscanTxUrl(digest)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              View on Suiscan
            </a>
          </div>
        </motion.div>
      )}

      {status === 'error' && error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`p-4 rounded-lg border border-[rgba(220,38,38,0.2)] bg-[var(--error-dim)] ${className}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -4, 4, -4, 4, 0] }}
              transition={{ duration: 0.4 }}
            >
              <XCircleIcon className="w-5 h-5 text-[var(--error)]" />
            </motion.div>
            <span className="text-[14px] font-medium text-[var(--error)]">Transaction failed</span>
          </div>
          {(() => {
            const abortCode = parseMoveAbortCode(error);
            return abortCode !== null ? (
              <div className="mb-1 font-mono text-[13px] text-[var(--error)]">
                Abort code: {abortCode}
              </div>
            ) : null;
          })()}
          <div className="font-mono text-[12px] text-[var(--text-secondary)] max-h-[120px] overflow-y-auto break-words">
            {error}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}