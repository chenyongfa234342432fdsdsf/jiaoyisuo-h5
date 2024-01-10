import { useEffect, useLayoutEffect } from 'react'
import { setHomeTableFavTabToCache, setHomeTableSelectedTabToCache } from '@/helper/cache'
import { useMarketListStore } from '@/store/market/market-list'
import { getUserPageDefaultDescribeMeta } from '@/helper/user'
import { UserModuleDescribeKeyEnum } from '@/constants/user'
import { t } from '@lingui/macro'
import HomePage from '@/features/front-page'

function Page() {
  return <HomePage />
}

async function onBeforeRender() {
  return {
    pageContext: {
      layoutParams: {
        footerShow: false, // 是否需要 footer
        headerShow: false,
        disableTransition: true,
        documentProps: getUserPageDefaultDescribeMeta(t`components/footer/index-0`, UserModuleDescribeKeyEnum.default),
      },
    },
  }
}

export { Page, onBeforeRender }
