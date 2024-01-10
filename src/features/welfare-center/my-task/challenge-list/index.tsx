import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

import classNames from 'classnames'

import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import { requestWithLoading } from '@/helper/order'
import { getAssetsRechargePageRoutePath } from '@/helper/route'
import { link } from '@/helper/link'
import { getFuturesPage, getTradePage } from '@/helper/route/welfare-center'
import { postV1WelfareMissionJoinApiRequest } from '@/apis/welfare-center'
import { CompareCondition, welfare_common_condition_scene_options } from '@/constants/welfare-center/common'
import CountDown from '../../count-down'
import styles from './index.module.css'

function ChallengeList(props) {
  const {
    businessScene,
    couponType,
    couponCode,
    status,
    taskTypeCode,
    condition,
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
              className={classNames('relative w-full p-4 box-border rounded-[16px]', {
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
                          item?.conditions?.[0]?.conditionName === welfare_common_condition_scene_options.transfer_input
                        ) {
                          link(getAssetsRechargePageRoutePath())
                        }

                        if (
                          item?.conditions?.[0]?.conditionName ===
                            welfare_common_condition_scene_options.contract_fee ||
                          item?.conditions?.[0]?.conditionName ===
                            welfare_common_condition_scene_options.contract_transfer
                        ) {
                          link(getFuturesPage())
                        }

                        if (
                          item?.conditions?.[0]?.conditionName === welfare_common_condition_scene_options.spot_fee ||
                          item?.conditions?.[0]?.conditionName === welfare_common_condition_scene_options.spot_goods
                        ) {
                          link(getTradePage())
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
              <div className="h-[6px] w-full rounded-[16px] bg-bg_sr_color mt-3">
                <div
                  className="h-[6px]  rounded-[16px] bg-brand_color"
                  style={{
                    width: `${
                      (item?.conditions?.[0]?.currentValue || 0) / item?.conditions?.[0]?.targetValue > 1
                        ? 100
                        : ((item?.conditions?.[0]?.currentValue || 0) / item?.conditions?.[0]?.targetValue) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-[10px]">
                <span className="common-12-content text-text_color_03">
                  {
                    condition?.filter(_item => {
                      return _item.codeVal === item?.conditions?.[0]?.conditionName
                    })?.[0]?.codeKey
                  }
                  {CompareCondition[item?.conditions?.[0]?.compareCondition]}
                  {item?.conditions?.[0]?.targetValue || 0}
                  {item?.conditions?.[0]?.targetUnit}
                  {t`features_c2c_trade_trade_form_22225101654`}
                </span>
                <span className="common-12-content text-text_color_03">
                  <span className="text-text_color_01 font-medium">{item?.conditions?.[0]?.currentValue || 0}</span>/
                  {item?.conditions?.[0]?.targetValue || 0}
                  {item?.conditions?.[0]?.targetUnit}
                </span>
              </div>
            </div>
          )
        })}
      />
    </div>
  )
}

export default ChallengeList
