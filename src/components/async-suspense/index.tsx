import React, { useEffect, useState } from 'react'
import { Loading } from '@nbit/vant'
import { envIsServer } from '@/helper/env'

interface AsyncSuspenseProps {
  /** 是否需要 loading 此属性为不添加 loading */
  hasLoading?: boolean
  /** 子组件 */
  children: React.ReactNode
}

function AsyncSuspense({ hasLoading = false, children }: AsyncSuspenseProps) {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  if (envIsServer) {
    return (
      <div className="w-full flex justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <React.Suspense
      fallback={
        !hasLoading ? null : (
          <div className="w-full flex justify-center">
            <Loading />
          </div>
        )
      }
    >
      {children}
    </React.Suspense>
  )
}
export default AsyncSuspense
