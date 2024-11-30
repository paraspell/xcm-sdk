import type { MockInstance } from 'vitest'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkKeepAlive } from '../keepAlive'
import type { TAddress, TAsset, TCurrencyInput, TDestination, TSendOptions } from '../../../types'
import type { Extrinsic, TPjsApi } from '../../../pjs'
import { performKeepAliveCheck } from './performKeepAliveCheck'
import type { IPolkadotApi } from '../../../api'

vi.mock('../keepAlive', () => ({
  checkKeepAlive: vi.fn()
}))

describe('performKeepAliveCheck', () => {
  let consoleWarnSpy: MockInstance

  const options = {
    api: {} as IPolkadotApi<TPjsApi, Extrinsic>,
    origin: 'Acala',
    destApiForKeepAlive: {} as IPolkadotApi<TPjsApi, Extrinsic>,
    currency: {
      symbol: 'ACA'
    },
    amount: '100',
    address: 'some-address',
    destination: undefined
  } as TSendOptions<TPjsApi, Extrinsic>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
  })

  it('should warn when currency has multilocation', async () => {
    const modifiedOptions = {
      ...options,
      currency: {
        multilocation: {}
      } as unknown as TCurrencyInput
    }

    await performKeepAliveCheck(modifiedOptions, null)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when using MultiLocation as currency.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should warn when currency has multiasset', async () => {
    const modifiedOptions = {
      ...options,
      currency: {
        multiasset: {}
      } as unknown as TCurrencyInput
    }

    await performKeepAliveCheck(modifiedOptions, null)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when using MultiLocation as currency.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should warn when address is an object', async () => {
    const modifiedOptions = {
      ...options,
      address: {} as TAddress
    }

    await performKeepAliveCheck(modifiedOptions, null)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when using MultiLocation as address.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should warn when destination is an object', async () => {
    const modifiedOptions = {
      ...options,
      destination: {} as TDestination
    }

    await performKeepAliveCheck(modifiedOptions, null)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when using MultiLocation as destination.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should warn when destination is Ethereum', async () => {
    const modifiedOptions = {
      ...options,
      destination: 'Ethereum' as TDestination
    }

    await performKeepAliveCheck(modifiedOptions, null)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when using Ethereum as origin or destination.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should warn when asset is null', async () => {
    const asset: TAsset | null = null

    await performKeepAliveCheck(options, asset)

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Keep alive check is not supported when asset check is disabled.'
    )
    expect(checkKeepAlive).not.toHaveBeenCalled()
  })

  it('should call checkKeepAlive when all conditions are met', async () => {
    const asset: TAsset | null = {} as TAsset

    await performKeepAliveCheck(options, asset)

    expect(consoleWarnSpy).not.toHaveBeenCalled()
    expect(checkKeepAlive).toHaveBeenCalledWith({
      originApi: options.api,
      address: options.address,
      amount: options.amount,
      originNode: options.origin,
      destApi: options.destApiForKeepAlive,
      asset: asset,
      destNode: options.destination
    })
  })

  it('should handle undefined amount by passing empty string', async () => {
    const modifiedOptions = {
      ...options,
      amount: null
    }
    const asset: TAsset | null = {} as TAsset

    await performKeepAliveCheck(modifiedOptions, asset)

    expect(checkKeepAlive).toHaveBeenCalledWith({
      originApi: options.api,
      address: options.address,
      amount: '',
      originNode: options.origin,
      destApi: options.destApiForKeepAlive,
      asset: asset,
      destNode: options.destination
    })
  })
})