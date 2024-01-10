import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import { useUnmount } from 'react-use'
import { useSafeState, useSize } from 'ahooks'
import {
  OrderBookButtonTypeEnum,
  OrderBookDepthTypeDefaultEnum,
  OrderBookContractMarkPriceSubs,
  getGearNumbers,
  EntrustType,
  DepthDataObject,
} from '@/store/order-book/common'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { useOrderFutureStore } from '@/store/order/future'
import { IBaseOrderItem, IFutureOrderItem } from '@/typings/api/order'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useOrderBookStore } from '@/store/order-book'
import { useFutureTradeStore } from '@/store/trade/future'
import { TradeModeEnum } from '@/constants/trade'
import { getFutureOrderIsBuy } from '@/helper/order/future'
import BuyOrderBook from '@/features/order-book/trade/component/buy-order-book'
import SellOrderBook from '@/features/order-book/trade/component/sell-order-book'
import OrderBookFooter from './footer'
import OrderBookHeader from './header'
import OrderBookTicker from './ticker'

interface OrderBookProps {
  /**
   * price 价格
   * total 合计
   * direction 方向 (买或者卖)
   * amount 数量
   */
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  tradeMode: string
}

function OrderBook({ onSelectPrice, tradeMode }: OrderBookProps) {
  const [mode, setMode] = useState<number>(OrderBookButtonTypeEnum.primary)
  const [mergeDepth, setMergeDepth] = useState<string>(OrderBookDepthTypeDefaultEnum.default)
  const [quantity, setQuantity] = useState<number>(0)
  const [entrust, setEntrust] = useSafeState<EntrustType>()

  const contentRef = useRef<HTMLDivElement>(null)
  const oldPrice = useRef<string>('')
  const contentWidth = useRef<number>(0)
  const oldSymbolWassName = useRef<string>('')

  const size = useSize(contentRef)

  const spotStore = useMarketStore()
  const contractStore = useContractMarketStore()
  const futureTradeStore = useFutureTradeStore()

  const { openOrderModule: spotOpenOrderModule } = useBaseOrderSpotStore()
  const { openOrderModule: contractOpenOrderModule } = useOrderFutureStore()
  const orderBookStore = useOrderBookStore()

  const { showIndexPrice } = futureTradeStore.settings

  const {
    wsDepthSubscribe,
    wsDepthUnSubscribe,
    wsMarketSubscribe,
    wsMarketUnSubscribe,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    setSymbolWassName,
    setWsDepthConfig,
    setWsMarketConfig,
    resetDepthAndMarketData,
    subscriptionModel,
  } = orderBookStore

  const store = tradeMode === TradeModeEnum.spot ? spotStore : contractStore
  const openOrderModule = tradeMode === TradeModeEnum.spot ? spotOpenOrderModule.normal : contractOpenOrderModule.normal
  const {
    symbolWassName,
    priceOffset,
    amountOffset,
    depthOffset,
    baseSymbolName: targetCoin,
    quoteSymbolName: denominatedCurrency,
  } = store.currentCoin

  const Header = useMemo(() => {
    return <OrderBookHeader targetCoin={targetCoin} denominatedCurrency={denominatedCurrency} tradeMode={tradeMode} />
  }, [targetCoin, denominatedCurrency])

  const Footer = useMemo(() => {
    return (
      <OrderBookFooter
        onHandicapModeChange={setMode}
        mergeDepth={mergeDepth}
        depthOffset={depthOffset || [OrderBookDepthTypeDefaultEnum.default]}
        onMergeDepth={setMergeDepth}
      />
    )
  }, [mergeDepth, depthOffset])

  useEffect(() => {
    setWsDepthConfig({
      mergeDepth,
      priceOffset,
      amountOffset,
      contentWidth: contentWidth.current,
      entrust,
      quantity,
      fiatOffest: 0,
    })
  }, [mergeDepth, entrust, contentWidth.current, priceOffset, amountOffset, quantity])

  useEffect(() => {
    setWsMarketConfig({
      denominatedCurrency,
      oldPrice,
    })
  }, [denominatedCurrency])

  useEffect(() => {
    const entrustList = [...(openOrderModule.data as Array<IBaseOrderItem & IFutureOrderItem>)]
    const buyEntrustPrice: Array<number> = []
    const sellEntrustPrice: Array<number> = []

    entrustList?.forEach(v => {
      /** 现货订单判断 */
      v.side === OrderBookButtonTypeEnum.buy && buyEntrustPrice.push(Number(v.entrustPrice))
      v.side === OrderBookButtonTypeEnum.sell && sellEntrustPrice.push(Number(v.entrustPrice))

      /** 合约订单判断 */
      if (v.sideInd) {
        const isBuy = getFutureOrderIsBuy(v.sideInd)
        isBuy ? buyEntrustPrice.push(Number(v.price)) : sellEntrustPrice.push(Number(v.price))
      }
    })
    setEntrust({ buyEntrustPrice, sellEntrustPrice })
  }, [openOrderModule.data])

  useEffect(() => {
    const { depthSubs, marketSubs } = subscriptionModel(tradeMode)

    if (oldSymbolWassName.current) {
      resetDepthAndMarketData()

      wsDepthUnSubscribe(depthSubs(oldSymbolWassName.current))
      wsMarketUnSubscribe(marketSubs(oldSymbolWassName.current))

      if (tradeMode === TradeModeEnum.futures) {
        oldSymbolWassName.current && wsMarkPriceUnSubscribe(OrderBookContractMarkPriceSubs(oldSymbolWassName.current))
      }
    }

    if (symbolWassName) {
      resetDepthAndMarketData()
      setSymbolWassName(symbolWassName)
      wsDepthSubscribe(depthSubs(symbolWassName))
      wsMarketSubscribe(marketSubs(symbolWassName))

      if (tradeMode === TradeModeEnum.futures) {
        wsMarkPriceSubscribe(OrderBookContractMarkPriceSubs(symbolWassName))
      }
    }

    oldSymbolWassName.current = symbolWassName as string
  }, [symbolWassName])

  useEffect(() => {
    depthOffset &&
      setMergeDepth(
        depthOffset.length > 0 ? depthOffset[depthOffset.length - 1] : OrderBookDepthTypeDefaultEnum.default
      )
  }, [depthOffset])

  useUnmount(() => {
    const { depthSubs, marketSubs } = subscriptionModel(tradeMode)

    wsDepthUnSubscribe(depthSubs(symbolWassName as string))
    wsMarketUnSubscribe(marketSubs(symbolWassName as string))

    if (tradeMode === TradeModeEnum.futures) {
      wsMarkPriceUnSubscribe(OrderBookContractMarkPriceSubs(symbolWassName as string))
    }

    DepthDataObject.destroyInstance()
  })

  useLayoutEffect(() => {
    contentWidth.current = contentRef.current?.offsetWidth as number
  }, [])

  useEffect(() => {
    if (size?.height) {
      setQuantity(getGearNumbers(size?.height, mode, tradeMode, false))
    }
  }, [size?.height, mode])

  return (
    <section className="trade-order-book h-full flex flex-col" ref={contentRef}>
      {Header}

      <div className="trade-order-main flex flex-1 flex-col h-full">
        {(mode === OrderBookButtonTypeEnum.primary || mode === OrderBookButtonTypeEnum.sell) && (
          <SellOrderBook
            onSelectPrice={onSelectPrice}
            quantity={quantity}
            width={contentWidth.current}
            tradeMode={tradeMode}
          />
        )}

        <OrderBookTicker
          hasRoundingSymbol={tradeMode === TradeModeEnum.spot}
          tradeMode={tradeMode}
          // hasIndexPrice={showIndexPrice}
        />

        {(mode === OrderBookButtonTypeEnum.primary || mode === OrderBookButtonTypeEnum.buy) && (
          <BuyOrderBook
            onSelectPrice={onSelectPrice}
            quantity={quantity}
            width={contentWidth.current}
            tradeMode={tradeMode}
          />
        )}
      </div>

      {Footer}
    </section>
  )
}

export default OrderBook
