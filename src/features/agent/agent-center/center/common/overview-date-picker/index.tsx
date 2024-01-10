/**
 * 代理中心 - 数据总览自定义时间筛选
 */
import { Button, DatetimePicker, Popup, Toast } from '@nbit/vant'
import { useState } from 'react'
import { useGetState, useUpdateEffect } from 'ahooks'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { CheckTimeDifference, formatDate } from '@/helper/date'
import styles from './index.module.css'

interface OverviewDatePickerProps {
  visible: boolean
  startTime?: number
  endTime?: number
  onClose: () => void
  onChange: (e) => void
}

enum DateTypeEnum {
  start = 'start',
  end = 'end',
}

function OverviewDatePicker(props: OverviewDatePickerProps) {
  const { visible, startTime, endTime, onClose, onChange } = props || {}
  const [formData, setFormData, getFormData] = useGetState({ startTime, endTime })
  const [hintVisible, setHintVisible] = useState(false)
  const [activeDate, setActiveDate] = useState(DateTypeEnum.start)
  const [errText, setErrText] = useState('')

  const onCommit = () => {
    if (errText) return

    const { startTime: start, endTime: end } = getFormData()
    onChange({ startTime: start, endTime: end })
    onClose()
  }

  useUpdateEffect(() => {
    const { startTime: start, endTime: end } = getFormData()

    let nErr = ''
    if (!start || !end) {
      nErr = t`features_agent_agent_center_center_common_overview_date_picker_index_icvdj21fy6`
    } else if (CheckTimeDifference(start, end)) {
      nErr = t`features_agent_agent_center_center_common_overview_date_picker_index_wdlz_s1j8u`
    } else if (start && end && start > end) {
      nErr = t`features_agent_agent_center_center_common_overview_date_picker_index_ybdvzinq99`
    }

    setErrText(nErr)
  }, [formData?.startTime, formData?.endTime])

  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={onClose}
      className={styles['overview-date-picker-root']}
      closeOnPopstate
      safeAreaInsetBottom
      destroyOnClose
    >
      <div className="picker-header">
        <div className="header-cancel" onClick={onClose}>
          {t`assets.financial-record.cancel`}
        </div>
        <div className="header-title">{t`features_agent_agent_gains_detail_index_5101378`}</div>
        <div className="header-cancel !text-brand_color" onClick={onCommit}>
          {t`common.confirm`}
        </div>
      </div>

      <div className="picker-content">
        <div className="flex items-center mb-4">
          <div className="date-hint">{t`features_agent_agent_center_center_common_overview_date_picker_index_akztvjlyzm`}</div>
          <Icon name="msg" hasTheme className="hint-icon" onClick={() => setHintVisible(true)} />
        </div>

        <div className="date-info-content">
          <div className="date-info-wrap">
            <div
              className={classNames('date-info', {
                active: activeDate === DateTypeEnum.start,
              })}
              onClick={() => setActiveDate(DateTypeEnum.start)}
            >
              {formData?.startTime ? formatDate(formData?.startTime) : '--'}
            </div>
            <div className="date-interval">{t`features_assets_financial_record_datetime_search_index_602`}</div>
            <div
              className={classNames('date-info', {
                active: activeDate === DateTypeEnum.end,
              })}
              onClick={() => setActiveDate(DateTypeEnum.end)}
            >
              {formData?.endTime ? formatDate(formData?.endTime) : '--'}
            </div>
          </div>
          {errText && <div className="err-text">{errText}</div>}
        </div>

        <DatetimePicker
          type="date"
          showToolbar={false}
          onCancel={onClose}
          maxDate={new Date()}
          value={
            activeDate === DateTypeEnum.start ? new Date(formData?.startTime || '') : new Date(formData?.endTime || '')
          }
          onChange={value => {
            if (activeDate === DateTypeEnum.start) {
              setFormData({
                ...getFormData(),
                startTime: new Date(new Date(new Date(value).getTime()).setHours(0, 0, 0, 0)).getTime(),
              })
              return
            }

            setFormData({
              ...getFormData(),
              endTime: new Date(new Date(new Date(value).getTime()).setHours(23, 59, 59, 59)).getTime(),
            })
          }}
        />
      </div>

      <Popup className={styles['hint-popup-wrapper']} visible={hintVisible} onClose={() => setHintVisible(false)}>
        <div className="popup-title">{t`features_agent_agent_gains_detail_index_5101379`}</div>
        <div className="popup-content">
          {t`features_agent_agent_center_center_common_overview_date_picker_index_6jyvz9fe_g`}
        </div>
        <Button type="primary" className="popup-btn" onClick={() => setHintVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </Popup>
  )
}

export { OverviewDatePicker }
