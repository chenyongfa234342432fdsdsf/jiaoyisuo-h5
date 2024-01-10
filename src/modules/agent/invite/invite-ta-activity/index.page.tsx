import { agentModuleRoutes } from '@/constants/agent'
import AgentInviteTaActivity from '@/features/agent/agent-invite/invite-info/invite-ta-activity'

import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentInviteTaActivity />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${agentModuleRoutes.invite}`,
      documentProps: generateAgentDefaultSeoMeta({
        title: t`modules_agent_invite_invite_ta_activity_index_page_vpnmozuen5`,
      }),
    },
  }
}
