import AgentInviteContent from '@/features/agent/agent-invite/invite-info/invite-info-content'
import AgentInviteHeader from '@/features/agent/agent-invite/invite-info/invite-info-header'
import StatsLayout from '@/features/agent/common/stats-layout'

function AgentInviteInfo() {
  return <StatsLayout header={<AgentInviteHeader showAnalysis />} content={<AgentInviteContent />} />
}

export default AgentInviteInfo
