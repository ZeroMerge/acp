import { useState, useCallback } from 'react';
import { DocumentDuplicateIcon, ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { truncateAddress, suiscanObjectUrl, suiscanAddressUrl, suiscanTxUrl } from '../../lib/utils';

interface AddressDisplayProps {
  address: string;
  chars?: number;
  showCopy?: boolean;
  showLink?: boolean;
  type?: 'object' | 'address' | 'tx';
  className?: string;
}

export default function AddressDisplay({
  address,
  chars = 6,
  showCopy = true,
  showLink = true,
  type = 'object',
  className = '',
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [address]);

  const getUrl = () => {
    switch (type) {
      case 'tx': return suiscanTxUrl(address);
      case 'address': return suiscanAddressUrl(address);
      default: return suiscanObjectUrl(address);
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[13px] text-[var(--text-secondary)] ${className}`}>
      <span>{truncateAddress(address, chars)}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-0.5 rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors"
          title="Copy address"
        >
          {copied ? (
            <CheckIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
          ) : (
            <DocumentDuplicateIcon className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" />
          )}
        </button>
      )}
      {showLink && (
        <a
          href={getUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-0.5 rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors"
          title="View on Suiscan"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" />
        </a>
      )}
    </span>
  );
}