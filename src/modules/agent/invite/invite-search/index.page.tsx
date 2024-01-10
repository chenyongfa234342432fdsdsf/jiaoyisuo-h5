import { AgentInviteContentSearchFocused } from '@/features/agent/agent-invite/invite-info/invite-info-content-focused'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentInviteContentSearchFocused />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      documentProps: generateAgentDefaultSeoMeta({
        title: t`features_agent_agent_invite_invite_check_more_index_0iqgxaja4k0sjpu853kum`,
      }),
    },
  }
}
