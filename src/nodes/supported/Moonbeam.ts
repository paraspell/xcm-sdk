// Contains detailed structure of XCM call construction for Moonbeam Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Moonbeam extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Moonbeam', 'moonbeam', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currency, currencyID } = input
    const currencySelection = currency === 'GLMR' ? 'SelfReserve ' : { ForeignAsset: currencyID }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Moonbeam
