/**
 * 代理中心
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AgentCenterAgentListReq,
  AgentCenterChildInviteListReq,
  AgentCenterChildInviteListResp,
  AgentCenterChildInviteOverviewReq,
  AgentCenterChildInviteOverviewResp,
  AgentCenterInviteDetailReq,
  AgentCenterInviteDetailResp,
  AgentCenterOverviewReq,
  AgentCenterOverviewResp,
  AgentCenterRebateDetailReq,
  AgentCenterRebateDetailResp,
  AgentCenterSetRebateRatioReq,
  AgentCenterSetRebateRatioResp,
  AgentCenterUserIsBlackReq,
  AgentCenterUserIsBlackResp,
  AreaAgentLevelListReq,
} from '@/typings/api/agent/agent-center/center'

/**
 * 获取用户所有代理模式
 */
export const getAgentList: MarkcoinRequest<AgentCenterAgentListReq, string[]> = params => {
  return request({
    path: `/v1/agent/center/getAgentList`,
    method: 'GET',
    params,
  })
}

/**
 * 获取区域代理等级列表
 */
export const getAreaAgentLevelList: MarkcoinRequest<AreaAgentLevelListReq, number[]> = params => {
  return request({
    path: `/v1/agent/system/getAreaAgentLevel`,
    method: 'GET',
    params,
  })
}

/**
 * 获取代理中心数据总览
 */
export const postAgentCenterOverview: MarkcoinRequest<AgentCenterOverviewReq, AgentCenterOverviewResp> = data => {
  return request({
    path: `/v1/agent/center/overviewData`,
    method: 'POST',
    data,
  })
}

/**
 * 查询是否黑名单用户
 */
export const getAgentCenterUserIsBlack: MarkcoinRequest<
  AgentCenterUserIsBlackReq,
  AgentCenterUserIsBlackResp
> = params => {
  return request({
    path: `/v1/agent/user/checkBlacklist`,
    method: 'GET',
    params,
  })
}

/**
 * 获取邀请详情列表
 */
export const postAgentCenterInviteDetail: MarkcoinRequest<
  AgentCenterInviteDetailReq,
  AgentCenterInviteDetailResp
> = data => {
  return request({
    path: `/v1/agent/center/inviteeDetail`,
    method: 'POST',
    data,
  })
}

/**
 * 获取返佣详情列表
 */
export const postAgentCenterRebateDetail: MarkcoinRequest<
  AgentCenterRebateDetailReq,
  AgentCenterRebateDetailResp
> = data => {
  return request({
    path: `/v1/agent/center/earningsDetail`,
    method: 'POST',
    data,
  })
}

/**
 * 查询 TA 的邀请（数据总览）
 */
export const getAgentCenterChildInviteOverview: MarkcoinRequest<
  AgentCenterChildInviteOverviewReq,
  AgentCenterChildInviteOverviewResp
> = params => {
  return request({
    path: `/v1/agent/center/hisInvitation`,
    method: 'GET',
    params,
  })
}

/**
 * 查询 TA 的邀请人列表
 */
export const postAgentCenterChildInviteList: MarkcoinRequest<
  AgentCenterChildInviteListReq,
  AgentCenterChildInviteListResp
> = data => {
  return request({
    path: `/v1/agent/center/hisInvitee`,
    method: 'POST',
    data,
  })
}

/**
 * 代理中心 - 金字塔代理 - 调整返佣比例
 */
export const postAgentCenterSetRebateRatio: MarkcoinRequest<
  AgentCenterSetRebateRatioReq,
  AgentCenterSetRebateRatioResp
> = data => {
  return request({
    path: `/v1/agent/center/setRebateRatio`,
    method: 'POST',
    data,
  })
}
