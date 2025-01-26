// Unit tests for buildTransferExtrinsics function

import { describe, it, expect, vi, type MockInstance, beforeEach, afterEach } from 'vitest';
import * as utils from '../utils/utils';
import * as transferUtils from './utils';
import * as selectBestExchange from './selectBestExchange';
import { buildTransferExtrinsics } from './buildTransferExtrinsics';
import type { TBuildTransferExtrinsicsOptions } from '../types';
import { TransactionType } from '../types';
import type ExchangeNode from '../dexNodes/DexNode';
import type { Extrinsic } from '@paraspell/sdk-pjs';
import { createApiInstanceForNode, buildEthTransferOptions } from '@paraspell/sdk-pjs';
import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { MOCK_TRANSFER_OPTIONS } from '../utils/testUtils';
import { createDexNodeInstance } from '../dexNodes/DexNodeFactory';

vi.mock('@paraspell/sdk-pjs', async () => {
  const actual = await vi.importActual('@paraspell/sdk-pjs');
  return {
    ...actual,
    createApiInstanceForNode: vi.fn().mockResolvedValue({
      disconnect: () => {},
    }),
    buildEthTransferOptions: vi.fn(),
  };
});

vi.mock('../dexNodes/DexNodeFactory', () => ({
  createDexNodeInstance: vi.fn(),
}));

