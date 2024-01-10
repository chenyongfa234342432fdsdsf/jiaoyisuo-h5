import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiPostV1OptionFavouriteTradePairAddApiRequest,
  YapiPostV1OptionFavouriteTradePairAddApiResponse,
} from '@/typings/yapi/OptionFavouriteTradePairAddV1PostApi'
import {
  YapiPostV1OptionFavouriteTradePairDeleteApiRequest,
  YapiPostV1OptionFavouriteTradePairDeleteApiResponse,
} from '@/typings/yapi/OptionFavouriteTradePairDeleteV1PostApi'
import {
  YapiGetV1OptionFavouriteTradePairListApiRequest,
  YapiGetV1OptionFavouriteTradePairListApiResponse,
} from '@/typings/yapi/OptionFavouriteTradePairListV1GetApi'
import {
  YapiGetV1OptionTradePairListApiRequest,
  YapiGetV1OptionTradePairListApiResponse,
} from '@/typings/yapi/OptionTradePairListV1GetApi'
// @ts-ignore
// import { YapiGetV1EarningTodayApiRequest, YapiGetV1EarningTodayApiResponse } from '@/typings/yapi/EarningTodayV1GetApi'

/**
 * [添加自选↗](https://yapi.nbttfc365.com/project/44/interface/api/10954)
 * */
export const postV1OptionFavouriteTradePairAddApiRequest: MarkcoinRequest<
  YapiPostV1OptionFavouriteTradePairAddApiRequest,
  YapiPostV1OptionFavouriteTradePairAddApiResponse['data']
> = data => {
  return request({
    path: '/v1/option/favouriteTradePair/add',
    method: 'POST',
    data,
  })
}

/**
 * [删除自选↗](https://yapi.nbttfc365.com/project/44/interface/api/10959)
 * */
export const postV1OptionFavouriteTradePairDeleteApiRequest: MarkcoinRequest<
  YapiPostV1OptionFavouriteTradePairDeleteApiRequest,
  YapiPostV1OptionFavouriteTradePairDeleteApiResponse['data']
> = data => {
  return request({
    path: '/v1/option/favouriteTradePair/delete',
    method: 'POST',
    data,
  })
}

/**
 * [期权自选列表↗](https://yapi.nbttfc365.com/project/44/interface/api/10964)
 * */
export const getV1OptionFavouriteTradePairListApiRequest: MarkcoinRequest<
  YapiGetV1OptionFavouriteTradePairListApiRequest,
  YapiGetV1OptionFavouriteTradePairListApiResponse['data']
> = params => {
  return request({
    path: '/v1/option/favouriteTradePair/list',
    method: 'GET',
    params,
  })
}

/**
 * [期权全部币对列表↗](https://yapi.nbttfc365.com/project/44/interface/api/10979)
 * */
export const getV1OptionTradePairListApiRequest: MarkcoinRequest<
  YapiGetV1OptionTradePairListApiRequest,
  YapiGetV1OptionTradePairListApiResponse['data']
> = params => {
  return request({
    path: '/v1/option/tradePair/list',
    method: 'GET',
    params,
  })
}

/**
 * [查询今日盈亏统计↗](https://yapi.nbttfc365.com/project/44/interface/api/11044)
 * */
export const getV1EarningTodayApiRequest: MarkcoinRequest = params => {
  return request({
    path: '/v1/earning/today',
    method: 'GET',
    params,
  })
}
