import cn from 'classnames'
import { t } from '@lingui/macro'
import FutureTrade from '@/features/trade/future/future-trade'
import { useMarketListStore } from '@/store/market/market-list'
import { FuturesTradeTypeEnum } from '@/constants/market/market-list/futures-module'
import { checkUrlIdAndLink, getBusinessName } from '@/helper/common'
import { usePageContext } from '@/hooks/use-page-context'
import styles from './index.module.css'

export function Page() {
  const marketListStore = useMarketListStore()
  const marketFuturesStore = marketListStore.futuresMarketsTradeModule
  const pageContext = usePageContext()
  const id = pageContext.routeParams.symbol
  const reg = /[a-z]+/
  checkUrlIdAndLink(reg, id, pageContext)

  const tabList = [
    {
      title: t`future.funding-history.tabs.usdt`,
      id: 2,
      cpn: <FutureTrade />,
      onCallBack: () => {
        marketFuturesStore.setSelectedTradeMode(FuturesTradeTypeEnum.usdt)
      },
    },
    {
      title: t`future.funding-history.tabs.coin`,
      id: 3,
      cpn: <FutureTrade />,
      onCallBack: () => {
        marketFuturesStore.setSelectedTradeMode(FuturesTradeTypeEnum.coin)
      },
    },
    {
      title: t`constants_market_market_list_futures_module_index_5101396`,
      id: 4,
      onCallBack: () => {
        marketFuturesStore.setSelectedTradeMode(FuturesTradeTypeEnum.option)
      },
    },
    {
      title: t`constants_market_market_list_futures_module_index_5101397`,
      id: 5,
      onCallBack: () => {
        marketFuturesStore.setSelectedTradeMode(FuturesTradeTypeEnum.battle)
      },
    },
  ]

  if (reg.test(id)) {
    return <div></div>
  }

  return <div className={cn(styles.scoped)}>{tabList[0].cpn}</div>
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
        footerShow: true, // 是否需要 footer
        disableTransition: true,
      },
      pageProps: {},
      documentProps: {
        title: t({
          id: `modules_future_index_page_f3ifcnok_o`,
          values,
        }),
        description: t({
          id: `modules_future_index_page_uyhhavlntp`,
          values,
        }),
      },
    },
  }
}
