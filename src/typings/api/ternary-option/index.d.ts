import { YapiPostV1OptionOrdersPlaceApiRequest } from "@/typings/yapi/OptionOrdersPlaceV1PostApi"
import { YapiPostV1OptionPlanOrdersPlaceApiRequest } from "@/typings/yapi/OptionPlanOrdersPlaceV1PostApi"
import { YapiGetV1OptionProductCallAndPutPercentData } from "@/typings/yapi/OptionProductCallAndPutPercentV1GetApi"
import { YapiGetV1OptionProductPeriodsListData } from "@/typings/yapi/OptionProductPeriodsV1GetApi"
import { YapiGetV1OptionProductYieldRateListData } from "@/typings/yapi/OptionProductYieldRateV1GetApi"
import { YapiGetV1OptionTradePairListData } from "@/typings/yapi/OptionTradePairListV1GetApi"

export type ITernaryOptionCoinDetail = Required<YapiGetV1OptionTradePairListData> & {
  symbolWassName: string
}
/** 看涨跌数据 */
export type ITernaryOptionUpDownPercent = YapiGetV1OptionProductCallAndPutPercentData

/** 交易时长 */
export type ITernaryOptionTradeTime = YapiGetV1OptionProductPeriodsListData

export type ITernaryOptionTradeProfitRate = YapiGetV1OptionProductYieldRateListData & {
  /** 前端字段，是否为正的价差 */
  frontendIsUp?: boolean
}

export type ITernaryOptionCreateOrderParams = YapiPostV1OptionOrdersPlaceApiRequest
export type ITernaryOptionCreatePlanOrderParams = YapiPostV1OptionPlanOrdersPlaceApiRequest
