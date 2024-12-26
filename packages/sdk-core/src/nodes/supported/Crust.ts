// Contains detailed structure of XCM call construction for Crust Parachain

import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError'
import type { TAsset } from '../../types'
import {
  type IXTokensTransfer,
  Version,
  type TXTokensTransferOptions,
  type TReserveAsset
} from '../../types'
import { isForeignAsset } from '../../utils/assets'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../xTokens'

class Crust<TApi, TRes> extends ParachainNode<TApi, TRes> implements IXTokensTransfer {
  constructor() {
    super('Crust', 'crustParachain', 'polkadot', Version.V3)
  }

  private getCurrencySelection(asset: TAsset): TReserveAsset {
    if (asset.symbol === this.getNativeAssetSymbol()) {
      return 'SelfReserve'
    }

    if (!isForeignAsset(asset) || !asset.assetId) {
      throw new InvalidCurrencyError(`Asset ${JSON.stringify(asset)} has no assetId`)
    }

    return { OtherReserve: BigInt(asset.assetId) }
  }

  transferXTokens<TApi, TRes>(input: TXTokensTransferOptions<TApi, TRes>) {
    const { asset } = input
    const currencySelection = this.getCurrencySelection(asset)
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Crust