import { Popup, DatetimePicker, Field } from '@nbit/vant'
import { formatDate, getBeforeDate, getDiff } from '@/helper/date'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import Styles from './index.module.css'

const defaultDateMark = 'start'
export function SelectDateGroup({ isShow, selectConfirm, cancelFunc, dateData }) {
  const [dateValue, setDateValue] = useState(dateData)
  const [activeMark, setActiveMark] = useState(defaultDateMark)
  const [errText, setErrText] = useState('')
  const dateValidate = () => {
    let text = ''
    // 完成前先进行校验
    const diffTime = dayjs(formatDate(dateValue.start, 'YYYY-MM-DD')).diff(formatDate(dateValue.end, 'YYYY-MM-DD'))
    // 如果起始日期大于截止日期
    if (diffTime > 0) {
      text = t`features_assets_financial_record_datetime_search_index_510168`
    }
    setErrText(text)
  }
  const confirmClick = () => {
    if (errText) return
    selectConfirm(dateValue)
  }
  useEffect(() => {
    dateValidate()
  }, [dateValue])
  return (
    <Popup
      onClickOverlay={cancelFunc}
      visible={isShow}
      position="bottom"
      round
      className={classNames(Styles['select-date-group'])}
    >
      <div className="header">
        <span onClick={() => cancelFunc()}>{t`assets.financial-record.cancel`}</span>
        <span className="confirm" onClick={confirmClick}>
          {t`assets.financial-record.complete`}
        </span>
      </div>
      <div className="date">
        <span
          onClick={() => setActiveMark('start')}
          className={classNames('time', {
            active: activeMark === 'start',
          })}
        >
          {formatDate(dateValue.start, 'YYYY-MM-DD')}
        </span>
        <span className="center">{t`features_assets_financial_record_datetime_search_index_602`}</span>
        <span
          onClick={() => setActiveMark('end')}
          className={classNames('time', {
            active: activeMark === 'end',
          })}
        >
          {formatDate(dateValue.end, 'YYYY-MM-DD')}
        </span>
      </div>
      <p>{errText && <span className="err-text">*{errText}</span>}</p>
      <DatetimePicker
        type="date"
        showToolbar={false}
        minDate={new Date(getBeforeDate(90))}
        maxDate={new Date()}
        value={new Date(dateValue[activeMark])}
        onChange={val => {
          setDateValue(pre => {
            return { ...pre, [activeMark]: val }
          })
        }}
      />
    </Popup>
  )
}
