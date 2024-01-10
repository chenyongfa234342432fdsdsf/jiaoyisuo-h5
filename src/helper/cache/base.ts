import { baseUserStore } from '@/store/user'
import cacheUtils from 'store'

/** 获取用户账户缓存数据 */
export function getCacheWithUser(key: string) {
  const { isLogin, userInfo } = baseUserStore.getState()
  const info = cacheUtils.get(key) || {}

  return info[isLogin ? userInfo.uid : '']
}

/** 缓存用户账号数据 */
export function setCacheWithUser(key: string, info: any) {
  const { isLogin, userInfo } = baseUserStore.getState()

  const cache = cacheUtils.get(key) || {}
  cache[isLogin ? userInfo.uid : ''] = info
  cacheUtils.set(key, cache)
}
