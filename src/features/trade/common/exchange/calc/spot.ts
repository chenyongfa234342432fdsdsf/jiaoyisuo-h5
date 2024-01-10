import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import Decimal from 'decimal.js'
import { useCreation } from 'ahooks'
import { getMyAssetsDataProps } from '@/typings/assets'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { useGetMyAssets } from '@/hooks/features/assets/spot'
import { useAssetsStore } from '@/store/assets/spot'
import type { IExchangeBaseContext } from '../context'
import { IExchangeCOntextCalcHelper } from '.'

/** 现货的舍入策略，和 pc 端保持一致 */
const toFixedStrategy = Decimal.ROUND_DOWN

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 计算手续费
 */
function calcFee(amount: any) {
  // TODO: 费率如何获取未定
  const feeRate = 0
  return SafeCalcUtil.mul(amount, feeRate) as any
}

/**
 * 计算花费金额
 * 委托价格 * 委托数量 / 杠杆
 */
function calcAmount(tempTradeInfo: IExchangeBaseContext, digit: number) {
  let amount = SafeCalcUtil.div(
    SafeCalcUtil.mul(tempTradeInfo.entrustPrice, tempTradeInfo.entrustAmount),
    tempTradeInfo.lever
  )
  return formatNumberDecimalWhenExceed(amount, digit, toFixedStrategy)
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
  amount = SafeCalcUtil.sub(amount, calcFee(amount))

  return formatNumberDecimalWhenExceed(SafeCalcUtil.div(amount, tempTradeInfo.entrustPrice), digit, toFixedStrategy)
}

/**
 * 计算百分比
 * 金额 / 可用余额
 */
function calcPercent(amount: string, balance: number) {
  return Math.min(Number(SafeCalcUtil.div(amount, balance).mul(100).toFixed(0)), 100)
}

function useGetBalance(tempTradeInfo: IExchangeBaseContext) {
  const currentCoin = useTradeCurrentSpotCoin()
  const { tradeMode } = tempTradeInfo
  const assetsOptions = useCreation(() => {
    const options: getMyAssetsDataProps = {
      accountType: tradeMode,
      paramsCoin: {
        tradeId: currentCoin.id!,
      },
    }

    return options
  }, [currentCoin.id, tradeMode])
  useGetMyAssets(assetsOptions)
  const { userAssetsSpot } = useAssetsStore()
  // const userAssetsSpot = useGetMyAssets(assetsOptions)
  const baseBalance = userAssetsSpot?.sellCoin.availableAmount
  const quoteBalance = userAssetsSpot?.buyCoin.availableAmount

  return {
    baseBalance,
    quoteBalance,
    positionQuoteBalance: 0,
  }
}

export const spotTradeCalcHelper: IExchangeCOntextCalcHelper = {
  calcAmount,
  calcEntrustAmount,
  calcFee,
  calcPercent,
  useGetBalance,
}
