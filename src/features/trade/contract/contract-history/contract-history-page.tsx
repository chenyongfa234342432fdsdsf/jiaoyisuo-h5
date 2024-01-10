import { Tabs } from '@nbit/vant'
import { useCreation, useEventEmitter, useMount, useUpdateEffect } from 'ahooks'
import React, { useState } from 'react'
import {
  getPerpetualPlanOrdersHistory,
  getPerpetualOrdersHistory,
  queryPerpetualOrdersCurrent,
  queryPerpetualStopProfitLossCurrent,
  queryPerpetualPlanOrdersCurrent,
  getPerpetualStrategyOrdersHistory,
} from '@/apis/future/common'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import {
  FutureTabTypeEnum,
  FuturePlanOrderStatusParamsCompositionEnum,
  SpotFutureStatusParamsCompositionEnum,
  FutureStopOrderStatusParamsCompositionEnum,
} from '@/constants/future/future-history'
import { normalOrderMapParamsFn } from '@/helper/order/future'
import { t } from '@lingui/macro'
import produce from 'immer'
import { usePageContext } from '@/hooks/use-page-context'
import { EntrustTypeEnum } from '@/constants/trade'
import { link } from '@/helper/link'
import { storeEnumsToOptions } from '@/helper/store'
import { getFuturePagePath } from '@/helper/route'
import { useOrderFutureStore } from '@/store/order/future'
import { useSpotOpenFuture } from '@/hooks/features/contract'
import { IFutureHeaderFiltersProps } from '../contract-filters'
import styles from './index.module.css'
import { getSpotFiltersModalDefaultParams, SpotFiltersModal } from './spot-filters-modal'
import { BaseOrders } from './spot-page-base-orders'
import ContractFundrate from '../contract-fundrate/index'
import {
  HistorySelectParams,
  CapitalSelectParams,
  CurrentNormalParams,
  HistoryNormalParams,
  IQuerySpotOrderReqParams,
} from '../contract'

export type IMyTradeProps = {
  /** 交易类型，用于获取订单列表 */
  tradeType: string
}
/**
 * 现货订单页面
 */
