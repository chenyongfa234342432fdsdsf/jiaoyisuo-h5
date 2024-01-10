import classNames from 'classnames'
import { getExchangeList } from '@/apis/welfare-center/all-voucher'
import { useEffect, useState } from 'react'
import { formatDate } from '@/helper/date'
import { receiveVoucher } from '@/apis/welfare-center/exchange-center'
import { Button, Toast } from '@nbit/vant'
import { GetExchangeListResponseType } from '@/typings/api/welfare-center/all-voucher'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import CommonListEmpty from '@/components/common-list/list-empty'
import { t } from '@lingui/macro'
import { cloneDeep } from 'lodash'
import { useCommonStore } from '@/store/common'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { ApiWelfareType, TaskTypeCode } from '@/constants/welfare-center/common'
import styles from './index.module.css'
import CardItem from '../compontents/card-item'
import { ScrollToTopButton } from '../compontents/scroll-to-top-button'
import RefreshList from '../compontents/refresh-list'
import { useListLoad } from '../hooks/use-list-load'

export default function ExchangeCenter() {
  const [activityList, setActivityList] = useState<GetExchangeListResponseType[]>([])
  const { fetchCouponCount, setHasNew } = useBaseWelfareCenter()
  const commonState = useCommonStore()
  const { isShow, finished, onLoad, onRefresh, cardListData } = useListLoad({
    paramsData: {},
    pageSize: 5,
    loadRequest: getExchangeList,
  })
  const onRefreshPage = () => {
    onRefresh({})
  }
  useEffect(() => {
    setActivityList(cardListData)
  }, [cardListData])
  const expiredDateSlotRender = cardData => {
    // 有效期类型 after_receive 领取后 N 天有效，time_period 时间段
    if (cardData.validityType === 'after_receive') {
      return (
        <span className="expire-time">
          {t`features_welfare_center_exchange_center_index_eirrf7giag`}
          {cardData.validDay}
          {t`features_welfare_center_exchange_center_index__xwwmsauqt`}
        </span>
      )
    }
    if (cardData.validityType === 'time_period') {
      return (
        <span className="expire-time">
          {t`features_welfare_center_exchange_center_index_uoiwsz6qpz`}
          {formatDate(cardData.validDateFrom, 'YYYY-MM-DD')}
          {t`features_assets_financial_record_datetime_search_index_602`}
          {formatDate(cardData.validDateTo, 'YYYY-MM-DD')}
        </span>
      )
    }
  }
  // 领取优惠卷
  const receiveVoucherFunc = (data, activeIdex, cardIdex) => {
    receiveVoucher({ id: data.id, welfareType: data.welfareType, issueId: data.issueId }).then(res => {
      if (res.isOk) {
        Toast.info(t`features_welfare_center_exchange_center_index_fxqngssvdl`)
        // 成功后刷新数量
        fetchCouponCount()
        // 打上有新数据的标签
        setHasNew(true)
        const cloneData = cloneDeep(activityList)
        const clickActiveData = cloneData[activeIdex]
        clickActiveData?.list?.splice(cardIdex, 1)
        if (clickActiveData.list && !clickActiveData.list.length) {
          cloneData?.splice(activeIdex, 1)
        }
        setActivityList(cloneData)
      }
    })
  }
  const [condition, setCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [missionCondition, setMissionCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  useEffect(() => {
    Promise.all([
      /** 条件 */
      getCodeDetailList({ codeVal: 'welfare_common_condition_scene_options' }),
      getCodeDetailList({ codeVal: 'welfare_achievments_mission_condition_options' }),
    ]).then(([conditionRes, missionConditionRes]) => {
      if (conditionRes.isOk) {
        setCondition(conditionRes.data || [])
      }

      if (missionConditionRes.isOk) {
        setMissionCondition(missionConditionRes.data || [])
      }
    })
  }, [])

  return (
    <div className={classNames(styles['exchange-center'])}>
      <RefreshList
        listItem={(i, activeIdex) => {
          return (
            <div className="task-item" key={activeIdex}>
              <div className={classNames('Task', commonState?.theme)}>
                <h3>
                  {i.welfareType === ApiWelfareType.activity || i.welfareType === ApiWelfareType.manual
                    ? i.activityName
                    : i.missionType === TaskTypeCode.challenge
                    ? condition?.filter(_item => {
                        return _item.codeVal === i?.activityName
                      })?.[0]?.codeKey
                    : missionCondition?.filter(_item => {
                        return _item.codeVal === i?.activityName
                      })?.[0]?.codeKey}
                </h3>
                {
                  <span>
                    {t`features_welfare_center_exchange_center_index_1qp3o0cr_z`}
                    {i.list?.reduce(
                      (accumulator, currentValue) => accumulator + Number(currentValue.couponAcquireLimit),
                      0
                    )}
                  </span>
                }
              </div>
              {i?.list.length ? (
                i.list?.map((item, cardIdex) => {
                  return (
                    <CardItem
                      condition={condition}
                      missionCondition={missionCondition}
                      key={item?.id}
                      cardData={item}
                      btnSlot={
                        <Button
                          onClick={() => receiveVoucherFunc(item, activeIdex, cardIdex)}
                          className={classNames('btn')}
                          type="primary"
                        >
                          {t`features_welfare_center_exchange_center_index__4g2mvki9m`}
                        </Button>
                      }
                      footerSlot={expiredDateSlotRender(item)}
                    />
                  )
                })
              ) : (
                <CommonListEmpty />
              )}
            </div>
          )
        }}
        cardListData={activityList}
        onRefresh={onRefreshPage}
        onLoad={onLoad}
        finished={finished}
        isShow={isShow}
      />
      <ScrollToTopButton />
    </div>
  )
}
