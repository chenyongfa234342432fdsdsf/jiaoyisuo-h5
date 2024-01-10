import classNames from 'classnames'
import OrderBook from '@/features/order-book/trade'
import { FutureTradeHeader } from '@/features/trade/header/future'
import { EntrustTypeEnum, LayoutEnum, TradeModeEnum } from '@/constants/trade'
import { useTradeStore } from '@/store/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { FutureSettingKLinePositionEnum, FutureSettingOrderAreaPositionEnum } from '@/constants/future/settings'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import {
  useFetchMarketCurrentFutureCoin,
  useFutureCoinIndexPriceSubscribe,
  useFutureCoinSubscribe,
} from '@/hooks/features/market'
import CommonList from '@/components/common-list/list'
import { useUpdateEffect, useMount } from 'ahooks'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'
import { t } from '@lingui/macro'
import { useFutureTradeStore } from '@/store/trade/future'
import { useCommonStore } from '@/store/common'
import { FuturesDetailsLayout } from '@/features/assets/futures/futures-details'
import { getIsLogin } from '@/helper/auth'
import { MarketFuturesForTrade } from '@/hooks/features/market/market-list/use-market-trade-area'
import { ScenesBeUsedEnum } from '@/constants/welfare-center/common'
import { useGetCouponSelectList } from '@/hooks/features/welfare-center/coupon-select'
import MyTrade from '../my-trade'
import styles from './index.module.css'
import { ExchangeContext, useExchangeInTop } from '../../common/exchange/context'
import TradeKLine from '../../common/k-line'
import TradeNotification from '../../common/notification'
import { futureTradeCalcHelper } from '../../common/exchange/calc/future'
import FutureExchange from '../exchange'
import { SpotNotAvailable } from '../../spot/not-available'
import FutureExchangeHeader from '../header'
import { FutureTradeGuide } from './guide'
import { GuideModal } from '../open-future/guide-modal'

function ExchangeContextContainer() {
  const layout = LayoutEnum.left
  const { generalSettings } = useTradeStore()
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const pageContext = usePageContext()
  const useExchangeResult = useExchangeInTop(
    futureTradeCalcHelper,
    TradeModeEnum.futures,
    false,
    pageContext.urlParsed.search.direction ? Number(pageContext.urlParsed.search.direction) : undefined
  )
  const { tradeInfo, onEntrustPriceChange, onFutureMarketPriceChange } = useExchangeResult
  const onSelectOrderBookPrice = (price: string, count?: string, direction?: number) => {
    if (tradeInfo.entrustType === EntrustTypeEnum.plan && tradeInfo.entrustPriceType === EntrustTypeEnum.market) {
      return
    }
    if (Number.isNaN(Number(price))) return
    if (tradeInfo.entrustType === EntrustTypeEnum.market) {
      onFutureMarketPriceChange({
        price,
        count: count || '',
      })
      return
    }
    onEntrustPriceChange(price)
  }
  const { getPreference, fetchFutureGroups } = useFutureTradeStore()
  useMount(() => {
    fetchFutureGroups()
    getPreference()
  })
  return (
    <ExchangeContext.Provider value={useExchangeResult}>
      <div className="mb-2.5">
        <FutureExchangeHeader />
      </div>
      <div className={classNames('content', layout)}>
        <div className="flex">
          <div
            className={classNames('trade-exchange-wrapper', {
              'order-1 ml-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.right,
              'mr-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.left,
            })}
          >
            <SpotNotAvailable className="pt-9" coin={currentFutureCoin as any}>
              <FutureExchange />
            </SpotNotAvailable>
          </div>
          <div className="trade-orderbook-wrapper">
            <OrderBook onSelectPrice={onSelectOrderBookPrice} tradeMode={TradeModeEnum.futures} />
          </div>
        </div>
      </div>
    </ExchangeContext.Provider>
  )
}

function FutureTradePriceWrapper() {
  const marketState = useContractMarketStore()
  const symbol = usePageContext().routeParams?.symbol
  // TODO: 有 bug，在路由被切换前 pageContext 已经改变了
  const { data } = useFetchMarketCurrentFutureCoin(symbol, false, true)
  const latestData = useFutureCoinSubscribe({
    symbol: data.symbolName!,
    symbolWassName: data.symbolWassName!,
  })
  const indexPriceData = useFutureCoinIndexPriceSubscribe({
    symbolWassName: data.symbolWassName!,
  })
  useUpdateEffect(() => {
    if (data.symbolWassName !== latestData.symbolWassName || data.symbolWassName !== indexPriceData.symbolWassName) {
      return
    }
    marketState.updateCurrentCoin({
      ...marketState.currentCoin,
      ...latestData,
      ...indexPriceData,
    })
  }, [latestData, indexPriceData])

  return <></>
}

function FutureTrade() {
  const { generalSettings } = useTradeStore()
  const { subscribe, isTutorialMode, tutorialFutureDetailVisible } = useFutureTradeStore()
  const { updateRefreshCounter } = useCommonStore()
  useMount(subscribe)
  const data = useTradeCurrentFutureCoin()
  const kLineInBottom = generalSettings.kLinePosition === FutureSettingKLinePositionEnum.bottom
  const symbolNameInKLine = `${data.baseSymbolName}${data.quoteSymbolName} ${t`assets.enum.tradeCoinType.perpetual`}`
  const pageContext = usePageContext()
  const showGuideModal = pageContext.path.includes('userGuide')
  useGetCouponSelectList(ScenesBeUsedEnum.perpetual)

  return (
    <div
      className={classNames(styles.scoped, {
        'pb-16': kLineInBottom,
      })}
    >
      {showGuideModal && <GuideModal />}
      <MarketFuturesForTrade />
      <FutureTradeGuide />
      <FutureTradePriceWrapper />
      <div
        className={classNames({
          hidden: tutorialFutureDetailVisible,
        })}
      >
        <FutureTradeHeader />
        <CommonList onRefreshing={updateRefreshCounter} onlyRefresh refreshing>
          <div className="min-h-screen">
            <TradeNotification mode={TradeModeEnum.futures} />
            {generalSettings.kLinePosition === FutureSettingKLinePositionEnum.top && (
              <div className="mb-1.5">
                <TradeKLine symbolName={symbolNameInKLine} type={KLineChartType.Futures} />
              </div>
            )}
            <div className="mb-2.5">
              <ExchangeContextContainer />
            </div>
            <MyTrade />
            {kLineInBottom && (
              <div className="fixed w-full bottom-12 z-10 bg-bg_color">
                <TradeKLine symbolName={symbolNameInKLine} type={KLineChartType.Futures} />
              </div>
            )}
          </div>
        </CommonList>
      </div>
      <div
        className={classNames({
          hidden: !isTutorialMode || !tutorialFutureDetailVisible || !getIsLogin(),
        })}
      >
        {isTutorialMode && <FuturesDetailsLayout />}
      </div>
    </div>
  )
}

export default FutureTrade
