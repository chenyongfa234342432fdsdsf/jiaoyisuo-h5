import { t } from '@lingui/macro'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import AgentRebateRules from '@/features/agent/agent-invitation-rebate/agent-rebate-rules'

function Page() {
  return <AgentRebateRules />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent',
      documentProps: generateAgentDefaultSeoMeta({
        title: t`features_agent_agent_invitation_rebate_agent_rebate_rules_index_hkalabowqa`,
      }),
    },
  }
}
