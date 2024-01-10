import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { ITernaryOptionCoinDetail } from '@/typings/api/ternary-option'
import { TernaryTradePair } from '@/typings/api/ternary-option/market'

export type ITernaryOptionStore = ReturnType<typeof getBaseStoreStore>

type IStore = ReturnType<typeof getStore>

export const ternaryOptionInitCoin: ITernaryOptionCoinDetail = {
  id: '',
  symbol: 'BTCUSD',
  last: '334344',
  coinSymbol: 'USDT',
  minAmount: '13',
} as ITernaryOptionCoinDetail
function getBaseStoreStore(set, get) {
  const baseState = {
    defaultCoin: {} as ITernaryOptionCoinDetail,
    updateDefaultCoin: (data: ITernaryOptionCoinDetail) => {
      set(
        produce((draft: IStore) => {
          draft.defaultCoin = data
        })
      )
    },
    /** 当前币种信息 */
    currentCoin: ternaryOptionInitCoin as ITernaryOptionCoinDetail,
    /** 不带价格的币种信息，避免多次更新 */
    currentCoinExcludePrice: {} as ITernaryOptionCoinDetail,
    updateCurrentCoin: (newCurrentCoin: Partial<ITernaryOptionCoinDetail>) =>
      // produce 会冻结某些属性导致读取报错
      set((state: IStore) => {
        // id 不一样、之前没有杠杆、指定的属性数据不一样
        const shouldUpdateExcludePriceProps = []
        const shouldUpdateExcludePrice =
          newCurrentCoin.id !== state.currentCoinExcludePrice.id ||
          shouldUpdateExcludePriceProps.some(prop => newCurrentCoin[prop] !== state.currentCoinExcludePrice[prop])

        return {
          ...state,
          currentCoinExcludePrice: !shouldUpdateExcludePrice ? state.currentCoinExcludePrice : newCurrentCoin,
          currentCoin: {
            ...state.currentCoin,
            ...newCurrentCoin,
          },
        }
      }),

    /** 所有的币对 */
    allTradePairs: [] as TernaryTradePair[],
    updateAllTradePairs(data: TernaryTradePair[]) {
      set(
        produce((state: IStore) => {
          state.allTradePairs = data
        })
      )
    },

    isPageScrolling: false,
    setIsPageScrolling: (isScroll: boolean) => {
      set(
        produce((state: IStore) => {
          state.isPageScrolling = isScroll
        })
      )
    },
  }

  return baseState
}
function getStore(set, get) {
  return {
    ...getBaseStoreStore(set, get),
  }
}

const baseTernaryOptionStore = create(getStore)
const useTernaryOptionStore = createTrackedSelector(baseTernaryOptionStore)

export { useTernaryOptionStore, baseTernaryOptionStore }
