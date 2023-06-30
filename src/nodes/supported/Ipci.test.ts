// Contains test scenario for Parachain to Parachain transfer on Ipci

import { describe, it, vi, expect } from 'vitest'
import { PolkadotXCMTransferInput, TScenario, Version } from '../..'
import {
  createApiInstance,
  createCurrencySpecification,
  createHeaderPolkadotXCM,
  handleAddress
} from '../../utils'
import PolkadotXCMTransferImpl from '../PolkadotXCMTransferImpl'
import Ipci from './Ipci'

describe('Ipci', () => {
  it('transferPolkadotXCM - ParaToPara', async () => {
    const api = await createApiInstance('wss://kusama.rpc.ipci.io')
    const ipci = new Ipci()
    const currency = 'DOT'
    const paraId = 2006
    const amount = 1000
    const scenario: TScenario = 'ParaToPara'
    const addressSelection = handleAddress(scenario, 'polkadotXCM', api, '', Version.V1, paraId)
    const header = createHeaderPolkadotXCM(scenario, Version.V1, paraId)
    const currencySelection = createCurrencySpecification(
      amount,
      scenario,
      Version.V1,
      ipci.node,
      currency
    )
    const input: PolkadotXCMTransferInput = {
      api: undefined as any,
      header,
      addressSelection,
      currencySelection,
      scenario
    }
    const transferSpy = vi
      .spyOn(PolkadotXCMTransferImpl, 'transferPolkadotXCM')
      .mockImplementation(() => {
        return undefined as any
      })
    await ipci.transferPolkadotXCM(input)
    expect(transferSpy).toHaveBeenCalledWith(input, 'reserveTransferAssets')
  })
})