import { GetAgtApplyInfoResponse, GetAgtApplyInfoRequest } from '@/typings/api/agent/result'
import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * [金字塔代理商申请结果 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18429)
 * */
export const getAgtApplyResult: MarkcoinRequest<GetAgtApplyInfoRequest, GetAgtApplyInfoResponse> = data => {
  return request({
    path: '/v1/agent/pyramid/applyInfo',
    method: 'GET',
    data,
  })
}

/**
 * [金字塔返佣申请 (未通过时) 设置为已读 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18494)
 * */
export const postResultRead: MarkcoinRequest<GetAgtApplyInfoRequest, GetAgtApplyInfoResponse> = data => {
  return request({
    path: '/v1/agent/pyramid/apply/read',
    method: 'POST',
    data,
  })
}
