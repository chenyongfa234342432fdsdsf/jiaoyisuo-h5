import { IAgentCurrencyList } from '@/typings/api/agent/agent-center/center'
import cacheUtils from 'store'

export const AGENT_INVITATION_REBATE = 'AGENT_INVITATION_REBATE'
export function getAgentInvitationRebateCache() {
  return cacheUtils.get(AGENT_INVITATION_REBATE)
}
export function setAgentInvitationRebateCache(data: any) {
  return cacheUtils.set(AGENT_INVITATION_REBATE, data)
}
/** 代理中心 - 是否隐藏金额 */
export const AGENT_CENTER_ENCRYPTION = 'AGENT_CENTER_ENCRYPTION'
export function getAgentCenterEncryptionCache() {
  return cacheUtils.get(AGENT_CENTER_ENCRYPTION)
}
export function setAgentCenterEncryptionCache(data: boolean) {
  return cacheUtils.set(AGENT_CENTER_ENCRYPTION, data)
}

/** 代理中心 - 当前选中法币 */
export const AGENT_CENTER_CURRENT_CURRENCY = 'AGENT_CENTER_CURRENT_CURRENCY'
export function getAgentCenterCurrentCurrencyCache() {
  return cacheUtils.get(AGENT_CENTER_CURRENT_CURRENCY)
}
export function setAgentCenterCurrentCurrencyCache(data: IAgentCurrencyList) {
  return cacheUtils.set(AGENT_CENTER_CURRENT_CURRENCY, data)
}
