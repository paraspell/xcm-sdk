import { isNodeEvm } from '@paraspell/sdk-pjs';
import type { TRouterPlan } from '../types';
import { submitTransaction } from '../utils/submitTransaction';
import { type Signer } from '@polkadot/types/types';

type TExecuteRouterPlanOptions = {
  signer: Signer;
  senderAddress: string;
  evmSigner?: Signer;
  evmSenderAddress?: string;
};

export const executeRouterPlan = async (
  plan: TRouterPlan,
  { signer, senderAddress, evmSigner, evmSenderAddress }: TExecuteRouterPlanOptions,
): Promise<void> => {
  for (const { api, tx, node } of plan) {
    if (isNodeEvm(node)) {
      if (!evmSigner || !evmSenderAddress) {
        throw new Error('EVM signer and sender address must be provided for EVM nodes.');
      }

      await submitTransaction(api, tx, evmSigner, evmSenderAddress);
    } else {
      await submitTransaction(api, tx, signer, senderAddress);
    }
  }
};
