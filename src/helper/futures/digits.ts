import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { AssetsCurrencySettingsResp } from '@/typings/api/assets/futures'

export const USDT_SYMBOL = 'USDT'
export const USDT_FUTURE_DIGIT = 2

/**
 * 获取合约计价币展示精度
 * 在 usdt 时，写死为 2 位
 */
export function getFutureQuoteDisplayDigit(settings?: AssetsCurrencySettingsResp): number {
  if (!settings) {
    settings = baseAssetsFuturesStore.getState().futuresCurrencySettings
  }

  return settings?.currencySymbol === USDT_SYMBOL ? USDT_FUTURE_DIGIT : settings?.offset
}
