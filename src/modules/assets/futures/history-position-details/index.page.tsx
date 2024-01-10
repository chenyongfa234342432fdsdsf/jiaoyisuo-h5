import { t } from '@lingui/macro'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'
import { LiquidationDetailsLayout } from '@/features/assets/futures/liquidation-details/layout'

export function Page() {
  return <LiquidationDetailsLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: getAssetsDefaultSeoMeta(t`constants/assets/common-29`),
    },
  }
}
