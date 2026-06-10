import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { PERMISSION_CAPSULE_TYPE } from '../constants/package';
import type { PermissionCapsuleObject } from '../types';

export function usePermissionCapsule(agentId: string, overrideOwner?: string) {
  const currentAccount = useCurrentAccount();
  const owner = overrideOwner ?? currentAccount?.address;

  const { data, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: owner ?? '',
      filter: { StructType: PERMISSION_CAPSULE_TYPE },
      options: { showContent: true },
    },
    { enabled: !!owner && !!agentId }
  );

  const allCapsules = data?.data ?? [];
  const match = allCapsules.find((obj) => {
    const fields = (obj.data?.content as any)?.fields;
    return fields?.agent_id === agentId;
  });

  let capsule: PermissionCapsuleObject | null = null;
  if (match) {
    const fields = (match.data?.content as any)?.fields;
    const expiryEpoch = Number(fields?.expiry_epoch ?? 0);
    const nowEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const isExpired = expiryEpoch > 0 && nowEpoch > expiryEpoch;
    capsule = {
      id: match.data?.objectId ?? '',
      agentId: fields?.agent_id ?? '',
      issuer: fields?.issuer ?? '',
      permissions: fields?.permissions ?? [],
      protocolWhitelist: fields?.protocol_whitelist ?? [],
      spendPerTx: BigInt(fields?.spend_per_tx ?? 0),
      dailyLimit: BigInt(fields?.daily_limit ?? 0),
      lifetimeLimit: BigInt(fields?.lifetime_limit ?? 0),
      spentToday: BigInt(fields?.spent_today ?? 0),
      spentTotal: BigInt(fields?.spent_total ?? 0),
      lastResetEpoch: Number(fields?.last_reset_epoch ?? 0),
      expiryEpoch,
      isExpired,
      isActive: !isExpired,
    };
  }

  return {
    capsule,
    isLoading,
    error,
    refetch,
    hasCapsule: !!capsule,
    isExpired: capsule?.isExpired ?? false,
    isActive: capsule?.isActive ?? false,
  };
}