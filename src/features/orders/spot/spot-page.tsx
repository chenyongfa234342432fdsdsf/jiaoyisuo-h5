import { useCreation, useEventEmitter, useMount, useUpdateEffect } from 'ahooks'
import { IOrderHeaderFiltersProps } from '@/features/orders/order-filters'
import { useState } from 'react'
import {
  querySpotNormalHistoryOrderList,
  querySpotNormalOpenOrderList,
  querySpotPlanHistoryOrderList,
  querySpotPlanOpenOrderList,
  getV1ProfitLossOrdersCurrentApiRequest,
  getV1ProfitLossOrdersHistoryApiRequest,
} from '@/apis/order'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import {
  OrderTabTypeEnum,
  SpotOrderStatusParamsCompositionEnum,
  SpotPlanOrderStatusParamsCompositionEnum,
  SpotStopProfitLossOrderStatusParamsCompositionEnum,
} from '@/constants/order'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import { useSpotOpenOrders } from '@/hooks/features/order'
import { normalOrderMapParamsFn } from '@/helper/order/spot'
import { t } from '@lingui/macro'
import produce from 'immer'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { usePageContext } from '@/hooks/use-page-context'
import { EntrustTypeEnum } from '@/constants/trade'
import { link } from '@/helper/link'
import { storeEnumsToOptions } from '@/helper/store'
import { getSpotOrderPagePath } from '@/helper/route'
import styles from './index.module.css'
import { getSpotFiltersModalDefaultParams, SpotFiltersModal } from './spot-filters-modal'
import { BaseOrders } from './spot-page-base-orders'

export type IMyTradeProps = {
  /** 交易类型，用于获取订单列表 */
  tradeType: string
}

/**
 * 现货订单页面
 */
