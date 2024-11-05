import type { TCurrencyCore, TNodePolkadotKusama, TOriginFeeDetails } from '../../types'
import { type TNodeDotKsmWithRelayChains } from '../../types'
import { getBalanceNative } from './balance/getBalanceNative'
import { getMinNativeTransferableAmount } from './getExistentialDeposit'
import { isRelayChain } from '../../utils'
import { Builder } from '../../builder'
import type { IPolkadotApi } from '../../api/IPolkadotApi'
import type { TGetOriginFeeDetailsOptions } from '../../types/TBalance'

const createTx = async <TApi, TRes>(
  originApi: IPolkadotApi<TApi, TRes>,
  address: string,
  amount: string,
  currency: TCurrencyCore,
  originNode: TNodeDotKsmWithRelayChains,
  destNode: TNodeDotKsmWithRelayChains
): Promise<TRes> => {
  if (isRelayChain(originNode)) {
    return await Builder<TApi, TRes>(originApi)
      .to(destNode as TNodePolkadotKusama)
      .amount(amount)
      .address(address)
      .build()
  } else if (isRelayChain(destNode)) {
    return await Builder<TApi, TRes>(originApi)
      .from(originNode as TNodePolkadotKusama)
      .amount(amount)
      .address(address)
      .build()
  } else {
    return await Builder<TApi, TRes>(originApi)
      .from(originNode as TNodePolkadotKusama)
      .to(destNode as TNodePolkadotKusama)
      .currency(currency)
      .amount(amount)
      .address(address)
      .build()
  }
}

export const getOriginFeeDetails = async <TApi, TRes>({
  api,
  account,
  accountDestination,
  amount,
  currency,
  origin: origin,
  destination,
  feeMarginPercentage = 10
}: TGetOriginFeeDetailsOptions<TApi, TRes>): Promise<TOriginFeeDetails> => {
  const nativeBalance = await getBalanceNative({
    address: account,
    node: origin,
    api
  })

  const minTransferableAmount = getMinNativeTransferableAmount(origin)

  const tx = await createTx(api, accountDestination, amount, currency, origin, destination)

  const xcmFee = await api.calculateTransactionFee(tx, account)

  const xcmFeeWithMargin = xcmFee + xcmFee / BigInt(feeMarginPercentage)

  const sufficientForXCM = nativeBalance - minTransferableAmount - xcmFeeWithMargin > 0

  return {
    sufficientForXCM,
    xcmFee
  }
}
