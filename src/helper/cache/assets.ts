import { IFuturesPositionListForm } from '@/features/assets/overview/list/futures/futures-list/list-layout'
import cacheUtils from 'store'

/** 资产 - 合约相关本地设置 */
export const ASSETS_FUTURES_SETTING = 'ASSETS_FUTURES_SETTING'
export function getAssetsFuturesSettingCache() {
  return cacheUtils.get(ASSETS_FUTURES_SETTING)
}
export function setAssetsFuturesSettingCache(data: any) {
  return cacheUtils.set(ASSETS_FUTURES_SETTING, data)
}

/** 资产 - 合约账户列表表单 */
export const ASSETS_FUTURES_ACCOUNT_LIST_FORM = 'ASSETS_FUTURES_ACCOUNT_LIST_FORM'
export function getAssetsFuturesAccountListFormCache() {
  return cacheUtils.get(ASSETS_FUTURES_ACCOUNT_LIST_FORM)
}

export function setAssetsFuturesAccountListFormCache(data: IFuturesPositionListForm) {
  return cacheUtils.set(ASSETS_FUTURES_ACCOUNT_LIST_FORM, data)
}
/** 资产 - 充提币 - 币种选择搜索历史 */
export const ASSETS_DEPOSIT_COIN_HISTORY = 'ASSETS_DEPOSIT_COIN_HISTORY'
export function getAssetsDepositCoinHistoryCache() {
  return cacheUtils.get(ASSETS_DEPOSIT_COIN_HISTORY)
}
export function setAssetsDepositCoinHistoryCache(data: any) {
  return cacheUtils.set(ASSETS_DEPOSIT_COIN_HISTORY, data)
}
