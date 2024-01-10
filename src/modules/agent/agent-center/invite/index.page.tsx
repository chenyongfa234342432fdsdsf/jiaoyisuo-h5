import { AgentInviteLayout } from '@/features/agent/agent-center/invite'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentInviteLayout />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/center',
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_agent_agent_center_invite_index_jexcixkl8l` }),
    },
  }
}
