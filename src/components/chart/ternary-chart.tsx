import { Loading } from '@nbit/vant'
import React, { useEffect, useRef, memo, useState } from 'react'
import dayjs from 'dayjs'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'
import { ChartKLineRequest } from '@/constants/market'

import {
  ChartLayoutOptionsType,
  KLineChartData,
  MainIndicatorType,
  SubIndicatorType,
  SwitchTimeType,
  timeMap,
  WSThrottleTypeEnum,
  sortMarketChartData,
  getTheme,
  tradingviewTimeMap,
  TimeSharingType,
  KLineChartType,
} from '@nbit/chart-utils'

import { KLineChart } from '@nbit/chart-h5'
import { getIsLogin } from '@/helper/auth'
import Icon from '@/components/icon'
import { usePageContext } from '@/hooks/use-page-context'
import { SpotNotAvailable } from '@/features/trade/spot/not-available'
import { YapiGetV1TradePairDetailData } from '@/typings/yapi/TradePairDetailV1GetApi'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { formatNumberDecimal } from '@/helper/decimal'
import { useMemoizedFn, useSafeState, useUnmount } from 'ahooks'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { getV1OptionMarketKlinesApiRequest, getV1OptionMarketDealCountApiRequest } from '@/apis/ternary-option'
import { useTernaryOptionStore } from '@/store/ternary-option'
import optionWs from '@/plugins/ws/option'
import { useCommonStore } from '@/store/common'
import { initOptionMainIndicator, initOptionSubIndicator } from '@/constants/ternary-option/market-trade-area'
import { OrderBookOptionKlineSubs, getOptionWsContractCode } from '@/helper/ternary-option'
import { OptionOrder } from '@/plugins/ws/protobuf/ts/proto/OptionOrder'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import Lottie from 'lottie-react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
// import { KLineChart } from './src'
import HeaderData from './header-ternary-data'
import redUpJsonData from './animation/red-up.json'
import redDownJsonData from './animation/red-down.json'
import redOverUpJsonData from './animation/red-over-up.json'
import redOverDownJsonData from './animation/red-over-down.json'
import loadingCompleteJsonData from './animation/loading-complete.json'
import greenUpJsonData from './animation/green-up.json'
import greenOverUpJsonData from './animation/green-over-up.json'
import greenDownJsonData from './animation/green-down.json'
import greenOverDownJsonData from './animation/green-over-down.json'
import winJsonData from './animation/data.json'

import styles from './chart.module.css'

