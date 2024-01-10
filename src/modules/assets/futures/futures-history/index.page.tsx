import { t } from '@lingui/macro'
import { FuturesHistoryLayout } from '@/features/assets/futures/futures-history'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'

export function Page() {
  return <FuturesHistoryLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(t`features_future_group_group_detail_index_769`),
    },
  }
}
