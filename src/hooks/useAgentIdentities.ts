import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { AGENT_IDENTITY_TYPE } from '../constants/package';
import type { AgentIdentityObject } from '../types';
import { bytesToString } from '../lib/utils';

export function useAgentIdentities(overrideAddress?: string) {
  const currentAccount = useCurrentAccount();
  const address = overrideAddress ?? currentAccount?.address;

  const { data, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: address ?? '',
      filter: { StructType: AGENT_IDENTITY_TYPE },
      options: { showContent: true, showType: true },
    },
    { enabled: !!address }
  );

  const agents: AgentIdentityObject[] = (data?.data ?? []).map((obj) => {
    const fields = (obj.data?.content as any)?.fields;
    return {
      id: obj.data?.objectId ?? '',
      owner: fields?.owner ?? '',
      name: Array.isArray(fields?.name) ? bytesToString(fields.name) : fields?.name ?? '',
      createdEpoch: Number(fields?.created_epoch ?? 0),
      actionCount: Number(fields?.action_count ?? 0),
    };
  });

  return { agents, isLoading, error, refetch };
}