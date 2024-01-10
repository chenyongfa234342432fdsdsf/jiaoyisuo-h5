import { Tabs } from '@nbit/vant'
import { useOrderFutureStore } from '@/store/order/future'
import { useInterval, useMount, useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { contractStatusIndEnum, EntrustTypeEnum } from '@/constants/trade'
import Icon from '@/components/icon'
import NotLogin from '@/components/not-login'
import { OrderTabTypeEnum } from '@/constants/order'
import { ContractHeaderFilters } from '@/features/trade/contract/contract-filters/index'
import ContractLayoutList from '@/features/trade/contract/contract-layout-list/index'
import { SpotOpenContractItem } from '@/features/trade/contract/contract-order-item/index'
import { usePageContext } from '@/hooks/use-page-context'
import { useSpotOpenFuture } from '@/hooks/features/contract'
import { getAssetsHistoryPositionPageRoutePath, getFuturePagePath, getOpenFuturePagePath } from '@/helper/route'
import { useFutureTradeStore } from '@/store/trade/future'
import ContractElements from '@/features/trade/contract/contract-elements/index'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { FuturesPositionList } from '@/features/assets/futures/common/futures-position-list'
import { FuturesPositionList as FuturesAccountList } from '@/features/assets/overview/list/futures/futures-list/list-layout'
import { TradeFuturesAssets } from '@/features/assets/futures/common/trade-future-assets'
import React, { useEffect, useState } from 'react'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getFuturesCurrencySettings, getFuturesPositionList } from '@/helper/assets/futures'
import { useUserStore } from '@/store/user'
import NoDataImage from '@/components/no-data-image'
import { useOnPageRefresh } from '@/hooks/use-on-page-refresh'
import { FuturesPositionViewTypeEnum } from '@/constants/assets/futures'
import { onGetContractList } from '@/helper/assets/overview'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useAssetsStore } from '@/store/assets/spot'
import { activeFuture } from '@/helper/future'
import { useGetWsPositionChange } from '@/hooks/features/assets/futures'
import styles from './index.module.css'

export type IMyTradeProps = {
  /** 交易类型，用于获取订单列表 */
  tradeType: string
}
enum TabEnum {
  /** 当前持仓 */
  holdingOrder = 'holding-order',
  /** 当前委托 */
  openOrder = 'open-order',
  /** 资产 */
  assets = 'assets',
  /** 合约要素 */
  elementOrder = 'element-order',
}

/**
 * 我的交易模块，包括委托、持仓、资产等
 * 用于现货、杠杆、合约页面
 */