function OrdersSpotPage() {
  const pageContext = usePageContext()
  const isHistory = pageContext.routeParams.type === OrderTabTypeEnum.history
  const defaultOrderTab = isHistory ? OrderTabTypeEnum.history : OrderTabTypeEnum.current
  const queryType = pageContext.urlParsed.search.type
  const [orderTab, setOrderTab] = useState(defaultOrderTab || OrderTabTypeEnum.current)
  const isCurrentTab = orderTab === OrderTabTypeEnum.current
  const { fetchPairList, openOrderModule, fetchOpenOrders, orderEnums } = useBaseOrderSpotStore()
  const spotOrderHookResult = useSpotOpenOrders(queryType ? (Number(queryType) as EntrustTypeEnum) : undefined)
  const { orderType, setOrderType, cancelAll, openTitle, tradeShowCancelAll, openSpots } = spotOrderHookResult
  const [filtersVisible, setFiltersVisible] = useState(false)
  // 当前订单通用部分
  const [currentSelectParams, setCurrentSelectParams] = useState<IQuerySpotOrderReqParams>({
    direction: '',
    tradeId: '',
    orderType: '',
  })
  // 历史订单通用的部分
  const [historySelectParams, setHistorySelectParams] = useState<IQuerySpotOrderReqParams>({
    orderType: '',
    tradeId: '',
    ...getSpotFiltersModalDefaultParams(),
  })

  const [historyNormalParams, setHistoryNormalParams] = useState<IQuerySpotOrderReqParams>({
    statusArr: Object.values(SpotOrderStatusParamsCompositionEnum),
    orderType: '',
  })
  const [historyPlanParams, setHistoryPlanParams] = useState<IQuerySpotOrderReqParams>({
    statusArr: Object.values(SpotPlanOrderStatusParamsCompositionEnum),
    orderType: '',
  })
  const [historyStopParams, setHistoryStopParams] = useState<IQuerySpotOrderReqParams>({
    statusArr: Object.values(SpotStopProfitLossOrderStatusParamsCompositionEnum),
    orderType: '',
  })

  const [historyHideCanceled, setHistoryHideCanceled] = useState(false)
  const $cancelAll = useEventEmitter()
  const onCancelAll = async () => {
    const succeed = await cancelAll({
      side: currentSelectParams.direction,
      orderType: currentSelectParams.orderType,
      tradeId: currentSelectParams.tradeId,
    })
    if (!succeed) {
      return
    }
    // 暂时不触发清空 $cancelAll.emit()
    // 触发刷新
    fetchOpenOrders()
    setCurrentSelectParams({
      ...currentSelectParams,
    })
  }
  const historyNormalAllParams = useCreation(() => {
    return {
      ...historySelectParams,
      ...historyNormalParams,
    }
  }, [historySelectParams, historyNormalParams])

  const historyPlanAllParams = useCreation(() => {
    return {
      ...historySelectParams,
      ...historyPlanParams,
    }
  }, [historySelectParams, historyPlanParams])

  const historyStopAllParams = useCreation(() => {
    return {
      ...historySelectParams,
      ...historyStopParams,
    }
  }, [historySelectParams, historyStopParams])

  const onHideCanceledChange = (val: boolean) => {
    setHistoryHideCanceled(val)
  }
  useUpdateEffect(() => {
    setHistoryNormalParams({
      ...historyNormalParams,
      statusArr: produce(historyNormalParams.statusArr!, draft => {
        const index = draft.indexOf(SpotOrderStatusParamsCompositionEnum.canceled)

        if (!historyHideCanceled && index === -1) {
          draft.push(SpotOrderStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(SpotOrderStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })
    setHistoryPlanParams({
      ...historyPlanParams,
      statusArr: produce(historyPlanParams.statusArr!, draft => {
        const index = draft.indexOf(SpotPlanOrderStatusParamsCompositionEnum.canceled)
        if (!historyHideCanceled && index === -1) {
          draft.push(SpotPlanOrderStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(SpotPlanOrderStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })

    setHistoryStopParams({
      ...historyStopParams,
      statusArr: produce(historyStopParams.statusArr!, draft => {
        const index = draft.indexOf(SpotStopProfitLossOrderStatusParamsCompositionEnum.canceled)
        if (!historyHideCanceled && index === -1) {
          draft.push(SpotStopProfitLossOrderStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(SpotStopProfitLossOrderStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })
  }, [historyHideCanceled])
  const onModalParamsChange = (part: IQuerySpotOrderReqParams) => {
    const { statusArr, ...newHistorySelectParams } = part
    setHistorySelectParams({
      ...historySelectParams,
      ...newHistorySelectParams,
    })
    if (orderType === EntrustTypeEnum.normal) {
      const hideCanceled = !statusArr!.includes(SpotOrderStatusParamsCompositionEnum.canceled)
      setHistoryNormalParams({
        ...historyNormalParams,
        statusArr,
      })
      setHistoryHideCanceled(hideCanceled)
    } else if (orderType === EntrustTypeEnum.plan) {
      setHistoryPlanParams({
        ...historyPlanParams,
        statusArr,
      })
      const hideCanceled = !statusArr!.includes(SpotPlanOrderStatusParamsCompositionEnum.canceled)
      setHistoryHideCanceled(hideCanceled)
    } else {
      setHistoryStopParams({
        ...historyStopParams,
        statusArr,
      })
      const hideCanceled = !statusArr!.includes(SpotStopProfitLossOrderStatusParamsCompositionEnum.canceled)
      setHistoryHideCanceled(hideCanceled)
    }
    setFiltersVisible(false)
  }

  useMount(fetchPairList)
  useUpdateEffect(() => {
    link(getSpotOrderPagePath(orderTab, orderType), {
      overwriteLastHistoryEntry: true,
    })
  }, [orderTab, orderType])
  const currentHeaderFiltersProps: IOrderHeaderFiltersProps = {
    orderType,
    onOrderTYpeChange: setOrderType,
    onCancelAll,
  }
  const historyHeaderFiltersProps: IOrderHeaderFiltersProps = {
    orderType,
    onOrderTYpeChange: setOrderType,
    hideCanceled: historyHideCanceled,
    onHideCanceledChange,
  }
  const normalOrderTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    ...storeEnumsToOptions(orderEnums.entrustTypeWithSuffix.enums, 'name'),
  ]
  const planOrderTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    ...storeEnumsToOptions(orderEnums.planEntrustTypeWithSuffix.enums, 'name'),
  ]

  const stopProfitLossOrderTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`features_orders_order_filters_rfvgyk8h6q`,
      value: 'all',
    },
  ]

  const headerTabs = [
    {
      name: OrderTabTypeEnum.current,
      key: OrderTabTypeEnum.current,
      title: openTitle,
    },
    {
      name: OrderTabTypeEnum.history,
      key: OrderTabTypeEnum.history,
      title: t`constants_order_728`,
    },
  ]

  const spotPageCollectObj = {
    [EntrustTypeEnum.normal]: {
      filterAllParams: historyNormalAllParams,
    },
    [EntrustTypeEnum.plan]: {
      filterAllParams: historyPlanAllParams,
    },
    [EntrustTypeEnum.stop]: {
      filterAllParams: historyStopAllParams,
    },
  }

  return (
    <div className={styles['spot-page-wrapper']}>
      <NavBar
        title={
          <div className="header">
            {headerTabs.map(tabsItem => {
              return (
                <div key={tabsItem.key} className="header-cell" onClick={() => setOrderTab(tabsItem.key)}>
                  <span className={`header-cell-title ${orderTab === tabsItem.key && 'header-cell-title-active'}`}>
                    {tabsItem.title}
                  </span>
                  <div className={`header-cell-line ${orderTab !== tabsItem.key && 'invisible'}`} />
                </div>
              )
            })}
          </div>
        }
        right={
          !isCurrentTab && (
            <span>
              <Icon name="asset_record_filter" hasTheme />
            </span>
          )
        }
        onClickRight={() => setFiltersVisible(true)}
      />
      <div>
        {orderTab === OrderTabTypeEnum.current && (
          <div>
            {orderType === EntrustTypeEnum.normal && isCurrentTab && (
              <BaseOrders
                visible
                params={currentSelectParams}
                $cancelAll={$cancelAll}
                isCurrentTab
                onCancelAll={onCancelAll}
                onRefresh={fetchOpenOrders}
                headerFiltersProps={currentHeaderFiltersProps}
                removeOrderItem={openOrderModule.removeNormalOrder}
                setParams={setCurrentSelectParams}
                paramsMapFn={normalOrderMapParamsFn}
                showDirection
                search={querySpotNormalOpenOrderList}
                openSpots={openSpots}
                orderType={orderType}
                tradeShowCancelAll={tradeShowCancelAll}
              />
            )}
            {orderType === EntrustTypeEnum.plan && isCurrentTab && (
              <BaseOrders
                visible
                onCancelAll={onCancelAll}
                isCurrentTab
                headerFiltersProps={currentHeaderFiltersProps}
                params={currentSelectParams}
                removeOrderItem={openOrderModule.removePlanOrder}
                paramsMapFn={normalOrderMapParamsFn}
                $cancelAll={$cancelAll}
                onRefresh={fetchOpenOrders}
                showDirection
                setParams={setCurrentSelectParams}
                types={planOrderTypeOptions}
                search={querySpotPlanOpenOrderList}
                openSpots={openSpots}
                orderType={orderType}
                tradeShowCancelAll={tradeShowCancelAll}
              />
            )}
            {orderType === EntrustTypeEnum.stop && isCurrentTab && (
              <BaseOrders
                visible
                onCancelAll={onCancelAll}
                isCurrentTab
                headerFiltersProps={currentHeaderFiltersProps}
                params={currentSelectParams}
                removeOrderItem={openOrderModule.removePlanOrder}
                paramsMapFn={normalOrderMapParamsFn}
                $cancelAll={$cancelAll}
                onRefresh={fetchOpenOrders}
                showDirection
                setParams={setCurrentSelectParams}
                search={getV1ProfitLossOrdersCurrentApiRequest}
                openSpots={openSpots}
                orderType={orderType}
                tradeShowCancelAll={tradeShowCancelAll}
              />
            )}
          </div>
        )}

        {orderTab === OrderTabTypeEnum.history && (
          <div>
            {orderType === EntrustTypeEnum.normal && !isCurrentTab && (
              <BaseOrders
                visible
                $cancelAll={$cancelAll}
                headerFiltersProps={historyHeaderFiltersProps}
                params={historyNormalAllParams}
                paramsMapFn={normalOrderMapParamsFn}
                setParams={setHistorySelectParams}
                setTypeParams={setHistoryNormalParams}
                types={normalOrderTypeOptions}
                search={querySpotNormalHistoryOrderList}
                openSpots={openSpots}
                orderType={orderType}
              />
            )}
            {orderType === EntrustTypeEnum.plan && !isCurrentTab && (
              <BaseOrders
                visible
                setParams={setHistorySelectParams}
                headerFiltersProps={historyHeaderFiltersProps}
                $cancelAll={$cancelAll}
                paramsMapFn={normalOrderMapParamsFn}
                setTypeParams={setHistoryPlanParams}
                types={planOrderTypeOptions}
                params={historyPlanAllParams}
                search={querySpotPlanHistoryOrderList}
                openSpots={openSpots}
                orderType={orderType}
              />
            )}
            {orderType === EntrustTypeEnum.stop && !isCurrentTab && (
              <BaseOrders
                visible
                setParams={setHistorySelectParams}
                setTypeParams={setHistoryStopParams}
                headerFiltersProps={historyHeaderFiltersProps}
                $cancelAll={$cancelAll}
                paramsMapFn={normalOrderMapParamsFn}
                types={stopProfitLossOrderTypeOptions}
                params={historyStopAllParams}
                search={getV1ProfitLossOrdersHistoryApiRequest}
                openSpots={openSpots}
                orderType={orderType}
              />
            )}
          </div>
        )}
      </div>
      <SpotFiltersModal
        orderType={orderType}
        visible={filtersVisible}
        onClose={() => {
          setFiltersVisible(false)
        }}
        params={spotPageCollectObj?.[orderType]?.filterAllParams}
        onConfirm={onModalParamsChange}
      />
      {/* <SpotFiltersModal
        isPlanOrder
        visible={!isNormalOrder && filtersVisible}
        onClose={() => {
          setFiltersVisible(false)
        }}
        params={historyPlanAllParams}
        onConfirm={onModalParamsChange}
      /> */}
    </div>
  )
}

export default OrdersSpotPage
