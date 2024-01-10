import TernaryOptionTrade from '@/features/ternary-option/trade'
import { checkUrlIdAndLink, getBusinessName } from '@/helper/common'
import { useFusionFooterShow } from '@/hooks/use-fusion-footer-show'
import { usePageContext } from '@/hooks/use-page-context'
import { baseCommonStore } from '@/store/common'
import { t } from '@lingui/macro'

export function Page() {
  const reg = /[a-z]+/
  const pageContext = usePageContext()
  const symbol = pageContext.routeParams.symbol
  useFusionFooterShow()

  if (reg.test(symbol)) {
    return <div></div>
  }
  checkUrlIdAndLink(reg, symbol, pageContext)

  return <TernaryOptionTrade />
}
export async function onBeforeRender(pageContext) {
  const symbol = pageContext.routeParams.symbol
  const values = {
    symbol,
    businessName: getBusinessName(),
  }

  return {
    pageContext: {
      layoutParams: {
        footerShow: baseCommonStore.getState().isFusionMode,
      },
      pageProps: {},
      documentProps: {
        title: t`features_market_market_home_global_search_market_trade_search_ternary_option_index_gg3hfqd6hi`,
        description: t({
          id: `modules_future_index_page_uyhhavlntp`,
          values,
        }),
      },
    },
  }
}
