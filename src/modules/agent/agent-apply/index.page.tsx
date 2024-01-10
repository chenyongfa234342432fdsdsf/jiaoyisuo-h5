import AgentApply from '@/features/agent/agent-apply'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentApply />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/apply',
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_agent_agent_apply_index_2pb5ufrn8s` }),
    },
  }
}
