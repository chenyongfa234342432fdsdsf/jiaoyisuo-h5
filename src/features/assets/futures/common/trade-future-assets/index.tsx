/**
 * 合约 - 资产列表
 */
import { useEffect, useState } from 'react'
import { Toast } from '@nbit/vant'
import { TradeAssetsList } from '@/features/assets/futures/common/trade-future-assets/trade-assets-list'
import { getPerpetualGroupMarginList } from '@/apis/assets/futures/overview'
import { getFuturesCurrencySettings, onGetPerpetualMarginSettings } from '@/helper/assets/futures'
import { useFutureTradeStore } from '@/store/trade/future'
import { DetailMarginListChild } from '@/typings/api/assets/futures'
import { useMemoizedFn, useUnmount } from 'ahooks'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetail'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useOnPageRefresh } from '@/hooks/use-on-page-refresh'
import { link } from '@/helper/link'
import { getAssetsFuturesTransferPageRoutePath } from '@/helper/route'
import styles from './index.module.css'

function TradeFuturesAssets(props: { needRefresh?: boolean }) {
  const { needRefresh = false } = props
  const { wsPerpetualGroupDetailSubscribe, wsPerpetualGroupDetailUnSubscribe } = useAssetsFuturesStore()

  const { currentFutureGroup } = useFutureTradeStore()
  const groupId = currentFutureGroup?.groupId

  const [assetsList, setAssetsList] = useState<DetailMarginListChild[]>([])
  const [baseCoin, setBaseCoin] = useState<string>('')

  /**
   * 获取合约资产列表
   */
  const getAssetsList = async (id: string) => {
    const res = await getPerpetualGroupMarginList({ groupId: id })
    const { isOk, data, message = '' } = res || {}
    if (isOk && data) {
      setAssetsList(data.list)
      setBaseCoin(data.baseCoin)
    } else {
      Toast.info(message)
    }
  }
  useOnPageRefresh(() => {
    if (groupId) {
      getAssetsList(groupId)
    }
  })

  /**
   * 合约组详情推送回调
   */
  const onWsCallBack = useMemoizedFn((data: PerpetualGroupDetail[]) => {
    if (data && data.length > 0 && groupId) {
      getAssetsList(groupId)
    }
  })

  useEffect(() => {
    getFuturesCurrencySettings()
    onGetPerpetualMarginSettings()
    wsPerpetualGroupDetailSubscribe(onWsCallBack)
  }, [])

  useUnmount(() => {
    wsPerpetualGroupDetailUnSubscribe(onWsCallBack)
  })

  useEffect(() => {
    if (!groupId) {
      setAssetsList([])
      return
    }
    if (needRefresh) {
      getAssetsList(groupId)
    }
  }, [groupId, needRefresh])

  return (
    <div className={styles['futures-assets-wrapper']}>
      <TradeAssetsList
        list={assetsList}
        baseCoin={baseCoin}
        onClick={(type: string, params?: DetailMarginListChild) =>
          link(getAssetsFuturesTransferPageRoutePath({ groupId: groupId || '', type, symbol: params?.symbol }))
        }
      />
    </div>
  )
}

export { TradeFuturesAssets }
