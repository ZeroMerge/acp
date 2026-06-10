import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import type { ActionEvent } from '../types';
import { PACKAGE_ID } from '../constants/package';

export function useAgentHistory(agentId: string) {
  const client = useSuiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agentHistory', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      const result = await client.queryEvents({
        query: { MoveModule: { package: PACKAGE_ID, module: 'permission_capsule' } },
        limit: 50,
        order: 'descending',
      });
      return result.data
        .filter((e) => {
          const parsed = e.parsedJson as any;
          return parsed?.agent_id === agentId || parsed?.capsule_id !== undefined;
        })
        .map((e): ActionEvent => ({
          id: e.id.txDigest + e.id.eventSeq,
          type: e.type.split('::').pop() ?? e.type,
          agentId: (e.parsedJson as any)?.agent_id ?? agentId,
          txDigest: e.id.txDigest,
          timestampMs: Number(e.timestampMs ?? 0),
          data: e.parsedJson as Record<string, unknown>,
        }));
    },
    enabled: !!agentId,
    refetchInterval: 10000,
  });

  return { events: data ?? [], isLoading, error, refetch };
}