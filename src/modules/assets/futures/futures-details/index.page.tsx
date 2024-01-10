import { FuturesDetailsLayout } from '@/features/assets/futures/futures-details'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'
import { t } from '@lingui/macro'

export function Page() {
  return <FuturesDetailsLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(t`modules_assets_futures_details_index_page_makw-_qaiqbveqn9-hsdl`),
    },
  }
}
