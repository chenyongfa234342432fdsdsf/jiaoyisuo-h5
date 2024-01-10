import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import { Popover, Search, Tabs } from '@nbit/vant'
import { useDebounceFn, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import NoDataImage from '@/components/no-data-image'
import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import { requestWithLoading } from '@/helper/order'
import { getKycPageRoutePath, getPCAccountSecurityPageRoutePath } from '@/helper/route'
import { link } from '@/helper/link'
import { getV1WelfareNotifyOnApiRequest, postV1WelfareMissionJoinApiRequest } from '@/apis/welfare-center'
import { welfare_achievments_mission_condition_options } from '@/constants/welfare-center/common'
import styles from './index.module.css'
import CountDown from '../../count-down'

function AchievementList(props) {
  const {
    businessScene,
    couponType,
    couponCode,
    status,
    taskTypeCode,
    missionCondition,
    onLoadHistory,
    historyPositionList,
    historyFinished,
  } = props

  return (
    <div className={styles.scoped}>
      <CommonList
        refreshing
        onLoadMore={onLoadHistory}
        onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
        finished={historyFinished}
        showEmpty={historyPositionList.length === 0}
        listChildren={historyPositionList.map((item, i) => {
          return (
            <div
              key={i}
              style={{
                border: '1px solid var(--line_color_02)',
              }}
              className={classNames('w-full p-4 box-border rounded-[16px]', {
                'mt-4': !i,
                'mt-3': i,
              })}
            >
              <div className="absolute right-0 top-0">
                <CountDown restSecond={item?.expirationTime} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div>
                    <div className="w-[44px] h-[44px] bg-brand_color_special_02 flex justify-center items-center rounded-[44px]">
                      <Icon name="icon_welfare_coupon_spot_yellow" className="text-[22px] !mt-0" />
                    </div>
                  </div>
                  <div className="ml-3 flex flex-col">
                    <div className="common-20-title font-bold flex">
                      {item?.couponTemplateDetail?.couponValue} {item?.couponTemplateDetail?.coinSymbol}
                      <div
                        className="h-[14px] mt-[-4px] bg-sell_down_color text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                        style={{ borderRadius: '4px 4px 4px 0' }}
                      >
                        x{item?.awardValue}
                        {t`helper_order_future_holding_679`}
                      </div>
                    </div>

                    <span className="common-12-content text-text_color_01">
                      {
                        couponType?.filter(_item => {
                          return _item.codeVal === item?.couponTemplateDetail?.couponType
                        })?.[0]?.codeKey
                      }
                    </span>
                    <span className="common-12-content text-text_color_03 mt-1">
                      {
                        missionCondition?.filter(_item => {
                          return _item.codeVal === item?.conditions?.[0]?.conditionName
                        })?.[0]?.codeKey
                      }
                      {item?.conditions?.[0]?.conditionName ===
                      welfare_achievments_mission_condition_options.kyc_authorized ? (
                        <Popover
                          theme="dark"
                          placement="top"
                          reference={
                            <Icon
                              onClick={() => {
                                // setAssetVisible(true)
                              }}
                              name="property_icon_tips"
                              className="text-xs ml-1 !mt-0 text-text_color_03"
                            />
                          }
                        >
                          <div className="p-2 text-xs text-button_text_01">{t`features_welfare_center_my_task_task_record_index_9rpt4e4qzm`}</div>
                        </Popover>
                      ) : null}
                    </span>
                  </div>
                </div>

                <div>
                  <span
                    className={classNames('btn active')}
                    onClick={() => {
                      postV1WelfareMissionJoinApiRequest({
                        missionId: item?.missionId,
                      }).then(res => {
                        if (
                          item?.conditions?.[0]?.conditionName ===
                          welfare_achievments_mission_condition_options.kyc_authorized
                        ) {
                          link(getKycPageRoutePath())
                        }

                        if (
                          item?.conditions?.[0]?.conditionName ===
                            welfare_achievments_mission_condition_options.mobile_bind ||
                          item?.conditions?.[0]?.conditionName ===
                            welfare_achievments_mission_condition_options.account_security_authorized
                        ) {
                          link(getPCAccountSecurityPageRoutePath())
                        }

                        if (
                          item?.conditions?.[0]?.conditionName ===
                          welfare_achievments_mission_condition_options.mobile_notification_on
                        ) {
                          getV1WelfareNotifyOnApiRequest({}).then(_res => {
                            requestWithLoading(onLoadHistory(true), 0)
                          })
                        }
                      })
                    }}
                  >
                    {item?.times
                      ? t`features_welfare_center_my_task_challenge_list_index_nof0cjrcwi`
                      : t`features_welfare_center_my_task_challenge_list_index__ph4ocnuiz`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      />
    </div>
  )
}

export default AchievementList
