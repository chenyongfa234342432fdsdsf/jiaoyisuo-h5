import Link from '@/components/link'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'
import Icon from '@/components/icon'
import { useCommonStore } from '@/store/common'
import { usePageContext } from '@/hooks/use-page-context'
import {
  getAuthModuleRoutes,
  AuthModuleEnum,
  getAuthMarketsModuleStatus,
  getAuthModuleRouterStatus,
} from '@/helper/modal-dynamic'
import cn from 'classnames'
import { newbitEnv } from '@/helper/env'
import { useUserStore } from '@/store/user'
import { recreationEncryptAES } from '@/helper/ASE_RSA'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { MarketListRouteEnum } from '@/constants/market/market-list/market-module'
import { getFutureTradePagePath, getTradePagePath } from '@/helper/route'
import { useContractMarketStore } from '@/store/market/contract'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { getTernaryOptionTradePagePath } from '@/helper/route/ternary-option'
import { getIsWebClipCache, getIsVestBagCache } from '@/helper/cache/common'
import classNames from 'classnames'
import { getEnvUrlConfig } from '../../../build'
import styles from './index.module.css'

const basicFusionUrl = 'https://mixmode-recreation-h5.monkey00.com/'

function Footer({ isShow }: { isShow: boolean }) {
  const pageContext = usePageContext()
  const { token } = useUserStore()
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const { currentCoinExcludePrice: currentOptionCoin } = useTernaryOptionStore()
  const { isFusionMode, locale, businessId } = useCommonStore()
  const { currentCoin: currentFutureCoin, defaultCoin: futureDefaultCoin } = useContractMarketStore()

  const [fusionH5Url, setFusionH5Url] = useState<string>('')

  const isWebClip = getIsWebClipCache()
  const isVestBag = getIsVestBagCache()

  const getFusionUrl = async () => {
    const envUrlConfig = await getEnvUrlConfig(businessId, newbitEnv)
    const fusionUrl = envUrlConfig?.H5?.['recreation-h5']
    setFusionH5Url(fusionUrl || basicFusionUrl)
  }

  useEffect(() => {
    isFusionMode && getFusionUrl()
  }, [isFusionMode])

  const home = {
    title: t`components/footer/index-0`,
    icon: 'home',
    routes: ['/home-page'],
    hoverIcon: 'home_hover',
  }

  const option = {
    title: t`features_market_market_home_global_search_market_trade_search_ternary_option_index_gg3hfqd6hi`,
    icon: 'options_unselected',
    routes: [
      '/ternary-option',
      getTernaryOptionTradePagePath({
        symbolName: currentSpotCoin.id ? currentOptionCoin.symbol : 'BTCUSD',
      }),
    ],
    hoverIcon: 'options_selected',
  }
  const quotes = {
    title: t`components/footer/index-1`,
    icon: 'quotes',
    routes: isFusionMode ? [MarketListRouteEnum.futures, MarketListRouteEnum.sector] : getAuthModuleRouterStatus(),
    hoverIcon: 'quotes_hover',
  }
  const trade = {
    title: t`components/footer/index-2`,
    icon: 'trade',
    routes: [
      getTradePagePath({
        symbolName: currentSpotCoin.id ? currentSpotCoin.symbolName : 'BTCUSDT',
      }),
    ],
    hoverIcon: 'trade_hover',
  }
  const contract = {
    title: t`components/footer/index-3`,
    icon: 'contract',
    routes: [
      getFutureTradePagePath({
        symbolName: currentFutureCoin.id ? currentFutureCoin.symbolName : futureDefaultCoin.symbolName,
      }),
    ],
    hoverIcon: 'contract_hover',
  }
  const property = {
    title: t`components/footer/index-4`,
    icon: 'property',
    routes: ['/assets'],
    hoverIcon: 'property_hover',
  }
  const entertainment = {
    title: t`components_footer_index_bx0qud6rwr`,
    icon: 'icon_games',
    isLink: true,
    routes: [`${fusionH5Url}${locale}/?isMergeMode=true&isRAToken=${recreationEncryptAES(token)}`],
    hoverIcon: 'icon_games_hover',
  }

  let normalModeDynamics: any[] = [home]
  if (getAuthMarketsModuleStatus()) {
    normalModeDynamics = [...normalModeDynamics, quotes]
  }
  normalModeDynamics = [
    ...normalModeDynamics,
    ...getAuthModuleRoutes({ [AuthModuleEnum.spot]: trade, [AuthModuleEnum.contract]: contract, property }),
  ]

  const tabBars = isFusionMode ? [option, quotes, contract, property] : normalModeDynamics
  if (!isShow) {
    return null
  }
  const pathname = pageContext.path.split('?')[0]

  return (
    <footer
      className={cn(`${styles.scoped}`, {
        'pb-6': isWebClip,
        'pb-0': isVestBag,
        'px-4': isFusionMode,
      })}
    >
      {tabBars.map(item => {
        return (
          <div
            className={classNames('tab-bar-box', {
              'is-active': item.routes.includes(pathname),
            })}
            key={item.routes[0]}
          >
            {item?.isLink ? (
              <div className={'tab-bar-content'} onClick={() => (window.location.href = item.routes[0])}>
                <Icon
                  className="tab-bar-icon"
                  hasTheme={!item.routes.includes(pathname)}
                  name={item.routes.includes(pathname) ? item.hoverIcon : item.icon}
                />
                <span className="whitespace-nowrap title">{item.title}</span>
              </div>
            ) : (
              <Link href={item.routes[0]}>
                <div className={'tab-bar-content'}>
                  <Icon
                    className="tab-bar-icon"
                    hasTheme={!item.routes.includes(pathname)}
                    name={item.routes.includes(pathname) ? item.hoverIcon : item.icon}
                  />
                  <span className="whitespace-nowrap title">{item.title}</span>
                </div>
              </Link>
            )}
          </div>
        )
      })}
    </footer>
  )
}

export default Footer
