import { RechargeLayout } from '@/features/assets/recharge/layout'
import { getAssetsDefaultSeoMeta } from '@/helper/assets/overview'
import { t } from '@lingui/macro'

export function Page() {
  return <RechargeLayout />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      unAuthTo: '/login?redirect=/assets/recharge',
      documentProps: getAssetsDefaultSeoMeta(t`assets.financial-record.tabs.Deposit`),
    },
  }
}
