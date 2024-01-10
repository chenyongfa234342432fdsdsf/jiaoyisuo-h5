import { generateAgentDefaultSeoMeta } from '@/store/agent/index.page'
import { t } from '@lingui/macro'
import VipCenter from '@/features/vip/vip-center'

function Page() {
  return <VipCenter />
}

export { Page }

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/vip/vip-center',
      documentProps: generateAgentDefaultSeoMeta({ title: t`modules_vip_vip_center_index_page_hiptbccjkf` }),
    },
  }
}
