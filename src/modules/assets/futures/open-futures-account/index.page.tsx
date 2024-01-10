import { t } from '@lingui/macro'
import { OpenFuturesAccountLayout } from '@/features/assets/overview/list/common/open-futures-account'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'

export function Page() {
  return <OpenFuturesAccountLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(t`features_assets_futures_open_futures_index_5101392`),
    },
  }
}
