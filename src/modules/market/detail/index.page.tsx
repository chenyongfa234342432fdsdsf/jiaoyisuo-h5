import MarketDetail from '@/features/market/detail'
import { checkUrlIdAndLink } from '@/helper/common'
import { usePageContext } from '@/hooks/use-page-context'
import { KLineChartType } from '@nbit/chart-utils'

function Page() {
  const pageContext = usePageContext()
  const id = pageContext.routeParams.id
  const reg = /[a-z]+/
  checkUrlIdAndLink(reg, id, pageContext)
  if (reg.test(id)) {
    return <div></div>
  }
  return <MarketDetail type={KLineChartType.Quote} />
}

export { Page }
