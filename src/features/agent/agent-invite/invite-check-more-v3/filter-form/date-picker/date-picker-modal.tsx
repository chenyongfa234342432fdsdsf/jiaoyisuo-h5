/**
 * 日期选择弹窗
 */
import { ComponentProps, useState } from 'react'
import { DatetimePicker } from '@nbit/vant'
import { useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import styles from './index.module.css'

interface DatePickerModalProps {
  /** 当前显示的时间 */
  value?: Date | number
  datePickerConfig?: ComponentProps<typeof DatetimePicker>
  onChange?: (v: ReturnType<typeof DatePickerValueFormat>) => void
  className?: string
  /** 当前激活的对应日期组件 */
  active: ActiveType
}

enum DateTypeEnum {
  start = 'start',
  end = 'end',
}
type ActiveType = {
  start: boolean
  end: boolean
}

export function DatePickerValueFormat(startDate, endDate) {
  return {
    startDate,
    endDate,
  }
}

function DatePickerModal(props: DatePickerModalProps) {
  const { datePickerConfig, onChange, className, value, active } = props
  const [activeDate, setActiveDate] = useState(DateTypeEnum.start)
  const [startDate, setStartDate] = useState<number | undefined>()
  const [endDate, setEndDate] = useState<number | undefined>()

  useUpdateEffect(() => {
    onChange && onChange(DatePickerValueFormat(startDate, endDate))
  }, [startDate, endDate])

  useUpdateEffect(() => {
    setActiveDate(active.start ? DateTypeEnum.start : DateTypeEnum.end)
  }, [active])
  const { columnsTop, ...rest } = datePickerConfig || {}

  return (
    <div className={classNames(styles['date-picker-modal-root'], className)}>
      <div className="date-picker-modal-wrapper">
        <DatetimePicker
          type="date"
          maxDate={new Date()}
          showToolbar={false}
          value={new Date(value!)}
          onChange={value => {
            if (activeDate === DateTypeEnum.start) {
              setStartDate(new Date(new Date(new Date(value).getTime()).setHours(0, 0, 0, 0)).getTime())
              return
            }

            setEndDate(new Date(new Date(new Date(value).getTime()).setHours(23, 59, 59, 59)).getTime())
          }}
          columnsTop={<>{columnsTop}</>}
          {...(rest as typeof DatetimePicker)}
        />
      </div>
    </div>
  )
}
export default DatePickerModal
