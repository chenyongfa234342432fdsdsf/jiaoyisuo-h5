import { createContext, useContext, useState } from 'react'
import { TradeDirectionEnum, TradeUnitEnum } from '@/constants/trade'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { getFutureDefaultLever } from '@/helper/trade'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type IFuturePair = YapiGetV1PerpetualTradePairDetailData & {
  quoteSymbolScale: number
}

export type IFutureComputerBaseContext = {
  selectedFuture?: IFuturePair
  lever: number
  entrustPrice: string
  direction: TradeDirectionEnum
  closePrice: string
  /** 委托额，标的币种 */
  entrustAmount: string
  /** 花费金额，基础币种 */
  amount: string
  // 额外保证金
  extraMargin: string
  tradeUnit: TradeUnitEnum
  profit: string
  /** 收益率，带上了百分比的 */
  profitRate: string
  profitIsRate: boolean
}

export const futureComputerContext = createContext<ReturnType<typeof useFutureComputerContextInTop>>({} as any)
function createExchangeContextValue(defaultValue: Partial<IFutureComputerBaseContext>) {
  const initialData: IFutureComputerBaseContext = {
    direction: TradeDirectionEnum.buy,
    entrustAmount: '',
    amount: '',
    tradeUnit: TradeUnitEnum.indexBase,
    entrustPrice: defaultValue.entrustPrice || '',
    lever: 1,
    extraMargin: '',
    closePrice: '',
    profitIsRate: false,
    profit: '',
    profitRate: '',
  }
  Object.assign(initialData, defaultValue)

  return initialData
}
export function useFutureComputerContextInTop() {
  const [tradeInfo, setTradeInfo] = useState(createExchangeContextValue({}))
  const selectedFuture = tradeInfo.selectedFuture
  const buySymbol = selectedFuture?.quoteSymbolName
  const sellSymbol = selectedFuture?.baseSymbolName
  const buyDigit = selectedFuture?.quoteSymbolScale
  const sellDigit = selectedFuture?.amountOffset
  const priceDigit = selectedFuture?.priceOffset
  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  /** 合约计算器单独保存一份杠杆缓存 */
  const [leverCache, setLeverCache] = useState<Record<any, number>>({})

  const onChange = (newInfo: Partial<IFutureComputerBaseContext>) => {
    setTradeInfo(old => ({
      ...old,
      ...newInfo,
    }))
  }
  const onEntrustPriceChange = (value: string) => {
    onChange({
      entrustPrice: value,
      ...(!unitIsQuote
        ? { amount: formatNumberDecimalWhenExceed(SafeCalcUtil.mul(value, tradeInfo.entrustAmount), buyDigit || 2) }
        : {
            entrustAmount: formatNumberDecimalWhenExceed(SafeCalcUtil.div(tradeInfo.amount, value), sellDigit || 2),
          }),
    })
  }
  const onLeverChange = (value: number) => {
    onChange({
      lever: value,
    })
    setLeverCache({
      ...leverCache,
      [selectedFuture!.id!]: value,
    })
  }
  const onDirectionChange = (value: TradeDirectionEnum) => {
    onChange({
      direction: value,
    })
  }
  const onTradeUnitChange = (value: TradeUnitEnum) => {
    if (value === tradeInfo.tradeUnit) {
      return
    }
    // 保持输入框的值不变
    const keepValue = unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount
    onChange({
      tradeUnit: value,
      amount: unitIsQuote
        ? formatNumberDecimalWhenExceed(SafeCalcUtil.mul(keepValue, tradeInfo.entrustPrice), buyDigit || 2)
        : keepValue,
      entrustAmount: unitIsQuote
        ? keepValue
        : formatNumberDecimalWhenExceed(SafeCalcUtil.div(keepValue, tradeInfo.entrustPrice), sellDigit || 2),
    })
  }
  const onEntrustAmountChange = (value: string) => {
    onChange({
      entrustAmount: value,
      amount: formatNumberDecimalWhenExceed(SafeCalcUtil.mul(value, tradeInfo.entrustPrice), buyDigit || 2),
    })
  }
  const onAmountChange = (value: string) => {
    onChange({
      amount: value,
      entrustAmount: formatNumberDecimalWhenExceed(SafeCalcUtil.div(value, tradeInfo.entrustPrice), sellDigit || 2),
    })
  }
  const onClosePriceChange = (value: string) => {
    onChange({
      closePrice: value,
    })
  }
  const onProfitIsRateChange = (value: boolean) => {
    onChange({
      profitIsRate: value,
    })
  }
  const onProfitChange = (value: string) => {
    onChange({
      profit: value,
    })
  }
  const onProfitRateChange = (value: string) => {
    onChange({
      profitRate: value,
    })
  }
  const onExtraMarginChange = (value: string) => {
    onChange({
      extraMargin: value,
    })
  }
  const onSelectedFutureChange = (value: IFuturePair) => {
    onChange({
      ...createExchangeContextValue({}),
      selectedFuture: value,
      lever: leverCache[value.id!] || getFutureDefaultLever(value),
    })
  }

  return {
    tradeInfo,
    onEntrustPriceChange,
    onLeverChange,
    onExtraMarginChange,
    onDirectionChange,
    onTradeUnitChange,
    onEntrustAmountChange,
    onAmountChange,
    onClosePriceChange,
    onProfitIsRateChange,
    onProfitChange,
    onProfitRateChange,
    onSelectedFutureChange,
    buySymbol,
    sellSymbol,
    buyDigit,
    sellDigit,
    priceDigit,
    unitIsQuote,
  }
}

export function useFutureComputerContext() {
  return useContext(futureComputerContext)
}
