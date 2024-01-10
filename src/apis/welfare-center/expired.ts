// 已失效/已使用
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  GetTypeSceneListRequest,
  GetTypeSceneListResponse,
  GetUsedInfoResponse,
  GetUsedInfoRequest,
} from '@/typings/api/welfare-center/expired'
/**
 * [查询券类型关系](https://yapi.nbttfc365.com/project/44/interface/api/18949)
 */
export const getTypeSceneList: MarkcoinRequest<GetTypeSceneListRequest, GetTypeSceneListResponse[]> = params => {
  return request({
    path: `/v1/coupon/typeSceneList`,
    method: 'GET',
    params,
  })
}

/**
 * [优惠券使用详情](https://yapi.nbttfc365.com/project/44/interface/api/18964)
 */
export const getUsedInfo: MarkcoinRequest<GetUsedInfoRequest, GetUsedInfoResponse[]> = params => {
  return request({
    path: `/v1/coupon/couponUsedDetail`,
    method: 'GET',
    params,
  })
}
