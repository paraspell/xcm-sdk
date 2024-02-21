// Unit tests for general utils

import { type Extrinsic, InvalidCurrencyError, createApiInstanceForNode } from '@paraspell/sdk';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  calculateTransactionFee,
  delay,
  maybeUpdateTransferStatus,
  validateRelayChainCurrency,
} from './utils';
import BigNumber from 'bignumber.js';
import {
  type TTxProgressInfo,
  TransactionStatus,
  TransactionType,
  type TSwapResult,
  type TTransferOptionsModified,
} from '../types';
import type ExchangeNode from '../dexNodes/DexNode';
import { buildFromExchangeExtrinsic, buildToExchangeExtrinsic } from '../transfer/utils';

describe('validateRelayChainCurrency', () => {
  it('should not throw an error for valid Polkadot currency', () => {
    expect(() => {
      validateRelayChainCurrency('Polkadot', 'DOT');
    }).not.toThrow();
  });

  it('should not throw an error for valid Kusama currency', () => {
    expect(() => {
      validateRelayChainCurrency('Kusama', 'KSM');
    }).not.toThrow();
  });

  it('should throw an InvalidCurrencyError for invalid Polkadot currency', () => {
    expect(() => {
      validateRelayChainCurrency('Polkadot', 'XYZ');
    }).toThrow(InvalidCurrencyError);
    expect(() => {
      validateRelayChainCurrency('Polkadot', 'XYZ');
    }).toThrow('Invalid currency for Polkadot');
  });

  it('should throw an InvalidCurrencyError for invalid Kusama currency', () => {
    expect(() => {
      validateRelayChainCurrency('Kusama', 'XYZ');
    }).toThrow(InvalidCurrencyError);
    expect(() => {
      validateRelayChainCurrency('Kusama', 'XYZ');
    }).toThrow('Invalid currency for Kusama');
  });
});

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should wait for the specified amount of time', async () => {
    const ms = 1000;
    const promise = delay(ms);
    vi.advanceTimersByTime(ms);
    await expect(promise).resolves.toBeUndefined();
  });
});

interface RuntimeDispatchInfoMock {
  partialFee: { toString: () => string };
}

class MockExtrinsic {
  async paymentInfo(address: string): Promise<RuntimeDispatchInfoMock> {
    return { partialFee: { toString: () => '1000' } };
  }
}

describe('calculateTransactionFee', () => {
  it('should return the correct transaction fee', async () => {
    const mockTx = new MockExtrinsic();
    const address = 'mockAddress';

    const fee = await calculateTransactionFee(mockTx as Extrinsic, address);

    expect(fee).toBeInstanceOf(BigNumber);
    expect(fee.toString()).toBe('1000');
  });
});

describe('maybeUpdateTransferStatus', () => {
  it('should call onStatusChange with info when onStatusChange is provided', () => {
    const mockOnStatusChange = vi.fn();
    const mockInfo: TTxProgressInfo = {
      type: TransactionType.TO_EXCHANGE,
      hashes: {
        [TransactionType.TO_EXCHANGE]: 'mockHashToExchange',
        [TransactionType.SWAP]: 'mockHashSwap',
        [TransactionType.TO_DESTINATION]: 'mockHashFromExchange',
      },
      status: TransactionStatus.SUCCESS,
    };

    maybeUpdateTransferStatus(mockOnStatusChange, mockInfo);

    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatusChange).toHaveBeenCalledWith(mockInfo);
  });

  it('should not call onStatusChange when it is undefined', () => {
    const mockOnStatusChange = undefined;
    const mockInfo: TTxProgressInfo = {
      type: TransactionType.SWAP,
      status: TransactionStatus.IN_PROGRESS,
    };

    expect(() => {
      maybeUpdateTransferStatus(mockOnStatusChange, mockInfo);
    }).not.toThrow();
  });
});

export const MOCK_ADDRESS = '5F5586mfsnM6durWRLptYt3jSUs55KEmahdodQ5tQMr9iY96';
export const MOCK_SLIIPPAGE = '1';

export const MOCK_TRANSFER_OPTIONS: TTransferOptionsModified = {
  from: 'Astar',
  exchange: 'HydraDX',
  to: 'Moonbeam',
  currencyFrom: 'ASTR',
  currencyTo: 'GLMR',
  amount: '10000000000000000000',
  slippagePct: '1',
  injectorAddress: MOCK_ADDRESS,
  recipientAddress: MOCK_ADDRESS,
  signer: {},
  type: TransactionType.FULL_TRANSFER,
};

export const performSwap = async (
  options: TTransferOptionsModified,
  dex: ExchangeNode,
): Promise<TSwapResult> => {
  const originApi = await createApiInstanceForNode(options.from);
  const swapApi = await dex.createApiInstance();
  const toDestTx = await buildFromExchangeExtrinsic(swapApi, options, options.amount);
  const toExchangeTx = await buildToExchangeExtrinsic(originApi, options);
  const toDestTransactionFee = await calculateTransactionFee(toDestTx, options.injectorAddress);
  const toExchangeTransactionFee = await calculateTransactionFee(
    toExchangeTx,
    options.injectorAddress,
  );
  return await dex.swapCurrency(swapApi, options, toDestTransactionFee, toExchangeTransactionFee);
};
