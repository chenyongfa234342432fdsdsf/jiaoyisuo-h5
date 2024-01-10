import { cloneDeep, pick } from 'lodash'
import cacheUtils from 'store'
import type { IOptionTradeStore } from '@/store/ternary-option/trade'
import { getCacheWithUser, setCacheWithUser } from '../base'

const tradePageKey = 'TERNARY_OPTION_TRADE_PAGE_SETTINGS_KEY'
const tradePageUserKey = 'TERNARY_OPTION_TRADE_PAGE_USER_SETTINGS_KEY'

export function getTernaryOptionTradePageCache() {
  return (cacheUtils.get(tradePageKey) || {}) as Pick<IOptionTradeStore, 'cacheData'>
}
export function setTernaryOptionTradePageCache(settings: Partial<IOptionTradeStore>) {
  // 加 cloneDeep 是为了解决 proxy 对象被撤回的问题，原因可能是 cache 内部有其它延时实现
  return cacheUtils.set(tradePageKey, pick(cloneDeep(settings), ['cacheData']))
}

export function getTernaryOptionTradePageUserCache() {
  return (getCacheWithUser(tradePageUserKey) || {}) as Pick<IOptionTradeStore, 'userCacheData'>
}

export function setTernaryOptionTradePageUserCache(settings: Partial<IOptionTradeStore>) {
  return setCacheWithUser(tradePageUserKey, pick(cloneDeep(settings), ['userCacheData']))
}
