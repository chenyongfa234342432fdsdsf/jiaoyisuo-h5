import cn from 'classnames'
import { useState } from 'react'
import { Popup } from '@nbit/vant'
import { t } from '@lingui/macro'
import CurrentHeader from '@/features/market/detail/current-header'
import Icon from '@/components/icon'
import { getIsLogin } from '@/helper/auth'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { useFutureTradeIsOpened, useTradeCurrentFutureCoin, useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { OrderTabTypeEnum } from '@/constants/order'
import {
  getFutureComputerPagePath,
  getFutureFundingRatePagePath,
  getFutureNotificationPagePath,
  getFuturePagePath,
  getSpotOrderPagePath,
} from '@/helper/route'
import { useCommonStore } from '@/store/common'
import { KLineChartType } from '@nbit/chart-utils'
import { FundingHistoryTypeEnum } from '@/constants/future/funding-history'
import { useFutureTradeStore } from '@/store/trade/future'
import styles from './index.module.css'
import MoreFeatures, { IFeature } from './more-features'

export function FutureTradeHeader() {
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const { setIsTutorialMode } = useFutureTradeStore()
  const { isFusionMode } = useCommonStore()
  const opened = useFutureTradeIsOpened()
  const preferences = {
    name: t`features/trade/future/exchange-14`,
    needLogin: true,
    icon: 'spot_preferences',
    href: '/future/settings',
  }
  const history = {
    name: t`features_assets_coin_details_trade_510156`,
    needLogin: true,
    icon: 'spot_order',
    href: getFuturePagePath(OrderTabTypeEnum.current),
  }
  const fee = {
    name: t`features_trade_header_more_features_510285`,
    icon: 'fee_rate',
    href: `/trade/help/fee?tab=${HelpFeeTabTypeEnum.futures}`,
  }
  const funding = {
    name: t`future.funding-history.title`,
    icon: 'funding-history',
    href: getFutureFundingRatePagePath({
      tradeId: currentFutureCoin.id,
    }),
  }
  const calculator = {
    name: t`features_trade_header_future_-zreei4fj3dn_szh_4gzo`,
    icon: 'calculator',
    href: getFutureComputerPagePath(),
  }
  const notice = {
    name: t`features_trade_common_notification_notification_settings_510274`,
    icon: 'announcement_notice',
    href: getFutureNotificationPagePath(),
  }
  const my = {
    name: t`features_trade_header_future_kcmzdtnmo3`,
    icon: 'personal_settings',
    href: '/personal-center/settings',
  }
  const guide = {
    name: t`features_trade_header_future_lzy6xsxggq`,
    icon: 'low_cost',
    needLogin: true,
    onClick: () => {
      setIsTutorialMode(true)
    },
  }
  const allFeatures: (IFeature & {
    needLogin?: boolean
  })[] = isFusionMode
    ? [preferences, history, fee, funding, calculator, notice, guide, my]
    : [preferences, history, fee, funding, calculator, notice, guide]
  const features = allFeatures.filter(feature => {
    if (feature.needLogin) {
      return getIsLogin() && opened
    }
    return true
  })

  return (
    <div className={cn(styles.scoped)}>
      <CurrentHeader
        type="trade"
        extra={<Icon onClick={() => setFeaturesVisible(true)} className="text-sm" name="contract_more" hasTheme />}
        coinType={KLineChartType.Futures}
      />
      <Popup
        className={styles['more-features-popup-wrapper']}
        visible={featuresVisible}
        position="top"
        onClose={() => setFeaturesVisible(false)}
      >
        <MoreFeatures onClose={() => setFeaturesVisible(false)} features={features} />
      </Popup>
    </div>
  )
}
