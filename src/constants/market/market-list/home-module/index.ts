import { getHotTradePair, getTopFalling, getTopRising, getTopVolume } from '@/apis/market'
import { spotFavFn } from '@/helper/market/market-favorite'
import { ITabConfig } from '@/typings/api/market/market-list/home-module'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { t } from '@lingui/macro'

export enum HomeModuleTabsEnum {
  fav = 'favTab',
  hot = 'hotTab',
  topRising = 'topRisingTab',
  topFalling = 'topFallingTab',
  topVolume = 'topVolumeTab',
}

export const getHomeModuleTabsConfig = (): ITabConfig<HomeModuleTabsEnum>[] => {
  const fav = {
    title: t`constants_market_market_list_market_module_index_510108`,
    id: HomeModuleTabsEnum.fav,
  }
  const hot = {
    title: t`store_market_market_list_constant_510098`,
    id: HomeModuleTabsEnum.hot,
  }
  const topRising = {
    title: t`store_market_market_list_constant_510099`,
    id: HomeModuleTabsEnum.topRising,
  }
  const topFalling = {
    title: t`store_market_market_list_constant_510100`,
    id: HomeModuleTabsEnum.topFalling,
  }
  const topVolume = {
    title: t`store_market_market_list_constant_510101`,
    id: HomeModuleTabsEnum.topVolume,
  }
  return getAuthModuleStatusByKey(AuthModuleEnum.spot) ? [fav, hot, topRising, topFalling, topVolume] : [fav]
}

export const getHomeModuleTabApi = (id: HomeModuleTabsEnum) => {
  return {
    // [HomeModuleTabsEnum.fav]: spotFavFn.getFavList,
    [HomeModuleTabsEnum.hot]: getHotTradePair,
    [HomeModuleTabsEnum.topRising]: getTopRising,
    [HomeModuleTabsEnum.topFalling]: getTopFalling,
    [HomeModuleTabsEnum.topVolume]: getTopVolume,
  }[id]
}
