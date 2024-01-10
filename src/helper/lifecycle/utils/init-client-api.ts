import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import { getCoinRateData } from '@/helper/assets/spot'
import { getFuturesDefaultTradePair } from '@/constants/market/market-list'
import { baseGuideMapStore } from '@/store/server'

export function initClientApi() {
  getCoinRateData()
  getFuturesCurrencySettings()
  getFuturesDefaultTradePair()
  // 获取 引导图接口
  baseGuideMapStore.getState().fetchGuideMapQueryAll()
}
