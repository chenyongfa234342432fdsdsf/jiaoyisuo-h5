import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * [领取优惠券](https://yapi.nbttfc365.com/project/44/interface/api/18894)
 */
export const receiveVoucher: MarkcoinRequest = params => {
  return request({
    path: `/v1/coupon/template/acquire`,
    method: 'POST',
    data: params,
  })
}
