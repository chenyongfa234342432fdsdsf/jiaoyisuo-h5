import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import coinWs from '@/plugins/ws'
import { ISubscribeParams } from '@/plugins/ws/types'
import { IBaseOrderItem, ISpotPlanOrderItem, IWsSpotOrder } from '@/typings/api/order'
import {
  querySpotNormalOpenOrderList,
  querySpotPlanOpenOrderList,
  getV1ProfitLossOrdersCurrentApiRequest,
} from '@/apis/order'
import { getIsLogin } from '@/helper/auth'
import { getSymbolLabelInfo } from '@/apis/market'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { getCodeDetailList, getCodeDetailListBatch } from '@/apis/common'
import { IStoreEnum } from '@/typings/store/common'
import { EntrustTypeEnum } from '@/constants/trade'
import { subscribeSpotOrders } from '@/helper/order/spot'

export type IBaseOrderSpotStore = ReturnType<typeof getBaseStore>

let subscribed = false

function createOnWs(set, get) {
  return {
    createOnEntrustPush(entrustType: EntrustTypeEnum) {
      return () => {
        const state: IBaseOrderSpotStore = get()
        state.fetchSingleModuleOpenOrders({
          entrustType,
        })
      }
    },
  }
}

function getBaseStore(set, get) {
  return {
    openOrderModule: {
      normal: {
        data: [] as any as IBaseOrderItem[],
        total: 0,
      },
      plan: {
        data: [] as any as ISpotPlanOrderItem[],
        total: 0,
      },
      stop: {
        data: [] as any,
        total: 0,
      },
      removePlanOrder(id?: any) {
        set(
          produce((state: IBaseOrderSpotStore) => {
            state.openOrderModule.plan.data = state.openOrderModule.plan.data.filter(item =>
              id ? item.id !== id : false
            )
            state.openOrderModule.plan.total = state.openOrderModule.plan.data.length
          })
        )
      },
      removeNormalOrder(id?: any) {
        set(
          produce((state: IBaseOrderSpotStore) => {
            state.openOrderModule.normal.data = state.openOrderModule.normal.data.filter(item =>
              id ? item.id !== id : false
            )
            state.openOrderModule.normal.total = state.openOrderModule.normal.data.length
          })
        )
      },
      removeStopOrder(id?: any) {
        set(
          produce((state: IBaseOrderSpotStore) => {
            state.openOrderModule.stop.data = state.openOrderModule.stop.data.filter(item =>
              id ? item.id !== id : false
            )
            state.openOrderModule.stop.total = state.openOrderModule.stop.data.length
          })
        )
      },
    },
    pairList: [] as {
      name: string
      id: any
    }[],
    subscribe() {
      // 因为是模块调用，不用担心空函数无法取消订阅
      if (subscribed) {
        return () => {}
      }
      if (!getIsLogin()) {
        return () => {}
      }
      const { createOnEntrustPush } = createOnWs(set, get)
      const unsubscribeFn = subscribeSpotOrders(createOnEntrustPush)
      subscribed = true
      return () => {
        subscribed = false
        unsubscribeFn()
      }
    },
    async fetchSingleModuleOpenOrders(
      { tradeId, entrustType }: { tradeId?: string; entrustType: EntrustTypeEnum } = {
        entrustType: EntrustTypeEnum.normal,
      }
    ) {
      if (!getIsLogin()) {
        return
      }

      const params = {
        pageSize: 1000 as any,
      }
      const res = await {
        [EntrustTypeEnum.normal]: querySpotNormalOpenOrderList,
        [EntrustTypeEnum.plan]: querySpotPlanOpenOrderList,
        [EntrustTypeEnum.stop]: getV1ProfitLossOrdersCurrentApiRequest,
      }[entrustType](params)
      const moduleName = {
        [EntrustTypeEnum.normal]: 'normal',
        [EntrustTypeEnum.plan]: 'plan',
        [EntrustTypeEnum.stop]: 'stop',
      }[entrustType]
      set(
        produce((draft: IBaseOrderSpotStore) => {
          draft.openOrderModule[moduleName] = {
            data: ((res.data && res.data.list) as any) || [],
            total: (res.data && res.data.total!) || 0,
          }
        })
      )
    },
    async fetchOpenOrders({ tradeId }: { tradeId?: string } = {}) {
      const state: IBaseOrderSpotStore = get()
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.normal })
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.plan })
      state.fetchSingleModuleOpenOrders({ tradeId, entrustType: EntrustTypeEnum.stop })
    },
    async fetchPairList() {
      const res = await getSymbolLabelInfo({})

      if (!res.isOk || !res.data) {
        return
      }
      set(
        produce((draft: IBaseOrderSpotStore) => {
          draft.pairList = ((res.data as any)?.list as YapiGetV1TradePairListData[]).map(item => {
            return {
              name: `${item.baseSymbolName}/${item.quoteSymbolName}`,
              id: item.id,
            }
          })
        })
      )
    },
    /** 订单枚举，从后端获取的数据字典 */
    orderEnums: {
      orderStatus: {
        codeKey: 'statusCode',
        enums: [],
      } as IStoreEnum,
      planOrderStatus: {
        codeKey: 'orderStatusCd',
        enums: [],
      } as IStoreEnum,
      orderStatusInFilters: {
        codeKey: 'web_SpotOrderStatusInFilters',
        enums: [],
      } as IStoreEnum,
      planOrderStatusInFilters: {
        codeKey: 'web_SpotTriggerOrderStatusInFilters',
        enums: [],
      } as IStoreEnum,
      orderDirection: {
        codeKey: 'sideInd',
        enums: [],
      } as IStoreEnum,
      // 和下面的这个区别是，限价，限价委托
      entrustType: {
        codeKey: 'web_SpotEntrustType',
        enums: [],
      } as IStoreEnum,
      entrustTypeWithSuffix: {
        codeKey: 'web_SpotEntrustTypeWithSuffix',
        enums: [],
      } as IStoreEnum,
      planEntrustTypeWithSuffix: {
        codeKey: 'web_SpotTriggerEntrustTypeWithSuffix',
        enums: [],
      } as IStoreEnum,
      stopEntrustTypeWithSuffix: {
        codeKey: 'web_SpotTriggerStopLossTypeWithSuffix',
        enums: [],
      } as IStoreEnum,
    },
    async fetchOrderEnums() {
      const state: IBaseOrderSpotStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.orderEnums).map(item => item.codeKey))
      set(
        produce((draft: IBaseOrderSpotStore) => {
          const items = Object.values(draft.orderEnums)
          items.forEach((item, index) => {
            item.enums = data[index].map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
  }
}
function getStore(set, get) {
  return {
    ...getBaseStore(set, get),
  }
}

const baseOrderSpotStore = create(getStore)

const useBaseOrderSpotStore = createTrackedSelector(baseOrderSpotStore)

export { useBaseOrderSpotStore, baseOrderSpotStore }
