import request, { MarkcoinRequest } from '@/plugins/request'
import {
  ITernaryOptionCreateOrderParams,
  ITernaryOptionCreatePlanOrderParams,
  ITernaryOptionTradeProfitRate,
  ITernaryOptionTradeTime,
  ITernaryOptionUpDownPercent,
} from '@/typings/api/ternary-option'
import {
  YapiPostV1OptionOrdersPlaceApiRequest,
  YapiPostV1OptionOrdersPlaceApiResponse,
} from '@/typings/yapi/OptionOrdersPlaceV1PostApi'
import { YapiGetV1OptionProductCallAndPutPercentApiRequest } from '@/typings/yapi/OptionProductCallAndPutPercentV1GetApi'
import { YapiGetV1OptionProductPeriodsApiRequest } from '@/typings/yapi/OptionProductPeriodsV1GetApi'
import { YapiGetV1OptionProductYieldRateApiRequest } from '@/typings/yapi/OptionProductYieldRateV1GetApi'

/**
 * 查询涨跌百分比
 */
export const queryOptionUpDownPercent: MarkcoinRequest<
  YapiGetV1OptionProductCallAndPutPercentApiRequest,
  ITernaryOptionUpDownPercent
> = params => {
  return request({
    path: '/v1/option/product/callAndPutPercent',
    method: 'GET',
    params: {
      ...params,
    },
  })
}

/**
 * 查询期权配置的交易时长
 */
export const queryOptionTradeTimes: MarkcoinRequest<
  YapiGetV1OptionProductPeriodsApiRequest,
  ITernaryOptionTradeTime[]
> = params => {
  return request({
    path: '/v1/option/product/periods',
    method: 'GET',
    params: {
      ...params,
    },
  })
}

/**
 * [下单页面收益率列表↗](https://yapi.nbttfc365.com/project/44/interface/api/11069)
 * */
export const queryOptionProfitRateList: MarkcoinRequest<
  YapiGetV1OptionProductYieldRateApiRequest,
  ITernaryOptionTradeProfitRate[]
> = params => {
  return request({
    path: '/v1/option/product/yieldRate',
    method: 'GET',
    params,
  })
}

/**
 * [新建期权普通委托↗](https://yapi.nbttfc365.com/project/44/interface/api/10914)
 * */
export const createOptionNormalOrder: MarkcoinRequest<ITernaryOptionCreateOrderParams> = data => {
  return request({
    path: '/v1/option/orders/place',
    method: 'POST',
    data,
  })
}

/**
 * [新建期权计划委托↗](https://yapi.nbttfc365.com/project/44/interface/api/10929)
 * */
export const createOptionPlanOrder: MarkcoinRequest<ITernaryOptionCreatePlanOrderParams> = data => {
  return request({
    path: '/v1/option/plan/orders/place',
    method: 'POST',
    data,
  })
}
