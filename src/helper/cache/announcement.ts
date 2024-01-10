import cacheUtils from 'store'

// 缓存公告中心的公告id，点了就不重复弹弹窗
export const seenNoticeIdsCache = 'seenNoticeIdsCache'

export function setSeenNoticeIdsCache(ids: string[]) {
  return cacheUtils.set(seenNoticeIdsCache, ids)
}

export function getSeenNoticeIdsCache() {
  return cacheUtils.get(seenNoticeIdsCache)
}
