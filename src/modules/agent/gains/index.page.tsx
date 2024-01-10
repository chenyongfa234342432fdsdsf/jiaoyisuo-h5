import { AgentContentTypeEnum, agentModuleRoutes } from '@/constants/agent'
import AgentDatetimeTabs from '@/features/agent/common/agent-datetime-tabs'
import AgentLayout, { AgentLayoutContent } from '@/features/agent/common/agent-layout'
import { useGetAgentProductTypes } from '@/hooks/features/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  useGetAgentProductTypes()
  const store = useAgentStatsStore()

  return (
    <AgentLayout module={AgentContentTypeEnum.gains}>
      <AgentDatetimeTabs {...store} />
      <AgentLayoutContent id={AgentContentTypeEnum.gains} />
    </AgentLayout>
  )
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${agentModuleRoutes.gains}`,
      documentProps: generateAgentDefaultSeoMeta({ title: t`modules_agent_gains_detail_index_page_5101622` }),
    },
  }
}
