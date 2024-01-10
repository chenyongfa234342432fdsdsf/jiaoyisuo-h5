import { Tabs } from '@nbit/vant'
// import { useMount } from 'ahooks'
import { t } from '@lingui/macro'
import Link from '@/components/link'
// import Icon from '@/components/icon'
import NotLogin from '@/components/not-login'
import Icon from '@/components/icon'
// import ContractLayoutList from '@/features/trade/contract/contract-layout-list/index'
// import { SpotOpenContractItem } from '@/features/trade/contract/contract-order-item/index'
import { usePageContext } from '@/hooks/use-page-context'
import { useUserStore } from '@/store/user'
import { useState, useRef } from 'react'
import ContractLayoutList from '@/features/ternary-option/option-order/ternary-layout-list'
import { TernaryOpenItem } from '@/features/ternary-option/option-order/ternary-order-item/index'
import { useTernaryPlanOrder } from '@/hooks/features/ternary-plan-order'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import TernarySpotPage from '@/features/ternary-option/option-order/ternary-history/ternary-history-page'
import { useUpdateEffect } from 'ahooks'
import { useCancelAll } from '../ternaryorder'
import styles from './index.module.css'
import { PositionLayout } from '../../position/layout'

export type IMyTradeProps = {
  /** 交易类型，用于获取订单列表 */
  tradeType: string
}
enum TabEnum {
  /** 当前持仓 */
  holdingOrder = 'holding-order',
  /** 计划委托 */
  openOrder = 'open-order',
  /** 历史战绩 */
  historicalAchievements = 'historical-achievements',
}

function MyTrade() {
  const { positionList } = useOptionPositionStore()

  const userState = useUserStore()

  const isLogin = userState.isLogin

  const ternarySpotPageRef = useRef<Record<'openFiltersVisibleModal', () => void>>()

  const [activeTab, setActiveTab] = useState<string>('')

  const { cancelAll } = useCancelAll()

  const pageContext = usePageContext()

  const { optionOrdersList } = useTernaryPlanOrder()

  const { myTradeActiveTabCounter } = useOptionTradeStore()

  useUpdateEffect(() => {
    setActiveTab(TabEnum.holdingOrder)
  }, [myTradeActiveTabCounter])

  const notLoginNode = (
    <div className="py-8 text-center">
      <Link className="text-brand_color" href={`/login?redirect=${pageContext.path}`}>
        {t`user.field.reuse_07`}
      </Link>
      {t`features_trade_spot_my_trade_index_510264`}
    </div>
  )

  const tabsNode = {
    [TabEnum.holdingOrder]: (
      <Tabs.TabPane
        name={TabEnum.holdingOrder}
        key={TabEnum.holdingOrder}
        title={t({
          id: 'features_ternary_option_option_order_my_trade_index_vkcnuixbz2',
          values: { 0: positionList?.length },
        })}
      >
        <NotLogin notLoginNode={notLoginNode}>
          <PositionLayout />
        </NotLogin>
      </Tabs.TabPane>
    ),
    [TabEnum.openOrder]: (
      <Tabs.TabPane
        name={TabEnum.openOrder}
        key={TabEnum.openOrder}
        title={t({
          id: 'features_ternary_option_option_order_my_trade_index_ufqjquye5y',
          values: { 0: optionOrdersList?.length },
        })}
      >
        <NotLogin notLoginNode={notLoginNode}>
          {/* @ts-ignore */}
          <ContractLayoutList OrderItem={TernaryOpenItem} propList={optionOrdersList} />
        </NotLogin>
      </Tabs.TabPane>
    ),
    [TabEnum.historicalAchievements]: (
      <Tabs.TabPane
        name={TabEnum.historicalAchievements}
        key={TabEnum.historicalAchievements}
        title={t`features_ternary_option_option_order_my_trade_index_avcx3m5clj`}
      >
        <NotLogin notLoginNode={notLoginNode}>
          <TernarySpotPage ref={ternarySpotPageRef} />
        </NotLogin>
      </Tabs.TabPane>
    ),
  }

  return (
    <div className={styles['my-trade-wrapper']}>
      <div className="tab-right-extra-wrapper">
        {activeTab === TabEnum.openOrder && optionOrdersList?.length > 0 && (
          <span className="tab-right-extra text-brand_color text-sm" onClick={() => cancelAll()}>
            {t`features_ternary_option_option_order_my_trade_index_sp_kgwwvkf`}
          </span>
        )}

        {activeTab === TabEnum.historicalAchievements && isLogin && (
          <span
            className="tab-right-extra text-brand_color text-sm"
            onClick={() => ternarySpotPageRef.current?.openFiltersVisibleModal()}
          >
            <Icon className="text-base" name="asset_record_filter" hasTheme />
          </span>
        )}
      </div>
      <Tabs active={activeTab} onClickTab={key => setActiveTab(key.name)} align="start" ellipsis={false}>
        {Object.keys(tabsNode).map(item => {
          return tabsNode[item]
        })}
      </Tabs>
    </div>
  )
}

export default MyTrade