for (let i = 0; i < 9; i += 1) {
  winJsonData.assets[i].u = oss_svg_image_domain_address
  winJsonData.assets[i].p = `option/img_${i}.png`
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

function KLine() {
  let currentModule
  const contractKline = {
    kline: getV1OptionMarketKlinesApiRequest,
  }
  const { wsOptionOrderSubscribe, wsOptionOrderUnSubscribe } = useOptionPositionStore() || {}

  const marketState = useTernaryOptionStore()
  const optionState = useOptionTradeStore()
  const useStore: any = useUserStore()

  const ws = optionWs
  currentModule = marketState
  const commonState = useCommonStore()
  const currentPriceTypeRef = useRef('kline')
  const currentModuleRef = useRef<any>(null)
  useEffect(() => {
    currentModuleRef.current = currentModule
  }, [currentModule])

  // const { setting } = TradeStore
  const isLogin = getIsLogin()
  const { personalCenterSettings } = useStore
  const colors = personalCenterSettings.colors || UserUpsAndDownsColorEnum.greenUpRedDown

  const controlRef = useRef<boolean>(true)

  const priceOffset =
    Number(currentModule.currentCoin.priceOffset) || currentModule.currentCoin.last?.split('.')?.[1]?.length || 4
  const amountOffset =
    Number(currentModule.currentCoin.amountOffset) || currentModule.currentCoin.last?.split('.')?.[1]?.length || 4
  const {
    bgColor,
    textColor,
    brandColor,
    upColor,
    downColor,
    textColor01,
    cardBgColor03,
    upSpecialColor02,
    downSpecialColor02,
    cardBgColor02,
    textColor02,
  } = getTheme()
  const [currentChart, setCurrentChart] = useSafeState<string>(ChartVersion.Normal)
  const [curData, setCurData] = useSafeState<Array<KLineChartData>>([])
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [mainIndicator, setMainIndicator] = useSafeState<MainIndicatorType>(initOptionMainIndicator)
  const [getOrderDataIndex, setGetOrderDataIndex] = useSafeState<number>(0)
  const [ordersData, setOrdersData] = useSafeState<any>([])

  const pageContext = usePageContext()
  const locale = pageContext.locale || ''

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

  const [subIndicator, setSubIndicator] = useSafeState<SubIndicatorType>(initOptionSubIndicator)
  const [getDataAndUpdateChart, setGetDataAndUpdateChart] = useSafeState<number>(0)
  const [curTime, setCurTime] = useSafeState<SwitchTimeType>({
    unit: 's',
    value: 1,
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

  const KlineWs = {
    Sub: 1,
    unSub: 0,
    OutSub: 2,
    Second: 3,
  }
  const [klineWs, setKlineWs] = useSafeState<number>(KlineWs.unSub)
  const symbolName = pageContext.routeParams.id

  const onlineRef = useRef<boolean>(true)
  const pageVisibelRef = useRef<boolean>(false)

  useEffect(() => {
    if (!currentModule.currentCoin.symbol) {
      return
    }
    let chartRequestInterval

    chartRequestInterval = setInterval(() => {
      if (!navigator.onLine) {
        onlineRef.current = false
      } else {
        if (!onlineRef.current) {
          controlRef.current = false

          getKlineHistoryData(currentModule.currentCoin.id, curTimeRef.current, null, ChartKLineRequest.OutLine)
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
          getKlineHistoryData(currentModule.currentCoin.id, curTimeRef.current, null, ChartKLineRequest.OutLine)
        })
      }
    }
    document.addEventListener('visibilitychange', visibleChange)
    return () => {
      clearInterval(chartRequestInterval)
      document.removeEventListener('visibilitychange', visibleChange)
    }
  }, [currentModule.currentCoin.symbol])

  const getOrderDataHistory = (id, timeSharing, param?) => {
    const time = timeMap[`${timeSharing.value}${timeSharing.unit}`]

    getV1OptionMarketDealCountApiRequest({
      interval: time,
      optionId: id,
      limit: '1440',
      endTime: param?.time || undefined,
    }).then(res => {
      setOrdersData(res.data || [])
    })
  }
  useEffect(() => {
    if (!currentModule.currentCoin.id) {
      return
    }
    if (!isLogin) {
      return
    }

    getOrderDataHistory(currentModule.currentCoin.id, curTime)
  }, [isLogin, currentModule.currentCoin.id, curTime, getOrderDataIndex])

  useEffect(() => {
    const kLineCallback = data => {
      // 更新实时报价信息
      /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
      if (!controlRef.current) return

      if (data?.[0]?.time) {
        if (currentModuleRef.current?.currentCoin.symbol !== data?.[0]?.symbol) {
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
                    (curTimeRef.current.unit === TimeSharingType.Second
                      ? 1000
                      : Number(tradingviewTimeMap[`${curTimeRef.current.value}${curTimeRef.current.unit}`]) *
                        60 *
                        1000))
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

            if (curTimeRef.current?.unit === 'time' || curTimeRef.current?.unit === 's') {
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
    const subs = OrderBookOptionKlineSubs(currentModuleRef.current?.currentCoin.symbol, curTimeRef.current)

    if (klineWs === KlineWs.Sub || klineWs === KlineWs.OutSub || klineWs === KlineWs.Second) {
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
  }, [commonState.theme])

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

  let apiRequest = contractKline[currentPriceTypeRef.current]

  /** 请求 k 线数据 */
  const getKlineHistoryData = (id, timeSharing, param?, requestType?) => {
    controlRef.current = true
    const time = timeMap[`${timeSharing.value}${timeSharing.unit}`]
    const params = {
      optionId: id,
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
        if (curTimeRef.current?.unit === TimeSharingType.Second) {
          setKlineWs(KlineWs.Second)
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

    getKlineHistoryData(currentModule.currentCoin.id, curTimeRef.current, param, ChartKLineRequest.More)
    getOrderDataHistory(currentModule.currentCoin.id, curTimeRef.current, param)
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
        getKlineHistoryData(currentModule.currentCoin.id, curTimeRef.current, null, ChartKLineRequest.MarketChanges)
      } else {
        setCurTime({
          value: 1,
          unit: 'h',
        })
      }
    } else {
      if (curTimeRef.current?.value === 1 && curTimeRef.current?.unit === 'm') {
        getKlineHistoryData(currentModule.currentCoin.id, curTimeRef.current, null, ChartKLineRequest.MarketChanges)
      } else {
        setCurTime({
          value: 1,
          unit: 'm',
        })
      }
    }
  }, [currentModule.marketChangesTime])

  useEffect(() => {
    if (!currentModule.currentCoin.symbol) {
      return
    }

    setCurData([])
    curDataRef.current = []
    if (currentModule.currentCoin.id && curTime.value) {
      getKlineHistoryData(currentModule.currentCoin.id, curTime)
    }

    return () => {
      controlRef.current = false
    }
    // }, [currentModule.currentCoin.id, curTime.unit, curTime.value, isLogin, layout.kLineHistory])
  }, [currentModule.currentCoin.symbol, curTime.unit, curTime.value, isLogin])

  const [isFullScreen, setIsFullScreen] = useSafeState<boolean>(false)

  const [popState, setPopState] = useSafeState(false)

  const [chartHeight, setChartHeight] = useSafeState(252)

  const onOrderWsCallBack = useMemoizedFn((data: OptionOrder[]) => {
    if (data?.length === 0) {
      return
    }
    // 这里写代码
    setGetOrderDataIndex(new Date().valueOf())
  })

  useEffect(() => {
    if (!isLogin) return

    wsOptionOrderSubscribe(onOrderWsCallBack)
  }, [isLogin])

  useUnmount(() => {
    wsOptionOrderUnSubscribe(onOrderWsCallBack)
  })

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
          <HeaderData
            currentChart={currentChart}
            setCurrentChart={setCurrentChart}
            locale={locale}
            tradeId={currentModule.currentCoin.id}
            curTime={curTime}
            setCurTime={setCurTime}
            setPopState={setPopState}
          />
          {/* {!isFullScreen ? (
          <div className="full-screen" onClick={() => {
                fullscreen(fullscreenRef, isFullScreen, setIsFullScreen)
              }}>
            <Icon name={'icon_full_white'} className="icon" />
          </div>
        ) : null} */}
          <div
            className={classNames('chart-wrap pl-4 box-border')}
            style={{
              height: 'calc(100% - 64px)',
              width: 'calc(100% - 16px)',
            }}
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
                      from={KLineChartType.Ternary}
                      theme={commonState.theme}
                      chartLayoutOptions={chartLayoutOptions}
                      data={curData}
                      curDataRef={curDataRef.current}
                      createChart={{
                        brandColor,
                        upColor,
                        downColor,
                        bgColor,
                        textColor,
                        textColor01,
                        cardBgColor03,
                        upSpecialColor02,
                        downSpecialColor02,
                        cardBgColor02,
                        textColor02,
                      }}
                      mainIndicator={mainIndicator}
                      subIndicator={subIndicator}
                      curTime={curTime}
                      ref={childRef}
                      ordersData={ordersData}
                      chartHeight={chartHeight - 33}
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
                      optionBuyCallback={optionState.optionBuyCallback}
                      optionSellCallback={optionState.optionSellCallback}
                      optionActiveTab={optionState.optionActiveTab}
                      countDownComponent={optionState.countDownComponent}
                      tradeRestSecond={optionState.tradeRestSecond}
                      optionIcon={{
                        up: (
                          <Icon
                            name={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? 'icon_options_levitate_rise_up'
                                : 'icon_options_levitate_fall_up'
                            }
                            className="text-[34px]"
                          />
                        ),
                        down: (
                          <Icon
                            name={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? 'icon_options_levitate_fall_down'
                                : 'icon_options_levitate_rise_down'
                            }
                            className="text-[34px]"
                          />
                        ),
                        overUp: (
                          <Icon
                            name={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? 'icon_options_levitate_rise_more_up'
                                : 'icon_options_levitate_fall_more_up'
                            }
                            className="text-[34px]"
                          />
                        ),
                        overDown: (
                          <Icon
                            name={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? 'icon_options_levitate_fall_more_down'
                                : 'icon_options_levitate_rise_more_down'
                            }
                            className="text-[34px]"
                          />
                        ),
                      }}
                      optionAnimation={{
                        win: <Lottie animationData={winJsonData} loop={false} autoPlay />,
                        call: (
                          <Lottie
                            animationData={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown ? greenUpJsonData : redUpJsonData
                            }
                            loop={false}
                            autoPlay
                          />
                        ),
                        put: (
                          <Lottie
                            animationData={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown ? redDownJsonData : greenDownJsonData
                            }
                            loop={false}
                            autoPlay
                          />
                        ),
                        over_call: (
                          <Lottie
                            animationData={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? greenOverUpJsonData
                                : redOverUpJsonData
                            }
                            loop={false}
                            autoPlay
                          />
                        ),
                        over_put: (
                          <Lottie
                            animationData={
                              colors === UserUpsAndDownsColorEnum.greenUpRedDown
                                ? redOverDownJsonData
                                : greenOverDownJsonData
                            }
                            loop={false}
                            autoPlay
                          />
                        ),
                        loading: <Lottie animationData={loadingCompleteJsonData} loop={false} autoPlay />,
                      }}
                    />
                  ) : (
                    <div className="spin-wrap">
                      <Loading />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </SpotNotAvailable>
    </div>
  )
}

export default memo(KLine)
