import {
  EntrustTypeEnum,
  TradeDirectionEnum,
  TradeModeEnum,
  TradePriceTypeEnum,
  TradeUnitEnum,
  MarginModeEnum,
  SpotTradeMarginModeEnum,
  SpotStopLimitTypeEnum,
  TradeFutureMarginTypeInReqEnum,
} from '@/constants/trade'
import { baseCommonStore } from '@/store/common'
import { IFutureGroup } from '@/typings/api/future/common'

export type IExchangeTradeInfo = {
  entrustType: EntrustTypeEnum
  direction: TradeDirectionEnum
  entrustPrice: string
  /** 委托额，标的币种 */
  entrustAmount: string
  /** 花费金额，基础币种 */
  amount: string
  tradeMode: TradeModeEnum
  triggerPrice: string
  /** 触发价类型，仅用于计划订单 */
  triggerPriceType: TradePriceTypeEnum
  /** 委托价类型，仅用于计划订单 */
  entrustPriceType: EntrustTypeEnum
  tradeUnit: TradeUnitEnum
  /** 滑块数值 */
  percent: number
  lever: number
  // TODO: 含义不明
  funds?: string
  marginMode?: MarginModeEnum
  tradeMarginType?: SpotTradeMarginModeEnum
  // 额外保证金
  extraMargin: string
  extraMarginPercent: number
  /** 开启合约止盈止损 */
  stopLimitEnabled: boolean
  // 止盈止损委托价，在合约里同时也认为是触发价
  stopProfitPrice: string
  stopLossPrice: string
  // 止盈止损触发价，
  stopProfitTriggerPrice: string
  stopLossTriggerPrice: string
  stopLimitPriceType: TradePriceTypeEnum
  // 止盈止损委托价类型
  stopLossEntrustPriceType: EntrustTypeEnum
  stopProfitEntrustPriceType: EntrustTypeEnum
  onlyReduce: boolean
  autoAddMargin: boolean
  /** 减仓时的仓位价值 */
  positionAmount: string
  spotStopLimitType: SpotStopLimitTypeEnum
  group?: IFutureGroup
  /** 合约组是否已初始化 */
  groupInited?: boolean
  /** 合约保证金来源 */
  marginSource?: TradeFutureMarginTypeInReqEnum
  /** 当前委托价格是否聚焦，聚焦的话不需要填入价格 */
  entrustPriceInputIsFocused?: boolean
  /** 委托价格是否已重新输入过，是的话就不需要自动填入最新价 */
  entrustPriceIsDirty?: boolean
}

export function createExchangeContextTradeInfo(defaultValue: Partial<IExchangeTradeInfo>) {
  const initialData: IExchangeTradeInfo = {
    entrustType: EntrustTypeEnum.market,
    direction: TradeDirectionEnum.buy,
    entrustAmount: '',
    amount: '',
    triggerPrice: '',
    tradeUnit: TradeUnitEnum.indexBase,
    tradeMode: TradeModeEnum.spot,
    entrustPrice: defaultValue.entrustPrice || '',
    percent: 0,
    lever: 1,
    extraMargin: '',
    autoAddMargin: false,
    //  新建账户默认为 100 全仓，选择了其它合约组则再置为 0
    extraMarginPercent: 100,
    stopLimitEnabled: false,
    groupInited: false,
    onlyReduce: false,
    stopProfitPrice: '',
    stopLossPrice: '',
    stopProfitTriggerPrice: '',
    stopLossTriggerPrice: '',
    positionAmount: '',
    entrustPriceInputIsFocused: false,
    stopLossEntrustPriceType: EntrustTypeEnum.limit,
    stopProfitEntrustPriceType: EntrustTypeEnum.limit,
    spotStopLimitType: SpotStopLimitTypeEnum.single,
    stopLimitPriceType: TradePriceTypeEnum.latest,
    triggerPriceType: TradePriceTypeEnum.latest,
    entrustPriceType: EntrustTypeEnum.market,
    marginSource: TradeFutureMarginTypeInReqEnum.assets,
  }
  Object.assign(initialData, defaultValue)

  return initialData
}
export function resetData(tempTradeInfo: IExchangeTradeInfo, { keepStopLimit = true, keepExtraMargin = true } = {}) {
  tempTradeInfo.entrustAmount = ''
  tempTradeInfo.amount = ''
  tempTradeInfo.percent = 0
  tempTradeInfo.triggerPrice = ''

  tempTradeInfo.positionAmount = ''
  tempTradeInfo.triggerPrice = ''
  tempTradeInfo.stopLossTriggerPrice = ''
  tempTradeInfo.stopProfitTriggerPrice = ''
  tempTradeInfo.entrustPriceIsDirty = false
  if (!keepStopLimit) {
    tempTradeInfo.stopProfitPrice = ''
    tempTradeInfo.stopLossPrice = ''
    tempTradeInfo.stopProfitTriggerPrice = ''
    tempTradeInfo.stopLossTriggerPrice = ''
  }

  if (!keepExtraMargin) {
    tempTradeInfo.extraMargin = ''
    // 融合模式下不启用全仓
    const { isFusionMode } = baseCommonStore.getState()
    tempTradeInfo.extraMarginPercent = isFusionMode || tempTradeInfo.group ? 0 : 100
  }
}

