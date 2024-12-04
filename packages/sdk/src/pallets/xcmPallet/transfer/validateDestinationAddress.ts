import type { TAddress, TDestination } from '../../../types'
import { isTMultiLocation } from '../utils'
import { validateAddress } from '../../../utils/validateAddress'

export const validateDestinationAddress = (address: TAddress, destination: TDestination) => {
  if (typeof address === 'string' && !isTMultiLocation(destination)) {
    validateAddress(address, destination)
  }
}
