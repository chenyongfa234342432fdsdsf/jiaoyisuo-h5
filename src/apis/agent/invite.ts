import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1AgentAbnormalApiRequest,
  YapiGetV1AgentAbnormalApiResponse,
} from '@/typings/yapi/AgentAbnormalV1GetApi'
import {
  YapiPostV1AgentActivationUserInfoApiRequest,
  YapiPostV1AgentActivationUserInfoApiResponse,
} from '@/typings/yapi/AgentActivationUserInfoV1PostApi'
import {
  YapiPostV1AgentActivationApiRequest,
  YapiPostV1AgentActivationApiResponse,
} from '@/typings/yapi/AgentActivationV1PostApi'
import {
  YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
  YapiGetV1AgentInvitationCodeQueryProductCdApiResponse,
} from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import {
  YapiGetV1AgentInviteAnalysisOverviewApiRequest,
  YapiGetV1AgentInviteAnalysisOverviewApiResponse,
} from '@/typings/yapi/AgentInviteAnalysisOverviewV1GetApi'
import {
  YapiPostV1AgentInviteDetailsAnalysisApiRequest,
  YapiPostV1AgentInviteDetailsAnalysisApiResponse,
} from '@/typings/yapi/AgentInviteDetailsAnalysisV1PostApi'
import {
  YapiPostV2AgentInviteDetailsAnalysisApiRequest,
  YapiPostV2AgentInviteDetailsAnalysisApiResponse,
} from '@/typings/yapi/AgentInviteDetailsAnalysisV2PostApi'
import {
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsApiResponse,
} from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import {
  YapiPostV1AgentInviteHistoryApiRequest,
  YapiPostV1AgentInviteHistoryApiResponse,
} from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import {
  YapiPostV2AgentInviteHistoryApiRequest,
  YapiPostV2AgentInviteHistoryApiResponse,
} from '@/typings/yapi/AgentInviteHistoryV2PostApi'
import {
  YapiGetV1AgentRebateAnalysisOverviewApiRequest,
  YapiGetV1AgentRebateAnalysisOverviewApiResponse,
} from '@/typings/yapi/AgentRebateAnalysisOverviewV1GetApi'
import {
  YapiGetV2AgentRebateLogsGetUrlApiRequest,
  YapiGetV2AgentRebateLogsGetUrlApiResponse,
} from '@/typings/yapi/AgentRebateLogsGetUrlV2GetApi'
import {
  YapiPostV1AgentRebateLogsApiRequest,
  YapiPostV1AgentRebateLogsApiResponse,
} from '@/typings/yapi/AgentRebateLogsV1PostApi'
import {
  YapiPostV1AgentUpdateInvitedUserRebateRatioApiRequest,
  YapiPostV1AgentUpdateInvitedUserRebateRatioApiResponse,
} from '@/typings/yapi/AgentUpdateInvitedUserRebateRatioV1PostApi'

/**
 * [代理商 - 邀请明细↗](https://yapi.nbttfc365.com/project/44/interface/api/4159)
 * */
export const postV1AgentInviteDetailsApiRequest: MarkcoinRequest<
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsApiResponse
> = data => {
  return request({
    path: '/v1/agent/inviteDetails',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 邀请明细分析↗](https://yapi.nbttfc365.com/project/44/interface/api/4235)
 * */
export const postV1AgentInviteDetailsAnalysisApiRequest: MarkcoinRequest<
  YapiPostV1AgentInviteDetailsAnalysisApiRequest,
  YapiPostV1AgentInviteDetailsAnalysisApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/inviteDetailsAnalysis',
    method: 'POST',
    data: params,
  })
}

/**
 * [代理商 - 邀请用户详情↗](https://yapi.nbttfc365.com/project/44/interface/api/4003)
 * */
