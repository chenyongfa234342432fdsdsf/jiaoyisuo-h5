import AgentJoin from '@/features/agent/agent-join'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <AgentJoin />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/join',
      documentProps: generateAgentDefaultSeoMeta({ title: t`user.application_form_11` }),
    },
  }
}
