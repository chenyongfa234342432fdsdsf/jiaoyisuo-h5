import TradeFee from '@/features/trade/help/fee'
import { getTradeDefaultSeoMeta } from '@/helper/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'

export function Page() {
  const pageContext = usePageContext()

  return <TradeFee defaultTab={Number(pageContext.urlParsed.search.tab)} />
}

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      documentProps: getTradeDefaultSeoMeta(t`features_trade_header_more_features_510285`),
    },
  }
}
