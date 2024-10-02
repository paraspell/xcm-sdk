import { describe, expect, it } from 'vitest'
import * as sdk from './index'

describe('Module Exports', () => {
  it('should export xcmPallet', () => {
    expect(sdk.xcmPallet).toBeDefined()
  })

  it('should export assets', () => {
    expect(sdk.assets).toBeDefined()
  })

  it('should export NODE_NAMES_DOT_KSM and other constants', () => {
    expect(sdk.NODE_NAMES_DOT_KSM).toBeDefined()
    expect(sdk.NODE_NAMES).toBeDefined()
    expect(sdk.NODES_WITH_RELAY_CHAINS).toBeDefined()
    expect(sdk.NODES_WITH_RELAY_CHAINS_DOT_KSM).toBeDefined()
    expect(sdk.SUPPORTED_PALLETS).toBeDefined()
  })

  it('should export utility functions', () => {
    expect(sdk.getNodeEndpointOption).toBeDefined()
    expect(sdk.getNode).toBeDefined()
    expect(sdk.getNodeProvider).toBeDefined()
    expect(sdk.getAllNodeProviders).toBeDefined()
    expect(sdk.createApiInstanceForNode).toBeDefined()
    expect(sdk.isRelayChain).toBeDefined()
    expect(sdk.determineRelayChain).toBeDefined()
  })
})
