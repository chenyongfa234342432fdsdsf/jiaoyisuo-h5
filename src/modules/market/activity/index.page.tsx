import { MarketActivityLayout } from '@/features/market/activity/market-activity-layout'
import { getMarketDefaultSeoMeta } from '@/helper/assets/overview'
import { t } from '@lingui/macro'

export function Page() {
  return <MarketActivityLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: getMarketDefaultSeoMeta(t`features_message_index_5101225`),
    },
  }
}
