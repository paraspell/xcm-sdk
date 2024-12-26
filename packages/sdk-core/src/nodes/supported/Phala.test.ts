import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InvalidCurrencyError } from '../../errors'
import type { TXTransferTransferOptions } from '../../types'
import { Version } from '../../types'
import XTransferTransferImpl from '../xTransfer'
import type Phala from './Phala'
import { getNode } from '../../utils'

vi.mock('../xTransfer', () => ({
  default: {
    transferXTransfer: vi.fn()
  }
}))

describe('Phala', () => {
  let phala: Phala<unknown, unknown>
  const mockInput = {
    asset: { symbol: 'PHA', amount: '100' }
  } as TXTransferTransferOptions<unknown, unknown>

  beforeEach(() => {
    phala = getNode<unknown, unknown, 'Phala'>('Phala')
  })

  it('should initialize with correct values', () => {
    expect(phala.node).toBe('Phala')
    expect(phala.info).toBe('phala')
    expect(phala.type).toBe('polkadot')
    expect(phala.version).toBe(Version.V3)
  })

  it('should call transferXTransfer with valid currency', () => {
    const spy = vi.spyOn(XTransferTransferImpl, 'transferXTransfer')
    vi.spyOn(phala, 'getNativeAssetSymbol').mockReturnValue('PHA')

    phala.transferXTransfer(mockInput)

    expect(spy).toHaveBeenCalledWith(mockInput)
  })

  it('should throw InvalidCurrencyError for unsupported currency', () => {
    vi.spyOn(phala, 'getNativeAssetSymbol').mockReturnValue('NOT_PHA')

    expect(() => phala.transferXTransfer(mockInput)).toThrowError(
      new InvalidCurrencyError(`Node Phala does not support currency PHA`)
    )
  })
})