import cn from 'classnames'
import { useState } from 'react'
import { Popup } from '@nbit/vant'
import { t } from '@lingui/macro'
import CurrentHeader from '@/features/market/detail/current-header'
import Icon from '@/components/icon'
import { getIsLogin } from '@/helper/auth'
import { useCommonStore } from '@/store/common'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { OrderTabTypeEnum } from '@/constants/order'
import { getSpotNotificationPagePath, getSpotOrderPagePath } from '@/helper/route'
import { KLineChartType } from '@nbit/chart-utils'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import styles from './index.module.css'
import MoreFeatures, { IFeature } from './more-features'
import { MarketComparison } from './market-comparison'

function Header(props: { type: KLineChartType }) {
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [marketVisible, setMarketVisible] = useState(false)
  const guideUrl = useHelpCenterUrl('spot_new_lesson')
  const { isFusionMode } = useCommonStore()
  const market = {
    name: t`features_trade_header_more_features_510283`,
    icon: 'market_comparison',
    onClick: () => {
      setMarketVisible(true)
    },
  }
  const guide = {
    name: t`features_trade_header_more_features_510284`,
    icon: 'Novice_guide',
    href: guideUrl,
  }
  const announcement = {
    name: t`features_trade_common_notification_notification_settings_510274`,
    icon: 'announcement_notice',
    href: getSpotNotificationPagePath(),
  }
  const fee = {
    name: t`features_trade_header_more_features_510285`,
    icon: 'fee_rate',
    href: `/trade/help/fee?tab=${HelpFeeTabTypeEnum.spot}`,
  }
  const preferences = {
    name: t`features/trade/future/exchange-14`,
    needLogin: true,
    icon: 'spot_preferences',
    href: '/future/settings',
  }
  const recharge = {
    name: t`assets.financial-record.tabs.Deposit`,
    needLogin: true,
    icon: 'spot_recharge',
    href: '/assets/recharge',
  }
  const order = {
    name: t`features_trade_header_more_features_510287`,
    needLogin: true,
    icon: 'spot_order',
    href: getSpotOrderPagePath(OrderTabTypeEnum.current),
  }

  const allFeatures: (IFeature & {
    needLogin?: boolean
  })[] = isFusionMode
    ? [market, announcement, fee, preferences, recharge, order]
    : [market, guide, announcement, fee, preferences, recharge, order]
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const features = allFeatures.filter(feature => {
    if (feature.needLogin) {
      return getIsLogin()
    }
    return true
  })

  return (
    <div className={cn(styles.scoped)}>
      <CurrentHeader
        type="trade"
        extra={<Icon onClick={() => setFeaturesVisible(true)} className="text-sm" name="contract_more" hasTheme />}
        coinType={props.type}
      />
      <Popup
        className={styles['more-features-popup-wrapper']}
        visible={featuresVisible}
        position="top"
        onClose={() => setFeaturesVisible(false)}
      >
        <MoreFeatures onClose={() => setFeaturesVisible(false)} features={features} />
      </Popup>

      <MarketComparison
        coinId={currentSpotCoin.sellCoinId!}
        visible={marketVisible}
        onClose={() => setMarketVisible(false)}
      />
    </div>
  )
}

export default Header
