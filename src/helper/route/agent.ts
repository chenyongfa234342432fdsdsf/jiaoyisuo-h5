export function getAgentApplyRoutePath() {
  return '/agent/apply'
}

export function getAgentResultRoutePath(type) {
  return `/agent/result/${type}`
}

export function getAgentModuleRoutePath() {
  return '/agent/manage'
}

export function getAgentRebateRulesRoutePath() {
  return '/agent/agent-rebate-rules'
}

/**
 * 代理中心
 */
export function getAgentCenterPageRoutePath() {
  return `/agent/center`
}

/**
 * 代理中心 - TA 的邀请
 * @param uid 用户 UID
 * @param model 代理模式
 */
export function getAgentCenterInvitePageRoutePath(uid: number, model: string) {
  return `/agent/center/invite?uid=${uid}&model=${model}`
}

/**
 * 更多详情
 */
export function getAgentMoreDetail(model: string, uid?: number) {
  let url = `/agent/invitation?model=${model}`

  if (uid) url += `&uid=${uid}`
  return url
}
/*
 * 代理中心 - 邀请详情 - 搜索用户
 */
export function getAgentCenterSearchUserPageRoutePath(model: string) {
  return `agent/center/search?model=${model}`
}
