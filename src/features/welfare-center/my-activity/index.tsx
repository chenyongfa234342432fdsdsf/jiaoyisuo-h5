import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import classNames from 'classnames'

import CommonList from '@/components/common-list/list'
import { requestWithLoading } from '@/helper/order'
import { getV1WelfareActivityAllApiRequest, getV1WelfareActivityListApiRequest } from '@/apis/welfare-center'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { link } from '@/helper/link'
import { formatDate } from '@/helper/date'
import { ActivityCode, ActivityStatusCode, ActivityType } from '@/constants/welfare-center/common'
import styles from './index.module.css'
import CountDown from '../count-down'

function MyActivity() {
  const [cardActive, setCardActive] = useState(ActivityType.inProgress)

  const [historyFinished, setHistoryFinished] = useState<boolean>(false)
  const [historyPositionList, setHistoryPositionList] = useState<any>([])

  const [allHistoryFinished, setAllHistoryFinished] = useState<boolean>(false)
  const [allHistoryPositionList, setAllHistoryPositionList] = useState<any>([])
  const [activityStatus, setActivityStatus] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [pageNum, setPageNum] = useState(1)
  const [allPageNum, setAllPageNum] = useState(1)

  const onLoadHistory = async (isRefresh?: boolean) => {
    const params = {
      status: cardActive === ActivityType.inProgress ? ActivityCode.processing : ActivityCode.ends,
      pageNum: isRefresh ? 1 : pageNum,
      pageSize: 20,
    }

    const res = await getV1WelfareActivityListApiRequest(params as any)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setHistoryFinished(true)
      return
    }

    const nList = isRefresh ? data.list : [...historyPositionList, ...data.list]
    setHistoryFinished(nList.length >= +data?.total)
    setHistoryPositionList(nList)

    setPageNum(isRefresh ? 1 : pageNum + 1)
  }

  const onLoadAllHistory = async (isRefresh?: boolean) => {
    const params = {
      pageNum: isRefresh ? 1 : pageNum,
      pageSize: 20,
    }

    const res = await getV1WelfareActivityAllApiRequest(params as any)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setAllHistoryFinished(true)
      return
    }

    const nList = isRefresh ? data.list : [...historyPositionList, ...data.list]
    setAllHistoryFinished(nList.length >= +data?.total)
    setAllHistoryPositionList(nList)

    setAllPageNum(isRefresh ? 1 : pageNum + 1)
  }

  useEffect(() => {
    requestWithLoading(onLoadHistory(true), 0)
  }, [cardActive])

  useEffect(() => {
    requestWithLoading(onLoadAllHistory(true), 0)
  }, [])

  useEffect(() => {
    Promise.all([
      /** 活动状态 */
      getCodeDetailList({ codeVal: 'welfare_activity_status_code' }),
    ]).then(([res]) => {
      if (res.isOk) {
        setActivityStatus(res.data || [])
      }
    })
  }, [])

  return (
    <div className={styles.scoped}>
      {/* <NoDataImage className="mt-8" /> */}

      <div className="w-full px-4 box-border flex justify-between mt-4">
        <div>
          <span
            className={classNames('btn', {
              active: cardActive === ActivityType.inProgress,
            })}
            onClick={() => {
              setCardActive(ActivityType.inProgress)
              setHistoryPositionList([])
            }}
          >{t`assets.financial-record.search.underway`}</span>
          <span
            className={classNames('btn', {
              active: cardActive === ActivityType.finished,
            })}
            onClick={() => {
              setCardActive(ActivityType.finished)
              setHistoryPositionList([])
            }}
          >{t`features_c2c_order_index_0us3t5nfaqmmvict2lkwa`}</span>
        </div>
      </div>
      <div className="w-full px-4 box-border">
        {cardActive === ActivityType.inProgress ? (
          <CommonList
            refreshing
            onLoadMore={onLoadHistory}
            onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
            finished={historyFinished}
            emptyClassName="pt-[85px] pb-[70px]"
            showEmpty={historyPositionList.length === 0}
            listChildren={historyPositionList.map((item, i) => {
              return (
                <div
                  key={i}
                  className="mt-4"
                  onClick={() => {
                    // link(
                    //   `/announcement/article/${
                    //     item?.activityUrl?.split('/')?.[item?.activityUrl?.split('/')?.length - 1]
                    //   }?from=${Activity}&status=${item?.status}&join=${item?.join}&activityId=${item?.activityId}`
                    // )
                    link(
                      `/announcement/article/${
                        item?.activityUrl?.split('/')?.[item?.activityUrl?.split('/')?.length - 1]
                      }`
                    )
                  }}
                >
                  <div className="flex">
                    <img className="w-[109px] h-[70px] object-contain" src={item.h5CoverUrl} alt="" />

                    <div className="ml-3 flex flex-col relative">
                      <span className="common-14-title">{item.activityName}</span>

                      <CountDown restSecond={item?.expirationTime} fromActivity />

                      <span className="common-12-content text-text_color_03 mt-2">
                        {t`features_welfare_center_my_activity_index_atatf2c6f7`}
                        {formatDate(Number(item?.expirationTime), 'YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                  {i !== historyPositionList?.length - 1 ? (
                    <div className="w-full h-[0.5px] mt-4 bg-line_color_02"></div>
                  ) : null}
                </div>
              )
            })}
          />
        ) : (
          <CommonList
            refreshing
            onLoadMore={onLoadHistory}
            onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
            finished={historyFinished}
            showEmpty={historyPositionList.length === 0}
            emptyClassName="pt-[85px] pb-[70px]"
            listChildren={historyPositionList.map((item, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    link(
                      `/announcement/article/${
                        item?.activityUrl?.split('/')?.[item?.activityUrl?.split('/')?.length - 1]
                      }`
                    )
                  }}
                >
                  <div className="flex">
                    <img className="w-[109px] h-[70px] object-contain" src={item.h5CoverUrl} alt="" />

                    <div className="ml-3 flex flex-col relative">
                      <span className="common-14-title">{item.activityName}</span>
                      <div className="h-[18px] px-1 flex items-center mt-2 common-12-content text-text_color_02 bg-bg_sr_color">
                        {t`features_c2c_order_index_0us3t5nfaqmmvict2lkwa`}
                      </div>
                      <span className="common-12-content text-text_color_03 mt-2">
                        {t`features_welfare_center_my_activity_index_atatf2c6f7`}
                        {formatDate(Number(item?.expirationTime), 'YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-[0.5px] mt-4 bg-line_color_02"></div>
                </div>
              )
            })}
          />
        )}
      </div>

      <div className="w-full h-1 bg-line_color_02"></div>

      <div className="w-full p-4 box-border">
        <div className="common-16-title">{t`features_welfare_center_my_activity_index_51gpbxlnza`}</div>
        <CommonList
          className="all-activity"
          refreshing
          onLoadMore={onLoadAllHistory}
          onRefreshing={() => requestWithLoading(onLoadAllHistory(true), 0)}
          finished={allHistoryFinished}
          emptyClassName="pt-[85px] pb-[70px]"
          showEmpty={allHistoryPositionList.length === 0}
          listChildren={allHistoryPositionList.map((item, i) => {
            return (
              <div
                key={i}
                className={classNames('flex flex-col', {
                  'ml-4': i % 2,
                  'mt-3': i === 0 || i === 1,
                  'mt-4': i !== 0 && i !== 1,
                })}
                style={{ width: 'calc((100% - 16.01px) / 2)' }}
                onClick={() => {
                  link(
                    `/announcement/article/${
                      item?.activityUrl?.split('/')?.[item?.activityUrl?.split('/')?.length - 1]
                    }`
                  )
                }}
              >
                <img className="w-full h-[105px] rounded-lg object-contain" src={item.h5CoverUrl} alt="" />

                <span className="common-14-title mt-3">{item.activityName}</span>
                <div
                  className={classNames(
                    'h-[18px] px-1 flex items-center mt-2 common-12-content text-text_color_02 bg-bg_sr_color rounded',
                    {
                      '!bg-buy_up_color_special_02': item?.status === ActivityStatusCode.processing,
                      '!text-buy_up_color': item?.status === ActivityStatusCode.processing,
                      '!text-auxiliary_color_02': item?.status === ActivityStatusCode.coming_soon,
                      '!bg-auxiliary_color_special_02': item?.status === ActivityStatusCode.coming_soon,
                    }
                  )}
                  style={{
                    width: 'fit-content',
                  }}
                >
                  {
                    activityStatus?.filter(_item => {
                      return _item.codeVal === item?.status
                    })?.[0]?.codeKey
                  }
                </div>
                <span className="common-12-content text-text_color_03 mt-2">
                  {item?.status === ActivityStatusCode.coming_soon
                    ? t`features_welfare_center_my_activity_index_rwywu936r4`
                    : t`features_welfare_center_my_activity_index_atatf2c6f7`}
                  {formatDate(
                    Number(item?.status === ActivityStatusCode.coming_soon ? item?.startTime : item?.expirationTime),
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </span>
              </div>
            )
          })}
        />
      </div>
    </div>
  )
}

export default MyActivity
