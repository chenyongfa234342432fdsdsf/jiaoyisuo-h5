import { useEffect } from 'react'
import { useMemoizedFn } from 'ahooks'
import { getFuturesPositionList } from '@/helper/assets/futures'
import { getIsLogin } from '@/helper/auth'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetail'
import { useAssetsFuturesStore } from '@/store/assets/futures'

/**
 * 获取仓位变动推送，更新当前持仓列表
 */
export const useGetWsPositionChange = () => {
  const isLogin = getIsLogin()
  const { wsPerpetualGroupDetailSubscribe, wsPerpetualGroupDetailUnSubscribe } = useAssetsFuturesStore()

  const onWsCallBack = useMemoizedFn((data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0) getFuturesPositionList()
  })

  useEffect(() => {
    if (!isLogin) return
    wsPerpetualGroupDetailSubscribe(onWsCallBack)

    return () => {
      wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
    }
  }, [isLogin])
}
