import type { IntegrationConfig } from '../types';
import { PACKAGE_ID } from '../constants/package';

export const INTEGRATIONS: IntegrationConfig[] = [
  {
    name: 'DeepBook',
    description: "Sui's native central limit order book. Place and manage limit orders with ACP authorization.",
    permissions: [6], // ORDER
    adapterId: PACKAGE_ID,
    status: 'live',
    color: '#4f9cf9',
  },
  {
    name: 'NAVI Protocol',
    description: 'Leading lending and borrowing protocol on Sui.',
    permissions: [2, 3], // SUPPLY, COLLECT
    adapterId: null,
    status: 'coming_soon',
    color: '#9b59b6',
  },
  {
    name: 'Cetus',
    description: 'Concentrated liquidity DEX on Sui.',
    permissions: [1], // SWAP
    adapterId: null,
    status: 'coming_soon',
    color: '#27ae60',
  },
  {
    name: 'Scallop',
    description: 'Institutional-grade lending on Sui.',
    permissions: [2, 3], // SUPPLY, COLLECT
    adapterId: null,
    status: 'coming_soon',
    color: '#e67e22',
  },
];

export const PROTOCOL_NAMES: Record<string, string> = {
  '0xdeepbook': 'DeepBook',
  'deepbook': 'DeepBook',
  '0xnavi': 'NAVI Protocol',
  'navi': 'NAVI Protocol',
  '0xcetus': 'Cetus',
  'cetus': 'Cetus',
  '0xscallop': 'Scallop',
  'scallop': 'Scallop',
};