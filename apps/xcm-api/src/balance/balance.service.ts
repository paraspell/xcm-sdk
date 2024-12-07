import { BadRequestException, Injectable } from '@nestjs/common';
import {
  NODE_NAMES_DOT_KSM,
  NODES_WITH_RELAY_CHAINS,
  NODES_WITH_RELAY_CHAINS_DOT_KSM,
  TNodeDotKsmWithRelayChains,
  TNodePolkadotKusama,
  TNodeWithRelayChains,
} from '@paraspell/sdk';
import { BalanceNativeDto } from './dto/BalanceNativeDto.js';
import { BalanceForeignDto } from './dto/BalanceForeignDto.js';
import { ApiPromise } from '@polkadot/api';
import { PolkadotClient } from 'polkadot-api';
import { ExistentialDepositDto } from './dto/ExistentialDepositDto.js';

@Injectable()
export class BalanceService {
  async getBalanceNative(
    node: string,
    { address, currency }: BalanceNativeDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodeDotKsmWithRelayChains;
    if (!NODES_WITH_RELAY_CHAINS_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getBalanceNative({
      address,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
      currency,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance;
  }

  async getBalanceForeign(
    node: string,
    { address, currency }: BalanceForeignDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodePolkadotKusama;
    if (!NODE_NAMES_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getBalanceForeign({
      address,
      currency,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance === null ? 'null' : balance.toString();
  }

  async getAssetBalance(
    node: string,
    { address, currency }: BalanceForeignDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodePolkadotKusama;
    if (!NODE_NAMES_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getAssetBalance({
      address,
      currency,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance === null ? 'null' : balance.toString();
  }

  async getMaxNativeTransferableAmount(
    node: string,
    { address, currency }: BalanceNativeDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodeDotKsmWithRelayChains;
    if (!NODES_WITH_RELAY_CHAINS_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getMaxNativeTransferableAmount({
      address,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
      currency,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance;
  }

  async getMaxForeignTransferableAmount(
    node: string,
    { address, currency }: BalanceForeignDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodePolkadotKusama;
    if (!NODE_NAMES_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getMaxForeignTransferableAmount({
      address,
      currency,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance;
  }

  async getTransferableAmount(
    node: string,
    { address, currency }: BalanceForeignDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodeDotKsmWithRelayChains;
    if (!NODES_WITH_RELAY_CHAINS_DOT_KSM.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    const api = await Sdk.createApiInstanceForNode(nodeTyped);
    const balance = await Sdk.getTransferableAmount({
      address,
      currency,
      node: nodeTyped,
      api: api as ApiPromise & PolkadotClient,
    });
    if ('disconnect' in api) await api.disconnect();
    else api.destroy();
    return balance;
  }

  async getExistentialDeposit(
    node: string,
    { currency }: ExistentialDepositDto,
    usePapi = false,
  ) {
    const nodeTyped = node as TNodeWithRelayChains;
    if (!NODES_WITH_RELAY_CHAINS.includes(nodeTyped)) {
      throw new BadRequestException(
        `Node ${node} is not valid. Check docs for valid nodes.`,
      );
    }

    const Sdk = usePapi
      ? await import('@paraspell/sdk/papi')
      : await import('@paraspell/sdk');

    return Sdk.getExistentialDeposit(nodeTyped, currency);
  }
}
