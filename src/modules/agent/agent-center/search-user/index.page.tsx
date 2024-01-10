import { SearchUserLayout } from '@/features/agent/agent-center/search'
import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'

function Page() {
  return <SearchUserLayout />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/agent/center',
      documentProps: generateAgentDefaultSeoMeta({
        title: t`features_agent_agent_center_center_common_search_user_modal_index_cxdro0wei0`,
      }),
    },
  }
}
