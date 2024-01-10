import { getOptionTradePairList } from '@/apis/ternary-option'
import { link } from '@/helper/link'
import { requestWithLoading } from '@/helper/order'
import { getTernaryOptionTradePagePath } from '@/helper/route/ternary-option'
import { useFusionFooterShow } from '@/hooks/use-fusion-footer-show'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { t } from '@lingui/macro'
import { useMount } from 'ahooks'

/** 三元期权中转 */
export function Page() {
  const { cacheData } = useOptionTradeStore()
  const fetchDefaultCoin = async () => {
    let symbol = 'BTCUSD'
    if (!cacheData.preCoinCache?.symbol) {
      const res = await requestWithLoading(getOptionTradePairList({}))
      if (res.data) {
        symbol = res.data.list?.[0]?.symbol
      }
    } else {
      symbol = cacheData.preCoinCache.symbol
    }

    link(
      getTernaryOptionTradePagePath({
        symbolName: symbol,
      }),
      {
        overwriteLastHistoryEntry: true,
      }
    )
  }
  useMount(fetchDefaultCoin)
  useFusionFooterShow()

  return <></>
}
export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      layoutParams: {
        footerShow: false,
      },
      pageProps: {},
      documentProps: {
        title: t`features_market_market_home_global_search_market_trade_search_ternary_option_index_gg3hfqd6hi`,
        description: '',
      },
    },
  }
}
