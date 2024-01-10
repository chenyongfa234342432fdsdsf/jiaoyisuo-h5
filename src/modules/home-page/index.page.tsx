import { useEffect, useLayoutEffect } from 'react'
import { useMarketListStore } from '@/store/market/market-list'
import Home from '@/features/home'
import { FavTabs } from '@/constants/market/market-list/favorite-module'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { setHomeTableFavTabToCache, setHomeTableSelectedTabToCache } from '@/helper/cache'
import useGuidePageInfo from '@/hooks/features/layout'

function Page() {
  useGuidePageInfo()
  const { homeFavType, selectedTab, setHomeFavType } = useMarketListStore().homeModuleState

  useEffect(() => {
    // 合约与现货动态化配置下默认展示
    const spot = getAuthModuleStatusByKey(AuthModuleEnum.spot)
    const contract = getAuthModuleStatusByKey(AuthModuleEnum.contract)
    if (spot && !contract) {
      setHomeFavType(FavTabs.Spot)
    }
    if (!spot && contract) {
      setHomeFavType(FavTabs.Futures)
    }
  }, [])

  // cache tabs
  useEffect(() => {
    const cacheTabsConfig = () => {
      homeFavType && setHomeTableFavTabToCache(homeFavType)
      selectedTab && setHomeTableSelectedTabToCache(selectedTab)
    }
    window.addEventListener('beforeunload', cacheTabsConfig)

    return () => window.removeEventListener('beforeunload', cacheTabsConfig)
  }, [homeFavType, selectedTab])

  return <Home />
}

function fetchData() {
  return Promise.resolve({
    title: 'home',
  })
}

async function onBeforeRender() {
  const response = await fetchData()
  return {
    pageContext: {
      pageProps: response,
      layoutParams: {
        footerShow: true, // 是否需要 footer
        headerShow: true,
        disableTransition: true,
      },
    },
  }
}

export { Page, onBeforeRender }
