import {
  EntrustTypeEnum,
  TradeUnitEnum,
  SpotNormalOrderMarketUnitEnum,
  SpotPlanTriggerDirection,
  SpotStopLimitTypeEnum,
} from '@/constants/trade'
import { useExchangeContext } from '@/features/trade/common/exchange/context'
import {
  ICreateSpotNormalOrderReq,
  ICreateSpotPlanOrderReq,
  ICreateSpotStopLimitOrderReq,
  ISpotCoinDetail,
} from '@/typings/api/trade'
import { decimalUtils } from '@nbit/utils'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 获取现货交易接口参数
 */
export function getTradeSpotOrderParams(
  context: ReturnType<typeof useExchangeContext>,
  currentSpotCoin: ISpotCoinDetail
) {
  const { tradeInfo, isBuy, isStopLimit, couponsRef } = context
  const isPlanOrder = tradeInfo.entrustType === EntrustTypeEnum.plan
  const normalIsMarket = tradeInfo.entrustType === EntrustTypeEnum.market
  const unitIsBase = tradeInfo.tradeUnit === TradeUnitEnum.indexBase
  const normalParams: ICreateSpotNormalOrderReq = {
    tradeId: currentSpotCoin.id!,
    orderType: tradeInfo.entrustType,
    marketUnit: normalIsMarket
      ? !unitIsBase
        ? SpotNormalOrderMarketUnitEnum.amount
        : SpotNormalOrderMarketUnitEnum.entrustAmount
      : '',
    side: tradeInfo.direction,
    placePrice: normalIsMarket ? undefined : Number(tradeInfo.entrustPrice),
    placeCount: normalIsMarket && !unitIsBase ? undefined : Number(tradeInfo.entrustAmount),
    funds: normalIsMarket && !unitIsBase ? Number(tradeInfo.amount) : undefined,
    coupons: couponsRef.current.coupons,
    // optimalLimitOrder，最优限价单暂时不做
  }
  const planIsMarketPrice = tradeInfo.entrustPriceType === EntrustTypeEnum.market
  const planParams: ICreateSpotPlanOrderReq = {
    tradeId: currentSpotCoin.id!,
    triggerTypeInd: tradeInfo.triggerPriceType,
    triggerPrice: Number(tradeInfo.triggerPrice),
    triggerDirectionInd: SafeCalcUtil.sub(tradeInfo.triggerPrice, currentSpotCoin.last).gte(0)
      ? SpotPlanTriggerDirection.up
      : SpotPlanTriggerDirection.down,
    matchType: tradeInfo.entrustPriceType,
    orderPrice: planIsMarketPrice
      ? unitIsBase
        ? undefined
        : Number(tradeInfo.amount)
      : Number(tradeInfo.entrustPrice),
    orderAmount: planIsMarketPrice
      ? unitIsBase
        ? Number(tradeInfo.entrustAmount)
        : undefined
      : Number(tradeInfo.entrustAmount),
    side: tradeInfo.direction,
    coupons: couponsRef.current.coupons,
  }
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double
  const profitPriceIsMarket = tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market
  const lossPriceIsMarket = tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
  const doubleStopLimitIsMarketPrice = profitPriceIsMarket && isDouble && lossPriceIsMarket

  const stopLimitDoubleCount = profitPriceIsMarket && !unitIsBase ? (undefined as any) : Number(tradeInfo.entrustAmount)
  const stopLimitDoubleFunds = profitPriceIsMarket && !unitIsBase ? Number(tradeInfo.amount) : (undefined as any)
  let stopLimitParams: ICreateSpotStopLimitOrderReq = {
    tradeId: currentSpotCoin.id!,
    marketUnit: doubleStopLimitIsMarketPrice
      ? !unitIsBase
        ? SpotNormalOrderMarketUnitEnum.amount
        : SpotNormalOrderMarketUnitEnum.entrustAmount
      : SpotNormalOrderMarketUnitEnum.entrustAmount,
    profitOrderType: profitPriceIsMarket ? EntrustTypeEnum.market : EntrustTypeEnum.limit,
    lossOrderType: (lossPriceIsMarket ? EntrustTypeEnum.market : EntrustTypeEnum.limit) as any,
    profitTriggerPrice: Number(tradeInfo.stopProfitTriggerPrice),
    profitPlacePrice: profitPriceIsMarket ? undefined : Number(tradeInfo.stopProfitPrice),
    profitPlaceCount: stopLimitDoubleCount,
    profitFunds: stopLimitDoubleFunds,
    lossTriggerPrice: Number(tradeInfo.stopLossTriggerPrice),
    lossPlacePrice: lossPriceIsMarket ? (undefined as any) : Number(tradeInfo.stopLossPrice),
    lossPlaceCount: stopLimitDoubleCount,
    lossFunds: stopLimitDoubleFunds,
    side: tradeInfo.direction,
    coupons: couponsRef.current.coupons,
  }
  // 对于单向止盈止损，就重新某些数据
  if (!isDouble) {
    const isProfit = isBuy
      ? planParams.triggerDirectionInd === SpotPlanTriggerDirection.down
      : planParams.triggerDirectionInd === SpotPlanTriggerDirection.up
    const placePrice = planIsMarketPrice ? (undefined as any) : Number(tradeInfo.entrustPrice)
    const placeCount = planIsMarketPrice && !unitIsBase ? (undefined as any) : Number(tradeInfo.entrustAmount)
    const placeFunds = planIsMarketPrice && !unitIsBase ? Number(tradeInfo.amount) : (undefined as any)
    const orderType = planIsMarketPrice ? EntrustTypeEnum.market : EntrustTypeEnum.limit
    let profitParams: Partial<ICreateSpotStopLimitOrderReq> = {
      profitTriggerPrice: Number(tradeInfo.triggerPrice),
      profitPlacePrice: placePrice,
      profitPlaceCount: placeCount,
      profitFunds: placeFunds,
      profitOrderType: orderType,
    }
    let lossParams: Partial<ICreateSpotStopLimitOrderReq> = {
      lossTriggerPrice: Number(tradeInfo.triggerPrice),
      lossPlacePrice: placePrice,
      lossPlaceCount: placeCount,
      lossFunds: placeFunds,
      lossOrderType: orderType,
    }
    if (isProfit) {
      lossParams = {
        lossTriggerPrice: undefined,
        lossPlacePrice: undefined,
        lossPlaceCount: undefined,
        lossFunds: undefined,
        lossOrderType: undefined,
      } as any
    } else {
      profitParams = {
        profitTriggerPrice: undefined,
        profitPlacePrice: undefined,
        profitPlaceCount: undefined,
        profitFunds: undefined,
        profitOrderType: undefined,
      } as any
    }
    Object.assign(
      stopLimitParams,
      {
        marketUnit: planIsMarketPrice
          ? !unitIsBase
            ? SpotNormalOrderMarketUnitEnum.amount
            : SpotNormalOrderMarketUnitEnum.entrustAmount
          : SpotNormalOrderMarketUnitEnum.entrustAmount,
      },
      profitParams,
      lossParams
    )
  }

  return {
    normalParams,
    planParams,
    isPlanOrder,
    stopLimitParams,
  }
}
