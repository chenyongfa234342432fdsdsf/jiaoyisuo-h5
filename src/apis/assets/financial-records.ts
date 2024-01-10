/**
 * 资产 - 财务记录
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AssetsRecordsCoinListReq,
  AssetsRecordsCoinListResp,
  AssetsRecordsListReq,
  AssetsRecordsListResp,
  AssetsRecordsDetailsReq,
  AssetsRecordsDetailsResp,
} from '@/typings/api/assets/assets'

/**
 * 财务记录 - 获取财务日志币种列表
 */
export const getRecordsCoinList: MarkcoinRequest<AssetsRecordsCoinListReq, AssetsRecordsCoinListResp> = params => {
  return request({
    path: `/v1/bill/log/coinList`,
    method: 'GET',
    params,
  })
}

/**
 * 财务记录 - 财务记录列表
 */
export const postRecordsList: MarkcoinRequest<AssetsRecordsListReq, AssetsRecordsListResp> = data => {
  return request({
    path: `/v1/bill/log/list`,
    method: 'POST',
    data,
  })
}

/**
 * 财务记录 - 财务日志详情
 */
export const getRecordsDetails: MarkcoinRequest<AssetsRecordsDetailsReq, AssetsRecordsDetailsResp> = params => {
  return request({
    path: `/v1/bill/log/detail`,
    method: 'GET',
    params,
  })
}
