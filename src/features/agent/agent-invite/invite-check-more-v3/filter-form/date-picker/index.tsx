/**
 * 日期选择组件
 */
import { t } from '@lingui/macro'
import { ReactNode, useEffect, useState } from 'react'
import { DateFormatTemplate, getBeforeDate, CheckTimeDifference, formatDate } from '@/helper/date'
import { AssetsRecordDateTypeEnum } from '@/constants/assets/common'
import { tr } from 'make-plural'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { Button, Popup } from '@nbit/vant'
import { useUpdateEffect } from 'ahooks'
import DatePickerModal from './date-picker-modal'
import styles from './index.module.css'

type IDateTypeList = {
  label: string
  value: number
}

interface CommonDatePickerProps {
  /** 是否展示组件标题，默认展示 */
  showTitle?: boolean
  /** 组件标题，默认：时间 */
  title?: string
  /** 是否展示日期选择类型，默认展示 */
  showDateType?: boolean
  /** 日期类型列表，默认：最近 1 天/最近 1 周/最近 1 月/最近 3 月 */
  dateTypeList?: IDateTypeList[]
  /** 日期类型 */
  dateType?: number
  /** 自定义日期类型 */
  dateTypeNode?: ReactNode
  /** 时间格式，默认：YYYY-MM-DD HH:mm:ss */
  dateTemplate?: string
  /** 开始时间 */
  startDate?: number
  /** 结束时间 */
  endDate?: number
  /** 最大日期选择区间，不显示日期选择类型时可选 */
  max?: number
  /** 修改时间 */
  onChange: (e: any) => void
  dateValidateResult: (result: boolean) => void
}

function CommonDatePicker(props: CommonDatePickerProps) {
  /** 时间类型列表 */
  const dateTypList = [
    { label: t`constants/assets/common-17`, value: AssetsRecordDateTypeEnum.day },
    { label: t`constants/assets/common-18`, value: AssetsRecordDateTypeEnum.week },
    { label: t`constants/assets/common-19`, value: AssetsRecordDateTypeEnum.month },
    { label: t`constants/assets/common-20`, value: AssetsRecordDateTypeEnum.threeMonths },
  ]
  const defaultEnd = new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 59)).getTime()

  const {
    showDateType = true,
    title = t`future.funding-history.index-price.column.time`,
    showTitle = true,
    dateTemplate = DateFormatTemplate.default,
    dateTypeList = dateTypList,
    dateType = AssetsRecordDateTypeEnum.week,
    startDate,
    endDate,
    dateTypeNode = null,
    max,
    onChange,
    dateValidateResult,
  } = props
  // 显示哪个的日期选择组件
  const [visible, setVisible] = useState({
    start: true,
    end: false,
  }) // 是否展示日期选择弹窗
  const [hintVisible, setHintVisible] = useState(false)
  const [errInfo, setErrInfo] = useState({ timeErr: '' })
  useEffect(() => {}, [startDate, endDate, dateType])

  useUpdateEffect(() => {
    // 数据验证逻辑
    const newErrorInfo = { timeErr: '' }
    if ((startDate && !endDate) || (!startDate && endDate)) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_overview_date_picker_index_icvdj21fy6`
    } else if (CheckTimeDifference(startDate, endDate)) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_3o2xhtpol9`
    } else if (startDate && endDate && startDate > endDate) {
      newErrorInfo.timeErr = t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_ffo9pjxjpu`
    } else {
      newErrorInfo.timeErr = ''
    }

    setErrInfo(newErrorInfo)
    dateValidateResult && dateValidateResult(!newErrorInfo.timeErr)
  }, [startDate, endDate])
  return (
    <div className={styles['common-date-wrapper']}>
      {showTitle && <span className="title">{title}</span>}

      <div className="date">
        <div
          className={classNames('date-item', {
            active: visible.start,
          })}
          onClick={() =>
            setVisible({
              start: true,
              end: false,
            })
          }
        >
          {startDate ? formatDate(startDate, dateTemplate) : '--'}
        </div>
        <div className="separate">{t`features_assets_financial_record_datetime_search_index_602`}</div>
        <div
          className={classNames('date-item', {
            active: visible.end,
          })}
          onClick={() =>
            setVisible({
              start: false,
              end: true,
            })
          }
        >
          {endDate ? formatDate(endDate, dateTemplate) : '--'}
        </div>
      </div>
      <div className="flex items-center mb-1 !mt-2">
        <div className="date-hint">
          {t`features_agent_agent_gains_detail_index_5101383`} 12 {t`features_agent_agent_gains_detail_index_5101384`}
        </div>
        <Icon name="msg" hasTheme className="hint-icon" onClick={() => setHintVisible(true)} />
      </div>
      {errInfo?.timeErr && <div className="err-text">{errInfo.timeErr}</div>}

      {visible && (
        <DatePickerModal
          value={
            visible.start ? new Date(startDate || new Date().getTime()) : new Date(endDate || new Date().getTime())
          }
          active={visible}
          onChange={dateData => {
            const { startDate: newStartDate, endDate: newEndDate } = dateData
            onChange({ startDate: newStartDate, endDate: newEndDate })
          }}
        />
      )}

      <Popup className={styles['hint-popup-wrapper']} visible={hintVisible} onClose={() => setHintVisible(false)}>
        <div className="popup-title">{t`features_agent_agent_gains_detail_index_5101379`}</div>
        <div className="popup-content">
          {t`features_agent_agent_center_center_common_invite_details_invite_filter_modal_index_kqhqiucgpy`}
        </div>
        <Button type="primary" className="popup-btn" onClick={() => setHintVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </div>
  )
}
export default CommonDatePicker
