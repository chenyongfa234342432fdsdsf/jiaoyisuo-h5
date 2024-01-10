/**
 * 合约组详情 - 持仓详情列表
 */
import { t } from '@lingui/macro'
import { Button } from '@nbit/vant'
import { useMemoizedFn, useUnmount, useUpdateEffect } from 'ahooks'
import {
  getLatestPriceProfits,
  onChangePositionData,
  onChangePositionListData,
  onGetMarkPriceSubs,
} from '@/helper/assets/futures'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import CommonList from '@/components/common-list/list'
import { WsTypesEnum } from '@/constants/ws'
import { FuturesAccountTypeEnum, StopLimitTriggerPriceTypeEnum } from '@/constants/assets/futures'
import { useFutureTradeStore } from '@/store/trade/future'
import { useState } from 'react'
import { useCommonStore } from '@/store/common'
import { PositionCell, PositionCellPageTypeEnum } from '../common/position-cell'

function PositionList({ onLoadList, onCloseAccount }: { onLoadList: () => void; onCloseAccount: () => void }) {
  const { isFusionMode } = useCommonStore()
  const {
    futuresDetails: { details },
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    wsDealSubscribe,
    wsDealUnSubscribe,
    positionSymbolWassNameList,
    positionListFutures: positionList,
    updatePositionListFutures,
  } = useAssetsFuturesStore()
  const { isTutorialMode } = useFutureTradeStore()
  // 未实现盈亏点开弹窗可切换价格基准：标记价格/最新价格
  const [priceType, setPriceType] = useState(StopLimitTriggerPriceTypeEnum.mark)
  // 是否选中最新价格
  const isLatestPriceSelected = priceType === StopLimitTriggerPriceTypeEnum.new

  /**
   * 标记价格推送回调
   */
  const onMarkPriceWsCallBack = useMemoizedFn((data: PerpetualIndexPrice[]) => {
    onChangePositionData(data, details?.groupId)
  })

  /**
   * 最新价格推送回调
   */
  const onDealPriceWsCallBack = useMemoizedFn(data => {
    if (!data || data.length === 0) return
    const newList = onChangePositionListData(data, positionList)
    updatePositionListFutures(newList)
  })

  useUpdateEffect(() => {
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)
    !isTutorialMode && wsMarkPriceSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)
    wsDealUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
    !isTutorialMode && wsDealSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
  }, [positionSymbolWassNameList, isTutorialMode])

  useUnmount(() => {
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)
    wsDealUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
    updatePositionListFutures([])
  })

  return (
    <CommonList
      finished
      showEmpty={positionList.length === 0}
      listChildren={positionList.map((item, i) => {
        return (
          <PositionCell
            showUnit={!isFusionMode}
            key={i}
            onRefreshing={onLoadList}
            type={PositionCellPageTypeEnum.details}
            idFirst={i === 0}
            priceType={priceType}
            setPriceType={setPriceType}
            data={{
              ...item,
              ...(isLatestPriceSelected && getLatestPriceProfits(item)),
            }}
          />
        )
      })}
      emptyText={
        <div className="flex flex-col items-center">
          <div>{t`features_assets_futures_futures_details_position_list_aukwlfkrhj`}</div>
          {details?.accountType === FuturesAccountTypeEnum.immobilization && (
            <Button type="primary" className="mt-4 font-medium" onClick={onCloseAccount}>
              {t`features_assets_futures_futures_details_position_list_uebz9uswyd`}
            </Button>
          )}
        </div>
      }
    />
  )
}

export { PositionList }
