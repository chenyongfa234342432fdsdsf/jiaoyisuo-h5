import { GetMaxRatioRequest, GetMaxRatioResponse } from '@/typings/api/agent/apply'
import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * [申请金字塔时可获得的最大返佣比例 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18929)
 * */
export const getMaxRatio: MarkcoinRequest<GetMaxRatioRequest, GetMaxRatioResponse> = data => {
  return request({
    path: '/v1/agent/pyramid/maxRatio',
    method: 'GET',
    data,
  })
}
