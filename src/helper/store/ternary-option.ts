import { getOptionTradePairList } from '@/apis/ternary-option'
import { MarketListFuturesEnum } from '@/constants/market/market-list/futures-module'
import { baseTernaryOptionStore } from '@/store/ternary-option'

/** 获取期权默认币种 */
export async function fetchOptionDefaultCoin() {
  const res = await getOptionTradePairList({
    typeInd: MarketListFuturesEnum.perpetual,
  })
  if (!res.isOk || !res.data) return
  if (res.data.list?.[0]) {
    baseTernaryOptionStore.getState().updateDefaultCoin(res.data.list[0])
  }
}
