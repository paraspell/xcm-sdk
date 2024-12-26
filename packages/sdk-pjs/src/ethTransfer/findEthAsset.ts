import type { TCurrencyCoreV1 } from '@paraspell/sdk-core'
import { getOtherAssets, InvalidCurrencyError } from '@paraspell/sdk-core'

export const findEthAsset = (currency: TCurrencyCoreV1) => {
  const ethAssets = getOtherAssets('Ethereum')
  const ethAsset =
    'symbol' in currency
      ? ethAssets.find(asset => asset.symbol === currency.symbol)
      : ethAssets.find(asset => asset.assetId === currency.id)
  if (!ethAsset) {
    throw new InvalidCurrencyError(
      `Currency ${JSON.stringify(currency)} is not supported for Ethereum transfers`
    )
  }
  return ethAsset
}