import { OrderStatusEnum, SpotPlanOrderStatusEnum, SpotStopProfitOrderStatusEnum } from '@/constants/order'
import { EntrustTypeEnum, TradeDirectionEnum } from '@/constants/trade'
import { baseOrderSpotStore } from '@/store/order/spot'
import { IBaseOrderItem, IQuerySpotOrderReqParams, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { WsBizEnum, WsTypesEnum, WsThrottleTimeEnum } from '@/constants/ws'
import { ISubscribeParams } from '@/plugins/ws/types'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'
import coinWs from '@/plugins/ws'
import { getTextFromStoreEnums } from '../store'

export function normalOrderMapParamsFn(params: IQuerySpotOrderReqParams): IQuerySpotOrderReqParams {
  return {
    ...params,
    status: Array.isArray(params.statusArr) ? params.statusArr.join(',') : params.status,
    side: Array.isArray(params.direction) ? (params.direction.length > 1 ? '' : params.direction[0]) : params.direction,
    beginDate: params.beginDateNumber?.toString(),
    endDate: params.endDateNumber?.toString(),
    beginDateNumber: undefined,
    endDateNumber: undefined,
    direction: undefined,
    statusArr: undefined,
    dateType: undefined,
  }
}
export function getNormalTypes() {
  return [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`constants/trade-1`,
      value: EntrustTypeEnum.market,
    },
    {
      name: t`constants/trade-0`,
      value: EntrustTypeEnum.limit,
    },
  ]
}
export function getPlanTypes() {
  return [
    {
      name: t`common.all`,
      value: '',
    },
    {
      name: t`features_orders_spot_open_order_item_510257`,
      value: EntrustTypeEnum.market,
    },
    {
      name: t`constants_order_747`,
      value: EntrustTypeEnum.limit,
    },
  ]
}

/** 获取订单枚举文本 */
export function getOrderValueEnumText(
  orderItem: IBaseOrderItem | ISpotPlanOrderItem,
  replaceValues: Partial<IBaseOrderItem & ISpotPlanOrderItem> = {},
  orderEnumType: number
) {
  const order = {
    ...orderItem,
    ...replaceValues,
  }
  const orderEnums = baseOrderSpotStore.getState().orderEnums
  const orderStatusEnums = orderEnums.orderStatus.enums
  const planOrderStatusEnums = orderEnums.planOrderStatus.enums

  const planOrder = order as ISpotPlanOrderItem
  const normalOrder = order as IBaseOrderItem
  const isPlanOrder = planOrder.orderStatusCd !== undefined
  const normalStatusConfigs = {
    [OrderStatusEnum.systemCanceled]: {
      text: t`constants/assets/common-33`,
    },
    [OrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
    },
  }
  const planStatusConfigs = {
    [SpotPlanOrderStatusEnum.systemCanceled]: {
      text: t`constants/assets/common-33`,
    },
    [SpotPlanOrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
    },
  }

  const stopProfitLossStatusConfigs = {
    [SpotStopProfitOrderStatusEnum.systemCanceled]: {
      text: t`constants/assets/common-33`,
    },
    [SpotStopProfitOrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
    },
  }

  const statusConfiguration = {
    [EntrustTypeEnum.normal]: {
      config: normalStatusConfigs,
      status: normalOrder.status!,
      side: normalOrder.side!,
      orderStatusEnums,
      orderType: normalOrder.orderType!,
    },
    [EntrustTypeEnum.plan]: {
      config: planStatusConfigs,
      status: planOrder.orderStatusCd,
      side: planOrder.side,
      orderStatusEnums: planOrderStatusEnums,
      orderType: planOrder.matchType,
    },
    [EntrustTypeEnum.stop]: {
      config: stopProfitLossStatusConfigs,
      status: order.status,
      side: order.side,
      orderStatusEnums: planOrderStatusEnums,
      orderType: planOrder.matchType,
    },
  }

  const statusConfigurationEnum = statusConfiguration?.[orderEnumType]

  const statusConfig = statusConfigurationEnum?.config?.[statusConfigurationEnum?.status]

  // const statusConfig = isPlanOrder
  //   ? planStatusConfigs[planOrder.orderStatusCd]
  //   : normalStatusConfigs[normalOrder.status!]
  // 对于已撤销，这里做一个单独的处理，因为控制台还是分开显示手动和系统，但是前端只有一个已撤销，无法改变文字来区分

  const statusText =
    statusConfig?.text ||
    getTextFromStoreEnums(statusConfigurationEnum?.status, statusConfigurationEnum?.orderStatusEnums)

  const typeText = getTextFromStoreEnums(statusConfigurationEnum?.orderType, orderEnums.entrustType.enums)

  const typeTextWithSuffix = getTextFromStoreEnums(
    statusConfigurationEnum?.orderType,
    isPlanOrder ? orderEnums.planEntrustTypeWithSuffix.enums : orderEnums.entrustTypeWithSuffix.enums
  )

  const directionText = getTextFromStoreEnums(statusConfigurationEnum?.side, orderEnums.orderDirection.enums)

  return {
    statusText,
    directionText,
    typeText,
    typeTextWithSuffix,
  }
}
const ORDER_MAX_COUNT = 50
/** 获取是否超出订单数量限制 */
export function getCanOrderMore(entrustType: EntrustTypeEnum, direction: TradeDirectionEnum) {
  const openOrderModule = baseOrderSpotStore.getState().openOrderModule
  const existOrders = (
    (entrustType === EntrustTypeEnum.plan ? openOrderModule.plan.data : openOrderModule.normal.data) as any[]
  ).filter(item => item.side === direction)

  return existOrders.length < ORDER_MAX_COUNT
}

export function subscribeSpotOrders(createCallback: (type: EntrustTypeEnum) => (data: any) => void) {
  const subscribeParams: ISubscribeParams[] = [
    {
      subs: {
        biz: WsBizEnum.spot,
        type: WsTypesEnum.order,
        base: '',
        quote: '',
        granularity: '',
      },
      callback: createCallback(EntrustTypeEnum.normal),
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
    },
    {
      subs: {
        biz: WsBizEnum.spot,
        type: WsTypesEnum.planOrder,
        base: '',
        quote: '',
        granularity: '',
      },
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
      callback: createCallback(EntrustTypeEnum.plan),
    },
    {
      subs: {
        biz: WsBizEnum.spot,
        type: WsTypesEnum.spotProfitLoss,
        base: '',
        quote: '',
        granularity: '',
      },
      callback: createCallback(EntrustTypeEnum.stop),
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
    },
  ]
  subscribeParams.forEach(({ callback, ...params }) => {
    coinWs.subscribe({
      ...params,
      callback,
    })
  })
  return () => {
    subscribeParams.forEach(params => {
      coinWs.unsubscribe(params)
    })
  }
}
