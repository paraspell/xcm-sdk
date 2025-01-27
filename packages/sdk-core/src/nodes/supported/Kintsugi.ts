// Contains detailed structure of XCM call construction for Kintsugi Parachain

import {
  type IXTokensTransfer,
  Version,
  type TXTokensTransferOptions,
  type TForeignOrTokenAsset
} from '../../types'
import { isForeignAsset } from '../../utils/assets'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../../pallets/xTokens'

class Kintsugi<TApi, TRes> extends ParachainNode<TApi, TRes> implements IXTokensTransfer {
  constructor() {
    super('Kintsugi', 'kintsugi', 'kusama', Version.V3)
  }

  transferXTokens<TApi, TRes>(input: TXTokensTransferOptions<TApi, TRes>) {
    const { asset } = input
    const currencySelection: TForeignOrTokenAsset = isForeignAsset(asset)
      ? { ForeignAsset: Number(asset.assetId) }
      : { Token: asset.symbol }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Kintsugi
