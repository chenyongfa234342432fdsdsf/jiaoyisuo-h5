import { t } from '@lingui/macro'
import { MarketListRouteEnum } from '@/constants/market/market-list/market-module'
import MarketListLayout from '@/features/market/market-quatation'
import { getMarketDefaultSeoMeta } from '@/helper/market/sector'
import MarketListSector from '../../../features/market/market-quatation/market-sector/index'

export function Page() {
  return (
    <MarketListLayout moduleName={MarketListRouteEnum.sector}>
      <MarketListSector />
    </MarketListLayout>
  )
}

export async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: true, // 是否需要 footer
        disableTransition: true,
      },
      documentProps: getMarketDefaultSeoMeta(t`components/footer/index-1`),
    },
  }
}
