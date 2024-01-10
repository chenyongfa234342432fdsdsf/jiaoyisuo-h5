import AgentRank from '@/features/agent/agent-rank'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentRank />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/rank',
      documentProps: generateAgentDefaultSeoMeta({
        title: t`modules_agent_agent_rank_index_page_k-anyixolnfif3cd8ndls`,
      }),
    },
  }
}
