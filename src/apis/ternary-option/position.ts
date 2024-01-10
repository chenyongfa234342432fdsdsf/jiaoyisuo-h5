/**
 * 三元期权 - 当前持仓
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import { OptionPositionListReq, OptionPositionListResp } from '@/typings/api/ternary-option/position'

/**
 * 获取当前持仓列表
 */
export const getOptionPositionList: MarkcoinRequest<OptionPositionListReq, OptionPositionListResp> = params => {
  return request({
    path: `/v1/option/orders/current`,
    method: 'GET',
    params,
  })
}
