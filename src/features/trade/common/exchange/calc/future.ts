import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { TradeDirectionEnum, TradeFutureMarginTypeInReqEnum, TradeModeEnum, TradeUnitEnum } from '@/constants/trade'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useCreation } from 'ahooks'
import { getMyAssetsDataProps } from '@/typings/assets'
import { useGetMyAssets } from '@/hooks/features/assets/spot'
import { baseFutureTradeStore, useFutureTradeStore } from '@/store/trade/future'
import { baseContractMarketStore } from '@/store/market/contract'
import { findFuturesPositionItem, getFutureExtraMarginSourceIsAssets } from '@/helper/trade'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { IExchangeCOntextCalcHelper } from '.'
import type { IExchangeBaseContext } from '../context'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 计算手续费
 */
function calcFee(amount: any) {
  // TODO: 费率如何获取未定
  const feeRate = 0.0034
  return '0' // SafeCalcUtil.mul(amount, feeRate) as any
}

/**
 * 计算花费金额
 */
function calcAmount(tempTradeInfo: IExchangeBaseContext, digit: number) {
  const { settings: futuresSettings } = baseFutureTradeStore.getState()
  let amount = SafeCalcUtil.div(
    SafeCalcUtil.mul(tempTradeInfo.entrustPrice, tempTradeInfo.entrustAmount),
    tempTradeInfo.lever
  )
  // 重新计算时要加上已有的保证金
  if (!getFutureExtraMarginSourceIsAssets()) {
    amount = SafeCalcUtil.add(amount, tempTradeInfo.extraMargin)
  }
  return formatNumberDecimalWhenExceed(Math.max(amount.toNumber(), 0), digit)
}
/**
 * 计算可开数量
 * (金额 * 杠杆 - 手续费) / 委托价格
 */
function calcEntrustAmount(tempTradeInfo: IExchangeBaseContext, digit: number) {
  if (decimalUtils.getSafeDecimal(tempTradeInfo.entrustPrice).lte(0)) {
    return ''
  }

  let amount = SafeCalcUtil.mul(tempTradeInfo.amount, tempTradeInfo.lever)
  if (!getFutureExtraMarginSourceIsAssets()) {
    amount = SafeCalcUtil.sub(amount, SafeCalcUtil.mul(tempTradeInfo.extraMargin, tempTradeInfo.lever))
  }
  amount = SafeCalcUtil.sub(amount, calcFee(amount))

  return formatNumberDecimalWhenExceed(
    Math.max(SafeCalcUtil.div(amount, tempTradeInfo.entrustPrice).toNumber(), 0),
    digit
  )
}

/**
 * 计算百分比
 * 金额 / 可用余额
 */
function calcPercent(amount: string, balance: number) {
  return Math.min(Number(SafeCalcUtil.div(amount, balance).mul(100).toFixed(0)), 100)
}

//  • 1、• 账户资产作为额外保证金 模式下：
// - 输入框选择计价币时：仓位名义价值=仓位保证金*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
// - 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量，仓位保证金=（开仓数量*标的币价值）/杠杆倍数；最大保留至 usd 稳定币计算精度
// • 2、• 下单资金作为额外保证金 模式下：
// - 输入框选择计价币时：仓位名义价值=（仓位保证金 - 额外保证金数量）*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
// - 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量 - 额外保证金数量*杠杆倍数，仓位保证金=仓位名义价值/杠杆倍数；最大保留至 usd 稳定币计算精度
/**
 * 计算仓位名义价值
 */
function calcPositionNamedValue(tradeInfo: IExchangeBaseContext, digit: number) {
  const { currentCoin: currentFutureCoin } = baseContractMarketStore.getState()
  const { settings: futuresSettings } = baseFutureTradeStore.getState()

  const latestPrice = currentFutureCoin.last

  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  let value = unitIsQuote
    ? SafeCalcUtil.mul(tradeInfo.amount, tradeInfo.lever)
    : SafeCalcUtil.mul(tradeInfo.entrustAmount, tradeInfo.entrustPrice)

  if (!getFutureExtraMarginSourceIsAssets() && unitIsQuote) {
    value = SafeCalcUtil.sub(value, SafeCalcUtil.mul(tradeInfo.extraMargin, tradeInfo.lever))
  }
  if (value.lt(0)) {
    value = decimalUtils.getSafeDecimal(0)
  }
  return formatNumberDecimalWhenExceed(value, digit)
}
function useGetBalance(tempTradeInfo: IExchangeBaseContext) {
  const currentCoin = useTradeCurrentFutureCoin()
  const { tradeMode, group, lever, marginSource } = tempTradeInfo
  const assetsOptions = useCreation(() => {
    const options: getMyAssetsDataProps = {
      accountType: TradeModeEnum.futures,
      paramsFutures: {
        currencyCode: currentCoin.symbolName!,
      },
    }

    return options
  }, [currentCoin.id, tradeMode])
  useGetMyAssets(assetsOptions)
  const { futureGroups } = useFutureTradeStore()
  // positionListFutures 是为了保持更新，别删除
  const { userAssetsFutures, positionListFutures } = useAssetsFuturesStore()
  // 获取当前方向可平标的币余额
  const isBuy = tempTradeInfo.direction === TradeDirectionEnum.buy
  const futurePosition = findFuturesPositionItem(isBuy, group?.groupId || '', currentCoin.id || '', lever)
  const positionBaseBalance =
    Number(futurePosition?.lockSize) > 0
      ? 0
      : SafeCalcUtil.sub(futurePosition?.size, futurePosition?.entrustFrozenSize).toNumber()
  // 减仓时区分方向，开仓时以可用余额为准
  const baseBalance = tempTradeInfo.onlyReduce
    ? positionBaseBalance
    : Number(userAssetsFutures.availableBalanceValue || 0)
  const positionQuoteBalance = Number(
    formatNumberDecimalWhenExceed(
      SafeCalcUtil.mul(baseBalance, tempTradeInfo.entrustPrice || 0),
      currentCoin.priceOffset!
    )
  )
  const quoteBalance =
    marginSource === TradeFutureMarginTypeInReqEnum.assets
      ? Number(userAssetsFutures.availableBalanceValue || 0)
      : Number(futureGroups.find(g => g.groupId === group?.groupId)?.marginAvailable || 0)

  return {
    baseBalance,
    quoteBalance,
    positionQuoteBalance,
  }
}

export const futureTradeCalcHelper: IExchangeCOntextCalcHelper = {
  calcAmount,
  calcEntrustAmount,
  calcFee,
  calcPercent,
  useGetBalance,
  calcPositionNamedValue,
}
