import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1OptionTradePairListApiRequest,
  YapiGetV1OptionTradePairListApiResponse,
} from '@/typings/yapi/OptionTradePairListV1GetApi'
import { YapiGetV1OptionEarningTodayApiResponse } from '@/typings/yapi/OptionEarningTodayV1GetApi'
import dayjs from 'dayjs'

import {
  YapiGetV1OptionOrdersHistoryApiRequest,
  YapiGetV1OptionOrdersHistoryApiResponse,
} from '@/typings/yapi/OptionOrdersHistoryV1GetApi'

import {
  YapiPostV1OptionPlanOrdersOperateApiRequest,
  YapiPostV1OptionPlanOrdersOperateApiResponse,
} from '@/typings/yapi/OptionPlanOrdersOperateV1PostApi'

import {
  YapiPostV1OptionPlanOrdersCancelAllApiRequest,
  YapiPostV1OptionPlanOrdersCancelAllApiResponse,
} from '@/typings/yapi/OptionPlanOrdersCancelAllV1PostApi'

import {
  YapiGetV1OptionPlanOrdersCurrentApiRequest,
  YapiGetV1OptionPlanOrdersCurrentApiResponse,
} from '@/typings/yapi/OptionPlanOrdersCurrentV1GetApi'

export const getOptionTradePairList: MarkcoinRequest<
  YapiGetV1OptionTradePairListApiRequest,
  YapiGetV1OptionTradePairListApiResponse['data']
> = params => {
  return request({
    path: `/v1/option/tradePair/list`,
    method: 'GET',
    params,
  })
}

export const getOptionOrdersHistory: MarkcoinRequest<
  YapiGetV1OptionOrdersHistoryApiRequest,
  YapiGetV1OptionOrdersHistoryApiResponse['data']
> = params => {
  return request({
    path: `/v1/option/orders/history`,
    method: 'GET',
    params,
  })
}

export const setOptionOrdersPlanOperate: MarkcoinRequest<
  YapiPostV1OptionPlanOrdersOperateApiRequest,
  YapiPostV1OptionPlanOrdersOperateApiResponse['data']
> = data => {
  return request({
    path: `/v1/option/plan/orders/operate`,
    method: 'POST',
    data,
  })
}

export const setOptionOrdersCancelAll: MarkcoinRequest<
  YapiPostV1OptionPlanOrdersCancelAllApiRequest,
  YapiPostV1OptionPlanOrdersCancelAllApiResponse['data']
> = data => {
  return request({
    path: `/v1/option/plan/orders/cancelAll`,
    method: 'POST',
    data,
  })
}

export const setOptionOrdersPlanCurrent: MarkcoinRequest<
  YapiGetV1OptionPlanOrdersCurrentApiRequest,
  YapiGetV1OptionPlanOrdersCurrentApiResponse['data']
> = data => {
  return request({
    path: `/v1/option/plan/orders/current`,
    method: 'GET',
    data,
  })
}

/**
 * [今日盈亏↗](https://yapi.nbttfc365.com/project/44/interface/api/11074)
 * */
export const getV1OptionEarningTodayApiRequest: MarkcoinRequest<
  any,
  YapiGetV1OptionEarningTodayApiResponse['data']
> = () => {
  return request({
    path: '/v1/option/earning/today',
    method: 'GET',
    params: {
      ts: dayjs().startOf('day').unix() * 1000,
    },
  })
}
