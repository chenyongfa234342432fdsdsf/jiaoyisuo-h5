import { useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import { useUnmount } from 'react-use'
import {
  HandleCurrencyPair,
  OrderBookDepthDataType,
  OrderBookListLimitEnum,
  HandlingEmptyData,
  DepthDataObject,
  handleOrderBookPopUpValue,
} from '@/store/order-book/common'
import { TradeModeEnum, TradeUnitEnum } from '@/constants/trade'
import { useFetchMarketCurrentSpotCoin, useFetchMarketCurrentFutureCoin } from '@/hooks/features/market'
import { usePageContext } from '@/hooks/use-page-context'
import { useOrderBookStore } from '@/store/order-book'
import { useTradeStore } from '@/store/trade'
import { DepthColorBlockEnum } from '@/constants/future/settings'
import { useFutureTradeStore } from '@/store/trade/future'
import styles from './index.module.css'

function MarketOrderBookContainer({ mergeDepth, tradeMode }) {
  const contentWidth = useRef<number>(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const oldSymbolWassName = useRef<string>('')

  const pageContext = usePageContext()
  const { settings } = useFutureTradeStore()

  const { generalSettings } = useTradeStore()

  const symbol = pageContext.routeParams.symbol

  const { targetCoin, denominatedCurrency } = HandleCurrencyPair(symbol)

  const spotCoin = useFetchMarketCurrentSpotCoin(`${targetCoin}${denominatedCurrency}`)
  const futureCoin = useFetchMarketCurrentFutureCoin(`${targetCoin}${denominatedCurrency}`)
  const store = tradeMode === TradeModeEnum.spot ? spotCoin : futureCoin
  const { priceOffset, amountOffset, symbolWassName } = store.data

  const orderBookStore = useOrderBookStore()
  const {
    wsDepthSubscribe,
    wsDepthUnSubscribe,
    setSymbolWassName,
    setWsDepthConfig,
    resetDepthAndMarketData,
    subscriptionModel,
    bidsList,
    asksList,
  } = orderBookStore

  const bidsListEmptyData = useMemo(() => {
    if (bidsList.length > 0 && bidsList.length < OrderBookListLimitEnum.twenty) {
      return HandlingEmptyData(OrderBookListLimitEnum.twenty - bidsList.length)
    }

    return []
  }, [bidsList.length])

  const asksListEmptyData = useMemo(() => {
    if (asksList.length > 0 && asksList.length < OrderBookListLimitEnum.twenty) {
      return HandlingEmptyData(OrderBookListLimitEnum.twenty - asksList.length)
    }

    return []
  }, [asksList.length])

  const handleMaximumQuantity = (list: Array<OrderBookDepthDataType>) => {
    return list.length > 0
      ? Math.max(
          ...list
            .slice(0, OrderBookListLimitEnum.twenty)
            .map(item =>
              Number(
                generalSettings.depthColorBlock === DepthColorBlockEnum.grandTotal
                  ? item.totalInitialValue !== '--'
                    ? item.totalInitialValue
                    : 0
                  : item.volumeInitialValue !== '--'
                  ? item.volumeInitialValue
                  : 0
              )
            )
        )
      : 0
  }

  const colorBlockWidth = (v: OrderBookDepthDataType, bodyWidth: number, maximumQuantity: number) => {
    const value =
      generalSettings.depthColorBlock === DepthColorBlockEnum.grandTotal ? v.totalInitialValue : v.volumeInitialValue
    return value !== '--' && maximumQuantity ? (Number(value) / maximumQuantity) * contentWidth.current : bodyWidth
  }

  const handelBidList = handleOrderBookPopUpValue([...bidsList, ...bidsListEmptyData])
  const buyMaximumQuantity = handleMaximumQuantity(handelBidList)

  const handelAsksList = handleOrderBookPopUpValue([...asksList, ...asksListEmptyData])
  const sellMaximumQuantity = handleMaximumQuantity(handelAsksList)

  useEffect(() => {
    setWsDepthConfig({
      mergeDepth,
      priceOffset: priceOffset || 2,
      amountOffset: amountOffset || 2,
      contentWidth: contentWidth.current,
      quantity: OrderBookListLimitEnum.twenty,
    })
  }, [mergeDepth, contentWidth.current, priceOffset, amountOffset])

  useEffect(() => {
    const { depthSubs } = subscriptionModel(tradeMode)

    if (oldSymbolWassName.current) {
      wsDepthUnSubscribe(depthSubs(oldSymbolWassName.current))
    }

    if (symbolWassName) {
      resetDepthAndMarketData()
      setSymbolWassName(symbolWassName)
      wsDepthSubscribe(depthSubs(symbolWassName))
    }

    oldSymbolWassName.current = symbolWassName as string
  }, [symbolWassName])

  useUnmount(() => {
    const { depthSubs } = subscriptionModel(tradeMode)

    wsDepthUnSubscribe(depthSubs(symbolWassName as string))

    DepthDataObject.destroyInstance()
  })

  useLayoutEffect(() => {
    contentWidth.current = contentRef.current?.offsetWidth as number
  }, [])

  return (
    <div className={`market-order-book-container ${styles.scoped}`}>
      <div className="buy" ref={contentRef}>
        {handelBidList.slice(0, OrderBookListLimitEnum.twenty).map((v: OrderBookDepthDataType, i) => (
          <div className="cell" key={i}>
            <div className="volume">
              <label>
                {tradeMode === TradeModeEnum.spot
                  ? v.volume
                  : settings.tradeUnit === TradeUnitEnum.indexBase
                  ? v.volume
                  : v.turnover}
              </label>
            </div>
            <div className="price">
              <label>{v.tagPrice}</label>
            </div>
            <div
              className="progress"
              style={{ width: colorBlockWidth(v, v.bodyWidth as number, buyMaximumQuantity) }}
            ></div>
          </div>
        ))}
      </div>

      <div className="sell">
        {handelAsksList.slice(0, OrderBookListLimitEnum.twenty).map((v: OrderBookDepthDataType, i) => (
          <div className="cell" key={i}>
            <div className="price">
              <label>{v.tagPrice}</label>
            </div>
            <div className="volume">
              <label>
                {tradeMode === TradeModeEnum.spot
                  ? v.volume
                  : settings.tradeUnit === TradeUnitEnum.indexBase
                  ? v.volume
                  : v.turnover}
              </label>
            </div>
            <div
              className="progress"
              style={{ width: colorBlockWidth(v, v.bodyWidth as number, sellMaximumQuantity) }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketOrderBookContainer
