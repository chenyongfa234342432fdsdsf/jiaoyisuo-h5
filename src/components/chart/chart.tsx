import { Loading } from '@nbit/vant'
import React, { useEffect, useRef, memo, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'
import { ChartKLineRequest, initMainIndicator, initSubIndicator } from '@/constants/market'
import cacheUtils from 'store'

import {
  ChartLayoutOptionsType,
  KLineChartData,
  MainIndicatorType,
  SubIndicatorType,
  SwitchTimeType,
  KLineChartType,
  DeptChartSpecieEnum,
  DeptChartData,
  DeptList,
  timeMap,
  WSThrottleTypeEnum,
  sortMarketChartData,
  getTheme,
  fullscreen,
  tradingviewTimeMap,
} from '@nbit/chart-utils'

import { IncreaseTag } from '@nbit/react'
import { KLineChart, Dept } from '@nbit/chart-h5'
import { getIsLogin } from '@/helper/auth'
import Icon from '@/components/icon'
import {
  getKlineHistory,
  getOrdersHistoryKline,
  getPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
  getPerpetualMarketRestV1MarketKlinesApiRequest,
  getPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
} from '@/apis/market'
import spotWs from '@/plugins/ws'
import futureWs from '@/plugins/ws/futures'
import { useMarketStore } from '@/store/market'
import { usePageContext } from '@/hooks/use-page-context'
import { getCurrentQuoteShowCoin, getLocaleCurrency } from '@/helper/market'
import { YapiGetV1OrdersHistoryKlineListData } from '@/typings/yapi/OrdersHistoryKlineV1GetApi'
import { SpotNotAvailable } from '@/features/trade/spot/not-available'
import { YapiGetV1TradePairDetailData } from '@/typings/yapi/TradePairDetailV1GetApi'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { formatNumberDecimal } from '@/helper/decimal'
import { useSafeState } from 'ahooks'
import { useTradeStore } from '@/store/trade'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { useContractMarketStore } from '@/store/market/contract'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
// import { KLineChart, Dept } from './src'
import HeaderData from './header-data'
import IndicatorPop from './indicator-pop'
import TimePop from './time-pop'
import ChartPop from './chart-pop'
import IndicatorSelect from './indicator-select'

import styles from './chart.module.css'

interface PropsType {
  kLineChartData: Array<KLineChartData>
  theme: string
  type: KLineChartType
  from: 'kline' | 'trade'
  klineDetail?: YapiGetV1TradePairListData
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

enum ChartVersion {
  Normal = 'normal',
  Dept = 'dept',
}

const keepDecimal = (value, offset) => {
  if (!value) {
    return 0
  }
  return Number(Number(value).toFixed(offset))
}

function KLine(props: PropsType) {
  let currentModule
  const contractKline = {
    perpetual_index_kline: getPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
    perpetual_market_kline: getPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
    perpetual_kline: getPerpetualMarketRestV1MarketKlinesApiRequest,
  }
  const marketState = useMarketStore()
  const TradeStore = useTradeStore()
  const useStore = useUserStore()
  const contractMarketState = useContractMarketStore()
  const ws = props.type === KLineChartType.Futures ? futureWs : spotWs
  if (props.klineDetail) {
    currentModule = { currentCoin: props.klineDetail }
  } else {
    if (props.type === KLineChartType.Quote) {
      currentModule = marketState
    } else {
      currentModule = contractMarketState
    }
  }

  const currentPriceTypeRef = useRef('perpetual_kline')
  const currentModuleRef = useRef<any>(null)
  useEffect(() => {
    currentModuleRef.current = currentModule
  }, [currentModule])
  useEffect(() => {
    if (currentModule.currentPriceType) {
      currentPriceTypeRef.current = currentModule.currentPriceType
    }
  }, [currentModule.currentPriceType])
  // const { setting } = TradeStore
  const isLogin = getIsLogin()
  const { personalCenterSettings } = useStore
  const colors = personalCenterSettings.colors || UserUpsAndDownsColorEnum.greenUpRedDown
  const totalShareTimeList = currentModule.totalShareTimeList
  const initialShareTimeList = currentModule.initialShareTimeList

  const [initialShareTimeListCopy, setInitialShareTimeListCopy] =
    useSafeState<Array<SwitchTimeType>>(initialShareTimeList)
  const restShareTimeList = currentModule.restShareTimeList

  const updateInitialShareTimeList = currentModule.updateInitialShareTimeList
  const updateRestShareTimeList = currentModule.updateRestShareTimeList

  const controlRef = useRef<boolean>(true)

  const priceOffset = Number(currentModule.currentCoin.priceOffset) || 4
  const amountOffset = Number(currentModule.currentCoin.amountOffset) || 4
  const { bgColor, textColor, brandColor, upColor, downColor, textColor01, cardBgColor03 } = getTheme()
  const [ordersKlineData, setOrdersKlineData] = useSafeState<YapiGetV1OrdersHistoryKlineListData[]>()
  const [currentChart, setCurrentChart] = useSafeState<string>(ChartVersion.Normal)
  const [curData, setCurData] = useSafeState<Array<KLineChartData>>([])
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [mainIndicator, setMainIndicator] = useSafeState<MainIndicatorType>(initMainIndicator)

  const pageContext = usePageContext()
  const locale = pageContext.locale || ''

  const [deptData, setDeptData] = useSafeState<Array<DeptChartData>>([])
  const curDataRef = useRef<Array<KLineChartData>>([])

  const childRef = useRef<{
    updateCandlestickData: (data, ref) => void
    updateTimeData: (data, ref) => void
    updateVolumeData: (data) => void
    updateMaData: () => void
    updateWrData: () => void
    updateRsiData: () => void
    updateKdjData: () => void
    updateBollData: () => void
    updateMacdData: () => void
    scrollToTime: (v) => void
  }>()

  const [subIndicator, setSubIndicator] = useSafeState<SubIndicatorType>(initSubIndicator)
  const [getDataAndUpdateChart, setGetDataAndUpdateChart] = useSafeState<number>(0)
  const [curTime, setCurTime] = useSafeState<SwitchTimeType>({
    unit: 'm',
    value: 15,
  })

  const [chartLayoutOptions, setChartLayoutOptions] = useSafeState<ChartLayoutOptionsType & { fontSize: number }>({
    background: {
      color: bgColor,
    },
    textColor,
    fontSize: 10,
  })

  const curTimeRef = useRef<SwitchTimeType>(curTime)

  useEffect(() => {
    curTimeRef.current = curTime
  }, [curTime.value, curTime.unit])

  const mainIndicatorStorage = cacheUtils.get('mainIndicator') || '{}'
  const subIndicatorStorage = cacheUtils.get('subIndicator') || '{}'

  const KlineWs = {
    Sub: 1,
    unSub: 0,
    OutSub: 2,
  }
  const [klineWs, setKlineWs] = useSafeState<number>(KlineWs.unSub)
  const symbolName = pageContext.routeParams.id

  useEffect(() => {
    if (mainIndicatorStorage.ma) {
      setMainIndicator(mainIndicatorStorage)
    }

    if (subIndicatorStorage.macd) {
      setSubIndicator(subIndicatorStorage)
    }
  }, [JSON.stringify(mainIndicatorStorage), JSON.stringify(subIndicatorStorage)])

  const onlineRef = useRef<boolean>(true)
  const pageVisibelRef = useRef<boolean>(false)

  useEffect(() => {
    if (!currentModule.currentCoin.symbolName) {
      return
    }
    let chartRequestInterval

    chartRequestInterval = setInterval(() => {
      if (!navigator.onLine) {
        onlineRef.current = false
      } else {
        if (!onlineRef.current) {
          controlRef.current = false
          getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, null, ChartKLineRequest.OutLine)
        }
      }
    }, 10000)

    const visibleChange = () => {
      // 页面变为可见时触发
      if (document.visibilityState === 'visible') {
        controlRef.current = false
        setKlineWs(KlineWs.unSub)
        pageVisibelRef.current = true
        requestAnimationFrame(() => {
          getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, null, ChartKLineRequest.OutLine)
        })
      }
    }
    document.addEventListener('visibilitychange', visibleChange)
    return () => {
      clearInterval(chartRequestInterval)
      document.removeEventListener('visibilitychange', visibleChange)
    }
  }, [currentModule.currentCoin.symbolName])

  useEffect(() => {
    const kLineCallback = data => {
      // 更新实时报价信息
      /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
      if (!controlRef.current) return

      if (data?.[0]?.time) {
        if (currentModuleRef.current?.currentCoin.symbolWassName !== data?.[0]?.symbolWassName) {
          return
        }

        if (pageVisibelRef.current) {
          setGetDataAndUpdateChart(new Date().valueOf() + 1)
          pageVisibelRef.current = false
        }

        data.forEach(item => {
          const value = {
            time: Number(item.time),
            open: Number(item.open),
            /** 后端返回数据有时候最高价小于开盘价，前端容错 */
            high: item.high < item.open ? item.open : item.high,
            low: item.low < item.close ? item.low : item.close,
            close: Number(item.close),
            volume: Number(item.volume),
            quoteVolume: Number(item.quoteVolume),
          }
          if (curDataRef.current?.length) {
            /** 图表拉取数据时，ws要根据当前选择的时间，来调整k线柱子，比如1小时k线，ws就在1小时跳动，这里要加入时间的判断 */
            const lastValue = Number(curDataRef.current[curDataRef.current.length - 1]?.time)
            /** 时间不等时，判断图表所处时间范围 */

            if (
              lastValue === value.time ||
              (value.time > lastValue &&
                value.time <
                  lastValue +
                    Number(tradingviewTimeMap[`${curTimeRef.current.value}${curTimeRef.current.unit}`]) * 60 * 1000)
            ) {
              const newCurData = curDataRef.current.map((item, index) => {
                if (index === curDataRef.current.length - 1) {
                  return {
                    ...value,
                    open: item.open,
                    volume: Number((value.volume + (item.volume || 0)).toFixed(amountOffset)),
                    quoteVolume: Number((value.quoteVolume + (item.quoteVolume || 0)).toFixed(amountOffset)),
                    high: value.high > item.high ? value.high : item.high,
                    low: value.low < item.low ? value.low : item.low,
                    time: item.time,
                  }
                }
                return item
              })
              // setCurData(sortMarketChartData(newCurData))
              curDataRef.current = newCurData
              updateIndSetting()
            } else {
              const newCurData = sortMarketChartData(curDataRef.current.concat([value]))
              // setCurData(newCurData)

              curDataRef.current = newCurData
            }

            const newValue = curDataRef.current[curDataRef.current.length - 1]
            if (curTimeRef.current?.unit === 'time') {
              childRef.current?.updateTimeData(
                {
                  ...newValue,
                  value: newValue.close,
                },
                curDataRef.current
              )
            } else {
              childRef.current?.updateCandlestickData(newValue, curDataRef.current)
            }
            childRef.current?.updateVolumeData({
              ...newValue,
              time: newValue.time,
              value: newValue.volume,
              quoteVolume: newValue.quoteVolume,
              dir: newValue.close > newValue.open ? 'rise' : 'fall',
            })
          }
        })
      }
    }
    const subs = {
      biz: props.type === KLineChartType.Quote ? 'spot' : 'perpetual',
      type: props.type === KLineChartType.Quote ? 'kline' : currentPriceTypeRef.current,
      base: currentModuleRef.current?.currentCoin.baseSymbolName,
      quote: currentModuleRef.current?.currentCoin.quoteSymbolName,
      contractCode: currentModuleRef.current?.currentCoin.symbolWassName,
    }
    if (klineWs === KlineWs.Sub || klineWs === KlineWs.OutSub) {
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
  }, [klineWs])

  useEffect(() => {
    setKlineWs(KlineWs.unSub)
    return () => {
      controlRef.current = false
      curDataRef.current = []
      setCurData([])
      setDeptData([])
    }
  }, [symbolName])

  useEffect(() => {
    const _bgColor = getTheme().bgColor
    const _textColor = getTheme().textColor
    setChartLayoutOptions({
      background: {
        color: _bgColor,
      },
      textColor: _textColor,
      fontSize: 10,
    })
  }, [props.theme])

  /** ws 更新图表指标 */
  const updateIndSetting = () => {
    /** 如果设置了下面的指标，在 ws 改变的时候，会同时改变下面的指标，切换时间指标后，会导致可能出现 ws 数据不对的情况 */
    childRef.current?.updateMaData()
    childRef.current?.updateWrData()
    childRef.current?.updateRsiData()
    childRef.current?.updateKdjData()
    childRef.current?.updateBollData()
    childRef.current?.updateMacdData()
  }

  const apiTimeRef = useRef<Array<number>>([])

  let apiRequest = props.type === KLineChartType.Quote ? getKlineHistory : contractKline[currentPriceTypeRef.current]

  /** 请求 k 线数据 */
  const getKlineHistoryData = (symbolName, timeSharing, param?, requestType?) => {
    controlRef.current = true
    const symbol = symbolName
    const time = timeMap[`${timeSharing.value}${timeSharing.unit}`]
    const params = {
      symbol,
      interval: time,
      limit: String(24 * 60),
      endTime: param?.time || undefined,
    }

    apiRequest(params).then(res => {
      if (res.isOk) {
        /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
        if (!controlRef.current) return
        const klineData: Array<KLineChartData> = []
        if (res.data?.list?.length) {
          res.data?.list?.forEach(item => {
            const barValue = {
              time: Number(item[6]),
              open: Number(item[0]),
              close: Number(item[3]),
              quoteVolume: Number(item[5]),
              volume: Number(item[4]),
              /** 后端返回数据有时候最高价小于开盘价，前端容错 */
              high: Number(item[1]) < Number(item[0]) ? Number(item[0]) : Number(item[1]),
              low: Number(item[2]) > Number(item[3]) ? Number(item[3]) : Number(item[2]),
            }
            klineData.push(barValue)
          })

          if (requestType === ChartKLineRequest.OutLine) {
            onlineRef.current = true
          }

          /** 滚动图表，如果接口返回的数据为空，就把之前的数据返回 */
          if (param?.time) {
            setCurData(sortMarketChartData(klineData).concat(curDataRef.current))
            curDataRef.current = sortMarketChartData(sortMarketChartData(klineData).concat(curDataRef.current))
          } else {
            /** 如果不是滚动的时候拉取数据，就把已记录的时间清空，这么做是为了防止图表滚动到最左侧的时候，频繁的去拉取接口 */
            apiTimeRef.current = []

            setCurData(sortMarketChartData(klineData))
            curDataRef.current = sortMarketChartData(klineData)
          }
          /** 时间取整，行情异动的时间可能非k 线柱子 */
          if (currentModule.marketChangesTime) {
            if (
              currentModule.marketChangesTime <
              curDataRef.current[curDataRef.current.length - 1].time - 1000 * 60 * 60 * 24
            ) {
              childRef.current?.scrollToTime(
                Math.floor(currentModule.marketChangesTime / 1000 / 60 / 60) * 1000 * 60 * 60
              )
            } else {
              childRef.current?.scrollToTime(Math.floor(currentModule.marketChangesTime / 1000 / 60) * 1000 * 60)
            }
          }
          setGetDataAndUpdateChart(new Date().valueOf())
        }

        if (!requestType) {
          setKlineWs(KlineWs.Sub)
        }
        if (requestType === ChartKLineRequest.OutLine) {
          setKlineWs(KlineWs.OutSub)
        }
      }
    })
  }

  /** 图表滚动的时候去拉去更多的数据，拼接在图表数据的头部 */
  const getMoreKlineData = param => {
    if (apiTimeRef.current?.indexOf(param.time) !== -1) {
      return
    } else {
      let value: any = apiTimeRef.current
      apiTimeRef.current = value.concat([param.time])
    }
    getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, param, ChartKLineRequest.More)
  }

  useEffect(() => {
    if (!currentModule.marketChangesTime || !curDataRef.current?.length) {
      return
    }

    if (
      currentModule.marketChangesTime <
      curDataRef.current[curDataRef.current.length - 1].time - 1000 * 60 * 60 * 24
    ) {
      if (curTimeRef.current?.value === 1 && curTimeRef.current?.unit === 'h') {
        getKlineHistoryData(
          currentModule.currentCoin.symbolName,
          curTimeRef.current,
          null,
          ChartKLineRequest.MarketChanges
        )
      } else {
        setCurTime({
          value: 1,
          unit: 'h',
        })
      }
    } else {
      if (curTimeRef.current?.value === 1 && curTimeRef.current?.unit === 'm') {
        getKlineHistoryData(
          currentModule.currentCoin.symbolName,
          curTimeRef.current,
          null,
          ChartKLineRequest.MarketChanges
        )
      } else {
        setCurTime({
          value: 1,
          unit: 'm',
        })
      }
    }
  }, [currentModule.marketChangesTime])

  useEffect(() => {
    // if (currentModule.currentCoin.id && currentChart !== ChartVersion.Dept && isLogin) {
    //   getOrdersHistoryKline({
    //     tradeId: currentModule.currentCoin.id,
    //   }).then(res => {
    //     if (res.isOk) {
    //       setOrdersKlineData(res.data)
    //     }
    //   })
    // }
    if (!currentModule.currentCoin.symbolName) {
      return
    }
    setCurData([])
    curDataRef.current = []
    if (currentModule.currentCoin.id && curTime.value) {
      getKlineHistoryData(currentModule.currentCoin.symbolName, curTime)
    }

    return () => {
      controlRef.current = false
    }
    // }, [currentModule.currentCoin.id, curTime.unit, curTime.value, isLogin, layout.kLineHistory])
  }, [currentModule.currentCoin.symbolName, curTime.unit, curTime.value, isLogin, currentPriceTypeRef.current])

  const updateDeptList = depthList => {
    const asks = depthList.asks || []
    const bids = depthList.bids || []

    // 买入
    const buyData =
      bids.map(item => {
        return {
          value: Number(Number(item[1]).toFixed(amountOffset)),
          time: Number(Number(item[0]).toFixed(priceOffset)),
          direction: 'buy',
        }
      }) || []

    // 卖出
    const sellData =
      asks.map(item => {
        return {
          value: Number(Number(item[1]).toFixed(amountOffset)),
          time: Number(Number(item[0]).toFixed(priceOffset)),
          direction: 'sell',
        }
      }) || []

    // 买
    buyData.sort((x, y) => {
      return x.time - y.time
    })

    sellData.sort((x, y) => {
      return x.time - y.time
    })

    const _buyData: Array<{
      value: number
      time: number
      direction: string
      chg: number
    }> = []
    buyData.forEach((item, index) => {
      let sum = 0
      for (let i = (buyData?.length || 0) - 1; i >= index; i -= 1) {
        sum += buyData[i].value
      }

      _buyData.push({
        ...item,
        chg: keepDecimal(
          ((buyData[buyData?.length - 1].time - item.time) / (buyData[buyData?.length - 1].time || 1)) * 100,
          priceOffset + 2
        ),
        time: keepDecimal(item.time, priceOffset),
        value: keepDecimal(sum, amountOffset),
      })
    })

    const _sellData: Array<{
      value: number
      time: number
      direction: string
      chg: number
    }> = []
    sellData.forEach((item, index) => {
      let sum = 0
      for (let i = 0; i <= index; i += 1) {
        sum += sellData[i].value
      }

      _sellData.push({
        ...item,
        chg: keepDecimal(((item.time - sellData[0].time) / (sellData[0].time || 1)) * 100, priceOffset + 2),
        time: keepDecimal(item.time, priceOffset),
        value: keepDecimal(sum, amountOffset),
      })
    })

    setDeptData(_buyData.concat(_sellData))
  }

  useEffect(() => {
    if (!currentModule.currentCoin.symbolName || !currentModule.depthList?.length) {
      return
    }
    const deptSubs = {
      biz: props.type === KLineChartType.Quote ? 'spot' : 'perpetual',
      type: props.type === KLineChartType.Quote ? 'depth' : 'perpetual_depth',
      base: currentModule.currentCoin.baseSymbolName,
      quote: currentModule.currentCoin.quoteSymbolName,
      contractCode: currentModule.currentCoin.symbolWassName,
    }

    const depthCallback = data => {
      // 更新实时报价信息
      if (data?.length) {
        updateDeptList({
          ...data[0],
          asks: data[0].asks.map(item => {
            return [item.price, item.volume]
          }),
          bids: data[0].bids.map(item => {
            return [item.price, item.volume]
          }),
        })
      }
    }

    if (currentModule.depthList.asks?.[0]?.[0]) {
      updateDeptList(currentModule.depthList)
      ws.subscribe({
        subs: deptSubs,
        callback: depthCallback,
        throttleType: WSThrottleTypeEnum.cover,
        throttleTime: WsThrottleTimeEnum.Fast,
      })
    } else {
      updateDeptList([])
    }
    return () => {
      ws.unsubscribe({
        subs: deptSubs,
        callback: depthCallback,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule.currentCoin.symbolName, currentModule.depthList])

  const [isFullScreen, setIsFullScreen] = useSafeState<boolean>(false)

  const [popState, setPopState] = useSafeState(false)

  const [popTimeState, setPopTimeState] = useSafeState(false)

  const [popIndicatorState, setPopIndicatorState] = useSafeState(false)

  const showSettingOfTime = () => {
    setPopTimeState(true)
  }

  const showIndicatorOfChart = () => {
    setPopIndicatorState(true)
  }

  const onClose = () => setPopState(false)

  const [chartHeight, setChartHeight] = useSafeState(390)

  // const onChangeAfter = v => {
  //   setChartHeight(v)
  // }

  return (
    <div ref={fullscreenRef} className={styles.scoped}>
      <SpotNotAvailable
        className="not-avi"
        type="kline"
        tipAlign="center"
        coin={currentModule.currentCoin as unknown as YapiGetV1TradePairDetailData}
      >
        <div
          className="full-wrap"
          style={{
            height: isFullScreen ? '100vw' : chartHeight,
            width: isFullScreen ? 'var(--vh100)' : '100%',
            transform: isFullScreen ? 'rotate(90deg) translate(241px, 240px)' : 'unset',
          }}
        >
          {isFullScreen ? (
            <div className="full-coin-info">
              <div>
                <span>
                  {getCurrentQuoteShowCoin(
                    currentModule.currentCoin.baseSymbolName,
                    currentModule.currentCoin.quoteSymbolName
                  )}
                </span>
                <span
                  className={classNames('last-price', {
                    'text-buy_up_color': parseInt(currentModule.currentCoin.chg) >= 0,
                    'text-sell_down_color': parseInt(currentModule.currentCoin.chg) < 0,
                  })}
                >
                  {currentModule.currentCoin.last}
                </span>
                <span className="cny">{getLocaleCurrency(currentModule.currentCoin.cny, '￥')}</span>
                <span>
                  <IncreaseTag hasPostfix digits={2} value={currentModule.currentCoin.chg} />
                </span>
              </div>
              <Icon
                onClick={() => {
                  fullscreen(fullscreenRef, isFullScreen, setIsFullScreen)
                }}
                name={'a-icon_Cancelfull_white'}
                className="icon"
              />
            </div>
          ) : null}
          <HeaderData
            currentChart={currentChart}
            setCurrentChart={setCurrentChart}
            locale={locale}
            tradeId={currentModule.currentCoin.id}
            curTime={curTime}
            setCurTime={setCurTime}
            setPopState={setPopState}
            from={props.from}
          />
          {/* {!isFullScreen ? (
          <div className="full-screen" onClick={() => {
                fullscreen(fullscreenRef, isFullScreen, setIsFullScreen)
              }}>
            <Icon name={'icon_full_white'} className="icon" />
          </div>
        ) : null} */}
          <ChartPop
            showSettingOfTime={showSettingOfTime}
            showIndicatorOfChart={showIndicatorOfChart}
            onClose={onClose}
            chartHeight={chartHeight}
            setChartHeight={setChartHeight}
            popState={popState}
            setPopState={setPopState}
          />
          <TimePop setPopTimeState={setPopTimeState} popTimeState={popTimeState} />
          <IndicatorPop
            setMainIndicator={setMainIndicator}
            mainIndicator={mainIndicator}
            subIndicator={subIndicator}
            setSubIndicator={setSubIndicator}
            popIndicatorState={popIndicatorState}
            setPopIndicatorState={setPopIndicatorState}
          />
          <div
            className={classNames('chart-wrap')}
            style={{ height: currentChart === ChartVersion.Normal ? 'calc(100% - 64px)' : 'calc(100% - 32px)' }}
          >
            <div
              className={classNames('chart-include-ind', {
                'show': currentChart === ChartVersion.Normal,
                'not-show': currentChart !== ChartVersion.Normal,
              })}
            >
              {/* <div className={'chart-common'} style={{ height: 'calc(100% - 32px)' }}> */}
              <div className={'chart-common'}>
                {currentChart === ChartVersion.Normal &&
                  (curData.length ? (
                    <KLineChart
                      theme={props.theme}
                      chartLayoutOptions={chartLayoutOptions}
                      data={curData}
                      curDataRef={curDataRef.current}
                      createChart={{ brandColor, upColor, downColor, bgColor, textColor, textColor01, cardBgColor03 }}
                      mainIndicator={mainIndicator}
                      subIndicator={subIndicator}
                      curTime={curTime}
                      ref={childRef}
                      chartHeight={chartHeight - 64}
                      offset={{ priceOffset, amountOffset }}
                      // ordersKlineData={ordersKlineData}
                      locale={locale}
                      coinInfo={{
                        baseSymbolName: currentModule.currentCoin.baseSymbolName,
                        quoteSymbolName: currentModule.currentCoin.quoteSymbolName,
                      }}
                      getDataAndUpdateChart={getDataAndUpdateChart}
                      getMoreKlineData={getMoreKlineData}
                      updateMarketChangesTime={currentModule.updateMarketChangesTime}
                      colors={colors}
                    />
                  ) : (
                    <div className="spin-wrap">
                      <Loading />
                    </div>
                  ))}
              </div>
              {isFullScreen && currentChart !== ChartVersion.Dept ? (
                <IndicatorSelect
                  mainIndicator={mainIndicator}
                  setMainIndicator={setMainIndicator}
                  setSubIndicator={setSubIndicator}
                  chartHeight={chartHeight}
                  setChartHeight={setChartHeight}
                  subIndicator={subIndicator}
                  isFullScreen={isFullScreen}
                />
              ) : null}
            </div>
            <div
              className={classNames('chart-common', {
                show: currentChart === ChartVersion.Dept,
                hidden: currentChart !== ChartVersion.Dept,
              })}
            >
              {currentChart === ChartVersion.Dept &&
                (deptData.length ? (
                  <Dept
                    type={DeptChartSpecieEnum.DeptCurrent}
                    theme={props.theme}
                    deptData={deptData}
                    offset={{ priceOffset, amountOffset }}
                    colors={colors}
                  />
                ) : (
                  <div className="spin-wrap">
                    <Loading />
                  </div>
                ))}
            </div>{' '}
          </div>
          {!isFullScreen && currentChart !== ChartVersion.Dept ? (
            <IndicatorSelect
              mainIndicator={mainIndicator}
              setMainIndicator={setMainIndicator}
              setSubIndicator={setSubIndicator}
              chartHeight={chartHeight}
              setChartHeight={setChartHeight}
              subIndicator={subIndicator}
              isFullScreen={isFullScreen}
            />
          ) : null}
        </div>
      </SpotNotAvailable>
    </div>
  )
}

export default memo(KLine)
