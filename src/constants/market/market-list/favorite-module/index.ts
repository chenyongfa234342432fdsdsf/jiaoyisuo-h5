import { t } from '@lingui/macro'
import { baseCommonStore } from '@/store/common'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { MarketLisModulesEnum } from '../market-module'

export enum FavTabs {
  Spot,
  Futures,
}

export const getFavTabsTitle = () => {
  return {
    [FavTabs.Spot]: t`constants_market_market_list_market_module_index_510106`,
    [FavTabs.Futures]: t`assets.financial-record.tabs.futures`,
  }
}

export const getMrkFavTabsConfig = () => {
  const isFusionMode = baseCommonStore.getState().isFusionMode
  const spotMarkets = {
    title: t`constants_market_market_list_market_module_index_510106`,
    id: MarketLisModulesEnum.spotMarkets,
  }
  const futuresMarkets = {
    title: t`assets.financial-record.tabs.futures`,
    id: MarketLisModulesEnum.futuresMarkets,
  }

  if (isFusionMode) {
    return [futuresMarkets]
  }

  const FavTabsList: any[] = []

  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    FavTabsList.push(spotMarkets)
  }

  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) {
    FavTabsList.push(futuresMarkets)
  }

  return FavTabsList
}

export const getHomeFavTabsConfig = () => {
  const spot = {
    text: t`constants_market_market_list_market_module_index_510106`,
    value: FavTabs.Spot,
  }
  const futures = {
    text: t`assets.financial-record.tabs.futures`,
    value: FavTabs.Futures,
  }
  const cancel = {
    text: t`assets.financial-record.cancel`,
    value: undefined,
  }
  let config: any[] = []
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) config.push(spot)
  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) config.push(futures)
  config.push(cancel)
  return config
}

export enum FavCacheTypeEnum {
  'spot' = 'spot',
  'futures' = 'futures',
  'ternary-option' = 'ternary-option',
}

export const getFavCacheKeyMap = () => {
  return {
    [FavCacheTypeEnum.spot]: 'MARKET_SPOT_FAVOURITE_LIST',
    [FavCacheTypeEnum.futures]: 'MARKET_FUTURES_FAVOURITE_LIST',
    [FavCacheTypeEnum['ternary-option']]: 'MARKET_TERNARY_OPTION_FAVOURITE_LIST',
  }
}

export const getFavCacheKey = (type: FavCacheTypeEnum) => {
  const map = getFavCacheKeyMap()
  const key = map[type]
  // console.log('🚀 ~ file: index.ts:73 ~ getFavCacheKey ~ key:', key)
  return key || map[0]
}
