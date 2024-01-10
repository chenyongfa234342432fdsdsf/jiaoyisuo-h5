import OrdersSpotPage from '@/features/orders/spot/spot-page'
import { getTradeDefaultSeoMeta } from '@/helper/trade'
import { t } from '@lingui/macro'

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
      documentProps: getTradeDefaultSeoMeta(t`features_orders_spot_spot_page_510259`),
    },
  }
}