/** 预先写好事件处理类型，避免类型循环 */
export type IExchangeAllHandlers = {
  onAmountChange: (value: string, latestInfo?: IExchangeTradeInfo) => IExchangeTradeInfo
  onPositionAmountChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onPercentChange: (value: number, latestInfo?: IExchangeTradeInfo) => void
  onTradeUnitChange: (value: TradeUnitEnum, latestInfo?: IExchangeTradeInfo) => void
  onEntrustAmountChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onEntrustPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onEntrustTypeChange: (value: EntrustTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onDirectionChange: (value: TradeDirectionEnum, latestInfo?: IExchangeTradeInfo) => void
  onFutureMarketPriceChange: (
    newPrice: {
      price: string
      count: string
    },
    latestInfo?: IExchangeTradeInfo
  ) => void
  onLeverChange: (value: number, latestInfo?: IExchangeTradeInfo) => void
  onExtraMarginPercentChange: (value: number, latestInfo?: IExchangeTradeInfo) => void
  onExtraMarginChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onStopLimitEnabledChange: (value: boolean, latestInfo?: IExchangeTradeInfo) => void
  onStopLimitPriceTypeChange: (value: TradePriceTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onStopLossPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onAutoAddMarginChange: (value: boolean, latestInfo?: IExchangeTradeInfo) => void
  onOnlyReduceChange: (value: boolean, latestInfo?: IExchangeTradeInfo) => void
  onStopProfitPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onTriggerPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onTriggerPriceTypeChange: (value: TradePriceTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onEntrustPriceTypeChange: (value: EntrustTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onFutureGroupChange: (value: IFutureGroup, latestInfo?: IExchangeTradeInfo) => void
  onMarginSourceChange: (value: TradeFutureMarginTypeInReqEnum, latestInfo?: IExchangeTradeInfo) => void
  onStopLossTriggerPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onStopProfitTriggerPriceChange: (value: string, latestInfo?: IExchangeTradeInfo) => void
  onSpotStopLimitTypeChange: (value: SpotStopLimitTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onStopProfitEntrustPriceTypeChange: (value: EntrustTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onStopLossEntrustPriceTypeChange: (value: EntrustTypeEnum, latestInfo?: IExchangeTradeInfo) => void
  onEntrustPriceInputBlur: () => void
  onEntrustPriceInputFocus: () => void
}

export type IUseInSubParams = {
  allHandlers: IExchangeAllHandlers
  useOnChange: <T>(fn: (value: T, info: IExchangeTradeInfo) => void) => void
  resetData: typeof resetData
  fillEntrustPrice: string
  latestPrice: string
}
