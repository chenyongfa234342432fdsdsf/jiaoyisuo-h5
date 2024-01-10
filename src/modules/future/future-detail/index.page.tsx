import { usePageContext } from '@/hooks/use-page-context'
import { IBaseOrderItem } from '@/typings/api/order'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { getPerpetualOrdersDetails } from '@/apis/future/common'
import ContractDetailPageLayout from '@/features/trade/contract/contract-order-detail/index'

export function Page() {
  const pageContext = usePageContext()

  const [order, setOrder] = useState<IBaseOrderItem>({} as any)

  const { id, futureEntrustType } = pageContext.urlParsed.search || {}

  useMount(async () => {
    const { isOk: orderIsOk, data: orderData } = await getPerpetualOrdersDetails({
      id,
    })

    if (orderIsOk || orderData) {
      setOrder(orderData)
    }
  })

  return <ContractDetailPageLayout order={order} futureEntrustType={futureEntrustType} />
}
