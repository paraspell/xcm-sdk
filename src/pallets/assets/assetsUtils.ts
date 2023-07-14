// Contains function for getting Asset ID or Symbol used in XCM call creation

import { TNode } from '../../types'
import { getAssetsObject } from './assets'

export const getAssetBySymbolOrId = (
  node: TNode,
  symbolOrId: string | number
): { symbol: string; assetId?: number } | null => {
  const { otherAssets, nativeAssets, relayChainAssetSymbol } = getAssetsObject(node)

  const asset = [...otherAssets, ...nativeAssets].find(
    ({ symbol, assetId }) => symbol === symbolOrId || assetId === symbolOrId
  )

  if (asset) {
    const { symbol, assetId } = asset
    return { symbol, assetId: assetId ? Number(assetId) : undefined }
  }

  if (relayChainAssetSymbol === symbolOrId) return { symbol: relayChainAssetSymbol }

  return null
}
