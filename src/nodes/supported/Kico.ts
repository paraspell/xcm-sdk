// Contains detailed structure of XCM call construction for Kico Parachain

import { IXTokensTransfer, Version, XTokensTransferInput } from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Kico extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Kico', 'kico', 'kusama', Version.V1)
  }

  transferXTokens(input: XTokensTransferInput) {
    const { currencyID, fees } = input
    return XTokensTransferImpl.transferXTokens(input, currencyID, fees)
  }
}

export default Kico