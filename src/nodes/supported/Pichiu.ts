// Contains detailed structure of XCM call construction for Pichiu Parachain

import { IXTokensTransfer, Version, XTokensTransferInput } from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Pichiu extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Pichiu', 'pichiu', 'kusama', Version.V1)
  }

  transferXTokens(input: XTokensTransferInput) {
    const { currency, fees } = input
    return XTokensTransferImpl.transferXTokens(input, currency, fees, 'OrmlXTokens')
  }
}

export default Pichiu