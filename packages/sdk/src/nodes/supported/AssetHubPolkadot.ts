// Contains detailed structure of XCM call construction for Statemint Parachain

import { ethers } from 'ethers'
import { InvalidCurrencyError } from '../../errors'
import {
  constructRelayToParaParameters,
  createBridgeCurrencySpec,
  createBridgePolkadotXcmDest,
  createCurrencySpec,
  createPolkadotXcmHeader
} from '../../pallets/xcmPallet/utils'
import {
  type IPolkadotXCMTransfer,
  type PolkadotXCMTransferInput,
  Version,
  type Extrinsic,
  type TSerializedApiCall,
  Parents,
  type TScenario,
  type TRelayToParaInternalOptions,
  type TMultiAsset,
  type TMultiLocation,
  TJunction
} from '../../types'
import { generateAddressMultiLocationV4, generateAddressPayload } from '../../utils'
import ParachainNode from '../ParachainNode'
import PolkadotXCMTransferImpl from '../PolkadotXCMTransferImpl'
import { getOtherAssets } from '../../pallets/assets'

class AssetHubPolkadot extends ParachainNode implements IPolkadotXCMTransfer {
  constructor() {
    super('AssetHubPolkadot', 'PolkadotAssetHub', 'polkadot', Version.V3)
  }

  _assetCheckEnabled = false

  public handleBridgeTransfer(
    input: PolkadotXCMTransferInput,
    targetChain: 'Polkadot' | 'Kusama'
  ): Extrinsic | TSerializedApiCall {
    if (
      (targetChain === 'Kusama' && input.currencyId === 'KSM') ||
      (targetChain === 'Polkadot' && input.currencyId === 'DOT')
    ) {
      const modifiedInput: PolkadotXCMTransferInput = {
        ...input,
        header: createBridgePolkadotXcmDest(
          Version.V4,
          targetChain,
          input.destination,
          input.paraIdTo
        ),
        addressSelection: generateAddressMultiLocationV4(input.api, input.address),
        currencySelection: createBridgeCurrencySpec(input.amount, targetChain)
      }
      return PolkadotXCMTransferImpl.transferPolkadotXCM(
        modifiedInput,
        'transferAssets',
        'Unlimited'
      )
    } else if (
      (targetChain === 'Polkadot' && input.currencyId === 'KSM') ||
      (targetChain === 'Kusama' && input.currencyId === 'DOT')
    ) {
      const modifiedInput: PolkadotXCMTransferInput = {
        ...input,
        header: createBridgePolkadotXcmDest(
          Version.V3,
          targetChain,
          input.destination,
          input.paraIdTo
        ),
        currencySelection: createCurrencySpec(
          input.amount,
          Version.V3,
          Parents.ONE,
          input.overridedCurrency
        )
      }
      return PolkadotXCMTransferImpl.transferPolkadotXCM(
        modifiedInput,
        'limitedReserveTransferAssets',
        'Unlimited'
      )
    }
    throw new InvalidCurrencyError('Polkadot <-> Kusama bridge does not support this currency')
  }

  public handleEthBridgeTransfer(input: PolkadotXCMTransferInput): Extrinsic | TSerializedApiCall {
    const { api, scenario, destination, paraIdTo, address, currencyId } = input

    if (!ethers.isAddress(address)) {
      throw new Error('Only Ethereum addresses are supported for Ethereum transfers')
    }

    const ethAssets = getOtherAssets('Ethereum')
    const ethAsset = ethAssets.find(asset => asset.symbol === currencyId)

    if (!ethAsset) {
      throw new InvalidCurrencyError(
        `Currency ${currencyId} is not supported for Ethereum transfers`
      )
    }

    const ETH_CHAIN_ID = 1
    const ethJunction: TJunction = {
      GlobalConsensus: { Ethereum: { chain_id: ETH_CHAIN_ID } }
    }

    const modifiedInput: PolkadotXCMTransferInput = {
      ...input,
      header: createPolkadotXcmHeader(
        scenario,
        this.version,
        destination,
        paraIdTo,
        ethJunction,
        Parents.TWO
      ),
      addressSelection: generateAddressPayload(
        api,
        scenario,
        'PolkadotXcm',
        address,
        this.version,
        paraIdTo
      ),
      currencySelection: createCurrencySpec(input.amount, Version.V3, Parents.TWO, {
        parents: Parents.TWO,
        interior: {
          X2: [
            ethJunction,
            {
              AccountKey20: { key: ethAsset.assetId }
            }
          ]
        }
      })
    }
    return PolkadotXCMTransferImpl.transferPolkadotXCM(modifiedInput, 'transferAssets', 'Unlimited')
  }

  transferPolkadotXCM(input: PolkadotXCMTransferInput): Extrinsic | TSerializedApiCall {
    const { scenario } = input

    if (input.destination === 'AssetHubKusama') {
      return this.handleBridgeTransfer(input, 'Kusama')
    }

    if (input.destination === 'Ethereum') {
      return this.handleEthBridgeTransfer(input)
    }

    const method =
      scenario === 'ParaToPara' ? 'limitedReserveTransferAssets' : 'limitedTeleportAssets'
    return PolkadotXCMTransferImpl.transferPolkadotXCM(input, method, 'Unlimited')
  }

  transferRelayToPara(options: TRelayToParaInternalOptions): TSerializedApiCall {
    const { version = Version.V3 } = options
    return {
      module: 'xcmPallet',
      section: 'limitedTeleportAssets',
      parameters: constructRelayToParaParameters(options, version, true)
    }
  }

  createCurrencySpec(
    amount: string,
    scenario: TScenario,
    version: Version,
    currencyId?: string,
    overridedMultiLocation?: TMultiLocation | TMultiAsset[]
  ) {
    if (scenario === 'ParaToPara') {
      const interior = {
        X2: [
          {
            PalletInstance: 50
          },
          {
            GeneralIndex: currencyId
          }
        ]
      }
      return createCurrencySpec(amount, version, Parents.ZERO, overridedMultiLocation, interior)
    } else {
      return super.createCurrencySpec(amount, scenario, version, currencyId)
    }
  }
}

export default AssetHubPolkadot
