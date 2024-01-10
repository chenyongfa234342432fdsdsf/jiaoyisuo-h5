import {
  cancelAllNormalConstract,
  cancelNormalConstract,
  cancelAllStrategyConstract,
  cancelStrategyConstract,
  cancelAllPlanConstract,
  cancelPlanConstract,
} from '@/apis/future/common'
import { EntrustTypeEnum, TradeFutureMarginTypeInReqEnum } from '@/constants/trade'
import { requestWithLoading } from '@/helper/order'
import { useUserStore } from '@/store/user'
import { useOrderFutureStore } from '@/store/order/future'
import { IBaseOrderItem, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import AlertTip from '@/components/alert-tip'
import { Dialog, Toast } from '@nbit/vant'
import { useFutureTradeStore } from '@/store/trade/future'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'
import { MarkcoinRequest } from '@/plugins/request'
import { YapiGetV1PerpetualOrdersCurrentListData } from '@/typings/yapi/PerpetualOrdersCurrentV1GetApi.d'
import { YapiGetV1PerpetualStrategyCurrentListData } from '@/typings/yapi/PerpetualStrategyCurrentV1GetApi.d'
import { YapiGetV1PerpetualPlanOrdersCurrentListData } from '@/typings/yapi/PerpetualPlanOrdersCurrentV1GetApi.d'
import {
  YapiPostV1PerpetualOrdersCancelAllApiRequest,
  YapiPostV1PerpetualOrdersCancelAllApiResponse,
} from '@/typings/yapi/PerpetualOrdersCancelAllV1PostApi.d'
import {
  YapiPostV1PerpetualOrdersCancelApiRequest,
  YapiPostV1PerpetualOrdersCancelApiResponse,
} from '@/typings/yapi/PerpetualOrdersCancelV1PostApi.d'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import style from '@/features/trade/contract/contract-history/index.module.css'

/**
 * 获取现货当前委托标题和订阅相关模块
 */

type ConstractsProp = {
  data: Array<
    | YapiGetV1PerpetualOrdersCurrentListData
    | YapiGetV1PerpetualStrategyCurrentListData
    | YapiGetV1PerpetualPlanOrdersCurrentListData
  >
  removeFutureItem: (id: string) => void
}

type OpenFutureDetail = {
  title: string
  name: string
  requestAll: MarkcoinRequest<
    YapiPostV1PerpetualOrdersCancelAllApiRequest,
    YapiPostV1PerpetualOrdersCancelAllApiResponse
  >
  request: MarkcoinRequest<YapiPostV1PerpetualOrdersCancelApiRequest, YapiPostV1PerpetualOrdersCancelApiResponse>
}

export type OpenFuture = {
  [key: number]: OpenFutureDetail
}

// eslint-disable-next-line default-param-last
export function useSpotOpenFuture(defaultType = EntrustTypeEnum.normal, currentTradeId?: number, homePage?: boolean) {
  const [futureHooksType, setFutureHooksType] = useState(defaultType)

  const { id } = useTradeCurrentFutureCoin()

  const [constractsProp, setConstractsProp] = useState<ConstractsProp>()

  const { preferenceSettings } = useFutureTradeStore()

  const marginMode = preferenceSettings.marginSource === TradeFutureMarginTypeInReqEnum.wallet

  const { subscribe, fetchOpenOrders, openOrderModule, fetchOrderEnums } = useOrderFutureStore()

  const { isLogin } = useUserStore()
  /**
   * 当前委托的名字，相关枚举对应值，请求的总汇总
   */
  const openFuture: OpenFuture = {
    [EntrustTypeEnum.normal]: {
      title: 'normal',
      name: t`features_trade_future_settings_order_confirm_634`,
      requestAll: cancelAllNormalConstract,
      request: cancelNormalConstract,
    },
    [EntrustTypeEnum.plan]: {
      title: 'plan',
      name: t`constants/trade-3`,
      requestAll: cancelAllPlanConstract,
      request: cancelPlanConstract,
    },
    [EntrustTypeEnum.stop]: {
      title: 'stop',
      name: t`features_orders_future_holding_index_610`,
      requestAll: cancelAllStrategyConstract,
      request: cancelStrategyConstract,
    },
  }

  const setConstractsPropList = data => {
    return data
      .filter(order => {
        if (currentTradeId) {
          return String(order.tradeId) === String(currentTradeId)
        }
        return true
      })
      .sort(sort)
  }

  useEffect(() => {
    const constractsPropData = openOrderModule[openFuture[futureHooksType].title]
    const constractsList = setConstractsPropList(constractsPropData?.data)
    setConstractsProp({ ...constractsPropData, data: constractsList })
  }, [
    futureHooksType,
    currentTradeId,
    openOrderModule?.normal?.data,
    openOrderModule?.plan?.data,
    openOrderModule?.stop?.data,
    id,
  ])

  useEffect(() => {
    return subscribe()
  }, [isLogin])

  useMount(fetchOrderEnums)

  useEffect(() => {
    if (isLogin && id) {
      fetchOpenOrders({ tradeId: '', priorTrade: String(id) || '' })
    }
  }, [id, isLogin])

  const getTabTitle = (name: string, count: number) => {
    return `${name}${isLogin ? `(${count})` : ''}`
  }

  const openTotal = openOrderModule.normal.total + openOrderModule.plan.total + openOrderModule.stop.total

  const openTitle = getTabTitle(
    homePage ? t`features_trade_contract_contract_order_item_index_frpx0hjuwsdk2gxjhldfs` : t`constants_order_727`,
    openTotal
  )

  const isNormalOrder = futureHooksType === EntrustTypeEnum.normal

  const showCancelAll = openOrderModule[openFuture[futureHooksType].title].total > 0

  const cancelAll = async params => {
    const typeText = openFuture[futureHooksType].name
    await Dialog.confirm({
      className: style['future-revoke-modal'],
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
    const res = await requestWithLoading(openFuture[futureHooksType].requestAll(params))
    if (res?.isOk) {
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

  return {
    futureHooksType,
    setFutureHooksType,
    openTitle,
    openOrderModule,
    isNormalOrder,
    openFuture,
    showCancelAll,
    constractsProp,
    cancelAll,
    marginMode,
  }
}
