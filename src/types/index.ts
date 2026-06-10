export interface AgentIdentityObject {
  id: string;
  owner: string;
  name: string;
  createdEpoch: number;
  actionCount: number;
}

export interface PermissionCapsuleObject {
  id: string;
  agentId: string;
  issuer: string;
  permissions: number[];
  protocolWhitelist: string[];
  spendPerTx: bigint;
  dailyLimit: bigint;
  lifetimeLimit: bigint;
  spentToday: bigint;
  spentTotal: bigint;
  lastResetEpoch: number;
  expiryEpoch: number;
  isExpired: boolean;
  isActive: boolean;
}

export interface ActionEvent {
  id: string;
  type: string;
  agentId: string;
  txDigest: string;
  timestampMs: number;
  data: Record<string, unknown>;
}

export type CapsuleStatus = 'active' | 'expired' | 'revoked' | 'none';

export interface IntegrationConfig {
  name: string;
  description: string;
  permissions: number[];
  adapterId: string | null;
  status: 'live' | 'coming_soon';
  color: string;
}