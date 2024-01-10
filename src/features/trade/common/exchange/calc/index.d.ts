import Decimal from 'decimal.js'
import type { IExchangeBaseContext } from '../context'

/**
 * 计算手续费
 */
export interface ICalcFee {
  (amount: any): string
}
/**
 * 计算花费金额
 */
export interface ICalcAmount {
  (tempTradeInfo: IExchangeBaseContext, digit: number): string
}
/**
 * 计算委托数量
 */
export interface ICalcEntrustAmount {
  (tempTradeInfo: IExchangeBaseContext, digit: number): string
}

/**
 * 计算百分比
 */
export interface ICalcPercent {
  (amount: string, balance: number): number
}
/**
 * 计算仓位名义价值
 */
export interface ICalcPositionNamedValue {
  (tradeInfo: IExchangeBaseContext, digit: number): string
}
/** 获取余额 */
export interface ICalcGetBalance {
  (tradeInfo: IExchangeBaseContext): {
    baseBalance: number
    quoteBalance: number
    /** 仓位总计价币余额 */
    positionQuoteBalance: number
  }
}

export type IExchangeCOntextCalcHelper = {
  calcFee: ICalcFee
  calcAmount: ICalcAmount
  calcEntrustAmount: ICalcEntrustAmount
  calcPercent: ICalcPercent
  calcPositionNamedValue?: ICalcPositionNamedValue
  useGetBalance: ICalcGetBalance
}
