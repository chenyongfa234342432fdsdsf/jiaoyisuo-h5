import { MarketListRouteEnum } from '@/constants/market/market-list/market-module'
import MarketListLayout from '@/features/market/market-quatation'
import MarketListFutures from '@/features/market/market-quatation/market-list-futures'
import { generateMarketDefaultSeoMeta } from '@/helper/market'
import { t } from '@lingui/macro'

export function Page() {
  return (
    <MarketListLayout moduleName={MarketListRouteEnum.futures}>
      <MarketListFutures />
    </MarketListLayout>
  )
}

export async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: true, // 是否需要 footer
        disableTransition: true,
        documentProps: generateMarketDefaultSeoMeta({ title: t`components/footer/index-1` }),
      },
    },
  }
}
