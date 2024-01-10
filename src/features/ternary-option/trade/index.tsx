import classNames from 'classnames'
import { usePageContext } from '@/hooks/use-page-context'
import { FutureSettingKLinePositionEnum } from '@/constants/future/settings'
import { useFetchTernaryOptionCurrentCoin, useTernaryOptionCoinSubscribe } from '@/hooks/features/market'
import { useMount, useScroll, useUpdateEffect } from 'ahooks'
import { useTernaryOptionStore } from '@/store/ternary-option'
import TradeKLine from '@/features/trade/common/k-line'
import MyTrade from '@/features/ternary-option/option-order/my-trade'
import { MarketTernaryOptionForTrade } from '@/hooks/features/market/market-list/use-market-trade-area'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { useGetWsAssets } from '@/hooks/features/assets/spot'
import { onGetAssetsCoinList } from '@/helper/assets/overview'
import { useEffect, useRef } from 'react'
import { useUserStore } from '@/store/user'
import { ScenesBeUsedEnum } from '@/constants/welfare-center/common'
import { useGetCouponSelectList } from '@/hooks/features/welfare-center/coupon-select'
import { TernaryOptionTradeHeader } from './header'
import styles from './index.module.css'
import OptionTradeExchange from './exhange'

function ExchangeContextContainer() {
  return (
    <>
      <OptionTradeExchange />
    </>
  )
}

function TernaryOptionTradePriceWrapper() {
  const marketState = useTernaryOptionStore()
  const symbol = usePageContext().routeParams?.symbol
  const { isLogin } = useUserStore()
  const { data } = useFetchTernaryOptionCurrentCoin(symbol, false, true)
  const latestData = useTernaryOptionCoinSubscribe({
    symbol: data.symbol!,
  })
  useUpdateEffect(() => {
    if (data.symbol !== latestData.symbol) {
      return
    }
    marketState.updateCurrentCoin({
      ...marketState.currentCoin,
      ...latestData,
    })
  }, [latestData])
  useGetWsAssets()
  useEffect(() => {
    if (isLogin) {
      onGetAssetsCoinList()
    }
  }, [isLogin])

  return <></>
}

function TernaryOptionTrade() {
  const store = useTernaryOptionStore()
  const { currentCoinExcludePrice } = useTernaryOptionStore()
  const { setIsTutorialMode, cacheData, setDefaultEnums, fetchTradeEnums } = useOptionTradeStore()
  useUpdateEffect(() => {
    if (!currentCoinExcludePrice.id) {
      return
    }
    if (cacheData.needGuide !== false) {
      setIsTutorialMode(true)
    }
  }, [currentCoinExcludePrice.id])
  const kLinePosition = FutureSettingKLinePositionEnum.top as FutureSettingKLinePositionEnum
  const kLineInBottom = kLinePosition === FutureSettingKLinePositionEnum.bottom

  const pageRef = useRef<HTMLDivElement>(null)
  const scroll = useScroll()
  useEffect(() => {
    store.setIsPageScrolling(!!scroll && scroll?.top > (store.isPageScrolling ? 4 : 46))
  }, [scroll])
  useMount(() => {
    setDefaultEnums()
    fetchTradeEnums()
  })
  useGetCouponSelectList(ScenesBeUsedEnum.option)

  return (
    <div
      className={classNames(styles['trade-page'], 'text-sm min-h-screen text-leading-1-5', {
        'pb-16': kLineInBottom,
      })}
      ref={pageRef}
    >
      <MarketTernaryOptionForTrade />
      <TernaryOptionTradePriceWrapper />
      <TernaryOptionTradeHeader />
      {kLinePosition === FutureSettingKLinePositionEnum.top && (
        <div>
          <TradeKLine isOption symbolName="" />
        </div>
      )}
      <ExchangeContextContainer />
      <MyTrade />
      {kLineInBottom && (
        <div className="fixed w-full bottom-12 z-10 bg-bg_color">
          <TradeKLine isOption symbolName="" />
        </div>
      )}
    </div>
  )
}

export default TernaryOptionTrade
