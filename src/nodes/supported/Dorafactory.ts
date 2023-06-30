// Contains detailed structure of XCM call construction for DoraFactory Parachain

import { IXTokensTransfer, Version, XTokensTransferInput } from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Dorafactory extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Dorafactory', 'dorafactory', 'kusama', Version.V1)
  }

  transferXTokens(input: XTokensTransferInput) {
    const { currency, fees } = input
    return XTokensTransferImpl.transferXTokens(input, currency, fees)
  }
}

export default Dorafactory