import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { baseCommonStore } from '@/store/common'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'

export enum MarketListRouteEnum {
  spot = '/markets/spot',
  futures = '/markets/futures',
  sector = '/markets/sector',
  sectorDetails = '/markets/sector-detail',
  sectorTable = '/markets/sector-table',
  search = '/markets/search',
}

export enum MarketTabsEnum {
  spot,
  futures,
  sector,
}

export enum MarketSpotBaseCurrencyEnum {
  favourites,
}

export enum SpotMarketSectorCategoryEnum {
  total = 'totalTab',
}

export const getFusionMarketTabsConfig = () => {
  return [
    {
      title: t`assets.financial-record.tabs.futures`,
      id: MarketListRouteEnum.futures,
      onCallBack: () => {
        link(MarketListRouteEnum.futures)
      },
    },
    // {
    //   title: t`constants_market_market_list_market_module_index_510107`,
    //   id: MarketListRouteEnum.sector,
    //   onCallBack: () => {
    //     link(MarketListRouteEnum.sector)
    //   },
    // },
  ]
}

export const getMarketTabsConfig = () => {
  const spot = {
    title: t`constants_market_market_list_market_module_index_510106`,
    id: MarketListRouteEnum.spot,
    onCallBack: () => {
      link(MarketListRouteEnum.spot)
    },
  }
  const futures = {
    title: t`assets.financial-record.tabs.futures`,
    id: MarketListRouteEnum.futures,
    onCallBack: () => {
      link(MarketListRouteEnum.futures)
    },
  }
  const sector = {
    title: t`constants_market_market_list_market_module_index_510107`,
    id: MarketListRouteEnum.sector,
    onCallBack: () => {
      link(MarketListRouteEnum.sector)
    },
  }
  let routerConfig: any[] = []
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    routerConfig = [...routerConfig, spot]
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) {
    routerConfig = [...routerConfig, futures]
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    routerConfig = [...routerConfig, sector]
  }
  return routerConfig
}

// 每个 Tab 在 Store 中也对应相应的 module
export enum MarketLisModulesEnum {
  homeModule = 'homeModuleState',
  spotMarkets = 'spotMarketsModule',
  spotMarketsTrade = 'spotMarketsTradeModule',
  futuresMarkets = 'futuresMarketsModule',
  futuresMarketsTrade = 'futuresMarketsTradeModule',
  sector = 'sectorModule',
  favourites = 'favouritesModule',
  ternaryOptionMarketsTrade = 'ternaryOptionMarketsTradeModule',
}

export enum SpotListApiParamsSortByEnum {
  symbolName = 'symbolName',
  chg = 'chg',
  volume = 'volume',
  last = 'last',
}

export enum SpotListApiParamsSortOrderTypeEnum {
  asc = 'asc',
  desc = 'desc',
}

/** value 需要和后端返回的类型对应 */
export enum GlobalSearchTypesMappingEnum {
  'all' = 'all',
  'spot' = 'spot',
  'futures' = 'perpetual',
  // 'delivery' = 'delivery',
  // 'leverage' = 'leverage',
}

export const getGlobalSearchTypesList = () => {
  const all = {
    title: t`constants_market_market_list_market_module_index_5101071`,
    id: GlobalSearchTypesMappingEnum.all,
  }
  const spot = { title: t`constants_order_742`, id: GlobalSearchTypesMappingEnum.spot }
  const futures = { title: t`assets.layout.tabs.contract`, id: GlobalSearchTypesMappingEnum.futures }

  const isFusionMode = baseCommonStore.getState().isFusionMode

  if (isFusionMode) {
    return [all, futures]
  }

  let routerConfig: any[] = [all]
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    routerConfig = [...routerConfig, spot]
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) {
    routerConfig = [...routerConfig, futures]
  }

  return routerConfig
}

// Spot Module
export enum SpotMarketBaseCurrenyEnum {
  favorites = 'favoritesTab',
}

export const sportMarketsBaseCurrencyFilter = () => [
  {
    title: t`constants_market_market_list_market_module_index_510108`,
    id: SpotMarketBaseCurrenyEnum.favorites,
  },
]

export const spotMarketsCategoryFilter = () => [
  {
    title: t`constants_market_market_list_market_module_index_5101071`,
    id: SpotMarketSectorCategoryEnum.total,
  },
]

export const getCategoryTitleById = (id: SpotMarketSectorCategoryEnum) => {
  return {
    [SpotMarketSectorCategoryEnum.total]: t`constants_market_market_list_market_module_index_5101071`,
  }[id]
}

export const getSectorTabsConfig = () => {
  const spot = {
    title: t`constants_market_market_list_market_module_index_510106`,
    id: MarketTabsEnum.spot,
  }
  const futures = {
    title: t`assets.financial-record.tabs.futures`,
    id: MarketTabsEnum.futures,
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) {
    return [spot, futures]
  }
  return [spot]
}

// futures module
export enum FuturesMarketBaseCurrenyEnum {
  favorites = 'favoritesTab',
  total = 'totalTab',
}
export const futuresTradeSearchCategoryTab = () => [
  {
    title: t`constants_market_market_list_market_module_index_510108`,
    id: FuturesMarketBaseCurrenyEnum.favorites,
  },
  {
    title: t`constants_market_market_list_market_module_index_5101071`,
    id: FuturesMarketBaseCurrenyEnum.total,
  },
]
