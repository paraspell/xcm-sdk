// Contains detailed structure of XCM call construction for InvArchTinker Parachain

import { InvalidCurrencyError } from '../../errors'
import { type IXTokensTransfer, Version, type XTokensTransferInput } from '../../types'
import { isForeignAsset } from '../../utils/assets'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../xTokens'

class InvArchTinker<TApi, TRes> extends ParachainNode<TApi, TRes> implements IXTokensTransfer {
  constructor() {
    super('InvArchTinker', 'tinker', 'kusama', Version.V3)
  }

  transferXTokens<TApi, TRes>(input: XTokensTransferInput<TApi, TRes>) {
    const { asset } = input

    if (!isForeignAsset(asset)) {
      throw new InvalidCurrencyError(`Asset ${JSON.stringify(asset)} has no assetId`)
    }

    return XTokensTransferImpl.transferXTokens(input, BigInt(asset.assetId))
  }
}

export default InvArchTinker
