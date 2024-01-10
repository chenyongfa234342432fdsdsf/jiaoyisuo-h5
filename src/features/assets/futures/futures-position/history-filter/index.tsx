/**
 * 历史仓位 - 时间筛选弹窗
 */
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import CommonDatePicker from '@/components/common-date-picker'
import { AssetsRecordDateTypeEnum } from '@/constants/assets/common'
import { getBeforeDate } from '@/helper/date'
import { useState } from 'react'
import styles from './index.module.css'

interface IHistoryPositionFilterProps {
  historyForm: any
  visible: boolean
  onClose: () => void
  onChange: (e) => void
}
function HistoryPositionFilter(props: IHistoryPositionFilterProps) {
  const { visible, historyForm, onClose, onChange } = props || {}
  const defaultFormData = {
    /** 时间类型 */
    dateType: AssetsRecordDateTypeEnum.week,
    /** 开始时间 */
    startTime: getBeforeDate(AssetsRecordDateTypeEnum.week) || 0,
    /** 结束时间 */
    endTime: new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 59)).getTime(),
  }
  const [form, setForm] = useState({ ...historyForm })

  return (
    <Popup
      visible={visible}
      position="bottom"
      round
      className={styles['history-position-filter-root']}
      lockScroll
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
      onClose={onClose}
    >
      <div className="modal-warp">
        <div className="modal-header">
          <span>{t`features/assets/financial-record/record-screen-modal/index-0`}</span>
          <Icon hasTheme name="close" className="close-icon" onClick={onClose} />
        </div>
        <CommonDatePicker
          onChange={params =>
            setForm({ ...form, startTime: params.startDate, endTime: params.endDate, dateType: params.dateType })
          }
          startDate={form.startTime}
          endDate={form.endTime}
          dateType={form.dateType}
          dateTemplate={'YYYY-MM-DD'}
        />

        <div className="modal-bottom">
          <Button className="btn reset-btn" onClick={() => setForm({ ...historyForm, ...defaultFormData })}>
            {t`features/assets/financial-record/record-screen-modal/index-1`}
          </Button>
          <Button
            className="btn !mr-0"
            type="primary"
            onClick={() => {
              onChange({ ...form })
              onClose()
            }}
          >{t`common.confirm`}</Button>
        </div>
      </div>
    </Popup>
  )
}

export { HistoryPositionFilter }
