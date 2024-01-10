import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import spotWs from '@/plugins/ws'
import futuresWs from '@/plugins/ws/futures'
import {
  HandleDepthData,
  OrderBookButtonTypeEnum,
  HandlingEmptyData,
  OrderBookDepthDataType,
  OrderBookListLimitEnum,
  OrderBookSpotDepthSubs,
  OrderBookSpotMarketSubs,
  OrderBookContractDepthSubs,
  OrderBookContractMarketSubs,
} from '@/store/order-book/common'
import { TradeModeEnum } from '@/constants/trade'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { Depth } from '@/plugins/ws/protobuf/ts/proto/Depth'
import { Market_Body } from '@/plugins/ws/protobuf/ts/proto/Market'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { rateFilter } from '@/helper/assets/spot'
import produce from 'immer'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'

type SubsType = any[] | string | Record<string, any>

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    bidsList: <Array<OrderBookDepthDataType>>[],
    asksList: <Array<OrderBookDepthDataType>>[],
    symbolWassName: '',
    subscribeMode: 'spot',
    wsDepthConfig: {
      mergeDepth: '',
      priceOffset: 0,
      amountOffset: 0,
      contentWidth: 0,
      fiatOffest: 0,
      deepHandicap: 0,
      entrust: {
        buyEntrustPrice: [],
        sellEntrustPrice: [],
      },
      quantity: 0,
    },
    wsMarketConfig: {
      denominatedCurrency: '',
      oldPrice: '',
    },
    checkStatus: 0, // 买卖状态
    marketPrice: '', // 最新价
    marketPriceInitialValue: '', // 最新价初始值
    rate: '', // 最新价换算成法币价格
    contractMarkPrice: '', // 合约标记价格
    contractIndexPrice: '', // 合约指数价格
    contractMarkPriceInitialValue: '', // 合约标记价格初始值
    contractIndexPriceInitialValue: '', // 合约指数价格初始值
    resetDepthAndMarketData: () =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.bidsList = HandlingEmptyData(OrderBookListLimitEnum.twenty) as never[]
          _store.asksList = HandlingEmptyData(OrderBookListLimitEnum.twenty) as never[]
          _store.checkStatus = 0
          _store.marketPrice = ''
          _store.marketPriceInitialValue = ''
          _store.rate = ''
          _store.contractMarkPrice = ''
          _store.contractIndexPrice = ''
          _store.contractMarkPriceInitialValue = ''
          _store.contractIndexPriceInitialValue = ''
        })
      }),
    setSymbolWassName: (value: string) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.symbolWassName = value
        })
      }),
    setWsDepthConfig: value =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.wsDepthConfig = { ...value }
        })
      }),
    setWsMarketConfig: value =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.wsMarketConfig = { ...value }
        })
      }),
    subscriptionModel: (mode: string) => {
      const depthSubs = mode === TradeModeEnum.spot ? OrderBookSpotDepthSubs : OrderBookContractDepthSubs
      const marketSubs = mode === TradeModeEnum.spot ? OrderBookSpotMarketSubs : OrderBookContractMarketSubs

      set((store: IStore) => {
        return produce(store, _store => {
          _store.subscribeMode = mode
        })
      })

      return { depthSubs, marketSubs }
    },
    getSubscribeMode: () => {
      const state: IStore = get()
      return state.subscribeMode === TradeModeEnum.spot ? spotWs : futuresWs
    },
    setSubscribeMode: (value: string) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.subscribeMode = value
        })
      })
    },
    wsDepthCallback: (depthData: Depth) =>
      set((store: IStore) => {
        return produce(store, _store => {
          depthData = depthData[0]

          if (_store.symbolWassName === depthData.symbolWassName) {
            const { bidsList, asksList } = HandleDepthData(depthData, _store.wsDepthConfig.entrust)

            const bidsListFirstValue = bidsList[0] ? bidsList[0].tagPrice : 0
            const asksListFirstValue = asksList[0] ? asksList[0].tagPrice : 0

            if (
              bidsListFirstValue !== '--' &&
              asksListFirstValue !== '--' &&
              bidsListFirstValue === asksListFirstValue
            ) {
              if (asksList.length > 1) {
                const firstValue = asksList.shift()
                asksList[0].volume = formatNumberDecimal(
                  Number(firstValue?.volume) + Number(asksList[0].volume),
                  _store.wsDepthConfig.amountOffset
                )
              }
            }

            _store.bidsList = [...bidsList]
            _store.asksList = [...asksList]
          }
        })
      }),
    wsMarketCallBack: (marketData: Market_Body) =>
      set((store: IStore) => {
        return produce(store, _store => {
          marketData = marketData[0]

          if (_store.symbolWassName === marketData.symbolWassName) {
            _store.checkStatus =
              Number(marketData.last) > Number(_store.wsMarketConfig.oldPrice)
                ? OrderBookButtonTypeEnum.buy
                : Number(marketData.last) < Number(_store.wsMarketConfig.oldPrice)
                ? OrderBookButtonTypeEnum.sell
                : OrderBookButtonTypeEnum.primary

            _store.wsMarketConfig.oldPrice = marketData.last
            _store.marketPrice = formatCurrency(marketData.last, _store.wsDepthConfig.priceOffset)
            _store.marketPriceInitialValue = marketData.last
            _store.rate = rateFilter({
              amount: marketData.last,
              symbol: _store.wsMarketConfig.denominatedCurrency,
              isFormat: true,
              precision: _store.wsDepthConfig.priceOffset,
            }) as string
          }
        })
      }),
    wsMarkPriceCallback: (MarkPriceData: PerpetualIndexPrice) =>
      set((store: IStore) => {
        return produce(store, _store => {
          MarkPriceData = MarkPriceData[0]

          const priceOffset = _store.wsDepthConfig.priceOffset ? Number(_store.wsDepthConfig.priceOffset) : 0

          if (_store.symbolWassName === MarkPriceData.symbolWassName) {
            _store.contractMarkPrice = formatCurrency(MarkPriceData.markPrice, priceOffset)
            _store.contractIndexPrice = formatCurrency(MarkPriceData.indexPrice, priceOffset)
            _store.contractMarkPriceInitialValue = MarkPriceData.markPrice
            _store.contractIndexPriceInitialValue = MarkPriceData.indexPrice
          }
        })
      }),
    wsDepthSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.subscribe({
        subs,
        throttleTime: WsThrottleTimeEnum.Medium,
        throttleType: WSThrottleTypeEnum.cover,
        callback: state.wsDepthCallback,
      })
    },
    wsDepthUnSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.unsubscribe({
        subs,
        callback: state.wsDepthCallback,
      })
    },
    wsMarketSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.subscribe({
        subs,
        throttleTime: WsThrottleTimeEnum.Medium,
        throttleType: WSThrottleTypeEnum.cover,
        callback: state.wsMarketCallBack,
      })
    },
    wsMarketUnSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.unsubscribe({
        subs,
        callback: state.wsMarketCallBack,
      })
    },
    wsMarkPriceSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.subscribe({
        subs,
        throttleTime: WsThrottleTimeEnum.Medium,
        throttleType: WSThrottleTypeEnum.cover,
        callback: state.wsMarkPriceCallback,
      })
    },
    wsMarkPriceUnSubscribe: (subs: SubsType) => {
      const state: IStore = get()
      const ws = state.getSubscribeMode()

      ws.unsubscribe({
        subs,
        callback: state.wsMarkPriceCallback,
      })
    },
  }
}
const baseOrderBookStore = create(subscribeWithSelector(getStore))

const useOrderBookStore = createTrackedSelector(baseOrderBookStore)

export { useOrderBookStore, baseOrderBookStore }