export const postV1AgentInviteHistoryApiRequest: MarkcoinRequest<
  Partial<YapiPostV1AgentInviteHistoryApiRequest>,
  YapiPostV1AgentInviteHistoryApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/inviteHistory',
    method: 'POST',
    data: params,
  })
}
// return new Promise((resolve, reject) => {
//   axios
//     .request({
//       url: 'https://yapi.nbttfc365.com/mock/44/v1/agent/inviteHistory',
//       data: params,
//       method: 'POST',
//     })
//     .then(res => resolve({
//       isOk: true,
//       data: res.data.data
//     }))

/**
 * [查询代理加普通一共开通的产品线↗](https://yapi.nbttfc365.com/project/44/interface/api/5479)
 * */
export const getV1AgentInvitationCodeQueryProductCdApiRequest: MarkcoinRequest<
  YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
  YapiGetV1AgentInvitationCodeQueryProductCdApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/invitationCode/queryProductCd',
    method: 'GET',
    params,
  })
}

/**
 * [代理商 - 邀请明细分析 V2↗](https://yapi.nbttfc365.com/project/44/interface/api/5949)
 * */
export const postV2AgentInviteDetailsAnalysisApiRequest: MarkcoinRequest<
  YapiPostV2AgentInviteDetailsAnalysisApiRequest,
  YapiPostV2AgentInviteDetailsAnalysisApiResponse['data']
> = data => {
  return request({
    path: '/v2/agent/inviteDetailsAnalysis',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 邀请明细-Ta 的活跃度 - 用户信息↗](https://yapi.nbttfc365.com/project/44/interface/api/6004)
 * */
export const postV1AgentActivationUserInfoApiRequest: MarkcoinRequest<
  YapiPostV1AgentActivationUserInfoApiRequest,
  YapiPostV1AgentActivationUserInfoApiResponse['data']
> = data => {
  return request({
    path: '/v1/agent/activation/userInfo',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 邀请明细-Ta 的活跃度 - 时间筛选↗](https://yapi.nbttfc365.com/project/44/interface/api/5984)
 * */
export const postV1AgentActivationApiRequest: MarkcoinRequest<
  YapiPostV1AgentActivationApiRequest,
  YapiPostV1AgentActivationApiResponse['data']
> = data => {
  return request({
    path: '/v1/agent/activation',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 返佣明细分析 - 总览↗](https://yapi.nbttfc365.com/project/44/interface/api/5934)
 * */
export const getV1AgentRebateAnalysisOverviewApiRequest: MarkcoinRequest<
  YapiGetV1AgentRebateAnalysisOverviewApiRequest,
  YapiGetV1AgentRebateAnalysisOverviewApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/rebateAnalysis/overview',
    method: 'GET',
    params,
  })
}

/**
 * [代理商 - 邀请明细分析 - 总览↗](https://yapi.nbttfc365.com/project/44/interface/api/5944)
 * */
export const getV1AgentInviteAnalysisOverviewApiRequest: MarkcoinRequest<
  YapiGetV1AgentInviteAnalysisOverviewApiRequest,
  YapiGetV1AgentInviteAnalysisOverviewApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/inviteAnalysis/overview',
    method: 'GET',
    params,
  })
}

/**
 * [代理商 - 修改邀请用户的返佣比例↗](https://yapi.nbttfc365.com/project/44/interface/api/5979)
 * */
export const postV1AgentUpdateInvitedUserRebateRatioApiRequest: MarkcoinRequest<
  YapiPostV1AgentUpdateInvitedUserRebateRatioApiRequest,
  YapiPostV1AgentUpdateInvitedUserRebateRatioApiResponse['data']
> = data => {
  return request({
    path: '/v1/agent/updateInvitedUserRebateRatio',
    method: 'POST',
    data,
  })
}

/**
 * [用户账户异常提醒 (是否被拉入黑名单)↗](https://yapi.nbttfc365.com/project/44/interface/api/5974)
 * */
export const getV1AgentAbnormalApiRequest: MarkcoinRequest<
  YapiGetV1AgentAbnormalApiRequest,
  YapiGetV1AgentAbnormalApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/abnormal',
    method: 'GET',
    params,
  })
}

/**
 * [代理商 - 邀请用户详情 V2 版本↗](https://yapi.nbttfc365.com/project/44/interface/api/5889)
 * */
