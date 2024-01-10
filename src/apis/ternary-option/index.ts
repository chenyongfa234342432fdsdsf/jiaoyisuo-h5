import request, { MarkcoinRequest } from '@/plugins/request'
import { ITernaryOptionCoinDetail } from '@/typings/api/ternary-option'
import {
  YapiGetV1OptionMarketDealCountApiRequest,
  YapiGetV1OptionMarketDealCountApiResponse,
} from '@/typings/yapi/OptionMarketDealCountV1GetApi'
import {
  YapiGetV1OptionMarketKlinesApiRequest,
  YapiGetV1OptionMarketKlinesApiResponse,
} from '@/typings/yapi/OptionMarketKlinesV1GetApi'
import { YapiGetV1OptionTradePairDetailApiRequest } from '@/typings/yapi/OptionTradePairDetailV1GetApi'
import { YapiGetV1OptionTradePairListApiRequest } from '@/typings/yapi/OptionTradePairListV1GetApi'

/**
 * [期权全部币对列表↗](https://yapi.nbttfc365.com/project/44/interface/api/10979)
 * */
export const getOptionTradePairList: MarkcoinRequest<
  YapiGetV1OptionTradePairListApiRequest,
  {
    list: ITernaryOptionCoinDetail[]
  }
> = params => {
  return request({
    path: '/v1/option/tradePair/list',
    method: 'GET',
    params,
  })
}
/**
 * [期权详情接口↗](https://yapi.nbttfc365.com/project/44/interface/api/11149)
 * */
export const getOptionTradePairDetail: MarkcoinRequest<
  YapiGetV1OptionTradePairDetailApiRequest,
  ITernaryOptionCoinDetail
> = params => {
  return request({
    path: '/v1/option/tradePair/detail',
    method: 'GET',
    params,
  })
}

/**
 * [k线接口↗](https://yapi.nbttfc365.com/project/44/interface/api/11089)
 * */
export const getV1OptionMarketKlinesApiRequest: MarkcoinRequest<
  YapiGetV1OptionMarketKlinesApiRequest,
  YapiGetV1OptionMarketKlinesApiResponse['data']
> = params => {
  return request({
    path: '/v1/option/market/klines',
    method: 'GET',
    params,
  })
}

/**
 * [k线下单统计↗](https://yapi.nbttfc365.com/project/44/interface/api/15119)
 * */
export const getV1OptionMarketDealCountApiRequest: MarkcoinRequest<
  YapiGetV1OptionMarketDealCountApiRequest,
  YapiGetV1OptionMarketDealCountApiResponse['data']
> = params => {
  return request({
    path: '/v1/option/market/dealCount',
    method: 'GET',
    params,
  })
}
