import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getFutureQuoteDisplayDigit } from '@/helper/futures/digits'

/**
 * 获取合约计价币展示精度
 * 在 usdt 时，写死为 2 位
 */
export function useFutureQuoteDisplayDigit(): number {
  return getFutureQuoteDisplayDigit(useAssetsFuturesStore().futuresCurrencySettings)
}
