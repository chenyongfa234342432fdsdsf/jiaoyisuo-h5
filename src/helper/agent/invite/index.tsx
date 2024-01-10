import { baseUserStore } from '@/store/user'
import { t } from '@lingui/macro'
import { Toast } from '@nbit/vant'
import { AgentGradeUnitEnum } from '@/constants/agent/invite'

export function getTaActivitiesSliderPoints(value: number) {
  const points = [0]
  const step = Math.floor(value / 5)
  for (let i = 1; i < 5; i += 1) {
    points.push(step * i)
  }
  points.push(value)
  return points
}

export function agentGetUserId() {
  return baseUserStore.getState().userInfo?.uid
}

const getSearchReminderMsg = () => t`helper_agent_invite_index_zvxzbh4wws`
export function showAgentSearchMsg() {
  Toast.info({ message: getSearchReminderMsg() })
}

export const getUserRebateLevelText = (codeKey, text: string) => {
  if (codeKey === AgentGradeUnitEnum.teamSize) {
    return t({
      id: 'helper_agent_agent_invite_index_kcooi6wwle',
      values: { 0: text },
    })
  }
  return t({
    id: 'helper_agent_agent_invite_index__9cylzkvoy',
    values: { 0: text },
  })
}
