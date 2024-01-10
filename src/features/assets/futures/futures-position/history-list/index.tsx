/**
 * 合约 - 历史仓位
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import CommonList from '@/components/common-list/list'
import { useEffect, useState } from 'react'
import { TypeSelectModal } from '@/features/assets/common/type-select-modal'
import { getTextFromStoreEnums } from '@/helper/store'
import { useMemoizedFn, useUnmount, useUpdateEffect } from 'ahooks'
import { postPerpetualPositionHistoryList } from '@/apis/assets/futures/position'
import { requestWithLoading } from '@/helper/order'
import { ClosePositionHistory } from '@/plugins/ws/protobuf/ts/proto/ClosePositionHistory'
import { FuturesPositionHistoryCell } from '../history-cell'
import { HistoryPositionTradeList } from '../trade-list'
import styles from './index.module.css'

function FuturesPositionHistory() {
  const { futuresPosition, futuresEnums, updateFuturesPosition } = useAssetsFuturesStore() || {}
  const {
    historyForm,
    historyFinished,
    historyPositionList,
    wsClosePositionHistorySubscribe,
    wsClosePositionHistoryUnSubscribe,
  } = futuresPosition || {}
  const [typeVisible, setTypeVisible] = useState(false)
  const [futuresVisible, setFuturesVisible] = useState(false)
  const [pageNum, setPageNum] = useState(1)

  const onLoadHistory = async (isRefresh?: boolean) => {
    const params = {
      ...historyForm,
      symbol: historyForm.tradeInfo?.symbolName || '',
      pageNum: isRefresh ? 1 : pageNum,
      pageSize: 20,
    }

    delete params.tradeInfo
    if (!params.symbol) delete params.symbol
    if (!params.operationTypeCd) delete params.operationTypeCd

    const res = await postPerpetualPositionHistoryList(params)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      updateFuturesPosition({ historyFinished: true })
      return
    }

    const nList = isRefresh ? data.list : [...historyPositionList, ...data.list]
    updateFuturesPosition({ historyFinished: nList.length >= +data?.total, historyPositionList: nList })
    setPageNum(isRefresh ? 1 : pageNum + 1)
  }

  /**
   * 历史仓位变动推送回调
   */
  const onClosePositionHistoryWsCallBack = useMemoizedFn((data: ClosePositionHistory[]) => {
    if (!data || data.length === 0) return

    const { closePositionTime, symbol, type } = data[0] || {}
    const { startTime, endTime, tradeInfo, operationTypeCd } = historyForm || {}
    if (
      +closePositionTime >= startTime &&
      +closePositionTime <= endTime &&
      (!tradeInfo?.symbolName || tradeInfo?.symbolName === symbol) &&
      (!operationTypeCd || operationTypeCd === type)
    )
      onLoadHistory(true)
  })

  useEffect(() => {
    wsClosePositionHistorySubscribe(onClosePositionHistoryWsCallBack)
  }, [])

  useUpdateEffect(() => {
    requestWithLoading(onLoadHistory(true), 0)
  }, [historyForm.startTime, historyForm.endTime, historyForm.tradeInfo, historyForm.operationTypeCd])

  useUnmount(() => {
    wsClosePositionHistoryUnSubscribe(onClosePositionHistoryWsCallBack)
    updateFuturesPosition({ historyFinished: false, historyPositionList: [] })
  })

  return (
    <div className={styles['futures-history-position-root']}>
      <div className="filter-wrap">
        <div className="filter-cell" onClick={() => setFuturesVisible(true)}>
          <span className="filter-label">
            {t`features_assets_futures_futures_position_history_list_index_49m5yepnvy`}
            {historyForm.tradeInfo?.id
              ? historyForm.tradeInfo?.symbolName
              : t`constants_market_market_list_market_module_index_5101071`}
          </span>
          <Icon name="regsiter_icon_drop" hasTheme className="filter-icon" />
        </div>

        <div className="filter-cell" onClick={() => setTypeVisible(true)}>
          <span className="filter-label">
            {t`features_assets_futures_futures_history_futures_history_content_5101420`}
            {historyForm.operationTypeCd
              ? getTextFromStoreEnums(historyForm.operationTypeCd, futuresEnums.historyPositionCloseTypeEnum.enums)
              : t`constants_market_market_list_market_module_index_5101071`}
          </span>
          <Icon name="regsiter_icon_drop" hasTheme className="filter-icon" />
        </div>
      </div>

      <CommonList
        refreshing
        onLoadMore={onLoadHistory}
        onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
        finished={historyFinished}
        showEmpty={historyPositionList.length === 0}
        listChildren={historyPositionList.map((item, i) => {
          return <FuturesPositionHistoryCell key={i} data={item} />
        })}
      />

      {typeVisible && (
        <TypeSelectModal
          type={historyForm.operationTypeCd || ''}
          typeList={futuresEnums.historyPositionCloseTypeEnum.enums}
          enums={futuresEnums.historyPositionCloseTypeEnum.enums}
          visible={typeVisible}
          onClose={() => setTypeVisible(false)}
          onScreen={(val: string | number) => {
            updateFuturesPosition({ historyForm: { ...historyForm, operationTypeCd: val } })
            setTypeVisible(false)
          }}
        />
      )}

      {futuresVisible && (
        <HistoryPositionTradeList
          activeTrade={historyForm.tradeInfo}
          visible={futuresVisible}
          onBack={() => setFuturesVisible(false)}
          onChange={tradeInfo => {
            updateFuturesPosition({ historyForm: { ...historyForm, tradeInfo } })
            setFuturesVisible(false)
          }}
        />
      )}
    </div>
  )
}

export { FuturesPositionHistory }
