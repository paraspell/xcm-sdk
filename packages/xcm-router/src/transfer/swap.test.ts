import { vi, describe, it, expect, beforeAll, beforeEach, type MockInstance } from 'vitest';
import * as transferUtils from './utils';
import * as utils from '../utils/utils';
import { type ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { swap } from './swap';
import { type Extrinsic } from '@paraspell/sdk-pjs';
import type { TTransferOptionsModified } from '../types';
import { MOCK_TRANSFER_OPTIONS } from '../utils/testUtils';

describe('swap', () => {
  let options: TTransferOptionsModified;
  let mockSwapApi: ApiPromise;
  let mockTxHash: string;
  let mockFee: BigNumber;
  let extrinsicMock: Extrinsic;
  let submitSpy: MockInstance, statusSpy: MockInstance;

  beforeAll(() => {
    mockSwapApi = {} as ApiPromise;
    mockTxHash = 'mockTxHash';
    mockFee = new BigNumber(0);

    submitSpy = vi.spyOn(transferUtils, 'submitSwap').mockResolvedValue(mockTxHash);
    statusSpy = vi.spyOn(utils, 'maybeUpdateTransferStatus').mockResolvedValue();
    vi.spyOn(utils, 'calculateTransactionFee').mockResolvedValue(mockFee);
    vi.spyOn(transferUtils, 'buildFromExchangeExtrinsic').mockResolvedValue({} as Extrinsic);
    vi.spyOn(transferUtils, 'buildToExchangeExtrinsic').mockResolvedValue({} as Extrinsic);
  });

  beforeEach(() => {
    options = { ...MOCK_TRANSFER_OPTIONS, onStatusChange: vi.fn() };
    extrinsicMock = {
      signAsync: vi.fn().mockResolvedValue('signedTx'),
      send: vi.fn().mockResolvedValue('sentTx'),
    } as unknown as Extrinsic;
  });

  it('updates status and returns transaction hash on successful swap', async () => {
    const txHash = await swap(options, extrinsicMock, mockSwapApi);

    expect(statusSpy).toHaveBeenCalledWith(expect.any(Function), {
      type: 'SWAP',
      status: 'IN_PROGRESS',
    });
    expect(statusSpy).toHaveBeenCalledWith(expect.any(Function), {
      type: 'SWAP',
      hashes: { SWAP: mockTxHash },
      status: 'SUCCESS',
    });
    expect(submitSpy).toHaveBeenCalledWith(
      mockSwapApi,
      options,
      expect.objectContaining({
        signAsync: expect.any(Function),
        send: expect.any(Function),
      }),
    );
    expect(txHash).toBe(mockTxHash);
  });
});
