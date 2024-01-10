import request, { MarkcoinRequest } from '@/plugins/request'
import {
  GetExchangeListResponseType,
  GetCouponCountResponse,
  GetCouponCountRequest,
  GetExchangeListRequest,
  VipCouponListReq,
  VipCouponListResp,
  GetCouponListRequest,
  GetCouponListResponse,
} from '@/typings/api/welfare-center/all-voucher'
/**
 * [获取优惠券列表](https://yapi.nbttfc365.com/project/44/interface/api/18814)
 */
export const getCouponList: MarkcoinRequest<GetCouponListRequest, GetCouponListResponse[]> = params => {
  return request({
    path: `/v1/coupon/list`,
    method: 'GET',
    params,
  })
}

/**
 * [各类卡券数量统计](https://yapi.nbttfc365.com/project/44/interface/api/18849)
 */
export const getCouponCount: MarkcoinRequest<GetCouponCountRequest, GetCouponCountResponse> = params => {
  return request({
    path: `/v1/coupon/types/count`,
    method: 'GET',
    params,
  })
}

/**
 * [各类卡券数量统计](https://yapi.nbttfc365.com/project/44/interface/api/18849)
 */
export const getExchangeList: MarkcoinRequest<GetExchangeListRequest, GetExchangeListResponseType[]> = params => {
  return request({
    path: `/v1/coupon/template/list`,
    method: 'GET',
    params,
  })
}

/**
 * 获取用户可用券及 VIP 费率
 */
export const getVipCouponList: MarkcoinRequest<VipCouponListReq, VipCouponListResp> = params => {
  return request({
    path: `/v1/coupon/selectCoupons`,
    method: 'GET',
    params,
  })
}
