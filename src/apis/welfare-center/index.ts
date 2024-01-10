import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1WelfareActivityAllApiRequest,
  YapiGetV1WelfareActivityAllApiResponse,
} from '@/typings/yapi/WelfareActivityAllV1GetApi'
import {
  YapiGetV1WelfareActivityArticleApiRequest,
  YapiGetV1WelfareActivityArticleApiResponse,
} from '@/typings/yapi/WelfareActivityArticleV1GetApi'
import {
  YapiPostV1WelfareActivityJoinApiRequest,
  YapiPostV1WelfareActivityJoinApiResponse,
} from '@/typings/yapi/WelfareActivityJoinV1PostApi'
import {
  YapiGetV1WelfareActivityListApiRequest,
  YapiGetV1WelfareActivityListApiResponse,
} from '@/typings/yapi/WelfareActivityListV1GetApi'
import {
  YapiPostV1WelfareMissionJoinApiRequest,
  YapiPostV1WelfareMissionJoinApiResponse,
} from '@/typings/yapi/WelfareMissionJoinV1PostApi'
import {
  YapiGetV1WelfareMissionListApiRequest,
  YapiGetV1WelfareMissionListApiResponse,
} from '@/typings/yapi/WelfareMissionListV1GetApi'
import {
  YapiGetV1WelfareMissionRecordsApiRequest,
  YapiGetV1WelfareMissionRecordsApiResponse,
} from '@/typings/yapi/WelfareMissionRecordsV1GetApi'
import {
  YapiGetV1WelfareNotifyOnApiRequest,
  YapiGetV1WelfareNotifyOnApiResponse,
} from '@/typings/yapi/WelfareNotifyOnV1GetApi'
import { YapiGetV1WelfareTermsApiRequest, YapiGetV1WelfareTermsApiResponse } from '@/typings/yapi/WelfareTermsV1GetApi'

/**
 * [任务中心列表-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19891)
 * */
export const getV1WelfareMissionListApiRequest: MarkcoinRequest<
  YapiGetV1WelfareMissionListApiRequest,
  YapiGetV1WelfareMissionListApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/mission/list',
    method: 'GET',
    params,
  })
}

/**
 * [任务中心列表-点击去完成↗](https://yapi.nbttfc365.com/project/44/interface/api/19903)
 * */
export const postV1WelfareMissionJoinApiRequest: MarkcoinRequest<
  YapiPostV1WelfareMissionJoinApiRequest,
  YapiPostV1WelfareMissionJoinApiResponse['data']
> = data => {
  return request({
    path: '/v1/welfare/mission/join',
    method: 'POST',
    data,
  })
}

/**
 * [任务完成记录-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19915)
 * */
export const getV1WelfareMissionRecordsApiRequest: MarkcoinRequest<
  YapiGetV1WelfareMissionRecordsApiRequest,
  YapiGetV1WelfareMissionRecordsApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/mission/records',
    method: 'GET',
    params,
  })
}

/**
 * [活动中心列表-用户-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19927)
 * */
export const getV1WelfareActivityListApiRequest: MarkcoinRequest<
  YapiGetV1WelfareActivityListApiRequest,
  YapiGetV1WelfareActivityListApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/activity/list',
    method: 'GET',
    params,
  })
}

/**
 * [活动-立即报名↗](https://yapi.nbttfc365.com/project/44/interface/api/19933)
 * */
export const postV1WelfareActivityJoinApiRequest: MarkcoinRequest<
  YapiPostV1WelfareActivityJoinApiRequest,
  YapiPostV1WelfareActivityJoinApiResponse['data']
> = data => {
  return request({
    path: '/v1/welfare/activity/join',
    method: 'POST',
    data,
  })
}

/**
 * [活动中心列表-全部-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/20119)
 * */
export const getV1WelfareActivityAllApiRequest: MarkcoinRequest<
  YapiGetV1WelfareActivityAllApiRequest,
  YapiGetV1WelfareActivityAllApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/activity/all',
    method: 'GET',
    params,
  })
}

/**
 * [规则条款↗](https://yapi.nbttfc365.com/project/44/interface/api/20209)
 * */
export const getV1WelfareTermsApiRequest: MarkcoinRequest<
  YapiGetV1WelfareTermsApiRequest,
  YapiGetV1WelfareTermsApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/terms',
    method: 'GET',
    params,
  })
}

/**
 * [开启手机通知↗](https://yapi.nbttfc365.com/project/44/interface/api/20155)
 * */
export const getV1WelfareNotifyOnApiRequest: MarkcoinRequest<
  YapiGetV1WelfareNotifyOnApiRequest,
  YapiGetV1WelfareNotifyOnApiResponse
> = params => {
  return request({
    path: '/v1/welfare/notify/on',
    method: 'GET',
    params,
  })
}

/**
 * [根据article获取用户活动参与数据↗](https://yapi.nbttfc365.com/project/44/interface/api/20495)
 * */
export const getV1WelfareActivityArticleApiRequest: MarkcoinRequest<
  YapiGetV1WelfareActivityArticleApiRequest,
  YapiGetV1WelfareActivityArticleApiResponse['data']
> = params => {
  return request({
    path: '/v1/welfare/activity/article',
    method: 'GET',
    params,
  })
}
