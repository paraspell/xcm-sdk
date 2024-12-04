// Implements general builder pattern, this is Builder main file

import type {
  TDestination,
  TAddress,
  TNodeWithRelayChains,
  Version,
  TBatchOptions,
  TNodeDotKsmWithRelayChains,
  IFromBuilder,
  IToBuilder,
  ICurrencyBuilder,
  IAddressBuilder,
  IUseKeepAliveFinalBuilder,
  IFungibleBuilder,
  TCurrencyInputWithAmount,
  TSendOptions
} from '../types'
import AssetClaimBuilder from './AssetClaimBuilder'
import BatchTransactionManager from './BatchTransactionManager'
import type { IPolkadotApi } from '../api/IPolkadotApi'
import { send } from '../pallets/xcmPallet/transfer'
import { isRelayChain } from '../utils'
import { isTMultiLocation } from '../pallets/xcmPallet/utils'

/**
 * A builder class for constructing Para-to-Para, Para-to-Relay, Relay-to-Para transactions and asset claims.
 */
export class GeneralBuilder<TApi, TRes>
  implements
    IToBuilder<TApi, TRes>,
    ICurrencyBuilder<TApi, TRes>,
    IAddressBuilder<TApi, TRes>,
    IUseKeepAliveFinalBuilder<TApi, TRes>
{
  private _from: TNodeDotKsmWithRelayChains
  private _to: TDestination
  private _currency: TCurrencyInputWithAmount
  private _paraIdTo?: number
  private _address: TAddress
  private _ahAddress?: string
  private _destApi: IPolkadotApi<TApi, TRes>
  private _version?: Version

  constructor(
    private readonly batchManager: BatchTransactionManager<TApi, TRes>,
    private readonly api: IPolkadotApi<TApi, TRes>,
    from?: TNodeDotKsmWithRelayChains
  ) {
    if (from) {
      this._from = from
    }
  }

  /**
   * Specifies the origin node for the transaction.
   *
   * @param node - The node from which the transaction originates.
   * @returns An instance of Builder
   */
  from(node: TNodeDotKsmWithRelayChains) {
    this._from = node
    return this
  }

  /**
   * Specifies the destination node for the transaction.
   *
   * @param node - The node to which the transaction is sent.
   * @param paraIdTo - (Optional) The parachain ID of the destination node.
   * @returns An instance of Builder
   */
  to(node: TDestination, paraIdTo?: number) {
    if (isRelayChain(this._from) && node === 'Ethereum') {
      throw new Error('Transfers from Relay chain to Ethereum are not yet supported.')
    }
    this._to = node
    this._paraIdTo = paraIdTo
    return this
  }

  /**
   * Initiates the process to claim assets from a specified node.
   *
   * @param node - The node from which to claim assets.
   * @returns An instance of Builder
   */
  claimFrom(node: TNodeWithRelayChains): IFungibleBuilder<TRes> {
    return AssetClaimBuilder.create(this.api, node)
  }

  /**
   * Specifies the currency to be used in the transaction. Symbol, ID, multi-location or multi-asset.
   *
   * @param currency - The currency to be transferred.
   * @returns An instance of Builder
   */
  currency(currency: TCurrencyInputWithAmount): this {
    this._currency = currency
    return this
  }

  /**
   * Sets the recipient address.
   *
   * @param address - The destination address.
   * @returns An instance of Builder
   */
  address(address: TAddress, ahAddress?: string): this {
    this._address = address
    this._ahAddress = ahAddress
    return this
  }

  /**
   * Specifies to use the keep-alive option for the destination account to keep account active.
   *
   * @param destApi - The API instance of the destination chain.
   * @returns An instance of Builder
   */
  useKeepAlive(destApi: TApi): this {
    this._destApi = this.api.clone()
    this._destApi.setApi(destApi)
    return this
  }

  /**
   * Sets the XCM version to be used for the transfer.
   *
   * @param version - The XCM version.
   * @returns An instance of Builder
   */
  xcmVersion(version: Version): this {
    this._version = version
    return this
  }

  private createOptions(): TSendOptions<TApi, TRes> {
    return {
      api: this.api,
      origin: this._from,
      currency: this._currency,
      address: this._address,
      destination: this._to,
      paraIdTo: this._paraIdTo,
      destApiForKeepAlive: this._destApi,
      version: this._version,
      ahAddress: this._ahAddress
    }
  }

  /**
   * Adds the transfer transaction to the batch.
   *
   * @returns An instance of Builder
   */
  addToBatch() {
    this.batchManager.addTransaction(this.createOptions())
    return new GeneralBuilder(this.batchManager, this.api, this._from)
  }

  /**
   * Builds and returns the batched transaction based on the configured parameters.
   *
   * @param options - (Optional) Options to customize the batch transaction.
   * @returns A Extrinsic representing the batched transactions.
   */
  async buildBatch(options?: TBatchOptions) {
    return this.batchManager.buildBatch(this.api, this._from, options)
  }

  /**
   * Builds and returns the transfer extrinsic.
   *
   * @returns A Promise that resolves to the transfer extrinsic.
   */
  async build() {
    if (!this.batchManager.isEmpty()) {
      throw new Error(
        'Transaction manager contains batched items. Use buildBatch() to process them.'
      )
    }

    if (!isTMultiLocation(this._to) && isRelayChain(this._from) && isRelayChain(this._to)) {
      throw new Error('Transfers between relay chains are not yet supported.')
    }

    const options = this.createOptions()
    return send(options)
  }
}

/**
 * Creates a new Builder instance.
 *
 * @param api - The API instance to use for building transactions. If not provided, a new instance will be created.
 * @returns A new Builder instance.
 */
export const Builder = <TApi, TRes>(api: IPolkadotApi<TApi, TRes>): IFromBuilder<TApi, TRes> => {
  return new GeneralBuilder(new BatchTransactionManager(), api)
}