import { t } from '@lingui/macro'
import { Toast } from '@nbit/vant'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { useMount, useCreation } from 'ahooks'
import NavBar from '@/components/navbar'
import { IncreaseTag } from '@nbit/react'
import { getIsLogin } from '@/helper/auth'
import { formatDate } from '@/helper/date'
import { useState, useRef } from 'react'
import { getAutoAddMarginRecord } from '@/apis/trade'
import NoDataImage from '@/components/no-data-image'
import CommonList from '@/components/common-list/list'
import { MarginRecordType } from '@/typings/api/trade'
import { MarginRecordStatusEnum } from '@/constants/trade'
import { getCodeDetailList } from '@/apis/common'
import { useCommonStore } from '@/store/common'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import styles from './index.module.css'

interface dataDictionaryType {
  [key: string]: string
}
function MarginRecords() {
  const size = useRef<number>(20)

  const [page, setPage] = useState<number>(0)
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)
  const [recordType, setRecordType] = useState<dataDictionaryType>()
  const [recordData, setRecordData] = useState<Array<MarginRecordType>>([])

  const { locale } = useCommonStore()
  const isLogin = getIsLogin()

  const BillStatusEnum = {
    completed: t`features_trade_future_settings_margin_records_index_5101364`,
    processing: t`assets.financial-record.search.underway`,
    success: t`assets.financial-record.search.success`,
    fail: t`assets.financial-record.search.failure`,
    error: t`assets.financial-record.search.error`,
  }

  const getRecordsType = async () => {
    const res = await getCodeDetailList({ codeVal: 'perpetualBillType', lanType: locale })
    if (res.isOk && res.data) {
      const data: dataDictionaryType = {}
      res.data.forEach(item => (data[item?.codeVal] = item?.codeKey))
      setRecordType(data)
    }
  }

  /** 上拉加载更多* */
  const onLoadMore = async () => {
    setFinished(true)
    !finished && setPage(page + 1)
  }

  /** 下拉刷新* */
  const onRefreshing = async () => {
    setPage(0)
    setFinished(false)
    setRecordData([])
  }

  const getInmailList = async pages => {
    const params = {
      pageNum: pages,
      pageSize: size.current,
    }
    pages >= 1 && setLoading(true)
    const res = await getAutoAddMarginRecord(params)
    if (res.isOk && res.data) {
      if (!res.data.list?.length) {
        setIsLoad(false)
        setLoading(false)
        setFinished(true)
        return
      }
      const pageData = [...recordData, ...res.data.list]
      setFinished(pageData?.length >= res.data?.total)
      pageData && setRecordData(pageData)
    }
    setIsLoad(false)
    setLoading(false)
  }

  /** 记录的点击事件* */
  const onRecordChange = v => {
    link(`/assets/financial-record/detail?id=${v.id}`)
  }

  useMount(() => {
    setIsLoad(true)
    getRecordsType()
  })

  useCreation(() => {
    loading && page > 1
      ? Toast.loading({
          duration: 0,
          message: t`features_assets_coin_details_coin_details_510157`,
        })
      : Toast.clear()
  }, [loading])

  useCreation(() => {
    isLogin && page && getInmailList(page)
  }, [page])

  return (
    <div className={styles['record-list-wrapper']}>
      <NavBar title={t`features_trade_future_settings_margin_records_index_677`} left={<Icon name="back" hasTheme />} />
      <CommonList
        refreshing
        finished={finished}
        onLoadMore={onLoadMore}
        onRefreshing={onRefreshing}
        finishedText={recordData?.length ? t`components/common-list/list-footer/index-0` : ' '}
        listChildren={
          recordData?.length
            ? recordData.map(v => {
                return (
                  <div className="cell" key={v?.id} onClick={() => onRecordChange(v)}>
                    <div className="content">
                      <div className="header">
                        <div className="text">
                          <label>{v?.coinName}</label>
                          <label>
                            {`${t`features_trade_future_settings_margin_records_index_a6rj6jevmjqbmnd02luz-`} ${
                              v?.groupName || ''
                            }`}
                          </label>
                        </div>
                        <div className="price">
                          <IncreaseTag value={Number(v?.amount || 0)} />
                        </div>
                      </div>
                      <div className="footer">
                        <div className="describe">
                          <label>
                            {formatDate(v.time)} {recordType?.[v.logType] || ''}
                            {v?.operationType === MarginRecordStatusEnum.auto
                              ? t`features_trade_future_settings_margin_records_index_5101365`
                              : `(${t`constants_order_750`})`}
                          </label>
                        </div>
                        <div className="status">
                          <label>{BillStatusEnum[v?.status]}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            : !loading && <NoDataImage className="pt-10" />
        }
      />
      <div className="footer-record-text">
        <div className="record-text-box">
          <Icon name="prompt-symbol" className="footer-list-icon" />
          <div className="footer-list-text">{t`features_trade_future_settings_margin_records_index_5101398`}</div>
        </div>
      </div>
      <FullScreenLoading isShow={isLoad} />
    </div>
  )
}

export default MarginRecords
