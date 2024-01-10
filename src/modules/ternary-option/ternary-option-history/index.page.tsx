// import OrdersSpotPage from '@/features/orders/spot/spot-page'
import { getKycDefaultSeoMeta } from '@/helper/kyc'
import { t } from '@lingui/macro'
import TernarySpotPage from '@/features/ternary-option/option-order/ternary-history/ternary-history-page'

export function Page() {
  return <TernarySpotPage />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      uiSetting: {
        // 是否需要 footer
      },
      documentProps: await getKycDefaultSeoMeta(
        t`features_ternary_option_option_order_ternary_history_ternary_history_page_iakwbo_gwv`
      ),
    },
  }
}
