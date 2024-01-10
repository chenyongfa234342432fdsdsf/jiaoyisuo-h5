import { usePageContext } from '@/hooks/use-page-context'
import OrderDetailPageLayout from '@/features/orders/order-detail'
import { IBaseOrderItem } from '@/typings/api/order'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { querySpotNormalOpenOrderDetail } from '@/apis/order'
import { t } from '@lingui/macro'
import { getTradeDefaultSeoMeta } from '@/helper/trade'

export function Page() {
  const pageContext = usePageContext()
  const [order, setOrder] = useState<IBaseOrderItem>({} as any)

  const { id, orderEnumType } = pageContext.urlParsed?.search || {}
  useMount(async () => {
    const res = await querySpotNormalOpenOrderDetail({
      id,
    })
    if (!res.isOk || !res.data) {
      return
    }
    setOrder(res.data)
  })
  return <OrderDetailPageLayout order={order} orderEnumType={orderEnumType} />
}
export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      unAuthTo: `/login?redirect=${pageContext.path}`,
      documentProps: getTradeDefaultSeoMeta(t`features_orders_order_detail_510265`),
    },
  }
}
