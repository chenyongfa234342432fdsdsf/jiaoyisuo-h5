import { baseCommonStore } from '@/store/common'
import { setIsVestBagCache } from '@/helper/cache/common'

export function IsVestBag(pageContext: PageContext) {
  const { urlParsed } = pageContext
  const { isVestBag: isVestBagApp } = baseCommonStore.getState()
  const { search } = urlParsed

  const isVestBag = !!search?.isTabBar

  !isVestBagApp && setIsVestBagCache(isVestBag)
}
