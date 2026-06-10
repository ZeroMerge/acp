export const Permission = {
  QUERY: 0,
  SWAP: 1,
  SUPPLY: 2,
  COLLECT: 3,
  STAKE: 4,
  TRANSFER_WHITELIST: 5,
  ORDER: 6,
  DELEGATE: 7,
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface PermissionMetaEntry {
  label: string;
  description: string;
  icon: string;
}

export const PERMISSION_META: Record<number, PermissionMetaEntry> = {
  [Permission.QUERY]:              { label: 'QUERY',     description: 'Read public onchain state',          icon: 'MagnifyingGlassIcon' },
  [Permission.SWAP]:               { label: 'SWAP',      description: 'Token exchange on DEXs',             icon: 'ArrowsRightLeftIcon' },
  [Permission.SUPPLY]:             { label: 'SUPPLY',    description: 'Deposit into lending protocols',     icon: 'ArrowTrendingUpIcon' },
  [Permission.COLLECT]:            { label: 'COLLECT',   description: 'Claim earned yield and rewards',     icon: 'ArrowDownTrayIcon' },
  [Permission.STAKE]:              { label: 'STAKE',     description: 'Native SUI staking operations',      icon: 'LockClosedIcon' },
  [Permission.TRANSFER_WHITELIST]: { label: 'TRANSFER',  description: 'Send to pre-approved addresses',     icon: 'PaperAirplaneIcon' },
  [Permission.ORDER]:              { label: 'ORDER',     description: 'Place orders on DeepBook',           icon: 'BookOpenIcon' },
  [Permission.DELEGATE]:           { label: 'DELEGATE',  description: 'Create sub-agent capsules',          icon: 'ShareIcon' },
};

export const ALL_PERMISSIONS: Permission[] = Object.values(Permission).filter(
  (v): v is Permission => typeof v === 'number'
);

export const PERMISSION_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: 'rgba(107, 104, 96, 0.1)', text: '#6b6860' },
  1: { bg: 'rgba(194, 120, 20, 0.1)', text: '#c27814' },
  2: { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb' },
  3: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  4: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
  5: { bg: 'rgba(220, 38, 38, 0.1)', text: '#dc2626' },
  6: { bg: 'rgba(25, 0, 255, 0.1)', text: '#1900ff' },
  7: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' },
};

export function getPermissionColor(type: number) {
  return PERMISSION_COLORS[type] ?? { bg: 'rgba(0,0,0,0.04)', text: '#6b6860' };
}