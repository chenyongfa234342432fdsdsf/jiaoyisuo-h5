import { Loading, Tabs } from '@nbit/vant'
import React, { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { useMarketStore } from '@/store/market'
import { usePageContext } from '@/hooks/use-page-context'
import {
  getMarketTicker,
  getPerpetualMarketRestV1MarketDepthApiRequest,
  getV1PerpetualTradePairDetailApiRequest,
  postV3FullDepth,
} from '@/apis/market'
import AsyncSuspense from '@/components/async-suspense'
import spotWs from '@/plugins/ws'
import { getCurrentContractCoin } from '@/helper/market'
import futureWs from '@/plugins/ws/futures'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import MarketOrderBook from '@/features/order-book/market'
import MarketDetailSpotTrade from '@/features/trade/spot/market-detail-trade'
import { YapiGetV1TradePairDetailData } from '@/typings/yapi/TradePairDetailV1GetApi'
import NewDeal from '@/features/trade/new-deal'
import ErrorBoundary from '@/components/error-boundary'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { MarketActivityList } from '@/features/market/activity/market-activity-list'
import { initCurrentCoin } from '@/constants/market'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'
import { TradeModeEnum } from '@/constants/trade'
import MarketDetailFutureTrade from '@/features/trade/future/market-detail-trade'
import { OrderBookContractMarketSubs, OrderBookSpotMarketSubs } from '@/store/order-book/common'
import styles from './index.module.css'
import CurrentCoinDescribe from './current-coin-describe'
import CurrentHeader from './current-header'

const CurrentPrice = React.lazy(() => import('./current-price'))
const Chart = React.lazy(() => import('@/components/chart'))

interface DetailProps {
  type: KLineChartType
}

enum KLineTabsEnum {
  /** 委托订单 */
  order = 'order',
  /** 最新成交 */
  transaction = 'transaction',
  /** 行情异动 */
  activity = 'activity',
}

function Detail(props: DetailProps) {
  const tabList = [
    {
      title: t`features_market_detail_index_510199`,
      id: KLineTabsEnum.order,
      components: (
        <MarketOrderBook tradeMode={props.type === KLineChartType.Quote ? TradeModeEnum.spot : TradeModeEnum.futures} />
      ),
    },
    {
      title: t`features_market_detail_index_510200`,
      id: KLineTabsEnum.transaction,
      components: <NewDeal type={props.type} />,
    },
    {
      title: t`features_message_index_5101225`,
      id: KLineTabsEnum.activity,
      components: <MarketActivityList />,
    },
  ]
  let currentModule

  const marketState = useMarketStore()
  const contractMarketState = useContractMarketStore()
  const ws = props.type === KLineChartType.Futures ? futureWs : spotWs
  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }

  const pageContext = usePageContext()

  const [currentChartTab, setCurrentChartTab] = useState<number>(0)
  const symbolName = pageContext.routeParams.id
  const tempRef = useRef<any>()
  const controlRef = useRef<boolean>(true)

  const MarketWs = {
    Sub: 1,
    UnSub: 0,
  }
  const [marketWs, setMarketWs] = useState<number>(MarketWs.UnSub)

  useEffect(() => {
    return () => {
      /** 当通过路由跳转到其它页面时，需要清空当前币对信息，当用户从行情列表或者其它地方选择另外一个币对重新进入交易页面，这里不做清空，会导致 bug */
      currentModule.updateCurrentCoin(initCurrentCoin)
    }
  }, [])

  useEffect(() => {
    setMarketWs(MarketWs.UnSub)
  }, [symbolName])

  useEffect(() => {
    const kLineCallback = data => {
      // 更新实时报价信息
      const _priceOffset = tempRef.current.priceOffset || 4
      const _amountOffset = tempRef.current.amountOffset || 4
      // if (symbolName !== getCurrentContractCoin(data?.[0]?.symbolWassName)) {
      //   return
      // }
      /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
      if (!controlRef.current) return

      if (data?.length) {
        currentModule.updateCurrentCoin({
          ...tempRef.current,
          chg: Number(data[0].chg).toFixed(_priceOffset),
          close: Number(data[0].close).toFixed(_priceOffset),
          high: Number(data[0].high).toFixed(_priceOffset),
          last: Number(data[0].last).toFixed(_priceOffset),
          low: Number(data[0].low).toFixed(_priceOffset),
          open: Number(data[0].open).toFixed(_priceOffset),
          volume: Number(data[0].volume).toFixed(_amountOffset),
          quoteVolume: Number(data[0].quoteVolume).toFixed(_amountOffset),
        })
      }
    }
    const subs =
      props.type === KLineChartType.Quote
        ? OrderBookSpotMarketSubs(tempRef.current?.symbolWassName)
        : OrderBookContractMarketSubs(tempRef.current?.symbolWassName)

    if (marketWs === MarketWs.Sub) {
      ws.subscribe({
        subs,
        callback: kLineCallback,
        throttleType: WSThrottleTypeEnum.increment,
        throttleTime: WsThrottleTimeEnum.Fast,
      })
    }

    return () => {
      // if (klineWs === KlineWs.unSub) {
      ws.unsubscribe({
        subs,
        callback: kLineCallback,
      })
      // }
    }
  }, [marketWs])

  useEffect(() => {
    /** 进来的时候设置为 true */
    controlRef.current = true
    Promise.all([
      props.type === KLineChartType.Quote
        ? getMarketTicker({ symbol: symbolName })
        : getV1PerpetualTradePairDetailApiRequest({ symbol: symbolName }),
      props.type === KLineChartType.Quote
        ? postV3FullDepth({ symbol: symbolName, limit: '1000' })
        : getPerpetualMarketRestV1MarketDepthApiRequest({ symbol: symbolName, limit: '1000' }),
    ]).then(([detailRes, deptRes]) => {
      if (detailRes.isOk) {
        const { chg, quoteSymbolName, baseSymbolName } = detailRes.data as YapiGetV1TradePairDetailData
        /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
        if (!controlRef.current) return
        currentModule.updateCurrentCoin({
          ...currentModule.currentCoin,
          tradeId: detailRes.data?.id,
          change: chg,
          buySymbol: quoteSymbolName,
          sellSymbol: baseSymbolName,
          ...detailRes.data,
        })

        tempRef.current = detailRes.data

        if (tempRef.current?.id) {
          if (!controlRef.current) return
          setMarketWs(MarketWs.Sub)
        }
      }

      if (deptRes.isOk) {
        const asks = deptRes.data?.asks || []
        const bids = deptRes.data?.bids || []
        currentModule.updateCurrentInitPrice({
          buyPrice: bids[0]?.[0] || currentModule.currentCoin.last,
          sellPrice: asks[0]?.[0] || currentModule.currentCoin.last,
        })

        currentModule.updateDepthList(deptRes.data || {})
      }
    })

    return () => {
      controlRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolName])

  /** tab 切换 */
  const onTabChange = name => {
    currentModule.updateCurrentTab(name)
    // setCurrentTab(name)
  }

  const onTabChartChange = name => {
    setCurrentChartTab(name)
  }

  return (
    <div className={styles.scoped}>
      <div className="kline-header-w">
        <CurrentHeader type="kline" coinType={props.type} />
      </div>

      <Tabs align="start" className="tab" defaultActive={currentChartTab} onChange={onTabChartChange}>
        <Tabs.TabPane key={0} title={t`features_market_detail_index_510197`}>
          {currentChartTab === 0 && currentModule.currentCoin.symbolName ? (
            <div className="content-wrap">
              <div className="price-async-center">
                <AsyncSuspense>
                  <CurrentPrice type={props.type} />
                </AsyncSuspense>
              </div>
              <div className="detail-chart-wrap">
                <AsyncSuspense>
                  <ErrorBoundary>
                    <Chart from="kline" type={props.type} />
                  </ErrorBoundary>
                </AsyncSuspense>
              </div>
              <div className="coin-detail-wrap">
                <Tabs
                  className="tab-name"
                  defaultActive={currentModule.currentTab}
                  onChange={onTabChange}
                  align="start"
                >
                  {tabList.map((item, index) => {
                    if (props.type === KLineChartType.Futures && item.id === KLineTabsEnum.activity) {
                      return
                    }
                    return (
                      <Tabs.TabPane key={index} title={item.title}>
                        {item.components}
                      </Tabs.TabPane>
                    )
                  })}
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <Loading />
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane key={1} title={t`features_market_detail_index_510198`}>
          <CurrentCoinDescribe type={props.type} />
        </Tabs.TabPane>
      </Tabs>
      {currentChartTab === 0 && (
        <div className="footer-operation">
          {props.type === KLineChartType.Futures ? <MarketDetailFutureTrade /> : <MarketDetailSpotTrade />}
        </div>
      )}
    </div>
  )
}

export default Detail
