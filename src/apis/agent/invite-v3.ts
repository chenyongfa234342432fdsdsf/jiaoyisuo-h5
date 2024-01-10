import request, { MarkcoinRequest } from '@/plugins/request'
import {
  PostProductListResponse,
  PostProductListRequest,
  getAgentListResponse,
  getAreaAgentLevelRequest,
  getAreaAgentLevelResponse,
  getAgentListRequest,
} from '../../typings/api/agent/invite-v3'
/**
 * [产品线查询 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18264)
 */
export const postProductList: MarkcoinRequest<PostProductListRequest, PostProductListResponse> = data => {
  return request({
    path: '/v1/agent/system/getProductList',
    method: 'GET',
    data,
  })
}
/**
 * [区域代理等级查询 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18684)
 */
export const getAreaAgentLevel: MarkcoinRequest<getAreaAgentLevelRequest, getAreaAgentLevelResponse> = data => {
  return request({
    path: '/v1/agent/system/getAreaAgentLevel',
    method: 'GET',
    data,
  })
}
/**
 * [更多详情列表 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18459)
 */
export const GetDetailList: MarkcoinRequest<PostProductListRequest, PostProductListResponse> = data => {
  return request({
    path: '/v1/agent/center/moreDetail',
    method: 'POST',
    data,
  })
}
/**
 * [获取用户所有代理模式 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18474)
 */
export const getAgentList: MarkcoinRequest<getAgentListRequest, getAgentListResponse> = data => {
  return request({
    path: '/v1/agent/center/getAgentList',
    method: 'GET',
    params: data,
  })
}
