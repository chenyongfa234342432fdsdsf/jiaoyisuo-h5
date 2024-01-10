import Agent from '@/features/agent/agent-invitation-rebate'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <Agent />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent',
      documentProps: generateAgentDefaultSeoMeta({ title: t`user.personal_center_05` }),
    },
  }
}
