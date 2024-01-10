import { getV1GuideMapH5GetApiRequest } from '@/apis/layout'
import { link } from '@/helper/link'
import { getHomePageRoutePath } from '@/helper/route'
import { useLayoutStore } from '@/store/layout'
import { useEffect, useState } from 'react'

function useGuidePageInfo() {
  const { setGuidePageBasicWebInfo } = useLayoutStore()
  useEffect(() => {
    getV1GuideMapH5GetApiRequest()
      .then(res => {
        if (res.isOk) {
          const formatted = res.data.reduce((p, c) => {
            const key = Object.keys(c)[0]
            const value = c[key]
            p[key] = value
            return p
          }, {})
          setGuidePageBasicWebInfo(formatted)
        } else link(getHomePageRoutePath())
      })
      // redirect to home-page on api error
      .catch(() => link(getHomePageRoutePath()))
  }, [])
}

export default useGuidePageInfo
