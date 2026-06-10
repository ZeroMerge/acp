import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const suiToMist = (sui: number): bigint => BigInt(Math.round(sui * 1_000_000_000));

export const mistToSui = (mist: bigint): number => Number(mist) / 1_000_000_000;

export const formatSui = (mist: bigint): string => {
  const val = mistToSui(mist);
  return val < 0.01 ? `${val.toFixed(6)} SUI` : `${val.toFixed(4)} SUI`;
};

export const truncateAddress = (addr: string, chars = 6): string =>
  `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;

export const suiscanTxUrl = (digest: string): string =>
  `https://suiscan.xyz/testnet/tx/${digest}`;

export const suiscanObjectUrl = (id: string): string =>
  `https://suiscan.xyz/testnet/object/${id}`;

export const suiscanAddressUrl = (addr: string): string =>
  `https://suiscan.xyz/testnet/account/${addr}`;

export const epochToDate = (epoch: number): Date => new Date(epoch * 24 * 60 * 60 * 1000);

export const bytesToString = (bytes: number[]): string =>
  new TextDecoder().decode(new Uint8Array(bytes));

export const formatRelativeTime = (timestampMs: number): string => {
  const diff = Date.now() - timestampMs;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const formatCountdown = (expiryEpoch: number): string => {
  const nowMs = Date.now();
  const expiryMs = expiryEpoch * 24 * 60 * 60 * 1000;
  const diff = expiryMs - nowMs;
  if (diff <= 0) return 'EXPIRED';
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export const parseMoveAbortCode = (error: string): number | null => {
  const match = error.match(/MoveAbort\([^,]+,\s*(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
};