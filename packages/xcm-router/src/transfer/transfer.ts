import type { TPjsApi } from '@paraspell/sdk-pjs';
import { createApiInstanceForNode } from '@paraspell/sdk-pjs';
import { TransactionType, type TTransferOptions, type TTransferOptionsModified } from '../types';
import { delay } from '../utils/utils';
import { transferToExchange } from './transferToExchange';
import { swap } from './swap';
import { transferToDestination } from './transferToDestination';
import { prepareTransformedOptions } from './utils';
import { createSwapTx } from './createSwapTx';
import { validateTransferOptions } from './utils/validateTransferOptions';

type PlanContext = {
  options: TTransferOptions;
  transformedOptions?: TTransferOptionsModified;
  dex?: any;
  originApi?: TPjsApi;
  swapApi?: TPjsApi;
  swapTx?: any;
  amountOut?: string;
};

type PlanInstruction = {
  id: string;
  execute: (ctx: PlanContext) => Promise<void>;
};

function moveFundsFromOriginToExchange(ctx: PlanContext) {
  const { from, exchangeNode } = ctx.transformedOptions!;
  if (from === exchangeNode) return Promise.resolve();
  return transferToExchange(ctx.transformedOptions!, ctx.originApi!);
}

async function buildInstructions(ctx: PlanContext): Promise<PlanInstruction[]> {
  validateTransferOptions(ctx.options);
  const { evmSigner, evmInjectorAddress, type } = ctx.options;
  if (evmSigner !== undefined && evmInjectorAddress === undefined) {
    throw new Error('evmInjectorAddress is required when evmSigner is provided');
  }
  if (evmInjectorAddress !== undefined && evmSigner === undefined) {
    throw new Error('evmSigner is required when evmInjectorAddress is provided');
  }
  const { options: transformedOptions, dex } = await prepareTransformedOptions(ctx.options);
  ctx.transformedOptions = transformedOptions;
  ctx.dex = dex;
  const { from, to, amount, exchangeNode } = transformedOptions;

  switch (type) {
    case TransactionType.TO_EXCHANGE:
      return [
        {
          id: 'createOriginApi',
          execute: async (context) => {
            context.originApi = await createApiInstanceForNode(from);
          },
        },
        {
          id: 'moveFundsFromOriginToExchange',
          execute: async (context) => {
            await moveFundsFromOriginToExchange(context);
          },
        },
        {
          id: 'disconnectOriginApi',
          execute: async (context) => {
            await context.originApi?.disconnect();
          },
        },
      ];
    case TransactionType.SWAP:
      return [
        {
          id: 'createOriginApi',
          execute: async (context) => {
            context.originApi = await createApiInstanceForNode(from);
          },
        },
        {
          id: 'createSwapApi',
          execute: async (context) => {
            context.swapApi = await context.dex?.createApiInstance();
          },
        },
        {
          id: 'createSwapTx',
          execute: async (context) => {
            const { tx } = await createSwapTx(
              context.originApi!,
              context.swapApi!,
              context.dex,
              context.transformedOptions!,
            );
            context.swapTx = tx;
          },
        },
        {
          id: 'swap',
          execute: async (context) => {
            await swap(context.transformedOptions!, context.swapTx, context.swapApi!);
          },
        },
        {
          id: 'disconnectOriginApi',
          execute: async (context) => {
            await context.originApi?.disconnect();
          },
        },
        {
          id: 'disconnectSwapApi',
          execute: async (context) => {
            await context.swapApi?.disconnect();
          },
        },
      ];
    case TransactionType.TO_DESTINATION:
      return [
        {
          id: 'createSwapApi',
          execute: async (context) => {
            context.swapApi = await context.dex?.createApiInstance();
          },
        },
        {
          id: 'transferToDestination',
          execute: async (context) => {
            if (to !== exchangeNode) {
              await transferToDestination(context.transformedOptions!, amount, context.swapApi!);
            }
          },
        },
        {
          id: 'disconnectSwapApi',
          execute: async (context) => {
            await context.swapApi?.disconnect();
          },
        },
      ];
    default:
      return [
        {
          id: 'createOriginApi',
          execute: async (context) => {
            context.originApi = await createApiInstanceForNode(from);
          },
        },
        {
          id: 'createSwapApi',
          execute: async (context) => {
            context.swapApi = await context.dex?.createApiInstance();
          },
        },
        {
          id: 'moveFundsFromOriginToExchange',
          execute: async (context) => {
            await moveFundsFromOriginToExchange(context);
          },
        },
        {
          id: 'delayBeforeSwap',
          execute: async () => {
            await delay(1000);
          },
        },
        {
          id: 'createSwapTx',
          execute: async (context) => {
            const { tx, amountOut } = await createSwapTx(
              context.originApi!,
              context.swapApi!,
              context.dex,
              context.transformedOptions!,
            );
            context.swapTx = tx;
            context.amountOut = amountOut;
          },
        },
        {
          id: 'swap',
          execute: async (context) => {
            await swap(context.transformedOptions!, context.swapTx, context.swapApi!);
          },
        },
        {
          id: 'delayAfterSwap',
          execute: async () => {
            await delay(1000);
          },
        },
        {
          id: 'transferToDestination',
          execute: async (context) => {
            if (to !== exchangeNode) {
              await transferToDestination(
                context.transformedOptions!,
                context.amountOut!,
                context.swapApi!,
              );
            }
          },
        },
        {
          id: 'disconnectOriginApi',
          execute: async (context) => {
            await context.originApi?.disconnect();
          },
        },
        {
          id: 'disconnectSwapApi',
          execute: async (context) => {
            await context.swapApi?.disconnect();
          },
        },
      ];
  }
}

export function createRoutePlan(options: TTransferOptions) {
  const context: PlanContext = { options };
  let instructions: PlanInstruction[] = [];
  return {
    async initialize() {
      instructions = await buildInstructions(context);
    },
    getInstructions() {
      return instructions;
    },
    getContext() {
      return context;
    },
  };
}

export async function executeRoutePlan(instructions: PlanInstruction[], context: PlanContext) {
  for (const step of instructions) {
    await step.execute(context);
  }
}

export async function transfer(options: TTransferOptions): Promise<void> {
  const routePlan = createRoutePlan(options);
  await routePlan.initialize();
  const instructions = routePlan.getInstructions();
  const context = routePlan.getContext();
  await executeRoutePlan(instructions, context);
}