function MyTrade() {
  const { fetchOpenOrders, fetchTradePairDefaultQuote, fetchPairList } = useOrderFutureStore()
  const { positionListFutures, assetsFuturesSetting } = useAssetsFuturesStore()
  const { futuresAssetsList } = useAssetsStore().assetsModule || {}

  const { settings: futuresSettings, moduleOrderData, isTutorialMode } = useFutureTradeStore()
  const firstTabs = moduleOrderData?.find(item => item.sort === 1) || {}
  const [activeTab, setActiveTab] = useState<string>(firstTabs?.value || '')

  const showCurrentCoinFuture = futuresSettings.showCurrentCoinOrders

  const contractMarket = useTradeCurrentFutureCoin()
  const {
    personalCenterSettings: { isOpenContractStatus },
    isLogin,
  } = useUserStore()

  const {
    futureHooksType,
    setFutureHooksType,
    openTitle,
    constractsProp,
    showCancelAll,
    cancelAll: cancelAllApi,
    openFuture,
    marginMode,
  } = useSpotOpenFuture(undefined, showCurrentCoinFuture ? contractMarket.id : undefined, true)
  useGetWsPositionChange()

  const pageContext = usePageContext()

  const setOnOrderTYpeChange = e => {
    setFutureHooksType(e)
    fetchOpenOrders({ tradeId: '', priorTrade: String(contractMarket?.id) || '' })
  }

  useInterval(async () => {
    if (!isLogin) return
    if (
      isOpenContractStatus === contractStatusIndEnum.yes &&
      activeTab === TabEnum.holdingOrder &&
      assetsFuturesSetting.positionViewType === FuturesPositionViewTypeEnum.account
    )
      onGetContractList()
  }, 5000)

  useEffect(() => {
    if (!isLogin) return
    assetsFuturesSetting.positionViewType === FuturesPositionViewTypeEnum.account && onGetContractList()
  }, [assetsFuturesSetting.positionViewType, isTutorialMode, isLogin])

  useMount(() => {
    fetchTradePairDefaultQuote()
    getFuturesCurrencySettings()
    fetchPairList()
  })

  const tradeShowCancelAll = showCancelAll && constractsProp && constractsProp.data.length > 0

  const contractualElements = t`features_trade_future_my_trade_index_5101489`

  const cancelAll = async () => {
    await cancelAllApi({
      tradeId: showCurrentCoinFuture ? contractMarket.id?.toString() : undefined,
    })
  }
  useOnPageRefresh(fetchOpenOrders)

  useEffect(() => {
    if (isTutorialMode) {
      setActiveTab(TabEnum.holdingOrder)
    }
  }, [isTutorialMode])

  useEffect(() => {
    if (
      activeTab === TabEnum.holdingOrder &&
      assetsFuturesSetting?.positionViewType === FuturesPositionViewTypeEnum.position
    )
      return
    getFuturesPositionList()
  }, [])

  const notLoginNode = (
    <div className="py-8 text-center">
      <Link className="text-brand_color" href={`/login?redirect=${pageContext.path}`}>
        {t`user.field.reuse_07`}
      </Link>
      {t`features_trade_spot_my_trade_index_510264`}
    </div>
  )

  const setContractLayoutList = () => {
    // @ts-ignore
    const ContractComponent = <ContractLayoutList />
    const spotPlanOpenOrderObj = {
      [EntrustTypeEnum.plan]: ContractComponent,
      [EntrustTypeEnum.normal]: ContractComponent,
      [EntrustTypeEnum.stop]: ContractComponent,
    }
    return React.cloneElement(spotPlanOpenOrderObj[futureHooksType as number], {
      onRefresh: fetchOpenOrders,
      params: undefined,
      marginMode,
      removeOrderItem: constractsProp?.removeFutureItem,
      futureHooksType,
      openFuture,
      propList: constractsProp?.data,
      OrderItem: SpotOpenContractItem,
    })
  }
  const tabsNode = {
    [TabEnum.assets]: (
      <Tabs.TabPane name={TabEnum.assets} key={TabEnum.assets} title={t`page_title.assets`}>
        <NotLogin notLoginNode={notLoginNode}>
          {isOpenContractStatus === contractStatusIndEnum.yes ? (
            <TradeFuturesAssets needRefresh={activeTab === TabEnum.assets} />
          ) : (
            <NoDataImage className="pt-16" />
          )}
        </NotLogin>
      </Tabs.TabPane>
    ),
    [TabEnum.holdingOrder]: (
      <Tabs.TabPane
        name={TabEnum.holdingOrder}
        key={TabEnum.holdingOrder}
        title={`${t`features/assets/financial-record/record-detail/record-details-info/index-6`}(${
          positionListFutures.length
        })`}
      >
        <NotLogin notLoginNode={notLoginNode}>
          {isOpenContractStatus === contractStatusIndEnum.yes ? (
            <>
              <FuturesPositionList
                viewVisible
                visible={assetsFuturesSetting?.positionViewType === FuturesPositionViewTypeEnum.position}
              />
              {assetsFuturesSetting?.positionViewType === FuturesPositionViewTypeEnum.account && (
                <FuturesAccountList viewVisible />
              )}
            </>
          ) : (
            <NoDataImage
              className="pt-16"
              footerText={
                <div className="text-sm font-medium">
                  <span className="text-text_color_01">{t`features_trade_future_settings_index_5101362`}</span>
                  <span
                    className="text-brand_color"
                    onClick={() => activeFuture()}
                  >{t`features_trade_future_settings_index_5101363`}</span>
                </div>
              }
            />
          )}
        </NotLogin>
      </Tabs.TabPane>
    ),
    [TabEnum.openOrder]: (
      <Tabs.TabPane name={TabEnum.openOrder} key={TabEnum.openOrder} title={openTitle}>
        <NotLogin notLoginNode={notLoginNode}>
          <div className="bg-bg_color">
            <div className="header">
              <Icon
                className="hide-icon"
                name={showCurrentCoinFuture ? 'asset_view_coin_hide_open' : 'asset_view_coin_hide_close'}
                onClick={() => futuresSettings.updateShowCurrentCoinOrders(!showCurrentCoinFuture)}
              />

              <span>{t`features_assets_futures_common_futures_position_list_index_5101425`}</span>
            </div>
            <ContractHeaderFilters
              onCancelAll={tradeShowCancelAll ? cancelAll : undefined}
              orderType={futureHooksType}
              onOrderTYpeChange={setOnOrderTYpeChange}
            />
            {setContractLayoutList()}
          </div>
        </NotLogin>
      </Tabs.TabPane>
    ),
    [TabEnum.elementOrder]: (
      <Tabs.TabPane name={TabEnum.elementOrder} key={TabEnum.elementOrder} title={contractualElements}>
        <ContractElements />
      </Tabs.TabPane>
    ),
  }

  return (
    <div className={styles['my-trade-wrapper']}>
      <div className="tab-right-extra-wrapper">
        {/* navRight 无法解决一系列问题 */}
        <Link
          href={
            activeTab === TabEnum.holdingOrder
              ? getAssetsHistoryPositionPageRoutePath()
              : getFuturePagePath(OrderTabTypeEnum.current, futureHooksType)
          }
          className="tab-right-extra"
        >
          <Icon name="order_history" hasTheme />
        </Link>
      </div>
      <Tabs
        onClickTab={key => setActiveTab(key.name)}
        align="start"
        ellipsis={false}
        active={activeTab}
        className={GUIDE_ELEMENT_IDS_ENUM.futureTradePosition}
      >
        {moduleOrderData.map(item => {
          return tabsNode[item.value]
        })}
      </Tabs>
    </div>
  )
}

export default MyTrade
