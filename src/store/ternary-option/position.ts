/**
 * 三元期权 - 当前持仓
 */
import produce from 'immer'
import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import { subscribeWithSelector } from 'zustand/middleware'
import { IOptionPositionList } from '@/typings/api/ternary-option/position'
import { IStoreEnum } from '@/typings/store/common'
import { TernaryOptionDictionaryEnum } from '@/constants/ternary-option'
import { getCodeDetailListBatch } from '@/apis/common'
import ws from '@/plugins/ws/option'
import lodash from 'lodash'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@nbit/chart-utils'
import { YapiGetV1OptionOrdersHistoryListData } from '@/typings/yapi/OptionOrdersHistoryV1GetApi'
import { getOptionOrdersHistory } from '@/apis/ternary-option/order'
import { OptionOrder_Body } from '@/plugins/ws/protobuf/ts/proto/OptionOrder'
import { OptionMarket } from '@/plugins/ws/protobuf/ts/proto/OptionMarket'

type IStore = ReturnType<typeof getStore>

export const defaultUserAssetsFutures = {
  availableBalanceValue: '0', // 可用保证金 - 根据设置的保证金币种折算
}

function getStore(set, get) {
  return {
    /** 当前持仓列表 */
    positionList: [] as IOptionPositionList[],
    updateOptionPositionList: (newPositionList: IOptionPositionList[]) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.positionList = newPositionList
        })
      })
    },
    /** 结算后状态发生变化列表 */
    settlementList: [] as YapiGetV1OptionOrdersHistoryListData[],
    updateSettlementList: async (newPositionList: (OptionOrder_Body & Partial<Record<'id', string>>)[]) => {
      const positionList = newPositionList
        ?.filter(item => item?.orderState === 'complete')
        ?.map(item => {
          item.id = item.orderId
          return item
        })
      const stores: IStore = get()

      if (positionList?.length > 0) {
        const settlementOptionList = [...stores.settlementList, ...positionList]
        const { isOk, data } = await getOptionOrdersHistory({
          pageNum: '1',
          pageSize: String(settlementOptionList?.length),
        })
        set((store: IStore) => {
          if (isOk) {
            const commonList = lodash.intersectionBy(data?.list, settlementOptionList, 'id')
            return produce(store, _store => {
              _store.settlementList = [...commonList]
            })
          }
        })
      }
    },
    clearSettlementList: () =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.settlementList = []
        })
      }),
    /** 持仓 symbol */
    positionSymbolList: [] as string[],
    updatePositionSymbolList: (value: string[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.positionSymbolList = value
        })
      }),
    /** 三元期权数据字典 */
    optionDictionaryEnums: {
      /** 价格取值来源 */
      optionsPriceSourceEnum: {
        codeKey: TernaryOptionDictionaryEnum.optionsPriceSource,
        enums: [],
      } as IStoreEnum,
      /** 结算周期 */
      productPeriodCdEnum: {
        codeKey: TernaryOptionDictionaryEnum.productPeriodCd,
        enums: [],
      } as IStoreEnum,
      /** 涨跌方向 */
      optionsSideIndEnum: {
        codeKey: TernaryOptionDictionaryEnum.optionsSideInd,
        enums: [],
      } as IStoreEnum,
      /** 数据来源 */
      optionsSourceEnum: {
        codeKey: TernaryOptionDictionaryEnum.optionsSource,
        enums: [],
      } as IStoreEnum,
    },
    /** 三元期权数据字典 */
    async fetchOptionDictionaryEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.optionDictionaryEnums).map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.optionDictionaryEnums)
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
    /** 三元期权订单状态推送 */
    wsOptionOrderSubscribe: callback => {
      ws.subscribe({
        subs: { biz: WsBizEnum.option, type: WsTypesEnum.optionOrder },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.cover,
        callback,
      })
    },
    wsOptionOrderUnSubscribe: callback => {
      ws.unsubscribe({
        subs: { biz: WsBizEnum.option, type: WsTypesEnum.optionOrder },
        callback,
      })
    },
    /** 24 小时行情价格推送 */
    wsMarkPriceCallback: (markPriceData: OptionMarket) => {
      const state: IStore = get()
      set((store: IStore) => {
        return produce(store, _store => {
          markPriceData = markPriceData[0]

          const newPositionList = state.positionList.map((item: IOptionPositionList) =>
            item.symbol === markPriceData.symbol ? { ...item, currentPrice: markPriceData?.last } : item
          )
          _store.positionList = newPositionList
        })
      })
    },
    wsMarkPriceSubscribe: subs => {
      const state: IStore = get()
      ws.subscribe({
        subs,
        throttleTime: WsThrottleTimeEnum.Medium,
        throttleType: WSThrottleTypeEnum.cover,
        callback: state.wsMarkPriceCallback,
      })
    },
    wsMarkPriceUnSubscribe: subs => {
      const state: IStore = get()
      ws.unsubscribe({
        subs,
        callback: state.wsMarkPriceCallback,
      })
    },
  }
}

const baseOptionPositionStore = create(subscribeWithSelector(getStore))

const useOptionPositionStore = createTrackedSelector(baseOptionPositionStore)

export { useOptionPositionStore, baseOptionPositionStore }
