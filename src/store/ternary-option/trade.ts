import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import { TradeLayoutEnum } from '@/constants/trade'
import produce from 'immer'
import { fetchStoreEnums, mergeStateFromCache, setCacheTradeLayout } from '@/helper/store'
import { ITernaryOptionCoinDetail, ITernaryOptionTradeProfitRate } from '@/typings/api/ternary-option'
import {
  getTernaryOptionTradePageCache,
  setTernaryOptionTradePageCache,
  setTernaryOptionTradePageUserCache,
  getTernaryOptionTradePageUserCache,
} from '@/helper/cache/trade/option'
import { subscribeWithSelector } from 'zustand/middleware'
import { IStoreEnum } from '@/typings/store/common'
import { TernaryOptionTradeTabEnum } from '@/constants/ternary-option'

export type IOptionTradeStore = ReturnType<typeof getBaseStoreStore>

type IStore = ReturnType<typeof getStore>

function getSelectedProfitRateCacheKey(symbol: string, direction: string) {
  return `${symbol}_${direction}`
}

function getBaseStoreStore(set, get) {
  const baseState = {
    cacheData: {
      timeId: '' as any,
      // 是否需要教程
      needGuide: true,
      // 是否不需要三元期权引导
      notNeedOverTableGuide: false,
      // 不是第一次选择高级委托，默认 false，即是第一次
      notFirstCheckAdvance: false,
      preCoinCache: {} as ITernaryOptionCoinDetail,
      /** 常用的金额选项 */
      commonAmountOptions: [] as number[],
    },
    userCacheData: {
      // 涨超是否为表格
      overCallIsTable: false,
      // 选中的收益率
      selectedProfitRateCache: {} as Record<string, ITernaryOptionTradeProfitRate>,
    },
    toggleOverCallIsTable: () => {
      set(
        produce((draft: IStore) => {
          draft.userCacheData.overCallIsTable = !draft.userCacheData.overCallIsTable
        })
      )
    },
    setTimeId: (timeId: any) => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.timeId = timeId
        })
      )
    },
    setPreCoinCache: (coin: ITernaryOptionCoinDetail) => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.preCoinCache = coin
        })
      )
    },
    setNeedGuide: (needGuide: boolean) => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.needGuide = needGuide
        })
      )
    },
    setNotNeedOverTableGuide: (notNeedOverTableGuide: boolean) => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.notNeedOverTableGuide = notNeedOverTableGuide
        })
      )
    },
    setNotFirstCheckAdvance: () => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.notFirstCheckAdvance = true
        })
      )
    },
    setCommonAmountOptions: (commonAmountOptions: number[]) => {
      set(
        produce((draft: IStore) => {
          draft.cacheData.commonAmountOptions = commonAmountOptions
        })
      )
    },
    /** 是否已开启教程模式 */
    isTutorialMode: false,
    setIsTutorialMode: (value: boolean) => {
      set(
        produce((draft: IStore) => {
          draft.isTutorialMode = value
        })
      )
    },
    /** 教程中高级选项是否可见 */
    tutorialAdvancedVisible: false,
    setTutorialAdvancedVisible: (value: boolean) => {
      set(
        produce((draft: IStore) => {
          draft.tutorialAdvancedVisible = value
        })
      )
    },
    /** 教程中是否选中高级委托 */
    tutorialAdvancedChecked: false,
    setTutorialAdvancedChecked: (value: boolean) => {
      set(
        produce((draft: IStore) => {
          draft.tutorialAdvancedChecked = value
        })
      )
    },
    setSelectedProfitRateCache: (value: ITernaryOptionTradeProfitRate, symbol: string, direction: string) => {
      set(
        produce((draft: IStore) => {
          draft.userCacheData.selectedProfitRateCache[getSelectedProfitRateCacheKey(symbol, direction)] = value
        })
      )
    },
    getSelectedProfitRateCache: (symbol: string, direction: string) => {
      return get().userCacheData.selectedProfitRateCache[getSelectedProfitRateCacheKey(symbol, direction)] as
        | ITernaryOptionTradeProfitRate
        | undefined
    },
    /** 发现这个更新后就重置为当前持仓，用于下单后 */
    myTradeActiveTabCounter: 0,
    updateMyTradeActiveTabCounter: () => {
      set(
        produce((draft: IStore) => {
          draft.myTradeActiveTabCounter += 1
        })
      )
    },
    tradeEnums: {
      /** 常用时间枚举 */
      amountOptions: {
        codeKey: 'option_common_amount',
        enums: [],
        getDefault() {
          const amountList = [10, 20, 50, 100, 80, 200, 400, 600, 800]
          return amountList.map(item => {
            return {
              label: item.toString(),
              value: item,
            }
          })
        },
      } as IStoreEnum,
    },
    updateTradeEnums(enums: Record<string, IStoreEnum>) {
      set((draft: IOptionTradeStore) => {
        const state: IOptionTradeStore = {
          ...draft,
          tradeEnums: enums as any,
        }

        return state
      })
    },
    setDefaultEnums() {
      // 规避初始化时，多语言无法载入的问题
      const state: IOptionTradeStore = get()
      state.updateTradeEnums(
        produce(state.tradeEnums, draft => {
          const items = Object.values(draft)
          items.forEach(item => {
            item.enums = item.getDefault?.() || []
          })
        })
      )
    },
    async fetchTradeEnums() {
      const state: IOptionTradeStore = get()
      const data = await fetchStoreEnums(state.tradeEnums)
      state.updateTradeEnums(data)
    },
    // 以下给期权 k 线同步使用
    optionBuyCallback(value) {},
    updateOptionBuyCallback: (newOptionBuyCallback: () => void) =>
      set(
        produce((state: IStore) => {
          state.optionBuyCallback = newOptionBuyCallback
        })
      ),
    optionSellCallback(value) {},
    updateOptionSellCallback: (newOptionSellCallback: () => void) =>
      set(
        produce((state: IStore) => {
          state.optionSellCallback = newOptionSellCallback
        })
      ),
    tradeRestSecond: 0,
    updateTradeRestSecond: (newTradeRestSecond: number) =>
      set(
        produce((state: IStore) => {
          state.tradeRestSecond = newTradeRestSecond
        })
      ),
    countDownComponent(value) {},
    updateCountDownComponent: newCountDownComponent =>
      set(
        produce((state: IStore) => {
          state.countDownComponent = newCountDownComponent
        })
      ),
    optionActiveTab: TernaryOptionTradeTabEnum.normal,
    updateOptionActiveTab: (newOptionActiveTab: TernaryOptionTradeTabEnum) =>
      set(
        produce((state: IStore) => {
          state.optionActiveTab = newOptionActiveTab
        })
      ),
  }
  mergeStateFromCache(baseState, {
    ...getTernaryOptionTradePageCache(),
    ...getTernaryOptionTradePageUserCache(),
  })
  return baseState
}
function getStore(set, get) {
  return {
    ...getBaseStoreStore(set, get),
  }
}

const baseOptionTradeStore = create(subscribeWithSelector(getStore))
const useOptionTradeStore = createTrackedSelector(baseOptionTradeStore)
baseOptionTradeStore.subscribe(
  state => ({
    cacheData: state.cacheData,
    userCacheData: state.userCacheData,
  }),
  ({ cacheData, userCacheData }) => {
    setTernaryOptionTradePageCache({
      cacheData,
    })
    setTernaryOptionTradePageUserCache({
      userCacheData,
    })
  }
)
export { useOptionTradeStore, baseOptionTradeStore }
