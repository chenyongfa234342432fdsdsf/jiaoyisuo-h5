import cn from 'classnames'
import LeveragedTrade from '@/features/trade/leveraged/leveraged-trade'
import SpotTrade from '@/features/trade/spot/spot-trade'
import { useAssetsStore } from '@/store/assets/spot'
import { useMount } from 'ahooks'
import { t } from '@lingui/macro'
import { checkUrlIdAndLink, getBusinessName } from '@/helper/common'
import { getServerCacheSpotTradePair } from '@/helper/cache/server'
import { usePageContext } from '@/hooks/use-page-context'
import styles from './index.module.css'

export function Page() {
  const pageContext = usePageContext()
  const id = pageContext.routeParams.symbol
  const reg = /[a-z]+/
  checkUrlIdAndLink(reg, id, pageContext)

  const tabList = [
    {
      title: t`modules_trade_index_page_5101064`,
      id: 2,
      cpn: <SpotTrade />,
    },
    {
      title: t`assets.layout.tabs.leverage`,
      id: 3,
      cpn: <LeveragedTrade />,
    },
    {
      title: 'C2C',
      id: 5,
      onCallBack: () => {},
    },
  ]
  const {
    assetsModule: { fetchCoinRate },
  } = useAssetsStore()
  useMount(fetchCoinRate)
  if (reg.test(id)) {
    return <div></div>
  }
  return <div className={cn(styles.scoped)}>{tabList[0].cpn}</div>
}

export async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams: LayoutParams = {
    footerShow: true,
  }
  let symbol = pageContext.routeParams.symbol
  const data = await getServerCacheSpotTradePair(symbol)
  if (data) {
    symbol = `${data.baseSymbolName}/${data.quoteSymbolName}`
  }
  const values = {
    symbol,
    businessName: getBusinessName(),
  }

  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: {
        title: t({
          id: `modules_trade_index_page_omn2t6xoub`,
          values,
        }),
        description: t({
          id: `modules_trade_index_page_hssvdouaqa`,
          values,
        }),
      },
    },
  }
}
