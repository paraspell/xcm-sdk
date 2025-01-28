import type { TPjsApi } from '@paraspell/sdk-pjs';
import type { TRouterPlan } from '../types';
import { TransactionType, type TBuildTransactionsOptions } from '../types';
import {
  buildFromExchangeExtrinsic,
  buildToExchangeExtrinsic,
  prepareTransformedOptions,
} from './utils';
import { validateTransferOptions } from './utils/validateTransferOptions';
import { createSwapTx } from './createSwapTx';

export const buildTransactions = async (
  originApi: TPjsApi,
  swapApi: TPjsApi,
  initialOptions: TBuildTransactionsOptions,
): Promise<TRouterPlan> => {
  validateTransferOptions(initialOptions);

  const { options, dex } = await prepareTransformedOptions(initialOptions);

  const { from, to, exchangeNode } = options;

  const transactions: TRouterPlan = [];

  const toExchangeTx =
    from !== exchangeNode ? await buildToExchangeExtrinsic(originApi, options) : undefined;

  const { tx: swapTx, amountOut } = await createSwapTx(originApi, swapApi, dex, options);

  const toDestTx =
    to !== exchangeNode ? await buildFromExchangeExtrinsic(swapApi, options, amountOut) : undefined;

  if (toExchangeTx) {
    transactions.push({
      api: originApi,
      node: from,
      destinationNode: exchangeNode,
      tx: toExchangeTx,
      statusType: TransactionType.TRANSFER,
    });
  }

  transactions.push({
    api: swapApi,
    node: dex.node,
    tx: swapTx,
    statusType: TransactionType.SWAP,
  });

  if (toDestTx) {
    transactions.push({
      api: swapApi,
      node: dex.node,
      destinationNode: to,
      tx: toDestTx,
      statusType: TransactionType.TRANSFER,
    });
  }

  return transactions;
};
