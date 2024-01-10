import { t } from '@lingui/macro'
import { getMarketDefaultSeoMeta } from '@/helper/market/sector'

async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      layoutParams: {
        footerShow: true, // 是否需要 footer
        disableTransition: true,
      },
      documentProps: getMarketDefaultSeoMeta(
        t`features_market_market_quatation_market_sector_sector_table_index_5101069`
      ),
    },
  }
}

export { onBeforeRender }
