import AgentResult from '@/features/agent/agent-result'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentResult />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/result',
      documentProps: generateAgentDefaultSeoMeta({
        title: t`modules_agent_agent_result_index_page_bwmqktyle6ya1vxyiynzx`,
      }),
    },
  }
}
