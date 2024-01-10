import NavBar from '@/components/navbar'
import AgentGainsDetail from '@/features/agent/agent-gains-detail'
import { useGetAgentProductCode } from '@/hooks/features/agent'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  const name = t`modules_agent_gains_detail_index_page_5101622`
  useGetAgentProductCode()

  return (
    <>
      <NavBar title={name} />
      <AgentGainsDetail />
    </>
  )
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      documentProps: generateAgentDefaultSeoMeta({ title: t`modules_agent_gains_detail_index_page_5101622` }),
    },
  }
}
