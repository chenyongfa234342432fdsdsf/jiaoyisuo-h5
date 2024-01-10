import { create } from 'zustand'
import produce from 'immer'
import { createTrackedSelector } from 'react-tracked'
import { getSeenNoticeIdsCache, setSeenNoticeIdsCache } from '@/helper/cache'

type IStore = ReturnType<typeof getStore>

const seenNoticeIdsCache = getSeenNoticeIdsCache()

function getStore(set) {
  return {
    seenNoticeIdsCache: seenNoticeIdsCache || [],
    setSeenNoticeId: (id: string) =>
      set(
        produce((draft: IStore) => {
          const prevIds = draft.seenNoticeIdsCache
          const exist = prevIds.includes(id)
          if (!exist) {
            const newIds = [...prevIds, id]
            setSeenNoticeIdsCache(newIds)
            draft.seenNoticeIdsCache = newIds
          }
        })
      ),
  }
}

const baseAnnouncementStore = create(getStore)
const useAnnouncementStore = createTrackedSelector(baseAnnouncementStore)

export { useAnnouncementStore, baseAnnouncementStore }
