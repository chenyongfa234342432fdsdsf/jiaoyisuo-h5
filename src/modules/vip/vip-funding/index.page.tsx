import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'
import Vip from '@/features/vip/level-funding'

function Page() {
  return <Vip />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/vip/vip-funding',
      documentProps: generateAgentDefaultSeoMeta({ title: t`features_vip_vip_center_index_xvl9rcxhx4` }),
    },
  }
}
