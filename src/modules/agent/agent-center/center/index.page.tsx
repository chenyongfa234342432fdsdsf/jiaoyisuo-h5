import { AgentCenterLayout } from '@/features/agent/agent-center/center/center-layout'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentCenterLayout />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/center',
      documentProps: generateAgentDefaultSeoMeta({ title: t`modules_agent_agent_apply_index_page_jaworf6qns` }),
    },
  }
}
