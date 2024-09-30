/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PolkadotXCMTransferInput } from '../../types'
import { getNode } from '../../utils'
import Robonomics from './Robonomics'
import PolkadotXCMTransferImpl from '../polkadotXcm'

vi.mock('../polkadotXcm', async () => {
  const actual = await vi.importActual<typeof import('../polkadotXcm')>('../polkadotXcm')
  return {
    default: {
      ...actual.default,
      transferPolkadotXCM: vi.fn()
    }
  }
})

describe('Robonomics', () => {
  describe('transferPolkadotXCM', () => {
    let robonomics: Robonomics

    beforeEach(() => {
      robonomics = getNode('Robonomics')
    })

    it('should be instantiated correctly', () => {
      expect(robonomics).toBeInstanceOf(Robonomics)
    })
    it('should use limitedTeleportAssets when scenario is not ParaToPara', () => {
      const input = { scenario: 'ParaToRelay' } as PolkadotXCMTransferInput
      robonomics.transferPolkadotXCM(input)
      expect(PolkadotXCMTransferImpl.transferPolkadotXCM).toHaveBeenCalledWith(
        input,
        'limitedReserveTransferAssets',
        'Unlimited'
      )
    })
  })
})