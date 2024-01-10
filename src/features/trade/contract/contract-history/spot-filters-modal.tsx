/**
 * 现货订单 - 筛选弹窗
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useState, useEffect } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Popup, Checkbox, Button } from '@nbit/vant'
import { formatDate, getPeriodDayTime } from '@/helper/date'
import classNames from 'classnames'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import { EntrustTypeEnum } from '@/constants/trade'
import DatePickerModal from '@/components/common-date-picker/date-picker-modal'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import { storeEnumsToOptions } from '@/helper/store'
import {
  FutureTabTypeEnum,
  FuturePlanOrderStatusParamsCompositionEnum,
  SpotFutureStatusParamsCompositionEnum,
  FutureStopOrderStatusParamsCompositionEnum,
} from '@/constants/future/future-history'
import styles from './index.module.css'

const checkboxIconRender = createCheckboxIconRender()

enum DateTypeEnum {
  day = 2,
  week = 7,
  month = 30,
  threeMonth = 90,
}

export function getSpotFiltersModalDefaultParams() {
  return {
    startTime: `${getPeriodDayTime(DateTypeEnum.week).start}`,
    endTime: `${getPeriodDayTime(DateTypeEnum.week).end}`,
    timeRange: 'week',
  }
}
interface ISpotFiltersModalProps {
  visible: boolean
  params: IQuerySpotOrderReqParams
  onClose: () => void
  isPlanOrder?: boolean
  onConfirm: (params: IQuerySpotOrderReqParams) => void
  futureHooksType: string | number
  orderTab: string | number
}

function formatDateToDay(date) {
  return formatDate(date, 'YYYY-MM-DD')
}

export function SpotFiltersModal(props: ISpotFiltersModalProps) {
  const { visible = false, onClose, onConfirm, params, futureHooksType, orderTab } = props

  const normalStatusList = [
    { label: t`features_orders_spot_open_order_item_510252`, value: 'deal_done' },
    { label: t`constants/assets/common-32`, value: 'partial_deal_canceled' },
    { label: t`constants/assets/common-33`, value: 'revoke,revoke_sys' },
  ]
  const planStatusList = [
    { label: t`features_orders_spot_open_order_item_510255`, value: 'already_triggered,triggered_failed' },
    { label: t`constants/assets/common-33`, value: 'revoke,revoke_sys' },
  ]

  const stopStatusList = [
    { label: t`modules_future_stop_profitloss_index_page_5101509`, value: 'already_triggered,triggered_failed' },
    { label: t`constants/assets/common-33`, value: 'revoke,revoke_sys' },
  ]

  const showStatusList = {
    [EntrustTypeEnum.normal]: normalStatusList,
    [EntrustTypeEnum.stop]: stopStatusList,
    [EntrustTypeEnum.plan]: planStatusList,
  }

  const statusList = showStatusList[futureHooksType]

  const dateTypeList = [
    {
      label: t`constants/assets/common-17`,
      value: 'day',
      computed: DateTypeEnum.day,
    },
    {
      label: t`constants/assets/common-18`,
      value: 'week',
      computed: DateTypeEnum.week,
    },
    {
      label: t`constants/assets/common-19`,
      value: 'months',
      computed: DateTypeEnum.month,
    },
    {
      label: t`constants/assets/common-20`,
      value: 'three_months',
      computed: DateTypeEnum.threeMonth,
    },
  ]

  const [formData, setFormData] = useState<any>(params)
  const [dateModalVisible, setDateModalVisible] = useState(false)
  /**
   * 关闭弹窗
   */
  const onCloseModal = () => {
    // 关闭时重置
    setFormData(params)
    onClose()
  }

  const onDateTypeChange = type => {
    if (type.value === formData.timeRange) {
      return
    }
    setFormData({
      ...formData,
      startTime: getPeriodDayTime(type.computed).start,
      endTime: getPeriodDayTime(type.computed).end,
      timeRange: type.value,
    })
  }
  useUpdateEffect(() => {
    if (visible) {
      setFormData(params)
    }
  }, [visible])

  useEffect(() => {
    setFormData(params)
  }, [params])

  return (
    <Popup visible={visible} position="bottom" round closeOnClickOverlay={false}>
      <div className={styles['filters-modal-root']}>
        <div className="screen-header">
          <span>{t`features/assets/financial-record/record-screen-modal/index-0`}</span>
          <Icon hasTheme name="close" className="close-icon" onClick={onCloseModal} />
        </div>

        <span className="screen-title">{t`future.funding-history.funding-rate.column.time`}</span>
        <div className="screen-date">
          <div
            className="date"
            onClick={() => {
              setDateModalVisible(true)
            }}
          >
            {formatDateToDay(Number(formData.startTime))}
          </div>
          <span className="date-separate">{t`features_assets_financial_record_datetime_search_index_602`}</span>
          <div
            className="date"
            onClick={() => {
              setDateModalVisible(true)
            }}
          >
            {formatDateToDay(Number(formData.endTime))}
          </div>
        </div>
        <div className="date-type">
          {dateTypeList.map(typeItem => {
            return (
              <div
                key={typeItem.value}
                className={classNames('date-type-item', {
                  active: typeItem.value === formData.timeRange,
                })}
                onClick={() => onDateTypeChange(typeItem)}
              >
                {typeItem.label}
              </div>
            )
          })}
        </div>
        {orderTab !== FutureTabTypeEnum.fundrate && (
          <>
            <span className="screen-title">{t`user.security_verification_status_05`}</span>
            <Checkbox.Group
              value={formData.statusArr}
              direction="horizontal"
              iconSize={16}
              onChange={(names: any[]) => {
                setFormData({ ...formData, statusArr: names })
              }}
            >
              {statusList.map(statusItem => {
                const disabled = formData.statusArr?.includes(statusItem.value) && formData.statusArr.length === 1
                return (
                  <Checkbox
                    disabled={disabled}
                    iconRender={checkboxIconRender}
                    name={statusItem.value}
                    key={statusItem.value}
                    shape="square"
                  >
                    {statusItem.label}
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </>
        )}
        <div className="flex pt-6 pb-10">
          <Button
            block
            className="mr-4 bg-card_bg_color_02 button-reset"
            onClick={() => {
              const filtersObj = {
                [EntrustTypeEnum.normal]: Object.values(SpotFutureStatusParamsCompositionEnum) as string[],
                [EntrustTypeEnum.plan]: Object.values(FuturePlanOrderStatusParamsCompositionEnum) as string[],
                [EntrustTypeEnum.stop]: Object.values(FutureStopOrderStatusParamsCompositionEnum) as string[],
              }

              setFormData({ ...getSpotFiltersModalDefaultParams(), statusArr: filtersObj[futureHooksType] })
            }}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button
            block
            type="primary"
            onClick={() => {
              onConfirm(formData)
            }}
          >
            {t`user.field.reuse_10`}
          </Button>
        </div>
      </div>
      <DatePickerModal
        startDate={Number(formData.startTime!)}
        endDate={Number(formData.endTime!)}
        visible={dateModalVisible}
        onClose={() => {
          setDateModalVisible(false)
        }}
        dateTemplate="YYYY-MM-DD"
        onCommit={newParams => {
          setFormData({
            ...formData,
            timeRange: '',
            startTime: newParams.startDate,
            endTime: newParams.endDate,
          })
          setDateModalVisible(false)
        }}
      />
    </Popup>
  )
}
