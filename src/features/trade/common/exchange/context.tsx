import produce from 'immer'
import { decimalUtils } from '@nbit/utils'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useEventEmitter, useMemoizedFn, useThrottleFn, useUpdateEffect } from 'ahooks'
import { formatNumberDecimalWhenExceed, removeDecimalZero } from '@/helper/decimal'
import { ITradeCommonSettings } from '@/store/trade/base'
import { useUserStore } from '@/store/user'
import {
  EntrustTypeEnum,
  getTradePriceTypeEnumName,
  SpotStopLimitTypeEnum,
  SpotStopStatusEnum,
  TradeDirectionEnum,
  TradeFutureMarginTypeInReqEnum,
  TradeModeEnum,
  TradePriceTypeEnum,
  TradeUnitEnum,
} from '@/constants/trade'
import { link } from '@/helper/link'
import {
  useAutoAddMarginGroups,
  useFutureCurrencySettings,
  useFutureTradeIsOpened,
  useTradeCurrentFutureCoinWithMarkPrice,
  useTradeCurrentSpotCoinWithPrice,
} from '@/hooks/features/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { useOrderBookStore } from '@/store/order-book'
import { IFutureGroup } from '@/typings/api/future/common'
import { useFutureTradeStore } from '@/store/trade/future'
import { useSpotTradeStore } from '@/store/trade/spot'
import {
  getFutureDefaultLever,
  getFutureExtraMarginSourceIsAssets,
  getFutureGroupMarginSource,
  getUserFutureTradeEnabled,
  getUserSpotTradeEnabled,
} from '@/helper/trade'
import { Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { activeFuture } from '@/helper/future'
import { useReloadVisible } from '@/hooks/use-reload-visible'
import { ICouponResult } from '@/features/welfare-center/compontents/coupon-select'
import { useCommonStore } from '@/store/common'
import type { IExchangeCOntextCalcHelper } from './calc/index.d'
import {
  IExchangeAllHandlers,
  IExchangeTradeInfo,
  IUseInSubParams,
  createExchangeContextTradeInfo,
  resetData,
} from './context/common'
import { useSpotStopLimitContextInSub } from './context/spot'

const SafeCalcUtil = decimalUtils.SafeCalcUtil
/** 用于判断空、小数点作保留原始输入的情况 */
function getValue(originValue: string, numberValue: any) {
  const finalValue = originValue === '' || /\d+\.\d*$/.test(originValue) ? originValue : numberValue
  return finalValue
}

const percentWillChangeWhenAmountChange = true

export type IExchangeBaseContext = IExchangeTradeInfo

export const ExchangeContext = createContext<ReturnType<typeof useExchangeInTop>>({} as any)

export function useExchangeInTop(
  calcHelpers: IExchangeCOntextCalcHelper,
  tradeMode = TradeModeEnum.futures,
  inModal = false,
  direction = TradeDirectionEnum.buy
) {
  const pageContext = usePageContext()
  const { isFusionMode } = useCommonStore()
  const selectGroupIdFromUrl = pageContext.urlParsed.search?.selectgroup
  const { bidsList, asksList } = useOrderBookStore()
  const isFutureMode = tradeMode === TradeModeEnum.futures
  let bestBuyPrice = asksList[0]?.price
  bestBuyPrice = Number.isNaN(Number(bestBuyPrice)) ? '' : bestBuyPrice
  let bestSellPrice = bidsList[0]?.price
  bestSellPrice = Number.isNaN(Number(bestSellPrice)) ? '' : bestSellPrice
  const { settings: futuresSettings, futureGroups, updateCurrentFutureGroup } = useFutureTradeStore()
  const { settings: spotSettings } = useSpotTradeStore()

  const commonSettings: ITradeCommonSettings = tradeMode === TradeModeEnum.spot ? spotSettings : futuresSettings
  const currentSpotCoin = useTradeCurrentSpotCoinWithPrice()
  const currentFutureCoin = useTradeCurrentFutureCoinWithMarkPrice()
  const currentCoin = tradeMode === TradeModeEnum.spot ? currentSpotCoin : currentFutureCoin
  // 定义之后填充，不影响其它函数引用
  const allHandlers: IExchangeAllHandlers = {} as any
  let [tradeInfo, setTradeInfo] = useState<IExchangeBaseContext>(
    createExchangeContextTradeInfo({
      tradeMode,
      direction,
      // 使用缓存
      tradeUnit: commonSettings.tradeUnit,
      lever: isFutureMode ? getFutureDefaultLever(currentFutureCoin) : 1,
      entrustType: inModal ? commonSettings.modalEntrustType : commonSettings.entrustType,
      marginSource: futuresSettings.marginSource,
      entrustPrice: direction === TradeDirectionEnum.buy ? bestBuyPrice : bestSellPrice,
      spotStopLimitType: spotSettings.stopLimitType,
      entrustPriceType: commonSettings.entrustPriceType,
      stopProfitEntrustPriceType: spotSettings.stopProfitEntrustPriceType,
      stopLossEntrustPriceType: spotSettings.stopLossEntrustPriceType,
    })
  )
  const tradeInfoRef = useRef(tradeInfo)
  tradeInfoRef.current = tradeInfo
  /** effect 中使用传入 target */
  const updateTradeInfo = (target: Partial<IExchangeBaseContext>) => {
    setTradeInfo(old => {
      return {
        ...old,
        ...target,
      }
    })
  }
  const isStopLimit = tradeInfo.entrustType === EntrustTypeEnum.stop
  const { isLogin } = useUserStore()
  // 合约法币精度
  const futureCurrencySettings = useFutureCurrencySettings()
  const futureCurrencyDigit = futureCurrencySettings.offset
  const buyDigit = isFutureMode ? futureCurrencyDigit : Number(currentCoin.priceOffset || 0)
  const sellDigit = Number(currentCoin.amountOffset || 0)
  const priceDigit = Number(currentCoin.priceOffset || 0)
  const isBuy = tradeInfo.direction === TradeDirectionEnum.buy
  const latestPrice = currentCoin.last!
  const fillEntrustPrice = (isBuy ? bestBuyPrice : bestSellPrice) || latestPrice.toString()
  const spotStopLimitIsDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double
  const profitPriceIsMarket = tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market
  const lossPriceIsMarket = tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
  const doubleStopLimitIsMarketPrice = profitPriceIsMarket && spotStopLimitIsDouble && lossPriceIsMarket
  // 市价单、计划和单向止盈止损的时候可能是市价委托价格
  const isMarketPrice =
    tradeInfo.entrustType === EntrustTypeEnum.market ||
    // eslint-disable-next-line prettier/prettier
    (
      (EntrustTypeEnum.plan === tradeInfo.entrustType || (EntrustTypeEnum.stop === tradeInfo.entrustType && !spotStopLimitIsDouble)) &&
      // eslint-disable-next-line prettier/prettier
      tradeInfo.entrustPriceType === EntrustTypeEnum.market
    )
  useUpdateEffect(() => {
    if (isFutureMode) {
      updateTradeInfo({
        lever: getFutureDefaultLever(currentFutureCoin),
      })
    }
  }, [currentFutureCoin.tradePairLeverList])
  const { baseBalance, quoteBalance, positionQuoteBalance } = calcHelpers.useGetBalance(tradeInfo)
  // 合约减仓模式
  const isFutureReduce = isFutureMode && tradeInfo.onlyReduce
  // 合约开仓模式
  const isFutureOpen = isFutureMode && !tradeInfo.onlyReduce
  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  // 计划委托触发需要比较的价格
  const triggerLatestOrMarkPrice =
    isFutureMode && tradeInfo.triggerPriceType === TradePriceTypeEnum.mark ? currentFutureCoin.markPrice : latestPrice
  const balance = (isFutureMode ? isFutureReduce : !isBuy) ? baseBalance : quoteBalance
  // 合约因为额外保证金的加入，需要引入一个最大可用余额，和实际可用余额区分开来
  // 现在又改回以全部为基准，否则会和全仓额外保证金冲突
  const maxBalance = balance // isFutureOpen ? Math.max(SafeCalcUtil.sub(balance, tradeInfo.extraMargin).toNumber(), 0) : balance

  // 最大可用额外保证金，额外保证金来源资产为余额 - 保证金，来源为下单资金则为开仓保证金
  const extraMarginVisible = tradeInfo.marginSource === TradeFutureMarginTypeInReqEnum.assets
  const maxExtraMarginAmount = !extraMarginVisible
    ? 0
    : getFutureExtraMarginSourceIsAssets()
    ? Math.max(Number(formatNumberDecimalWhenExceed(SafeCalcUtil.sub(balance, tradeInfo.amount), buyDigit)), 0)
    : // 这里最大值是计算出来的最大，而不是实际保证金为最大，实际保证金值会变化
      Number(tradeInfo.amount)
  // 用来保存切换只减仓时的状态
  const oldExtraMarginRef = useRef({
    extraMargin: '',
    extraMarginPercent: 0,
    maxExtraMarginAmount: 0,
  })
  if (!tradeInfo.onlyReduce) {
    oldExtraMarginRef.current = {
      extraMargin: tradeInfo.extraMargin,
      extraMarginPercent: tradeInfo.extraMarginPercent,
      maxExtraMarginAmount,
    }
  }
  function useOnChange<T>(fn: (value: T, info: IExchangeBaseContext) => void) {
    return useMemoizedFn((value: T, latestInfo?: IExchangeBaseContext) => {
      // 函数内再次调用函数，就将传进来的值作为最新值处理一下，不做任何操作
      if (latestInfo) {
        fn(value, latestInfo)
        return
      }
      // 反之，就用最新的 tradeInfo
      setTradeInfo(
        produce(old => {
          fn(value, old)
        })
      )
    })
  }
  const paramsInSubHook: IUseInSubParams = {
    allHandlers,
    useOnChange,
    resetData,
    fillEntrustPrice,
    latestPrice,
  }
  useEffect(() => {
    let newExtraMargin = tradeInfo.extraMargin
    // 单向
    if (tradeInfo.extraMarginPercent === 100) {
      newExtraMargin = maxExtraMarginAmount.toString()
    } else if (Number(newExtraMargin) > 0) {
      if (SafeCalcUtil.sub(tradeInfo.extraMargin, maxExtraMarginAmount).gt(0)) {
        newExtraMargin = maxExtraMarginAmount.toString()
      }
    }
    if (newExtraMargin === tradeInfo.extraMargin) {
      return
    }
    updateTradeInfo({
      extraMargin: newExtraMargin === '0' ? '' : newExtraMargin,
      extraMarginPercent: tradeInfo.extraMarginPercent === 100 ? 100 : 0,
    })
  }, [maxExtraMarginAmount])
  // 修复某些情况下全仓无法填充保证金的问题
  useEffect(() => {
    if (tradeInfo.extraMarginPercent === 100) {
      updateTradeInfo({
        extraMargin: maxExtraMarginAmount.toString(),
      })
    }
  }, [tradeInfo.extraMarginPercent])
  const unsetMax = 99999999999999
  // 是否启用输入框最大限制，按现在的产品要求是不限制
  const enableMaxLimit = false
  // 用函数是因为，一个给 input 组件 max，一个在 change 函数中实时计算，二者基于的价格是不一样的
  function calcMax() {
    if (!enableMaxLimit) {
      return {
        maxEntrustAmount: unsetMax,
        maxAmount: unsetMax,
      }
    }
    const maxEntrustAmount =
      isBuy || isFutureOpen
        ? tradeInfo.entrustPrice
          ? Number(
              calcHelpers.calcEntrustAmount(
                {
                  ...tradeInfo,
                  amount: balance.toString(),
                },
                sellDigit
              )
            )
          : unsetMax
        : balance
    const maxAmount =
      isBuy || isFutureOpen
        ? balance
        : tradeInfo.entrustPrice
        ? Number(
            calcHelpers.calcAmount(
              {
                ...tradeInfo,
                entrustAmount: balance.toString(),
              },
              buyDigit
            )
          )
        : unsetMax

    return {
      maxAmount,
      maxEntrustAmount,
    }
  }
  // 重置数据
  useUpdateEffect(() => {
    setTradeInfo(
      produce(tempTradeInfo => {
        resetData(tempTradeInfo, {
          // 全仓时保留，否则会导致保证金没有填充
          keepExtraMargin: tempTradeInfo.extraMarginPercent === 100,
          keepStopLimit: false,
        })
        tempTradeInfo.entrustPrice = ''
        if (isFutureMode) {
          tempTradeInfo.lever = getFutureDefaultLever(currentFutureCoin)
        }
        if (tradeInfo.entrustType === EntrustTypeEnum.market) {
          tempTradeInfo.entrustPriceType = EntrustTypeEnum.market
        }
      })
    )
  }, [currentCoin.id])
  const onAmountChange = useOnChange((value: string, tempTradeInfo) => {
    if (value === tempTradeInfo.amount && tempTradeInfo.lever === tradeInfo.lever) {
      return
    }
    const newValue = Math.min(Number(value), calcMax().maxAmount).toString()
    // 花费金额又决定了委托数量和滑块比例
    tempTradeInfo.amount = getValue(value, newValue)
    if (!tempTradeInfo.entrustPrice) {
      return
    }
    if (
      tempTradeInfo.entrustAmount === tradeInfo.entrustAmount &&
      tempTradeInfo.entrustPrice === tradeInfo.entrustPrice &&
      // 委托数量没有变化委托价格没有变化，杠杆也没有变化或者按金额下单，就需要重新计算委托数量
      // 其它情况则不需要
      (tempTradeInfo.lever === tradeInfo.lever || unitIsQuote)
    ) {
      tempTradeInfo.entrustAmount = calcHelpers.calcEntrustAmount(tempTradeInfo, sellDigit)
      if (tempTradeInfo.amount === '') {
        tempTradeInfo.entrustAmount = ''
      }
    }
    if (tempTradeInfo.percent === tradeInfo.percent) {
      // 双向联动，委托数量变化也会调用这个函数
      if (percentWillChangeWhenAmountChange) {
        // 全仓时百分比不动
        tempTradeInfo.percent = calcHelpers.calcPercent(
          // eslint-disable-next-line prettier/prettier
          ((isBuy || isFutureOpen) && !isFutureReduce) ? tempTradeInfo.amount : tempTradeInfo.entrustAmount,
          maxBalance
        )
      } else {
        tempTradeInfo.percent = 0
      }
    }
    if (tempTradeInfo.positionAmount === tradeInfo.positionAmount) {
      tempTradeInfo.positionAmount = formatNumberDecimalWhenExceed(
        SafeCalcUtil.mul(tempTradeInfo.amount, tempTradeInfo.lever).toString(),
        buyDigit
      )
    }
  })
  const onPositionAmountChange = useOnChange((value: string, tempTradeInfo) => {
    const newValue = Math.min(Number(value), calcMax().maxAmount).toString()
    tempTradeInfo.positionAmount = getValue(value, newValue)
    onAmountChange(
      formatNumberDecimalWhenExceed(
        SafeCalcUtil.div(tempTradeInfo.positionAmount, tempTradeInfo.lever).toString(),
        buyDigit
      ),
      tempTradeInfo
    )
  })
  const onEntrustAmountChange = useOnChange((value: string, tempTradeInfo) => {
    if (value === tempTradeInfo.entrustAmount && tradeInfo.lever === tempTradeInfo.lever) {
      return
    }

    tempTradeInfo.entrustAmount = getValue(value, Math.min(calcMax().maxEntrustAmount, Number(value)).toString())
    onAmountChange(calcHelpers.calcAmount(tempTradeInfo, buyDigit), tempTradeInfo)
    if (tempTradeInfo.entrustAmount === '') {
      tempTradeInfo.amount = ''
    }
  })
  const onEntrustPriceChange = useOnChange((value: string, tempTradeInfo) => {
    if (value === tempTradeInfo.entrustPrice) {
      return
    }
    tempTradeInfo.entrustPriceIsDirty = true
    // 委托价格和委托数量决定花费金额
    // 存在从盘口获取价格的情况，因此需要去掉多余的 0
    tempTradeInfo.entrustPrice = getValue(value, formatNumberDecimalWhenExceed(removeDecimalZero(value), priceDigit))
    const isMarketPriceType =
      tempTradeInfo.entrustPriceType === EntrustTypeEnum.market ||
      (isStopLimit && spotStopLimitIsDouble && doubleStopLimitIsMarketPrice)
    // 市价或者未合约交易 & 且以交易额为准则变动数量
    if ((isMarketPriceType || isFutureMode) && tempTradeInfo.tradeUnit === TradeUnitEnum.quote) {
      // 为 0 的话保持空字符串
      if (tempTradeInfo.amount) {
        tempTradeInfo.entrustAmount = calcHelpers.calcEntrustAmount(tempTradeInfo, sellDigit) || ''
      }
    } else {
      if (tempTradeInfo.entrustAmount) {
        // 一般保持委托数量不动
        onAmountChange(calcHelpers.calcAmount(tempTradeInfo, buyDigit), tempTradeInfo)
      }
    }
  })
  useEffect(() => {
    if (!fillEntrustPrice) {
      return
    }
    // 对于市价委托，更新数据 & 对于现货双向止盈止损更新数据
    // 涉及计划市价和现货单向止盈止损委托，市价的话委托价格取触发价
    if (tradeInfo.entrustType === EntrustTypeEnum.market || (isStopLimit && spotStopLimitIsDouble)) {
      onEntrustPriceChange(fillEntrustPrice)
    }
  }, [fillEntrustPrice])
  useEffect(() => {
    if (!fillEntrustPrice) {
      return
    }
    // 没有并且当前输入框没有聚焦，而且没有手动输入过就填进去
    if (!tradeInfo.entrustPrice && !tradeInfo.entrustPriceInputIsFocused && !tradeInfo.entrustPriceIsDirty) {
      onEntrustPriceChange(fillEntrustPrice)
    }
  }, [fillEntrustPrice])

  const onTriggerPriceChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.triggerPrice = value
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.entrustPriceType === EntrustTypeEnum.market) {
      onEntrustPriceChange(value, tempTradeInfo)
    }
  })

  const onEntrustTypeChange = useOnChange((value: EntrustTypeEnum, tempTradeInfo) => {
    resetData(tempTradeInfo)
    tempTradeInfo.entrustType = value
    if (value === EntrustTypeEnum.market) {
      tempTradeInfo.entrustPriceType = EntrustTypeEnum.market
    }
    inModal ? commonSettings.updateModalEntrustType(value) : commonSettings.updateEntrustType(value)
    tempTradeInfo.entrustPrice = fillEntrustPrice
  })
  const onDirectionChange = useOnChange((value: TradeDirectionEnum, tempTradeInfo) => {
    if (value === tempTradeInfo.direction) {
      return
    }
    const entrustPriceType = tempTradeInfo.entrustPriceType
    resetData(tempTradeInfo)
    tempTradeInfo.direction = value
    tempTradeInfo.entrustPriceType = entrustPriceType
    tempTradeInfo.entrustPrice = isMarketPrice
      ? latestPrice.toString()
      : (tempTradeInfo.direction === TradeDirectionEnum.buy ? bestBuyPrice : bestSellPrice) || latestPrice.toString()
  })
  const onPercentChange = useOnChange((value: number, tempTradeInfo) => {
    tempTradeInfo.percent = value
    // 合约开仓始终以交易额为准，方便计算
    if ((isBuy || isFutureOpen) && !isFutureReduce) {
      onAmountChange(
        formatNumberDecimalWhenExceed(SafeCalcUtil.div(maxBalance, 100).mul(value), buyDigit),
        tempTradeInfo
      )
    } else {
      onEntrustAmountChange(
        formatNumberDecimalWhenExceed(SafeCalcUtil.div(maxBalance, 100).mul(value), sellDigit),
        tempTradeInfo
      )
    }
  })
  const onExtraMarginChange = useOnChange((value: string, tempTradeInfo) => {
    let newValue = value
    if (Number(value) > maxExtraMarginAmount) {
      newValue = maxExtraMarginAmount.toString()
    }
    tempTradeInfo.extraMargin = newValue
    if (tradeInfo.extraMarginPercent !== 100 && tradeInfo.extraMarginPercent === tempTradeInfo.extraMarginPercent) {
      tempTradeInfo.extraMarginPercent = 0
    }
    // 下单资金作为额外保证金模式下始终变的是委托数量
    if (!getFutureExtraMarginSourceIsAssets()) {
      tempTradeInfo.entrustAmount = calcHelpers.calcEntrustAmount(tempTradeInfo, sellDigit)
    }
  })
  const onExtraMarginPercentChange = useOnChange((value: number, tempTradeInfo) => {
    tempTradeInfo.extraMarginPercent = value
    onExtraMarginChange(
      value === 0
        ? ''
        : formatNumberDecimalWhenExceed(SafeCalcUtil.div(maxExtraMarginAmount, 100).mul(value), buyDigit),
      tempTradeInfo
    )
  })
  useEffect(() => {
    // 融合模式下不启用默认全仓
    onExtraMarginPercentChange(isFusionMode || tradeInfo.group?.groupId ? 0 : 100)
  }, [tradeInfo.group])
  const onTradeUnitChange = useOnChange((value: TradeUnitEnum, tempTradeInfo) => {
    tempTradeInfo.tradeUnit = value
    // 保持输入框的值会变化，后面会改回来
    // if (value === TradeUnitEnum.quote) {
    //   onAmountChange(tempTradeInfo.entrustAmount, false)
    // } else {
    //   onEntrustAmountChange(tempTradeInfo.amount, false)
    // }
    commonSettings.updateTradeUnit(value)
  })
  const onLeverChange = useOnChange((value: number, tempTradeInfo) => {
    tempTradeInfo.lever = value
    commonSettings.updateLever(currentCoin.id!, value)
    // 这里是应该清空还是保留呢？保留的话，需要重新计算
    if (unitIsQuote) {
      onAmountChange(tempTradeInfo.amount, tempTradeInfo)
    } else {
      onEntrustAmountChange(tempTradeInfo.entrustAmount, tempTradeInfo)
    }
  })
  // 合约市价下单做数量换算
  const onFutureMarketPriceChange = useOnChange(
    (
      {
        price,
        count,
      }: {
        price: string
        count: string
      },
      tempTradeInfo
    ) => {
      const withLimit = true
      if (withLimit) {
        tempTradeInfo.entrustType = EntrustTypeEnum.limit
        tempTradeInfo.entrustPriceType = EntrustTypeEnum.limit
        onEntrustPriceChange(price, tempTradeInfo)
        return
      }
      if (unitIsQuote) {
        // 需要的金额
        const amount = isFutureReduce
          ? SafeCalcUtil.mul(price, count)
          : SafeCalcUtil.mul(price, count).div(tempTradeInfo.lever)
        const allBalance = isFutureReduce
          ? formatNumberDecimalWhenExceed(SafeCalcUtil.mul(maxBalance, price), buyDigit)
          : maxBalance
        const fillAmount = formatNumberDecimalWhenExceed(
          amount.gt(allBalance) ? allBalance.toString() : amount.toString(),
          buyDigit
        )
        if (isFutureReduce) {
          onPositionAmountChange(fillAmount, tempTradeInfo)
        } else {
          onAmountChange(fillAmount, tempTradeInfo)
        }
      } else {
        const allBalance = !isFutureReduce
          ? formatNumberDecimalWhenExceed(SafeCalcUtil.div(maxBalance, price).mul(tempTradeInfo.lever), sellDigit)
          : maxBalance
        const fillEntrustAmount = decimalUtils.getSafeDecimal(count).gt(allBalance) ? allBalance.toString() : count
        onEntrustAmountChange(formatNumberDecimalWhenExceed(fillEntrustAmount, sellDigit), tempTradeInfo)
      }
    }
  )
  const onStopLimitEnabledChange = useOnChange((value: boolean, tempTradeInfo) => {
    tempTradeInfo.stopLimitEnabled = value
    tempTradeInfo.stopLossPrice = ''
    tempTradeInfo.stopProfitPrice = ''
    // 只减仓和止盈止损不能同时开启
    if (tempTradeInfo.stopLimitEnabled) {
      tempTradeInfo.onlyReduce = false
    }
  })
  const onStopLimitPriceTypeChange = useOnChange((value: TradePriceTypeEnum, tempTradeInfo) => {
    tempTradeInfo.stopLimitPriceType = value
  })
  const onTriggerPriceTypeChange = useOnChange((value: TradePriceTypeEnum, tempTradeInfo) => {
    tempTradeInfo.triggerPriceType = value
  })
  const onEntrustPriceTypeChange = useOnChange((value: EntrustTypeEnum, tempTradeInfo) => {
    tempTradeInfo.entrustPriceType = value
    commonSettings.updateEntrustPriceType(value)
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.entrustPriceType === EntrustTypeEnum.market) {
      onEntrustPriceChange(tempTradeInfo.triggerPrice, tempTradeInfo)
    } else {
      onEntrustPriceChange(latestPrice, tempTradeInfo)
    }
  })
  const onStopLossPriceChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.stopLossPrice = value
  })
  const onStopProfitPriceChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.stopProfitPrice = value
  })
  const spotStopLimitHandlers = useSpotStopLimitContextInSub(paramsInSubHook)
  const onEntrustPriceInputBlur = useOnChange((value: any, tempTradeInfo) => {
    tempTradeInfo.entrustPriceInputIsFocused = false
  })
  const onEntrustPriceInputFocus = useOnChange((value: any, tempTradeInfo) => {
    tempTradeInfo.entrustPriceInputIsFocused = true
  })

  const onOnlyReduceChange = useOnChange((value: boolean, tempTradeInfo) => {
    tempTradeInfo.onlyReduce = value
    if (tempTradeInfo.onlyReduce) {
      onStopLimitEnabledChange(false, tempTradeInfo)
    }
    resetData(tempTradeInfo, {
      keepExtraMargin: false,
    })
    tempTradeInfo.entrustPrice = fillEntrustPrice
  })
  const onAutoAddMarginChange = useOnChange((value: boolean, tempTradeInfo) => {
    tempTradeInfo.autoAddMargin = value
  })
  const onFutureGroupChange = useOnChange((value: IFutureGroup, tempTradeInfo) => {
    tempTradeInfo.group = value
    tempTradeInfo.marginSource = getFutureGroupMarginSource(value?.groupId as any)
    futuresSettings.updateGroupId(value?.groupId)
  })
  const onMarginSourceChange = useOnChange((value: TradeFutureMarginTypeInReqEnum, tempTradeInfo) => {
    if (value === tempTradeInfo.marginSource) {
      return
    }
    tempTradeInfo.marginSource = value
    futuresSettings.updateMarginSource(value)
    if (tempTradeInfo.group?.groupId) {
      futuresSettings.updateGroupMarginSource(tempTradeInfo.group.groupId, value)
    }
    tempTradeInfo.extraMargin = ''
    tempTradeInfo.extraMarginPercent =
      value === TradeFutureMarginTypeInReqEnum.assets && !tempTradeInfo.group?.groupId && !isFusionMode ? 100 : 0
  })
  function setSelectedGroup(selectGroupIdFromUrlChange = false) {
    setTradeInfo(
      produce(tempTradeInfo => {
        const group = futureGroups.find(g => g.groupId === (selectGroupIdFromUrl || futuresSettings.groupId))
        if (futureGroups.length > 0) {
          // 没有选中的合约组，那么默认为资产开仓
          if (!group || (tempTradeInfo.groupInited && !tempTradeInfo.group)) {
            onMarginSourceChange(TradeFutureMarginTypeInReqEnum.assets, tempTradeInfo)
          }
          // 未初始化或者 url id 变化
          if (!tempTradeInfo.groupInited || selectGroupIdFromUrlChange) {
            tempTradeInfo.group = group
            tempTradeInfo.groupInited = true
          }
        }
      })
    )
  }
  useEffect(setSelectedGroup, [futureGroups])
  useUpdateEffect(() => {
    if (!selectGroupIdFromUrl) {
      return
    }
    setSelectedGroup(true /** selectGroupIdFromUrlChange */)
  }, [selectGroupIdFromUrl])
  useEffect(() => {
    updateCurrentFutureGroup(tradeInfo.group?.groupId ? tradeInfo.group : undefined)
  }, [tradeInfo.group])
  const uFutureUnitOptions = [
    {
      value: TradeUnitEnum.indexBase,
      label: currentCoin.baseSymbolName,
    },
    {
      value: TradeUnitEnum.quote,
      label: currentCoin.quoteSymbolName,
    },
  ]
  // 如果是买入 显示计价货币，反之显示基准货币
  const symbol = isBuy ? currentCoin.quoteSymbolName : currentCoin.baseSymbolName
  const positionValue = calcHelpers.calcPositionNamedValue?.(tradeInfo, buyDigit)
  const priceTypeOptions = [TradePriceTypeEnum.latest, TradePriceTypeEnum.mark].map(item => ({
    value: item,
    text: getTradePriceTypeEnumName(item),
  }))
  const onOrder$ = useEventEmitter()
  const { groups } = useAutoAddMarginGroups()
  // 是否自动追加保证金
  const futureGroupAutoAddMarginEnabled =
    groups.find(g => g.id === (tradeInfo.group?.groupId as any))?.isAutoAdd === 'yes'
  const futureOpened = useFutureTradeIsOpened()

  Object.assign(allHandlers, {
    onAmountChange,
    onPositionAmountChange,
    onPercentChange,
    onTradeUnitChange,
    onEntrustAmountChange,
    onEntrustPriceChange,
    onEntrustTypeChange,
    onDirectionChange,
    onFutureMarketPriceChange,
    onLeverChange,
    onExtraMarginPercentChange,
    onExtraMarginChange,
    onStopLimitEnabledChange,
    onStopLimitPriceTypeChange,
    onStopLossPriceChange,
    onAutoAddMarginChange,
    onOnlyReduceChange,
    onStopProfitPriceChange,
    onTriggerPriceChange,
    onTriggerPriceTypeChange,
    onEntrustPriceTypeChange,
    onFutureGroupChange,
    onMarginSourceChange,
    onEntrustPriceInputBlur,
    onEntrustPriceInputFocus,
    ...spotStopLimitHandlers,
  })
  // 这里采用节流来避免重复下单
  const { run: throttleEmitOnOrder } = useThrottleFn(
    () => {
      onOrder$.emit()
    },
    {
      wait: 1000,
      // 一定要加这个参数，否则在延迟时间过后函数仍会触发
      trailing: false,
    }
  )
  // 仅做 ref，这里不需要更新
  const couponsRef = useRef({
    coupons: [] as any[],
    // 体验价金额
    amount: 0,
    // 是否为手动选择
    isManual: false,
  })
  const onCouponChange = ({ coupons, voucherAmount, isManual }: ICouponResult) => {
    couponsRef.current = {
      coupons,
      amount: Number(voucherAmount || 0),
      isManual: !!isManual,
    }
  }

  return {
    tradeInfo,
    symbol,
    positionValue,
    couponsRef,
    onCouponChange,
    futureGroupAutoAddMarginEnabled,
    ...calcMax(),
    ...allHandlers,
    uFutureUnitOptions,
    balance,
    unitIsQuote,
    priceTypeOptions,
    isMarketPrice,
    isBuy,
    buyDigit,
    sellDigit,
    priceDigit,
    baseBalance,
    quoteBalance,
    bestBuyPrice,
    bestSellPrice,
    positionQuoteBalance,
    maxExtraMarginAmount: oldExtraMarginRef.current.maxExtraMarginAmount,
    onOrder$,
    currentCoin,
    latestPrice,
    markPrice: currentFutureCoin?.markPrice,
    triggerLatestOrMarkPrice,
    isStopLimit,
    resetData: () => {
      setTradeInfo(
        produce(tempTradeInfo => {
          resetData(tempTradeInfo, {
            keepExtraMargin: false,
            keepStopLimit: false,
          })
        })
      )
    },
    onOrder: () => {
      if (!isLogin) {
        link(`/login?redirect=${pageContext.path}`)
        return
      }
      if (!futureOpened && isFutureMode) {
        activeFuture()
        return
      }
      if (currentCoin.marketStatus !== SpotStopStatusEnum.trading) {
        return
      }
      if (isFutureMode && !getUserFutureTradeEnabled(isBuy)) {
        return
      }
      // 现货都不能交易了，杠杆也无法交易
      if (!isFutureMode && !getUserSpotTradeEnabled(isBuy)) {
        return
      }
      if (tradeInfo.entrustType === EntrustTypeEnum.market) {
        if ((isBuy && !bestBuyPrice) || (!isBuy && !bestSellPrice)) {
          Toast(t`features_orders_future_holding_close_5101267`)
          return
        }
      }
      throttleEmitOnOrder()
    },
  }
}
export function useExchangeContext() {
  return useContext(ExchangeContext)
}
