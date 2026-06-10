import { useState, useEffect } from 'react';
import { formatCountdown } from '../../lib/utils';

interface CountdownTimerProps {
  expiryEpoch: number;
  className?: string;
}

export default function CountdownTimer({ expiryEpoch, className = '' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => formatCountdown(expiryEpoch));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatCountdown(expiryEpoch));
    }, 60000);
    return () => clearInterval(interval);
  }, [expiryEpoch]);

  const isExpired = remaining === 'EXPIRED';
  const isUrgent = !isExpired && remaining.includes('h') && !remaining.includes('d');

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[12px] ${className}`}>
      {isExpired ? (
        <span className="text-[var(--text-error)] font-medium">EXPIRED</span>
      ) : (
        <>
          <span className={isUrgent ? 'text-[var(--text-warning)]' : 'text-[var(--text-secondary)]'}>
            {remaining}
          </span>
          {isUrgent && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-warning)] animate-blink" />
          )}
        </>
      )}
    </span>
  );
}