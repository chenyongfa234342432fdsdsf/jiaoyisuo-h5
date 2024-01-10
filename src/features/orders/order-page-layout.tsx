import { ReactNode } from 'react'
import { Tabs } from '@nbit/vant'
import { usePageContext } from '@/hooks/use-page-context'
import NavBar from '@/components/navbar'

export type IOrderPageLayoutProps = {
  title: string | ReactNode
  children?: ReactNode
  orderTypes: {
    name: string
    route: string
    content?: ReactNode
  }[]
}

export function OrderPageLayout({ children, title, orderTypes }: IOrderPageLayoutProps) {
  const pageContext = usePageContext()
  const defaultTab = pageContext.routeParams!.orderType

  return (
    <div>
      <NavBar title={title} />
      <Tabs active={defaultTab}>
        {orderTypes.map(orderType => (
          <Tabs.TabPane name={orderType.route} key={orderType.route} title={orderType.name}>
            {orderType.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
      <div>{children}</div>
    </div>
  )
}
