import AgentManage from '@/features/agent/agent-manage'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentManage />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/manage',
      documentProps: generateAgentDefaultSeoMeta({
        title: t`modules_agent_agent_manage_index_page_wjhkrktd_0cs7mts9x6fo`,
      }),
    },
  }
}
