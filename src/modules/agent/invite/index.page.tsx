import { AgentContentTypeEnum, agentModuleRoutes } from '@/constants/agent'
import AgentLayout, { AgentLayoutContent } from '@/features/agent/common/agent-layout'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return (
    <AgentLayout module={AgentContentTypeEnum.invite}>
      <AgentLayoutContent id={AgentContentTypeEnum.invite} />
    </AgentLayout>
  )
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${agentModuleRoutes.invite}`,
      documentProps: generateAgentDefaultSeoMeta({
        title: t`features_agent_agent_invite_invite_check_more_index_0iqgxaja4k0sjpu853kum`,
      }),
    },
  }
}
