/* eslint-disable @typescript-eslint/unbound-method */
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { mockRequestObject } from '../testUtils.js';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { TSerializedEthTransfer } from '@paraspell/sdk';
import { XTransferEthController } from './x-transfer-eth.controller.js';
import { XTransferEthService } from './x-transfer-eth.service.js';
import { PatchedXTransferEthDto } from './dto/x-transfer-eth.dto.js';

describe('XTransferEthController', () => {
  let controller: XTransferEthController;
  let service: XTransferEthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XTransferEthController],
      providers: [
        XTransferEthService,
        {
          provide: AnalyticsService,
          useValue: { get: () => '', track: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<XTransferEthController>(XTransferEthController);
    service = module.get<XTransferEthService>(XTransferEthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateXcmCall', () => {
    it('should call generateXcmCall service method with correct parameters and return result', async () => {
      const queryParams: PatchedXTransferEthDto = {
        to: 'AssetHubPolkadot',
        amount: 100,
        address: '5F5586mfsnM6durWRLptYt3jSUs55KEmahdodQ5tQMr9iY96',
        currency: { symbol: 'WETH' },
      };
      const mockResult = {} as TSerializedEthTransfer;
      vi.spyOn(service, 'generateEthCall').mockResolvedValue(mockResult);

      const result = await controller.generateXcmCall(
        queryParams,
        mockRequestObject,
      );

      expect(result).toBe(mockResult);
      expect(service.generateEthCall).toHaveBeenCalledWith(queryParams);
    });
  });
});