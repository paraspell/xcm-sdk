import type { TJunction } from '../types'

export const DEFAULT_FEE_ASSET = 0

export const ETH_CHAIN_ID = BigInt(1)
export const ETHEREUM_JUNCTION: TJunction = {
  GlobalConsensus: { Ethereum: { chain_id: ETH_CHAIN_ID } }
}
