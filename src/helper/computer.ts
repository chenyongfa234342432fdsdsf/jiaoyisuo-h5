// 合约计算器相关公式，和持仓中的公式无法共用

import { IFutureComputerBaseContext } from '@/features/future/computer/common/context'
import { decimalUtils } from '@nbit/utils'
import { TradeDirectionEnum, TradeUnitEnum } from '@/constants/trade'
import { formatNumberDecimalWhenExceed } from './decimal'
import { getCurrentLeverConfig } from './trade'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type IParams = IFutureComputerBaseContext & {
  digit: number
}
/** 不带精度的金额 */
function calcAmount({ amount, tradeUnit, entrustAmount, entrustPrice }: IParams) {
  return tradeUnit === TradeUnitEnum.quote ? amount : SafeCalcUtil.mul(entrustAmount, entrustPrice).toString()
}
/** 不带精度的委托数量 */
function calcEntrustAmount({ amount, tradeUnit, entrustPrice, entrustAmount }: IParams) {
  return tradeUnit === TradeUnitEnum.quote ? SafeCalcUtil.div(amount, entrustPrice).toString() : entrustAmount
}
/**
 * 计算保证金
 * 保证金 = 合约数量 * 开仓价格 / 杠杆
 */
export function calcMargin(params: IParams, needDigit = true) {
  const { lever, digit } = params
  const margin = SafeCalcUtil.div(calcAmount(params), lever).toString()
  return needDigit ? formatNumberDecimalWhenExceed(margin, digit) : margin
}
function calcFee(params: IParams, rate: number) {
  const { entrustPrice, digit, closePrice } = params
  const openFee = SafeCalcUtil.mul(SafeCalcUtil.mul(entrustPrice, calcEntrustAmount(params)), rate)
  const closeFee = SafeCalcUtil.mul(SafeCalcUtil.mul(closePrice, calcEntrustAmount(params)), rate)
  return formatNumberDecimalWhenExceed(SafeCalcUtil.add(openFee, closeFee), digit)
}
/**
 * 计算 taker 手续费
 */
export function calcTakerFee(params: IParams) {
  return calcFee(params, params.selectedFuture?.takerFeeRate || 0)
}

/**
 * 计算 maker 手续费
 */
export function calcMakerFee(params: IParams) {
  return calcFee(params, params.selectedFuture?.markerFeeRate || 0)
}

/**
 * 计算收益
 * 收益 = (平仓价格 - 开仓价格) * 合约数量
 */
export function calcProfit(params: IParams, needDigit = true) {
  // 暂时不减去手续费
  const { entrustPrice, closePrice, digit } = params
  const profit = SafeCalcUtil.sub(
    SafeCalcUtil.mul(SafeCalcUtil.sub(closePrice, entrustPrice), calcEntrustAmount(params)),
    0
  )
    .mul(params.direction === TradeDirectionEnum.buy ? 1 : -1)
    .toString()
  return needDigit ? formatNumberDecimalWhenExceed(profit, digit) : profit
}
/**
 * 计算收益率
 * 收益 = 收益 / 本金
 */
export function calcProfitRate(params: IParams) {
  return formatNumberDecimalWhenExceed(SafeCalcUtil.div(calcProfit(params, false), calcMargin(params, false)), 4)
}

/**
 * 计算平仓价格
 * 平仓价格 = 收益 / 合约数量 + 开仓价格
 */
export function calcClosePrice(params: IParams) {
  const profit = params.profitIsRate
    ? SafeCalcUtil.mul(calcMargin(params, false), SafeCalcUtil.div(params.profitRate, 100))
    : params.profit

  const price = formatNumberDecimalWhenExceed(
    SafeCalcUtil.add(
      SafeCalcUtil.div(profit, calcEntrustAmount(params)).mul(params.direction === TradeDirectionEnum.buy ? 1 : -1),
      params.entrustPrice
    ),
    params.digit
  )

  return Number(price) > 0 ? price : '0'
}

/**
 * 计算强平价格
 * 开空/开多
 * （开仓价格 ±（保证金+额外保证金）/ 开仓数量 ) /（1 ± (taker 手续费率 + 维持保证金率）)
 */
export function calcLiquidationPrice(params: IParams) {
  const { entrustPrice, extraMargin, lever, digit, selectedFuture } = params
  const currentLeverConfig = getCurrentLeverConfig(lever, selectedFuture!.tradePairLeverList as any)
  const maintainMarginRatio = currentLeverConfig.marginRate
  const takerFeeRate = selectedFuture?.takerFeeRate || 0

  const margin = calcMargin(params, false)

  const price = formatNumberDecimalWhenExceed(
    SafeCalcUtil.div(
      SafeCalcUtil.add(
        entrustPrice,
        SafeCalcUtil.div(SafeCalcUtil.add(margin, extraMargin), calcEntrustAmount(params)).mul(
          params.direction === TradeDirectionEnum.buy ? -1 : 1
        )
      ),
      SafeCalcUtil.add(
        1,
        SafeCalcUtil.add(takerFeeRate, maintainMarginRatio).mul(params.direction === TradeDirectionEnum.buy ? -1 : 1)
      )
    ),
    digit
  )

  return Number(price) > 0 ? price : '0'
}
