import { PostAgtApplyRequest, GetAgtContractInfoResponse, GetAgtContractInfoRequest } from '@/typings/api/agent/join'
import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * [金字塔代理商申请 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18424)
 * */
export const postAgtApplyApiRequest: MarkcoinRequest<PostAgtApplyRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/apply',
    method: 'POST',
    data,
  })
}

/**
 * [查询用户账号安全填写的手机号和邮箱号 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18569)
 */
export const getAgtContractInfoApiRequest: MarkcoinRequest<
  GetAgtContractInfoRequest,
  GetAgtContractInfoResponse
> = data => {
  return request({
    path: '/v1/agent/member/contractInfo',
    method: 'GET',
    params: data,
  })
}