describe('buildTransferExtrinsics', () => {
  let fromExchangeTxSpy: MockInstance,
    toExchangeTxSpy: MockInstance,
    feeSpy: MockInstance,
    validateSpy: MockInstance;

  beforeEach(() => {
    fromExchangeTxSpy = vi
      .spyOn(transferUtils, 'buildFromExchangeExtrinsic')
      .mockResolvedValue({} as Extrinsic);
    toExchangeTxSpy = vi
      .spyOn(transferUtils, 'buildToExchangeExtrinsic')
      .mockResolvedValue({} as Extrinsic);

    feeSpy = vi.spyOn(utils, 'calculateTransactionFee').mockResolvedValue(BigNumber(100));
    validateSpy = vi.spyOn(utils, 'validateRelayChainCurrency').mockResolvedValue();
    vi.mocked(createDexNodeInstance).mockReturnValue({
      node: 'Acala',
      exchangeNode: 'AcalaDex',
      createApiInstance: vi.fn().mockResolvedValue({
        disconnect: () => {},
      }),
      swapCurrency: vi.fn().mockResolvedValue({}),
    } as unknown as ExchangeNode);

    vi.mocked(buildEthTransferOptions).mockResolvedValue({
      token: 'token123',
      destinationParaId: 1000,
      destinationFee: 500n,
      amount: 1000n,
      fee: 100n,
    });

    vi.mocked(createApiInstanceForNode).mockResolvedValue({
      disconnect: async () => {},
    } as ApiPromise);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should build transfer extrinsics correctly - manual exchange selection', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
    };
    const result = await buildTransferExtrinsics(options);

    expect(result).toBeDefined();
    expect(result).toHaveLength(3);
    expect(createApiInstanceForNode).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(feeSpy).toHaveBeenCalledTimes(2);
    expect(fromExchangeTxSpy).toHaveBeenCalledTimes(2);
    expect(toExchangeTxSpy).toHaveBeenCalled();
  });

  it('should build transfer extrinsics correctly - manual exchange selection', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      from: 'Hydration',
      currencyFrom: { symbol: 'WETH' },
    };
    const result = await buildTransferExtrinsics(options);

    expect(result).toBeDefined();
    expect(result).toHaveLength(3);
    expect(createApiInstanceForNode).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(feeSpy).toHaveBeenCalledTimes(2);
    expect(fromExchangeTxSpy).toHaveBeenCalledTimes(2);
    expect(toExchangeTxSpy).toHaveBeenCalled();
  });

  it('should build transfer extrinsics correctly - auto exchange selection', async () => {
    const options = {
      ...MOCK_TRANSFER_OPTIONS,
      currencyFrom: { id: '18446744073709551619' },
      currencyTo: { id: '18446744073709551616' },
      exchange: undefined,
    };
    const selectBestExchangeSpy = vi
      .spyOn(selectBestExchange, 'selectBestExchange')
      .mockReturnValue(
        Promise.resolve({
          node: 'Acala',
          createApiInstance: vi.fn().mockResolvedValue({
            disconnect: () => {},
          }),
          swapCurrency: vi.fn().mockResolvedValue({}),
        } as unknown as ExchangeNode),
      );

    const result = await buildTransferExtrinsics(options);

    expect(result).toBeDefined();
    expect(result).toHaveLength(3);
    expect(createApiInstanceForNode).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(selectBestExchangeSpy).toHaveBeenCalledTimes(1);
    expect(feeSpy).toHaveBeenCalledTimes(2);
    expect(fromExchangeTxSpy).toHaveBeenCalledTimes(2);
    expect(toExchangeTxSpy).toHaveBeenCalled();
  });

  it('throws error for invalid EVM injector Ethereum address', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      evmInjectorAddress: 'invalid_eth_address',
    };
    await expect(buildTransferExtrinsics(options)).rejects.toThrow(
      'Evm injector address is not a valid Ethereum address',
    );
  });

  it('throws error when Injector address is an Ethereum address', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      injectorAddress: '0x1501C1413e4178c38567Ada8945A80351F7B8496',
    };
    await expect(buildTransferExtrinsics(options)).rejects.toThrow(
      'Injector address cannot be an Ethereum address. Please use an Evm injector address instead.',
    );
  });

  it('correctly processes transactions based on the specified transaction type', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      type: TransactionType.TO_EXCHANGE,
    };
    const result = await buildTransferExtrinsics(options);
    // Adjust expectations based on mocked responses and expected behavior
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('handles API instance creation failures gracefully', async () => {
    vi.mocked(createApiInstanceForNode).mockRejectedValue(
      new Error('Failed to create API instance'),
    );
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
    };
    await expect(buildTransferExtrinsics(options)).rejects.toThrow('Failed to create API instance');
  });

  it('handles TO_DESTINATION transaction type correctly', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      recipientAddress: '0x1501C1413e4178c38567Ada8945A80351F7B8496',
      exchange: 'AcalaDex',
      currencyTo: { symbol: 'WBTC' },
      from: 'Hydration',
      to: 'Moonbeam',
      type: TransactionType.TO_DESTINATION,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result[0].node).toBe('Acala');
    expect(result[0].type).toBe('EXTRINSIC');
  });

  it('handles TO_DESTINATION transaction type correctly', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      to: 'Hydration',
      type: TransactionType.TO_DESTINATION,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result[0].node).toBe('Acala');
    expect(result[0].type).toBe('EXTRINSIC');
  });

  it('handles TO_EXCHANGE transaction type correctly', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'HydrationDex',
      to: 'Acala',
      from: 'AssetHubPolkadot',
      currencyFrom: { symbol: 'WETH' },
      currencyTo: { symbol: 'WBTC' },
      type: TransactionType.TO_EXCHANGE,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result[0].node).toBe('AssetHubPolkadot');
    expect(result[0].type).toBe('EXTRINSIC');
  });

  it('handles TO_EXCHANGE transaction type correctly', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      to: 'Hydration',
      type: TransactionType.TO_EXCHANGE,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result[0].node).toBe('Astar');
    expect(result[0].type).toBe('EXTRINSIC');
  });

  it('handles SWAP transaction type correctly', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      to: 'Hydration',
      type: TransactionType.SWAP,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result[0].node).toBe('Acala');
    expect(result[0].type).toBe('EXTRINSIC');
  });

  it('skips extrinsic building for transactions already on the exchange', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      from: 'Acala',
      to: 'Hydration',
      type: TransactionType.TO_EXCHANGE,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result).toHaveLength(0);
  });

  it('skips extrinsic building for transactions already on the exchange - FULL_TRANSFER', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      from: 'Acala',
      to: 'Hydration',
      type: TransactionType.FULL_TRANSFER,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result).toHaveLength(2);
  });

  it('skips extrinsic building for transactions already on destination', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      from: 'Hydration',
      to: 'Acala',
      type: TransactionType.TO_DESTINATION,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result).toHaveLength(0);
  });

  it('skips extrinsic building for transactions already on destination - FULL_TRANSFER', async () => {
    const options: TBuildTransferExtrinsicsOptions = {
      ...MOCK_TRANSFER_OPTIONS,
      exchange: 'AcalaDex',
      from: 'Hydration',
      to: 'Acala',
      type: TransactionType.FULL_TRANSFER,
    };
    const result = await buildTransferExtrinsics(options);
    expect(result).toHaveLength(2);
  });
});
