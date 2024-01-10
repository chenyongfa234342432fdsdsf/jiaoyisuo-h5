/**
 * 现货订单 - 筛选弹窗
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useState } from 'react'
import { Popup, Checkbox, Button, Toast } from '@nbit/vant'
import { formatDate, getPeriodDayTime } from '@/helper/date'
import {
  OrderDirectionEnum,
  SpotOrderStatusParamsCompositionEnum,
  SpotPlanOrderStatusParamsCompositionEnum,
  SpotStopProfitLossOrderStatusParamsCompositionEnum,
} from '@/constants/order'
import classNames from 'classnames'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import DatePickerModal from '@/components/common-date-picker/date-picker-modal'
import { useUpdateEffect } from 'ahooks'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import { storeEnumsToOptions } from '@/helper/store'
import { EntrustTypeEnum } from '@/constants/trade'
import { baseOrderSpotStore, useBaseOrderSpotStore } from '@/store/order/spot'
import styles from './index.module.css'

const checkboxIconRender = createCheckboxIconRender()

enum DateTypeEnum {
  day = 2,
  week = 7,
  month = 30,
  threeMonth = 90,
}

export function getSpotFiltersModalDefaultParams(): IQuerySpotOrderReqParams {
  return {
    beginDateNumber: getPeriodDayTime(DateTypeEnum.week).start,
    endDateNumber: getPeriodDayTime(DateTypeEnum.week).end,
    dateType: DateTypeEnum.week,
    direction: [OrderDirectionEnum.buy, OrderDirectionEnum.sell],
  }
}
interface ISpotFiltersModalProps {
  visible: boolean
  params: IQuerySpotOrderReqParams
  onClose: () => void
  isPlanOrder?: boolean
  onConfirm: (params: IQuerySpotOrderReqParams) => void
  orderType: number
}

function formatDateToDay(date: any) {
  return formatDate(date, 'YYYY-MM-DD')
}

export function SpotFiltersModal(props: ISpotFiltersModalProps) {
  const { visible = false, onClose, onConfirm, params, orderType } = props
  const { orderEnums } = useBaseOrderSpotStore()
  const normalStatusList = storeEnumsToOptions(orderEnums.orderStatusInFilters.enums)
  const planStatusList = storeEnumsToOptions(orderEnums.planOrderStatusInFilters.enums)

  const statusCollectObj = {
    statusList: {
      [EntrustTypeEnum.normal]: normalStatusList,
      [EntrustTypeEnum.plan]: planStatusList,
      [EntrustTypeEnum.stop]: planStatusList,
    },
    statusArr: {
      [EntrustTypeEnum.normal]: Object.values(SpotOrderStatusParamsCompositionEnum),
      [EntrustTypeEnum.plan]: Object.values(SpotPlanOrderStatusParamsCompositionEnum),
      [EntrustTypeEnum.stop]: Object.values(SpotStopProfitLossOrderStatusParamsCompositionEnum),
    },
  }

  const statusList = statusCollectObj?.statusList?.[orderType] || []

  const statusArr = statusCollectObj?.statusArr?.[orderType] || []

  const directionList = storeEnumsToOptions(orderEnums.orderDirection.enums)

  const dateTypeList = [
    {
      label: t`constants/assets/common-17`,
      value: DateTypeEnum.day,
    },
    {
      label: t`constants/assets/common-18`,
      value: DateTypeEnum.week,
    },
    {
      label: t`constants/assets/common-19`,
      value: DateTypeEnum.month,
    },
    {
      label: t`constants/assets/common-20`,
      value: DateTypeEnum.threeMonth,
    },
  ]
  const [formData, setFormData] = useState(params)
  const onCheckboxGroupChange = (name: string, value: any[]) => {
    if (value.length === 0) {
      Toast('至少选择 1 项')
      return
    }
    setFormData({ ...formData, [name]: value })
  }
  const [dateModalVisible, setDateModalVisible] = useState(false)
  /**
   * 关闭弹窗
   */
  const onCloseModal = () => {
    // 关闭时重置
    setFormData(params)
    onClose()
  }

  const onDateTypeChange = (type: any) => {
    if (type === formData.dateType) {
      return
    }
    setFormData({
      ...formData,
      beginDateNumber: getPeriodDayTime(type).start,
      endDateNumber: getPeriodDayTime(type).end,
      dateType: type,
    })
  }
  useUpdateEffect(() => {
    if (visible) {
      setFormData(params)
    }
  }, [visible])
  const reset = () => {
    setFormData({
      ...getSpotFiltersModalDefaultParams(),
      statusArr,
    })
  }

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
            {formatDateToDay(formData.beginDateNumber)}
          </div>
          <span className="date-separate">{t`features_assets_financial_record_datetime_search_index_602`}</span>
          <div
            className="date"
            onClick={() => {
              setDateModalVisible(true)
            }}
          >
            {formatDateToDay(formData.endDateNumber)}
          </div>
        </div>
        <div className="date-type">
          {dateTypeList.map(typeItem => {
            return (
              <div
                key={typeItem.value}
                className={classNames('date-type-item', {
                  active: typeItem.value === formData.dateType,
                })}
                onClick={() => onDateTypeChange(typeItem.value)}
              >
                {typeItem.label}
              </div>
            )
          })}
        </div>
        <span className="screen-title">{t`user.security_verification_status_05`}</span>
        <Checkbox.Group
          value={formData.statusArr}
          direction="horizontal"
          iconSize={16}
          onChange={(names: any[]) => {
            onCheckboxGroupChange('statusArr', names)
          }}
        >
          {statusList.map(statusItem => {
            return (
              <Checkbox iconRender={checkboxIconRender} name={statusItem.value} key={statusItem.value} shape="square">
                {statusItem.label}
              </Checkbox>
            )
          })}
        </Checkbox.Group>
        <span className="screen-title">{t`features_orders_spot_spot_filters_modal_510258`}</span>
        <Checkbox.Group
          value={formData.direction}
          direction="horizontal"
          iconSize={16}
          onChange={(names: any[]) => {
            onCheckboxGroupChange('direction', names)
          }}
        >
          {directionList.map(directionItem => {
            return (
              <Checkbox
                iconRender={checkboxIconRender}
                name={directionItem.value}
                key={directionItem.value}
                shape="square"
              >
                {directionItem.label}
              </Checkbox>
            )
          })}
        </Checkbox.Group>

        <div className="flex py-8">
          <Button
            block
            className="mr-4 gray-button"
            onClick={reset}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button block type="primary" onClick={() => onConfirm(formData)}>
            {t`user.field.reuse_10`}
          </Button>
        </div>
      </div>
      <DatePickerModal
        startDate={formData.beginDateNumber!}
        endDate={formData.endDateNumber!}
        visible={dateModalVisible}
        onClose={() => {
          setDateModalVisible(false)
        }}
        dateTemplate="YYYY-MM-DD"
        onCommit={newParams => {
          setFormData({
            ...formData,
            dateType: '',
            beginDateNumber: newParams.startDate,
            endDateNumber: newParams.endDate,
          })
          setDateModalVisible(false)
        }}
      />
    </Popup>
  )
}
