import { ApiStatusEnum } from '@/constants/market/market-list'
import { MarketLisModulesEnum } from '@/constants/market/market-list/market-module'
import {
  useApiAllMarketFuturesTradePair,
  useApiAllMarketTernaryOptionTradePair,
} from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import useApiAllMarketTradePair from '@/hooks/features/market/common/use-api-all-market-trade-pair'
import { useFuturesFavList, useSpotFavList, useTernaryOptionFavList } from '@/hooks/features/market/favourite'
import { usePageContext } from '@/hooks/use-page-context'
import { useMarketListStore } from '@/store/market/market-list'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { useMount } from 'ahooks'
import { useEffect } from 'react'

/**
 * 行情在现货交易页面的初始化
 */
const useMarketSpotForTrade = () => {
  /** 提前加载必要的行情数据 */
  useSpotFavList()
  useApiAllMarketTradePair()

  const marketListStore = useMarketListStore()

  useMount(() => {
    marketListStore.setActiveModule(MarketLisModulesEnum.spotMarketsTrade)
  })
}

export function MarketSpotForTrade() {
  useMarketSpotForTrade()
  return <></>
}

/**
 * 行情在合约交易页面的初始化
 */
const useMarketFuturesForTrade = () => {
  /** 提前加载必要的行情数据 */
  useFuturesFavList()
  useApiAllMarketFuturesTradePair()

  const marketListStore = useMarketListStore()

  useMount(() => {
    marketListStore.setActiveModule(MarketLisModulesEnum.futuresMarketsTrade)
  })
}

export function MarketFuturesForTrade() {
  useMarketFuturesForTrade()
  return <></>
}

/**
 * 行情在三元期权交易页面的初始化
 */
const useMarketTernaryOptionForTrade = () => {
  /** 提前加载必要的行情数据 */
  const upStore = useTernaryOptionStore()
  const symbolName = usePageContext().routeParams?.symbol
  useTernaryOptionFavList()
  const { apiStatus, data } = useApiAllMarketTernaryOptionTradePair()

  const marketListStore = useMarketListStore()

  useMount(() => {
    marketListStore.setActiveModule(MarketLisModulesEnum.ternaryOptionMarketsTrade)
  })

  useEffect(() => {
    if (apiStatus !== ApiStatusEnum.succeed) return
    if (upStore.currentCoin.symbol === symbolName) return
    const item = data.find(x => x.symbol === symbolName)
    if (!item) return
    upStore.updateCurrentCoin(item as any)
  }, [apiStatus, symbolName])
}

export function MarketTernaryOptionForTrade() {
  useMarketTernaryOptionForTrade()
  return <></>
}
