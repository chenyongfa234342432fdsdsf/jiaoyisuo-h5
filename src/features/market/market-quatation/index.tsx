import Icon from '@/components/icon'
import TabSwitch from '@/components/tab-switch'
import {
  getMarketTabsConfig,
  getFusionMarketTabsConfig,
  MarketLisModulesEnum,
  MarketListRouteEnum,
} from '@/constants/market/market-list/market-module'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import MarketNotificationDisplay from '@/features/market/market-quatation/common/market-notification-display'
import { link } from '@/helper/link'
import { useCommonStore } from '@/store/common'
import { useMarketListStore } from '@/store/market/market-list'
import { Sticky } from '@nbit/vant'
import { useEffect } from 'react'
import styles from './index.module.css'

type IProps = {
  moduleName: MarketListRouteEnum
  children?: React.ReactNode
}

const ModulesTabList = ({ moduleName }: IProps) => {
  const { isFusionMode } = useCommonStore()
  const tabList: any[] = isFusionMode ? getFusionMarketTabsConfig() : getMarketTabsConfig()

  return (
    <>
      <div className="module-tabs">
        <TabSwitch tabList={tabList as any} defaultId={moduleName} />
      </div>
      <div className="functional-icons"></div>
    </>
  )
}

export default function MarketListLayout({ moduleName, children }: IProps) {
  const { isFusionMode } = useCommonStore()
  const store = useMarketListStore()

  useEffect(() => {
    store.setActiveModule(
      moduleName === MarketListRouteEnum.futures
        ? MarketLisModulesEnum.futuresMarkets
        : MarketLisModulesEnum.spotMarkets
    )
  }, [moduleName])

  return (
    <div className={`${styles['market-common']} ${styles.scoped}`}>
      <Sticky>
        <div className="header-wrapper">
          <ModulesTabList moduleName={moduleName} />
          <span>
            {!isFusionMode && getAuthModuleStatusByKey(AuthModuleEnum.spot) && (
              <Icon name="trending-up" hasTheme onClick={() => link('/market/activity')} />
            )}
            <Icon name="search" hasTheme onClick={() => link(MarketListRouteEnum.search)} />
          </span>
        </div>

        {moduleName === MarketListRouteEnum.spot ||
          (moduleName === MarketListRouteEnum.futures && <MarketNotificationDisplay />)}
      </Sticky>

      <div className="market-list-content">{children}</div>
    </div>
  )
}
