import { YapiGetV1PerpetualStrategyHistoryApiRequest } from '@/typings/yapi/PerpetualStrategyHistoryV1GetApi.d'
import { getSpotFiltersModalDefaultParams } from './contract-history/spot-filters-modal'

enum PerpetualOrderDetail {
  openPosition = '开仓',
  orderLock = '下单冻结',
  cancelOrderUnlock = '撤单解冻',
  closePosition = '平仓',
  openPositionFee = '开仓手续费',
  closePositionFee = '平仓手续费',
  closePositionProfitAndLoss = '平仓盈亏',
  forcedClosePosition = '强制平仓',
  forcedReducePosition = '强制减仓',
  fundsFee = '资金费用',
  withdrawMargin = '提取保证金',
  depositMargin = '充值保证金',
  lockPositionFee = '锁仓手续费',
  migrate = '迁移',
  forcedClosePositionReturn = '强平返还',
  forcedClosePositionFee = '强平手续费',
  crossPositionInsuranceInjection = '穿仓保险金注入',
}

enum GetTypeIndName {
  delivery = '交割',
  perpetual = '永续',
}

const capitalSelectParamsProps = getSpotFiltersModalDefaultParams()

type CapitalSelectParams = typeof capitalSelectParamsProps

interface HistorySelectParams extends CapitalSelectParams {
  tradeId: string
}

type CurrentNormalParams = {
  entrustTypeInd: string
}

type HistoryNormalParams = {
  statusArr?: string[]
  entrustTypeInd?: string
  typeInd?: string
}

type IQuerySpotOrderReqParams = Partial<YapiGetV1PerpetualStrategyHistoryApiRequest> & {
  dateType?: string
  statusArr?: string[]
  beginDateNumber?: number
  endDateNumber?: number
  hideCanceled?: boolean
}

enum IsAccept {
  // 接管单
  TakeoverOrder = 1,
  // 非接管单
  NotTakeoverOrder = 2,
}

export {
  PerpetualOrderDetail,
  GetTypeIndName,
  IQuerySpotOrderReqParams,
  HistorySelectParams,
  CapitalSelectParams,
  CurrentNormalParams,
  HistoryNormalParams,
  IsAccept,
}
