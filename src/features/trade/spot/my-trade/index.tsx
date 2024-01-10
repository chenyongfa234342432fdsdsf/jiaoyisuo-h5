import { Tabs } from '@nbit/vant'
import { t } from '@lingui/macro'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { SpotOpenOrderItem } from '@/features/orders/spot/open-order-item'
import { OrderListLayout } from '@/features/orders/order-list-layout'
import { SpotNotAsset } from '@/features/orders/spot/spot-not-asset'
import { OrderHeaderFilters } from '@/features/orders/order-filters'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { useSpotOpenOrders } from '@/hooks/features/order'
import NotLogin from '@/components/not-login'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import classNames from 'classnames'
import { EntrustTypeEnum } from '@/constants/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { OrderTabTypeEnum } from '@/constants/order'
import { getSpotOrderPagePath } from '@/helper/route'
import { useSpotTradeStore } from '@/store/trade/spot'
import { useOnPageRefresh } from '@/hooks/use-on-page-refresh'
import { SpotTradeAssets } from './assets'
import styles from './index.module.css'

export type IMyTradeProps = {
  /** 交易类型，用于获取订单列表 */
  tradeType: string
}

/**
 * 我的交易模块，包括委托、资产
 */
function MyTrade() {
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const { openOrderModule, fetchOpenOrders, orderEnums } = useBaseOrderSpotStore()
  const { settings: spotSettings } = useSpotTradeStore()
  const pageContext = usePageContext()
  const showCurrentCoinOrders = spotSettings.showCurrentCoinOrders
  const {
    orderType,
    cancelAll: cancelAllApi,
    setOrderType,
    openTitle,
    displayNormalOrders,
    displayPlanOrders,
    displayStopOrders,
    openSpots,
    tradeShowCancelAll,
    isNotLetGoC2C,
    whetherOrNotShowChildren,
  } = useSpotOpenOrders(undefined, showCurrentCoinOrders ? currentSpotCoin.id : undefined)
  // 这里以展示的订单数为准
  const openTotal = displayNormalOrders.length + displayPlanOrders.length + displayStopOrders.length
  const onOrderTYpeChange = (val: number) => {
    val && setOrderType(val)
  }
  const cancelAll = async () => {
    await cancelAllApi({
      tradeId: showCurrentCoinOrders ? currentSpotCoin.id?.toString() : undefined,
    })
  }

  const notLoginNode = (
    <div className="py-8 text-center">
      <Link className="text-brand_color" href={`/login?redirect=${pageContext.path}`}>
        {t`user.field.reuse_07`}
      </Link>
      {t`features_trade_spot_my_trade_index_510264`}
    </div>
  )

  const hiddenClassName = 'fixed -top-full -left-full opacity-0 invisible'
  useOnPageRefresh(fetchOpenOrders)

  return (
    <div className={styles['my-trade-wrapper']}>
      <Tabs
        align="start"
        onChange={() => {
          fetchOpenOrders()
        }}
        navRight={
          <Link href={getSpotOrderPagePath(OrderTabTypeEnum.current, orderType)} className="tab-right-extra">
            <Icon name="order_history" hasTheme />
          </Link>
        }
      >
        <Tabs.TabPane name="open-order" key="open-order" title={openTitle}>
          <NotLogin notLoginNode={notLoginNode}>
            <SpotNotAsset isNotLetGoC2C={isNotLetGoC2C} whetherOrNotShowChildren={whetherOrNotShowChildren}>
              {orderEnums.orderStatus.enums.length > 0 && (
                <div className="bg-bg_color">
                  <div className="switch-wrapper rv-hairline--bottom flex justify-between items-center">
                    <div
                      onClick={() => {
                        spotSettings.updateShowCurrentCoinOrders(!showCurrentCoinOrders)
                      }}
                      className="flex justify-between items-center"
                    >
                      {showCurrentCoinOrders ? (
                        <Icon name="login_agreement_selected" />
                      ) : (
                        <Icon name="login_agreement_unselected" />
                      )}
                      <span className="label">{t`features_trade_spot_my_trade_index_510229`}</span>
                    </div>
                    {!!tradeShowCancelAll && (
                      <div className="text-text_color_01 text-xs px-2 py-1 rounded bg-bg_sr_color" onClick={cancelAll}>
                        {t`features_orders_order_filters_510216`}
                      </div>
                    )}
                  </div>
                  {openTotal > 0 && (
                    <OrderHeaderFilters
                      orderType={orderType}
                      onOrderTYpeChange={onOrderTYpeChange}
                      openSpots={openSpots}
                      isCurrentTab
                    />
                  )}
                  <div
                    className={classNames({
                      [hiddenClassName]: orderType !== EntrustTypeEnum.normal,
                    })}
                  >
                    <OrderListLayout
                      onRefresh={fetchOpenOrders}
                      params={undefined}
                      removeOrderItem={openOrderModule.removeNormalOrder}
                      propList={displayNormalOrders as any}
                      OrderItem={SpotOpenOrderItem}
                      openSpots={openSpots}
                      orderType={orderType}
                      isCurrentTab
                    />
                  </div>
                  <div
                    className={classNames({
                      [hiddenClassName]: orderType !== EntrustTypeEnum.plan,
                    })}
                  >
                    <OrderListLayout
                      removeOrderItem={openOrderModule.removePlanOrder}
                      params={undefined}
                      onRefresh={fetchOpenOrders}
                      propList={displayPlanOrders as any}
                      OrderItem={SpotOpenOrderItem}
                      openSpots={openSpots}
                      orderType={orderType}
                      isCurrentTab
                    />
                  </div>
                  <div
                    className={classNames({
                      [hiddenClassName]: orderType !== EntrustTypeEnum.stop,
                    })}
                  >
                    <OrderListLayout
                      removeOrderItem={openOrderModule.removeStopOrder}
                      params={undefined}
                      onRefresh={fetchOpenOrders}
                      propList={displayStopOrders as any}
                      OrderItem={SpotOpenOrderItem}
                      openSpots={openSpots}
                      orderType={orderType}
                      isCurrentTab
                    />
                  </div>
                </div>
              )}
            </SpotNotAsset>
          </NotLogin>
        </Tabs.TabPane>
        <Tabs.TabPane
          name="assets"
          key="assets"
          title={t`features/assets/financial-record/record-list/record-list-screen/index-0`}
        >
          <NotLogin notLoginNode={notLoginNode}>
            <SpotNotAsset isNotLetGoC2C={isNotLetGoC2C} whetherOrNotShowChildren={whetherOrNotShowChildren}>
              <SpotTradeAssets />
            </SpotNotAsset>
          </NotLogin>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default MyTrade
