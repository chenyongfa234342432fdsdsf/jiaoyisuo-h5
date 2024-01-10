/**
 * 资产-c2c
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import { AssetsC2CListReq, AssetsC2CListResp } from '@/typings/api/assets/assets'

/**
 * 获取广告账户余额列表
 */
export const getC2CList: MarkcoinRequest<AssetsC2CListReq, AssetsC2CListResp[]> = params => {
  return request({
    path: `/v1/c2c/balance/list`,
    method: 'GET',
    params,
  })
}
