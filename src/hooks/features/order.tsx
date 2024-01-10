import {
  cancelAllSpotNormalOrder,
  cancelAllSpotPlanOrder,
  cancelSpotNormalOrder,
  cancelSpotPlanOrder,
  cancelAllSpotProfitLossOrder,
  cancelSpotProfitLossOrder,
} from '@/apis/order'
import { EntrustTypeEnum } from '@/constants/trade'
import { requestWithLoading } from '@/helper/order'
import { useUserStore } from '@/store/user'
import AlertTip from '@/components/alert-tip'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { IBaseOrderItem, ISpotBatchCancelOrderReq, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { useMarketStore } from '@/store/market/index'
import { MarkcoinRequest } from '@/plugins/request'
import { Dialog, Toast } from '@nbit/vant'
import { getCoinOverview } from '@/apis/assets/coin'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'
import style from '@/features/trade/spot/my-trade/index.module.css'
import { getV1C2cAreaCheckCoinHasAreaApiRequest } from '@/apis/c2c/trade'

export type OpenSpotsDetail = {
  title: string
  listNums: undefined | number
  requestAll: MarkcoinRequest<any>
  request: MarkcoinRequest<any>
  total: number
  titleText: string
}

export type OpenSpots = {
  [key: number]: OpenSpotsDetail
}

/**
 * 获取现货当前委托标题和订阅相关模块
 */
export function useSpotOpenOrders(defaultType = EntrustTypeEnum.normal, currentTradeId?: number) {
  const [orderType, setOrderType] = useState(defaultType)
  const { subscribe, fetchOpenOrders, openOrderModule, fetchOrderEnums } = useBaseOrderSpotStore()
  const [isNotLetGoC2C, setIsNotLetGoC2C] = useState<boolean>(false)
  const { currentCoin } = useMarketStore()
  const { isLogin } = useUserStore()
  const [whetherOrNotShowChildren, setWhetherOrNotShowChildren] = useState<boolean>(true)

  const getC2cAreaCheckCoin = async () => {
    const { isOk, data } = await getV1C2cAreaCheckCoinHasAreaApiRequest({ coinId: String(currentCoin?.sellCoinId) })
    if (isOk) {
      setIsNotLetGoC2C(data as boolean)
    }
  }

  const getTotalAmount = async () => {
    const { isOk, data } = await getCoinOverview({})
    if (isOk) {
      Number(data?.availableAmount) !== 0 && setWhetherOrNotShowChildren(true)
    }
  }

  useEffect(() => {
    currentCoin?.sellCoinId && getC2cAreaCheckCoin()
  }, [currentCoin?.sellCoinId])

  useEffect(() => {
    isLogin && getTotalAmount()
    return subscribe()
  }, [isLogin])
  useMount(() => {
    fetchOpenOrders()
    fetchOrderEnums()
  })
  function getTabTitle(name: string, count: number) {
    return `${name}${isLogin ? `(${count})` : ''}`
  }
  const openTotal = openOrderModule.normal.total + openOrderModule.plan.total + openOrderModule.stop.total
  const openTitle = getTabTitle(t`constants_order_727`, openTotal)
  const isNormalOrder = orderType === EntrustTypeEnum.normal

  const displayNormalOrders = openOrderModule.normal.data
    .filter(order => {
      if (currentTradeId) {
        return order.tradeId === currentTradeId
      }
      return true
    })
    .sort(sort)
  const displayPlanOrders = openOrderModule.plan.data
    .filter(order => {
      if (currentTradeId) {
        return order.tradeId === currentTradeId
      }
      return true
    })
    .sort(sort)

  const displayStopOrders = openOrderModule.stop.data
    .filter(order => {
      if (currentTradeId) {
        return order.tradeId === currentTradeId
      }
      return true
    })
    .sort(sort)

  /**
   * 当前委托的名字，相关枚举对应值，请求的总汇总
   */
  const openSpots: OpenSpots = {
    [EntrustTypeEnum.normal]: {
      title: 'normal',
      listNums: displayNormalOrders?.length,
      requestAll: cancelAllSpotNormalOrder,
      request: cancelSpotNormalOrder,
      total: openOrderModule.normal.total,
      titleText: t`features_trade_future_settings_order_confirm_634`,
    },
    [EntrustTypeEnum.plan]: {
      title: 'plan',
      listNums: displayPlanOrders?.length,
      requestAll: cancelAllSpotPlanOrder,
      request: cancelSpotPlanOrder,
      total: openOrderModule.plan.total,
      titleText: t`constants/trade-3`,
    },
    [EntrustTypeEnum.stop]: {
      title: 'stop',
      listNums: displayStopOrders?.length,
      requestAll: cancelAllSpotProfitLossOrder,
      request: cancelSpotProfitLossOrder,
      total: openOrderModule.stop.total,
      titleText: t`features_orders_future_holding_index_610`,
    },
  }

  const showCancelAll = openSpots[orderType].total > 0

  const cancelAll = async (params: ISpotBatchCancelOrderReq) => {
    const typeText = openSpots[orderType].titleText
    await Dialog.confirm({
      // title: t`features_user_personal_center_account_security_email_index_592`,
      className: style['spot-revoke-modal'],
      message: (
        <AlertTip>
          <div>
            {t({
              id: 'features_trade_spot_my_trade_index_510227',
              values: {
                0: typeText,
              },
            })}
          </div>
        </AlertTip>
      ),
    })
    const res = await requestWithLoading(openSpots?.[orderType]?.requestAll?.(params))
    if (!res.isOk) {
      return false
    }
    Toast(t`features_trade_spot_my_trade_index_510228`)
    return true
  }
  function sort(a: IBaseOrderItem | ISpotPlanOrderItem, b: IBaseOrderItem | ISpotPlanOrderItem) {
    if (a.tradeId === currentTradeId) {
      return b.tradeId === currentTradeId ? 0 : -1
    }
    return b.tradeId === currentTradeId ? 1 : 0
  }

  const tradeShowCancelAll = showCancelAll && openSpots[orderType]?.listNums

  const setOrderTypeSelect = e => {
    e && setOrderType(e)
  }

  return {
    orderType,
    setOrderType: setOrderTypeSelect,
    openTitle,
    openOrderModule,
    isNormalOrder,
    showCancelAll,
    cancelAll,
    displayNormalOrders,
    displayPlanOrders,
    displayStopOrders,
    openSpots,
    tradeShowCancelAll,
    isNotLetGoC2C,
    whetherOrNotShowChildren,
  }
}
