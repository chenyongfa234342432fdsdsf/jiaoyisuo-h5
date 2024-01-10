import { baseCommonStore } from '@/store/common'
import { setIsWebClipCache } from '@/helper/cache/common'

export function IsWebClip(pageContext: PageContext) {
  const { urlParsed } = pageContext
  const { isWebClip: isApp } = baseCommonStore.getState()
  const { search } = urlParsed

  const isWebClip = !!search?.isWebClip

  !isApp && setIsWebClipCache(isWebClip)
}