export const postV2AgentInviteHistoryApiRequest: MarkcoinRequest<
  Partial<YapiPostV2AgentInviteHistoryApiRequest>,
  YapiPostV2AgentInviteHistoryApiResponse['data']
> = data => {
  return request({
    path: '/v2/agent/inviteHistory',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 返佣记录查询↗](https://yapi.nbttfc365.com/project/44/interface/api/5899)
 * */
export const postV1AgentRebateLogsApiRequest: MarkcoinRequest<
  Partial<YapiPostV1AgentRebateLogsApiRequest>,
  YapiPostV1AgentRebateLogsApiResponse
> = data => {
  return request({
    path: '/v1/agent/rebateLogs',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 返佣记录 - 导出↗](https://yapi.nbttfc365.com/project/44/interface/api/5969)
 * */
export const getV2AgentRebateLogsGetUrlApiRequest: MarkcoinRequest<
  YapiGetV2AgentRebateLogsGetUrlApiRequest,
  YapiGetV2AgentRebateLogsGetUrlApiResponse['data']
> = params => {
  return request({
    path: '/v2/agent/rebateLogs/getUrl',
    method: 'GET',
    params,
  })
}

/**
 * [邀请返佣 - 获取默认邀请码↗](https://yapi.nbttfc365.com/project/44/interface/api/18499)
 * */
export const getInvitationCodeApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/invitationCode/default',
    method: 'GET',
  })
}

/**
 * [邀请返佣 - 金字塔返佣申请信息↗](https://yapi.nbttfc365.com/project/44/interface/api/18429)
 * */
export const getPyramidApplyInfoApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/pyramid/applyInfo',
    method: 'GET',
  })
}

/**
 * [用户是否在黑名单中↗](https://yapi.nbttfc365.com/project/44/interface/api/18194)
 * */
export const getUserCheckBlacklistApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/user/checkBlacklist',
    method: 'GET',
  })
}

/**
 * [邀请返佣 - 返佣阶梯规则↗](https://yapi.nbttfc365.com/project/44/interface/api/18189)
 * */
export const getQueryRebateRatioInfoApiRequest: MarkcoinRequest = params => {
  return request({
    path: '/v1/agent/system/queryRebateRatioInfo',
    method: 'GET',
    params,
  })
}

/**
 * [邀请返佣 - 返佣规则↗](https://yapi.nbttfc365.com/project/44/interface/api/18479)
 * */
export const getRebateRuleApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/rebateRule',
    method: 'GET',
  })
}

/**
 * [邀请返佣 - 金字塔邀请码列表 (分页查询)↗](https://yapi.nbttfc365.com/project/44/interface/api/18379)
 * */
export const getPyramidListApiRequest: MarkcoinRequest = params => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/list',
    method: 'GET',
    params,
  })
}

/**
 * [邀请返佣 - 金字塔返佣首次设置是否已读↗](https://yapi.nbttfc365.com/project/44/interface/api/18624)
 * */
export const getFirstSettingReadApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/pyramid/firstSetting/read',
    method: 'POST',
  })
}

/**
 * [邀请返佣 - 设为默认邀请码↗](https://yapi.nbttfc365.com/project/44/interface/api/18399)
 * */
export const postInvitationCodeApiRequest: MarkcoinRequest = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/default',
    method: 'POST',
    data,
  })
}

/**
 * [邀请返佣 - 查询金字塔产品线返佣比例↗](https://yapi.nbttfc365.com/project/44/interface/api/18504)
 * */
export const getProductRatioApiRequest: MarkcoinRequest = () => {
  return request({
    path: '/v1/agent/pyramid/product/ratio',
    method: 'GET',
  })
}

/**
 * [邀请返佣 - 修改邀请码返佣比例↗](https://yapi.nbttfc365.com/project/44/interface/api/18404)
 * */
export const postPyramidCodeApiRequest: MarkcoinRequest = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/ratio',
    method: 'POST',
    data,
  })
}