function OrdersSpotPage() {
  const pageContext = usePageContext()
  const isHistory = pageContext.routeParams.type === FutureTabTypeEnum.history
  const defaultOrderTab = isHistory ? FutureTabTypeEnum.history : FutureTabTypeEnum.current
  const queryType = pageContext.urlParsed.search.type || EntrustTypeEnum.normal

  const [orderTab, setOrderTab] = useState<string | number>(defaultOrderTab || FutureTabTypeEnum.current)

  const {
    futureHooksType,
    setFutureHooksType,
    openTitle,
    constractsProp,
    cancelAll: cancelAllApi,
    openFuture,
    marginMode,
  } = useSpotOpenFuture(Number(queryType) as EntrustTypeEnum)

  const { fetchPairList, fetchOpenOrders } = useOrderFutureStore()

  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)
  // 当前订单通用部分
  const [currentSelectParams, setCurrentSelectParams] = useState<any>({
    tradeId: '',
  })

  const [currentNormalSelectParams, setNormalCurrentSelectParams] = useState<CurrentNormalParams>({
    entrustTypeInd: '',
  })

  const [currentStopSelectParams, setStopCurrentSelectParams] = useState<CurrentNormalParams>({
    entrustTypeInd: '',
  })

  const [currentPlanSelectParams, setPlanCurrentSelectParams] = useState<CurrentNormalParams>({
    entrustTypeInd: '',
  })

  // 历史订单通用的部分
  const [historySelectParams, setHistorySelectParams] = useState<Partial<HistorySelectParams>>({
    tradeId: '',
    ...getSpotFiltersModalDefaultParams(),
  })

  const [capitalSelectParams, setCapitalSelectParams] = useState<CapitalSelectParams>({
    ...getSpotFiltersModalDefaultParams(),
  })

  const [historyNormalParams, setHistoryNormalParams] = useState<HistoryNormalParams>({
    statusArr: Object.values(SpotFutureStatusParamsCompositionEnum) as string[],
    typeInd: '',
  })
  const [historyPlanParams, setHistoryPlanParams] = useState<HistoryNormalParams>({
    statusArr: Object.values(FuturePlanOrderStatusParamsCompositionEnum) as string[],
    entrustTypeInd: '',
  })
  const [historyStopParams, setHistoryStopParams] = useState<HistoryNormalParams>({
    statusArr: Object.values(FutureStopOrderStatusParamsCompositionEnum) as string[],
    entrustTypeInd: '',
  })

  const [historyHideCanceled, setHistoryHideCanceled] = useState(false)
  const $cancelAll = useEventEmitter()

  const currentNormalAllParams = useCreation(() => {
    return {
      ...currentSelectParams,
      ...currentNormalSelectParams,
    }
  }, [currentSelectParams, currentNormalSelectParams])

  const currentPlanAllParams = useCreation(() => {
    return {
      ...currentSelectParams,
      ...currentPlanSelectParams,
    }
  }, [currentSelectParams, currentPlanSelectParams])

  const currentStopAllParams = useCreation(() => {
    return {
      ...currentSelectParams,
      ...currentStopSelectParams,
    }
  }, [currentSelectParams, currentStopSelectParams])

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
        const index = draft.indexOf(SpotFutureStatusParamsCompositionEnum.canceled)

        if (!historyHideCanceled && index === -1) {
          draft.push(SpotFutureStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(SpotFutureStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })

    setHistoryPlanParams({
      ...historyPlanParams,
      statusArr: produce(historyPlanParams.statusArr!, draft => {
        const index = draft.indexOf(FuturePlanOrderStatusParamsCompositionEnum.canceled)
        if (!historyHideCanceled && index === -1) {
          draft.push(FuturePlanOrderStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(FuturePlanOrderStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })

    setHistoryStopParams({
      ...historyStopParams,
      statusArr: produce(historyStopParams.statusArr!, draft => {
        const index = draft.indexOf(FutureStopOrderStatusParamsCompositionEnum.canceled)
        if (!historyHideCanceled && index === -1) {
          draft.push(FutureStopOrderStatusParamsCompositionEnum.canceled)
        } else if (historyHideCanceled && index !== -1) {
          draft.splice(draft.indexOf(FutureStopOrderStatusParamsCompositionEnum.canceled), 1)
        }
      }),
    })
  }, [historyHideCanceled])

  const onModalParamsChange = (part: IQuerySpotOrderReqParams) => {
    const { statusArr, ...newHistorySelectParams } = part

    if (orderTab === FutureTabTypeEnum.history) {
      setHistorySelectParams({
        ...historySelectParams,
        ...newHistorySelectParams,
      })
      if (futureHooksType === EntrustTypeEnum.normal) {
        const hideCanceled = !statusArr!.includes(SpotFutureStatusParamsCompositionEnum.canceled)
        setHistoryNormalParams({
          ...historyNormalParams,
          statusArr,
        })
        setHistoryHideCanceled(hideCanceled)
      } else if (EntrustTypeEnum.plan === futureHooksType) {
        const hideCanceled = !statusArr!.includes(FuturePlanOrderStatusParamsCompositionEnum.canceled)
        setHistoryPlanParams({
          ...historyPlanParams,
          statusArr,
        })
        setHistoryHideCanceled(hideCanceled)
      } else {
        const hideCanceled = !statusArr!.includes(FutureStopOrderStatusParamsCompositionEnum.canceled)
        setHistoryStopParams({
          ...historyStopParams,
          statusArr,
        })
        setHistoryHideCanceled(hideCanceled)
      }
    } else if (orderTab === FutureTabTypeEnum.fundrate) {
      setCapitalSelectParams({
        ...capitalSelectParams,
        ...newHistorySelectParams,
      })
    }

    setFiltersVisible(false)
  }

  useMount(fetchPairList)

  useUpdateEffect(() => {
    link(getFuturePagePath(orderTab as number, futureHooksType), {
      overwriteLastHistoryEntry: true,
    })
  }, [orderTab, futureHooksType])

  const historyHeaderFiltersProps: IFutureHeaderFiltersProps = {
    orderType: futureHooksType,
    onOrderTYpeChange: setFutureHooksType,
    hideCanceled: historyHideCanceled,
    onHideCanceledChange,
  }

  const normalFutureTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`constants/trade-0`,
      value: 'limit_order',
    },
    {
      name: t`constants/trade-1`,
      value: 'market_order',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101500`,
      value: 'forced_liquidation_order',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101501`,
      value: 'forced_lighten_order',
    },
  ]

  const stopFutureTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101502`,
      value: 'limit',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101503`,
      value: 'market',
    },
    // ...storeEnumsToOptions(orderEnums.planEntrustTypeWithSuffix.enums, 'name'),
  ]

  const planFutureTypeOptions = [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101504`,
      value: 'limit',
    },
    {
      name: t`features_trade_contract_contract_history_contract_history_page_5101505`,
      value: 'market',
    },
  ]

  const futurnOptionsAll = {
    [EntrustTypeEnum.plan]: {
      futureOptions: planFutureTypeOptions,
      filterOptions: historyPlanAllParams,
      searchRequest: queryPerpetualPlanOrdersCurrent,
      searchHistoryRequest: getPerpetualPlanOrdersHistory,
      setHistoryTypeParams: setHistoryPlanParams,
      currentFilterOptions: currentPlanAllParams,
      setCurrentTypeParams: setPlanCurrentSelectParams,
    },
    [EntrustTypeEnum.stop]: {
      futureOptions: stopFutureTypeOptions,
      filterOptions: historyStopAllParams,
      searchRequest: queryPerpetualStopProfitLossCurrent,
      searchHistoryRequest: getPerpetualStrategyOrdersHistory,
      setHistoryTypeParams: setHistoryStopParams,
      currentFilterOptions: currentStopAllParams,
      setCurrentTypeParams: setStopCurrentSelectParams,
    },
    [EntrustTypeEnum.normal]: {
      futureOptions: normalFutureTypeOptions,
      filterOptions: historyNormalAllParams,
      searchRequest: queryPerpetualOrdersCurrent,
      searchHistoryRequest: getPerpetualOrdersHistory,
      setHistoryTypeParams: setHistoryNormalParams,
      currentFilterOptions: currentNormalAllParams,
      setCurrentTypeParams: setNormalCurrentSelectParams,
    },
  }

  const onCancelAll = async () => {
    const succeed = await cancelAllApi({
      tradeId: currentSelectParams.tradeId,
      entrustTypeInd: futurnOptionsAll[futureHooksType].currentFilterOptions.entrustTypeInd,
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

  const currentHeaderFiltersProps: IFutureHeaderFiltersProps = {
    orderType: futureHooksType,
    onOrderTYpeChange: setFutureHooksType,
    onCancelAll,
  }

  const setOrderTabChange = e => {
    setFutureHooksType(EntrustTypeEnum.normal)
    setOrderTab(e)
    fetchOpenOrders()
  }

  const setContractLayoutList = () => {
    // @ts-ignore
    const ContractComponent = <BaseOrders />
    const spotPlanOpenOrderObj = {
      [EntrustTypeEnum.plan]: ContractComponent,
      [EntrustTypeEnum.normal]: ContractComponent,
      [EntrustTypeEnum.stop]: ContractComponent,
    }
    const orderTabComponentParams = {
      [FutureTabTypeEnum.current]: {
        visible: orderTab === FutureTabTypeEnum.current,
        marginMode,
        params: futurnOptionsAll[futureHooksType].currentFilterOptions,
        $cancelAll,
        isCurrentTab: true,
        onCancelAll,
        onRefresh: fetchOpenOrders,
        headerFiltersProps: currentHeaderFiltersProps,
        setTypeParams: futurnOptionsAll[futureHooksType].setCurrentTypeParams,
        removeOrderItem: constractsProp?.removeFutureItem,
        openFuture,
        setParams: setCurrentSelectParams,
        types: futureHooksType !== EntrustTypeEnum.normal ? futurnOptionsAll[futureHooksType].futureOptions : undefined,
        paramsMapFn: normalOrderMapParamsFn,
        futureHooksType,
        showDirection: false,
        search: futurnOptionsAll[futureHooksType].searchRequest,
      },
      [FutureTabTypeEnum.history]: {
        visible: orderTab === FutureTabTypeEnum.history,
        $cancelAll,
        setTypeParams: futurnOptionsAll[futureHooksType].setHistoryTypeParams,
        orderTab,
        headerFiltersProps: historyHeaderFiltersProps,
        params: futurnOptionsAll[futureHooksType].filterOptions,
        paramsMapFn: normalOrderMapParamsFn,
        setParams: setHistorySelectParams,
        types: futurnOptionsAll[futureHooksType].futureOptions,
        futureHooksType,
        search: futurnOptionsAll[futureHooksType].searchHistoryRequest,
      },
    }

    return React.cloneElement(spotPlanOpenOrderObj[futureHooksType as number], {
      ...orderTabComponentParams[orderTab],
    })
  }

  return (
    <div className={styles['spot-page-wrapper']}>
      <NavBar
        title={t`features_trade_contract_contract_history_contract_history_page_5101499`}
        right={
          orderTab !== FutureTabTypeEnum.current && (
            <Icon className="record-filter-icon" name="asset_record_filter" hasTheme />
          )
        }
        onClickRight={() => setFiltersVisible(true)}
      />
      <Tabs align="start" active={orderTab} onChange={setOrderTabChange}>
        <Tabs.TabPane name={FutureTabTypeEnum.current} key={FutureTabTypeEnum.current} title={openTitle}>
          {orderTab === FutureTabTypeEnum.current && <div>{setContractLayoutList()}</div>}
        </Tabs.TabPane>
        <Tabs.TabPane name={FutureTabTypeEnum.history} key={FutureTabTypeEnum.history} title={t`constants_order_728`}>
          {orderTab === FutureTabTypeEnum.history && <div>{setContractLayoutList()}</div>}
        </Tabs.TabPane>
        <Tabs.TabPane
          name={FutureTabTypeEnum.fundrate}
          key={FutureTabTypeEnum.fundrate}
          title={t`constants/assets/common-8`}
        >
          {orderTab === FutureTabTypeEnum.fundrate && <ContractFundrate capitalSelectParams={capitalSelectParams} />}
        </Tabs.TabPane>
      </Tabs>
      <SpotFiltersModal
        futureHooksType={futureHooksType}
        visible={filtersVisible}
        onClose={() => {
          setFiltersVisible(false)
        }}
        params={
          orderTab !== FutureTabTypeEnum.fundrate
            ? futurnOptionsAll[futureHooksType].filterOptions
            : capitalSelectParams
        }
        orderTab={orderTab}
        onConfirm={onModalParamsChange}
      />
    </div>
  )
}

export default OrdersSpotPage
