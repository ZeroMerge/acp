import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, CLOCK_OBJECT_ID, DEEPBOOK_ADAPTER_ID } from '../constants/package';
import { suiToMist } from '../lib/utils';

export function useTransactions() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  const execute = async (tx: Transaction) => {
    const result = await signAndExecute({ transaction: tx });
    try {
      await client.waitForTransaction({ digest: result.digest });
      const fullTx = await client.getTransactionBlock({
        digest: result.digest,
        options: { showObjectChanges: true },
      });
      return { digest: result.digest, fullTx };
    } catch (err: any) {
      err.digest = result.digest;
      throw err;
    }
  };

  const mintAgentIdentity = async (name: string, agentAddress: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::agent_identity::mint_agent_identity`,
      arguments: [
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(name))),
        tx.pure.address(agentAddress),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    const { digest, fullTx } = await execute(tx);
    const agentId = (fullTx.objectChanges?.find(
      (change: any) => change.type === 'created' && change.objectType.includes('::agent_identity::AgentIdentity')
    ) as any)?.objectId || '';
    return { digest, agentId };
  };

  const attachPermissionCapsule = async (params: {
    agentId: string;
    permissions: number[];
    protocolWhitelist: string[];
    spendPerTxSui: number;
    dailyLimitSui: number;
    lifetimeLimitSui: number;
    expiryEpoch: number;
  }) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::mint_permission_capsule`,
      arguments: [
        tx.pure.id(params.agentId),
        tx.pure.vector('u8', params.permissions),
        tx.pure.vector('address', params.protocolWhitelist),
        tx.pure.u64(suiToMist(params.spendPerTxSui)),
        tx.pure.u64(suiToMist(params.dailyLimitSui)),
        tx.pure.u64(suiToMist(params.lifetimeLimitSui)),
        tx.pure.u64(params.expiryEpoch),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    const { digest, fullTx } = await execute(tx);
    const capsuleId = (fullTx.objectChanges?.find(
      (change: any) => change.type === 'created' && change.objectType.includes('::permission_capsule::PermissionCapsule')
    ) as any)?.objectId || '';
    return { digest, capsuleId };
  };

  const revokePermission = async (capsuleId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::revoke_permission`,
      arguments: [tx.object(capsuleId)],
    });
    const { digest } = await execute(tx);
    return { digest };
  };

  // Demo: authorized DeepBook trade
  const executeAuthorizedTrade = async (_capsuleId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${DEEPBOOK_ADAPTER_ID}::deepbook_adapter::execute_order`,
      arguments: [
        tx.object(_capsuleId),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  // Demo: unauthorized action — calls a function that will abort
  const executeUnauthorizedTransfer = async (capsuleId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::validate_and_charge`,
      arguments: [
        tx.object(capsuleId),
        tx.pure.u8(5), // TRANSFER_WHITELIST — not in demo capsule
        tx.pure.u64(suiToMist(1)),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  return {
    mintAgentIdentity,
    attachPermissionCapsule,
    revokePermission,
    executeAuthorizedTrade,
    executeUnauthorizedTransfer,
  };
}