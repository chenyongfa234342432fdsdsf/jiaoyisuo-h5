/**
 * 合约 - 当前持仓列表组件
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getPerpetualPositionCurrentList } from '@/apis/assets/futures/position'
import { useContractMarketStore } from '@/store/market/contract'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import { useMemoizedFn, useUnmount, useUpdateEffect } from 'ahooks'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'
import {
  onChangePositionData,
  onGetMarkPriceSubs,
  onFilterSymbolWassName,
  onChangePositionListData,
  getLatestPriceProfits,
} from '@/helper/assets/futures'
import { Toast } from '@nbit/vant'
import { PositionList } from '@/typings/api/assets/futures'
import { useOnPageRefresh } from '@/hooks/use-on-page-refresh'
import { WsTypesEnum } from '@/constants/ws'
import { FuturesPositionViewTypeEnum, StopLimitTriggerPriceTypeEnum } from '@/constants/assets/futures'
import futuresPositionList from '@/helper/assets/json/futuresPositionList.json'
import { useFutureTradeStore } from '@/store/trade/future'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { PositionCell } from '../position-cell'
import styles from './index.module.css'

interface IFuturesPositionListProps {
  viewVisible?: boolean
  visible?: boolean
}
function FuturesPositionList(props: IFuturesPositionListProps) {
  const { viewVisible, visible = true } = props || {}
  const { symbolName = '', id } = useContractMarketStore().currentCoin
  const {
    assetsFuturesSetting,
    positionListFutures,
    updateAssetsFuturesSetting,
    updatePositionListFutures,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    wsDealSubscribe,
    wsDealUnSubscribe,
    positionSymbolWassNameList,
  } = useAssetsFuturesStore()
  const { isTutorialMode = false } = useFutureTradeStore()
  const [finished, setFinished] = useState(false)
  // 未实现盈亏点开弹窗可切换价格基准：标记价格/最新价格
  const [priceType, setPriceType] = useState(StopLimitTriggerPriceTypeEnum.mark)
  // 是否选中最新价格
  const isLatestPriceSelected = priceType === StopLimitTriggerPriceTypeEnum.new

  const positionList = positionListFutures
    .sort((a, b) => {
      return a.symbol === symbolName && b.symbol !== symbolName
        ? -1
        : b.symbol === symbolName && a.symbol !== symbolName
        ? 1
        : 0
    })
    .map((item: any) => {
      return !!(assetsFuturesSetting.hideOthers ? symbolName.toUpperCase() === item.symbol.toUpperCase() : true)
    })

  /**
   * 查询持仓列表
   */
  const onLoadList = async () => {
    const res = isTutorialMode ? (futuresPositionList as any) : await getPerpetualPositionCurrentList({})
    const { isOk, data, message = '' } = res || {}

    if (!isOk) {
      Toast.info(message)
      setFinished(true)
      return
    }

    if (data?.list && data?.list.length > 0) onFilterSymbolWassName(data?.list)
    updatePositionListFutures(data?.list)
    setFinished(true)
  }
  useOnPageRefresh(onLoadList)

  /**
   * 标记价格推送回调
   */
  const onMarkPriceWsCallBack = useMemoizedFn((data: PerpetualIndexPrice[]) => {
    onChangePositionData(data)
  })

  /**
   * 最新价格推送回调
   */
  const onDealPriceWsCallBack = useMemoizedFn(data => {
    if (!data || data.length === 0) return
    const newList = onChangePositionListData(data, positionListFutures)
    updatePositionListFutures(newList)
  })

  useEffect(() => {
    fetchAndUpdateUserInfo()
  }, [])

  useUpdateEffect(() => {
    onLoadList()
  }, [isTutorialMode])

  useUpdateEffect(() => {
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)
    !isTutorialMode &&
      visible &&
      wsMarkPriceSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)

    wsDealUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
    !isTutorialMode && visible && wsDealSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
  }, [positionSymbolWassNameList, isTutorialMode])

  useUpdateEffect(() => {
    if (!positionListFutures || positionListFutures.length === 0) return

    const otherList =
      positionListFutures.filter((item: PositionList) => {
        return item?.tradeId !== id
      }) || []
    const currentList =
      positionListFutures.filter((item: PositionList) => {
        return item.tradeId === id
      }) || []
    updatePositionListFutures(currentList.concat(otherList))
  }, [id])

  useUnmount(() => {
    wsMarkPriceUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualIndex), onMarkPriceWsCallBack)
    wsDealUnSubscribe(onGetMarkPriceSubs(WsTypesEnum.perpetualDeal), onDealPriceWsCallBack)
    updatePositionListFutures([])
  })

  if (!visible) return null

  return (
    <div className={styles['futures-position-list-root']}>
      {viewVisible && (
        <div className="header">
          <div
            className="filter-wrap"
            onClick={() => updateAssetsFuturesSetting({ hideOthers: !assetsFuturesSetting.hideOthers })}
          >
            <Icon
              className="hide-icon"
              name={assetsFuturesSetting.hideOthers ? 'login_agreement_selected' : 'login_agreement_unselected'}
            />

            <span>{t`features_assets_futures_common_futures_position_list_index_5101425`}</span>
          </div>

          <Icon
            name="account_model"
            hasTheme
            className={`modal-icon ${GUIDE_ELEMENT_IDS_ENUM.futureTradePositionSwitchView}`}
            onClick={() =>
              updateAssetsFuturesSetting({
                positionViewType: FuturesPositionViewTypeEnum.account,
              })
            }
          />
        </div>
      )}

      <CommonList
        finished={finished}
        onlyRefresh={isTutorialMode}
        onLoadMore={onLoadList}
        showEmpty={positionListFutures.length === 0}
        emptyClassName="empty"
        listChildren={positionListFutures.map((item: any, index: number) => {
          if (!positionList[index]) {
            return
          }

          return (
            <PositionCell
              priceType={priceType}
              setPriceType={setPriceType}
              key={index}
              data={{
                ...item,
                ...(isLatestPriceSelected && getLatestPriceProfits(item)),
              }}
              onRefreshing={onLoadList}
            />
          )
        })}
      />
    </div>
  )
}

export { FuturesPositionList }
