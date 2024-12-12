import { createApiInstanceForNode as createApiInstanceForNodeInternal } from '../utils'
import type { TNodeDotKsmWithRelayChains } from '../types'
import PolkadotJsApi from './PolkadotJsApi'
import type { Extrinsic, TPjsApi, TPjsApiOrUrl } from './types'
import type { IPolkadotApi } from '../api'

export const createApiInstanceForNode = (node: TNodeDotKsmWithRelayChains) => {
  const pjsApi = new PolkadotJsApi()
  return createApiInstanceForNodeInternal<TPjsApi, Extrinsic>(pjsApi, node)
}

export const createPolkadotJsApiCall = <TArgs extends Record<string, unknown>, TResult>(
  apiCall: (options: TArgs & { api: IPolkadotApi<TPjsApi, Extrinsic> }) => Promise<TResult>
) => {
  return async (options: TArgs & { api?: TPjsApiOrUrl }): Promise<TResult> => {
    const pjsApi = new PolkadotJsApi()
    pjsApi.setApi(options.api)

    const optionsWithApi = {
      ...options,
      api: pjsApi as IPolkadotApi<TPjsApi, Extrinsic>
    } as TArgs & { api: IPolkadotApi<TPjsApi, Extrinsic> }

    return apiCall(optionsWithApi)
  }
}

export * from '../utils/assets/isForeignAsset'
