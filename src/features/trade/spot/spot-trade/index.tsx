import classNames from 'classnames'
import OrderBook from '@/features/order-book/trade'
import Header from '@/features/trade/header'
import { EntrustTypeEnum, LayoutEnum, TradeModeEnum } from '@/constants/trade'
import { useMarketStore } from '@/store/market'
import { useTradeStore } from '@/store/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { FutureSettingKLinePositionEnum, FutureSettingOrderAreaPositionEnum } from '@/constants/future/settings'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { useFetchMarketCurrentSpotCoin, useSpotCoinSubscribe } from '@/hooks/features/market'
import CommonList from '@/components/common-list/list'
import { useUpdateEffect } from 'ahooks'
import { KLineChartType } from '@nbit/chart-utils'
import { useSpotTradeStore } from '@/store/trade/spot'
import { useCommonStore } from '@/store/common'
import { MarketSpotForTrade } from '@/hooks/features/market/market-list/use-market-trade-area'
import { ScenesBeUsedEnum } from '@/constants/welfare-center/common'
import { useGetCouponSelectList } from '@/hooks/features/welfare-center/coupon-select'
import MyTrade from '../my-trade'
import styles from './index.module.css'
import { ExchangeContext, useExchangeInTop } from '../../common/exchange/context'
import TradeKLine from '../../common/k-line'
import TradeNotification from '../../common/notification'
import SpotExchange from '../exchange'
import { spotTradeCalcHelper } from '../../common/exchange/calc/spot'
import { SpotNotAvailable } from '../not-available'

function ExchangeContextContainer() {
  const layout = LayoutEnum.left
  const { generalSettings } = useTradeStore()
  const pageContext = usePageContext()
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const useExchangeResult = useExchangeInTop(
    spotTradeCalcHelper,
    TradeModeEnum.spot,
    false,
    pageContext.urlParsed.search.direction ? Number(pageContext.urlParsed.search.direction) : undefined
  )
  const { tradeInfo, onEntrustPriceChange } = useExchangeResult
  const onSelectOrderBookPrice = (price: string) => {
    if (tradeInfo.entrustPriceType === EntrustTypeEnum.market || tradeInfo.entrustType === EntrustTypeEnum.market) {
      return
    }
    if (Number.isNaN(Number(price))) return
    onEntrustPriceChange(price)
  }

  return (
    <ExchangeContext.Provider value={useExchangeResult}>
      <div className={classNames('content', layout)}>
        <div className="flex">
          <div
            className={classNames('trade-exchange-wrapper', {
              'order-1 ml-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.right,
              'mr-4': generalSettings.orderAreaPosition === FutureSettingOrderAreaPositionEnum.left,
            })}
          >
            <SpotNotAvailable className="pt-9" coin={currentSpotCoin}>
              <SpotExchange />
            </SpotNotAvailable>
          </div>
          <div className="trade-orderbook-wrapper">
            <OrderBook onSelectPrice={onSelectOrderBookPrice} tradeMode={TradeModeEnum.spot} />
          </div>
        </div>
      </div>
    </ExchangeContext.Provider>
  )
}
function SpotTradePriceWrapper() {
  const marketState = useMarketStore()

  const symbol = usePageContext().routeParams?.symbol
  // TODO: 有 bug，在路由被切换前 pageContext 已经改变了
  const { data } = useFetchMarketCurrentSpotCoin(symbol, false, true)
  const latestData = useSpotCoinSubscribe({
    symbol: data.symbolName,
    baseSymbolName: data.baseSymbolName,
    symbolWassName: data.symbolWassName,
    quoteSymbolName: data.quoteSymbolName,
  })
  useUpdateEffect(() => {
    if (data.symbolWassName !== latestData.symbolWassName) {
      return
    }
    marketState.updateCurrentCoin({
      ...marketState.currentCoin,
      ...latestData,
    })
  }, [latestData])

  return <></>
}
function SpotTrade() {
  const { generalSettings } = useTradeStore()
  const { updateRefreshCounter } = useCommonStore()
  const data = useTradeCurrentSpotCoin()
  const kLineInBottom = generalSettings.kLinePosition === FutureSettingKLinePositionEnum.bottom
  const symbolNameInKLine = `${data.baseSymbolName}/${data.quoteSymbolName}`
  useGetCouponSelectList(ScenesBeUsedEnum.spot)

  return (
    <div
      className={classNames(styles.scoped, {
        'pb-16': kLineInBottom,
      })}
    >
      <MarketSpotForTrade />
      <SpotTradePriceWrapper />
      <Header type={KLineChartType.Quote} />
      <CommonList onRefreshing={updateRefreshCounter} onlyRefresh refreshing>
        <div className="min-h-screen">
          <TradeNotification />
          {generalSettings.kLinePosition === FutureSettingKLinePositionEnum.top && (
            <div className="mb-4">
              <TradeKLine symbolName={symbolNameInKLine} type={KLineChartType.Quote} />
            </div>
          )}
          <ExchangeContextContainer />
          <MyTrade />
          {kLineInBottom && (
            <div className="fixed w-full bottom-12 z-10 bg-bg_color">
              <TradeKLine symbolName={symbolNameInKLine} type={KLineChartType.Quote} />
            </div>
          )}
        </div>
      </CommonList>
    </div>
  )
}

export default SpotTrade
