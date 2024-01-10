/**
 * 合约 - 合约组记录组件
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Popup, Toast } from '@nbit/vant'
import { IncreaseTag } from '@nbit/react'
import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import {
  AssetsHistoryPageTypeEnum,
  AssetsRecordTypeEnum,
  AssetsTransferTypeList,
  RecordExtractBondTypeList,
} from '@/constants/assets/common'
import { FuturesHistoryTabEnum } from '@/constants/assets/futures'
import { postRecordsList } from '@/apis/assets/financial-records'
import { AssetsRouteEnum, FinancialRecordRouteEnum } from '@/constants/assets'
import { getTextFromStoreEnums } from '@/helper/store'
import { formatDate } from '@/helper/date'
import { useAssetsStore } from '@/store/assets/spot'
import { AssetsRecordsListReq, RecordsListResp } from '@/typings/api/assets/assets'
import { link } from '@/helper/link'
import { IEnums } from '@/typings/store/common'
import { getAssetsHistoryDetailPageRoutePath } from '@/helper/route'
import styles from './index.module.css'

interface FuturesHistoryContentProps {
  type: string
  formData: any
  groupId: string
  onChangeData: (e: any) => void
  onSelectAssets: () => void
}

function FuturesHistoryContent(props: FuturesHistoryContentProps) {
  const { type, formData, groupId, onChangeData, onSelectAssets } = props
  const {
    assetsEnums,
    recordModule: { updateRecordModule },
  } = useAssetsStore()
  const [typeVisible, setTypeVisible] = useState(false)
  const [list, setList] = useState<RecordsListResp[]>([])
  const [finished, setFinished] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [typeList, setTypeList] = useState<IEnums[]>([])
  const [enums, setEnums] = useState<IEnums[]>([])

  /**
   * 查询记录列表
   * @param isRefresh
   */
  const onLoadList = async (isRefresh?: boolean) => {
    try {
      const params: AssetsRecordsListReq = {
        groupId,
        logType: AssetsRouteEnum.contract,
        pageNum: isRefresh ? 1 : pageNum,
        pageSize: 20,
        coinId: formData.coin ? formData.coin.id : '',
      }

      if (type === FuturesHistoryTabEnum.margin && !formData.type) {
        params.type = [
          AssetsRecordTypeEnum.extractBond,
          AssetsRecordTypeEnum.rechargeBond,
          AssetsRecordTypeEnum.futuresTransfer,
        ] as number[]
      } else {
        if (formData.type) {
          params.type = [formData.type]
        }
      }

      const res = await postRecordsList(params)
      const { isOk, data, message = '' } = res || {}
      if (!isOk || !data) {
        Toast(message)
        setFinished(true)
        return
      }

      const nList = isRefresh ? data.list : [...list, ...data.list]
      setList(nList)
      setFinished(data.list.length < 20)
      setPageNum(pageNum + 1)
      Toast.clear()
    } catch (error) {
      setFinished(false)
      Toast.clear()
    }
  }

  /**
   * 类型选择
   */
  const onTypeCommit = e => {
    onChangeData({ ...formData, type: e })
    setTypeVisible(false)
  }

  useEffect(() => {
    if (type === FuturesHistoryTabEnum.futures) {
      setTypeList(assetsEnums.financialRecordTypePerpetualList.enums)
      setEnums(assetsEnums.financialRecordTypePerpetualList.enums)
    }
    if (type === FuturesHistoryTabEnum.margin) {
      setTypeList(assetsEnums.financialRecordTypeMarginList.enums)
      setEnums(assetsEnums.financialRecordTypeMarginList.enums)
    }
  }, [assetsEnums])

  useUpdateEffect(() => {
    onLoadList(true)
  }, [formData])

  return (
    <div className={styles['futures-history-content-wrapper']}>
      <div className="header">
        <div className="header-item" onClick={onSelectAssets}>
          <span>
            {t`features_assets_futures_futures_history_futures_history_content_5101419`}
            {formData?.coin?.coinName || t`constants_market_market_list_market_module_index_5101071`}
          </span>
          <Icon name="regsiter_icon_drop" hasTheme className="down-icon" />
        </div>

        <div className="header-item" onClick={() => setTypeVisible(true)}>
          <span>
            {t`features_assets_futures_futures_history_futures_history_content_5101420`}
            {formData?.type
              ? getTextFromStoreEnums(formData?.type, assetsEnums.financialRecordTypePerpetualList.enums)
              : t`constants_market_market_list_market_module_index_5101071`}
          </span>
          <Icon name="regsiter_icon_drop" hasTheme className="down-icon" />
        </div>
      </div>

      <CommonList
        refreshing
        finished={finished}
        onRefreshing={() => onLoadList(true)}
        onLoadMore={onLoadList}
        listChildren={list.map((item, index) => {
          return (
            <div
              className="list-item"
              key={index}
              onClick={() => {
                updateRecordModule({ activeTab: FinancialRecordRouteEnum.contract })
                link(
                  getAssetsHistoryDetailPageRoutePath({
                    id: item.id,
                    page: AssetsHistoryPageTypeEnum.positionHistoryList,
                    amount: item.total,
                  })
                )
              }}
            >
              <div className="item-left">
                <div className="coin-cell">
                  <div className="coin-name">
                    {item.businessCoin || '--'}{' '}
                    {!RecordExtractBondTypeList.includes(item.type) &&
                      getTextFromStoreEnums(item.groupType || '', assetsEnums.financialRecordTypeSwapList.enums)}
                  </div>

                  <IncreaseTag
                    value={item.total}
                    hasColor={item.type !== AssetsRecordTypeEnum.migrate}
                    hasPrefix={item.type !== AssetsRecordTypeEnum.migrate && +item.total > 0}
                  />
                </div>
                {AssetsTransferTypeList.includes(item.type) && item.type !== AssetsRecordTypeEnum.migrate && (
                  <div className="transfer-cell">
                    <span>{item.from || t`features_trade_future_c2c_22225101593`}</span>
                    <span className="transfer-separate">{t`features_assets_financial_record_datetime_search_index_602`}</span>
                    <span>{item.to || t`features_trade_future_c2c_22225101593`}</span>
                  </div>
                )}
                <div className="date-cell">
                  <div className="flex">
                    <span>{formatDate(item.createdByTime)} </span>
                    <span className="ml-2">
                      {getTextFromStoreEnums(item.type, assetsEnums.financialRecordTypeEnum.enums)}
                      {RecordExtractBondTypeList.includes(item.type) &&
                        `(${getTextFromStoreEnums(
                          item.operationType || '',
                          assetsEnums.financialRecordTypeOperationList.enums
                        )})`}
                    </span>
                  </div>

                  <span>{getTextFromStoreEnums(item.status, assetsEnums.financialRecordStateEnum.enums)}</span>
                </div>
              </div>

              <Icon name="next_arrow" hasTheme className="next-icon" />
            </div>
          )
        })}
        showEmpty={list.length === 0}
      />

      <Popup
        className={styles['history-type-modal-root']}
        position="bottom"
        visible={typeVisible}
        round
        closeOnPopstate
        safeAreaInsetBottom
        destroyOnClose
        onClose={() => setTypeVisible(false)}
      >
        <div className="history-type-modal-wrapper">
          <div className="modal-list">
            <div className="item" onClick={() => onTypeCommit(AssetsRecordTypeEnum.all)}>
              <span
                className={formData?.type === AssetsRecordTypeEnum.all ? 'text-active' : 'text'}
              >{t`constants_market_market_list_market_module_index_5101071`}</span>
            </div>

            {typeList.map(item => {
              return (
                <div key={item.value} className="item" onClick={() => onTypeCommit(item.value)}>
                  <span className={formData?.type === item.value ? 'text-active' : 'text'}>
                    {getTextFromStoreEnums(item.value, enums)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="bottom" onClick={() => setTypeVisible(false)}>{t`common.modal.cancel`}</div>
        </div>
      </Popup>
    </div>
  )
}

export { FuturesHistoryContent }
