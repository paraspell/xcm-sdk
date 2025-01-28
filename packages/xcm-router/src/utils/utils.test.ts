// Unit tests for general utils

import { describe, it, expect, vi } from 'vitest';
import { type Extrinsic, InvalidCurrencyError } from '@paraspell/sdk-pjs';
import { calculateTransactionFee, validateRelayChainCurrency } from './utils';
import BigNumber from 'bignumber.js';
import { type TTxProgressInfo, TransactionStatus, TransactionType } from '../types';

describe('validateRelayChainCurrency', () => {
  it('should not throw an error for valid Polkadot currency', () => {
    expect(() => {
      validateRelayChainCurrency('Polkadot', { symbol: 'DOT' });
    }).not.toThrow();
  });

  it('should not throw an error for valid Kusama currency', () => {
    expect(() => {
      validateRelayChainCurrency('Kusama', { symbol: 'KSM' });
    }).not.toThrow();
  });

  it('should throw an InvalidCurrencyError for invalid Polkadot currency', () => {
    expect(() => {
      validateRelayChainCurrency('Polkadot', { symbol: 'XYZ' });
    }).toThrow(InvalidCurrencyError);
    expect(() => {
      validateRelayChainCurrency('Polkadot', { symbol: 'XYZ' });
    }).toThrow('Invalid currency for Polkadot');
  });

  it('should throw an InvalidCurrencyError for invalid Kusama currency', () => {
    expect(() => {
      validateRelayChainCurrency('Kusama', { symbol: 'XYZ' });
    }).toThrow(InvalidCurrencyError);
    expect(() => {
      validateRelayChainCurrency('Kusama', { symbol: 'XYZ' });
    }).toThrow('Invalid currency for Kusama');
  });
});

interface RuntimeDispatchInfoMock {
  partialFee: { toString: () => string };
}

class MockExtrinsic {
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
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
    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    expect(mockOnStatusChange).toHaveBeenCalledWith(mockInfo);
  });
});
