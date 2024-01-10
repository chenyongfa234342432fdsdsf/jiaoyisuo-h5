// import OrdersSpotPage from '@/features/orders/spot/spot-page'
import { getKycDefaultSeoMeta } from '@/helper/kyc'
import { t } from '@lingui/macro'
import OrdersSpotPage from '@/features/trade/contract/contract-history/contract-history-page'

export function Page() {
  return <OrdersSpotPage />
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      uiSetting: {
        // 是否需要 footer
      },
      documentProps: await getKycDefaultSeoMeta(
        t`features_trade_contract_contract_history_contract_history_page_5101499`
      ),
    },
  }
}
