import { Popup, Button } from '@nbit/vant'
import { formatDate, getBeforeDate } from '@/helper/date'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import Styles from './index.module.css'
import { SelectDateGroup } from './components/select-date-goup'

export default function FilterPop({ visable, dateData, filterConfirm, cancelClick }) {
  const [isShow, setIsShow] = useState(false)
  const [selectDayPeriod, setSelectPeriod] = useState<number>()
  const [dateDate, setDateData] = useState(dateData)
  // 日期选择
  const selectConfirm = val => {
    const DAY_MS = 24 * 60 * 60 * 1000
    const start = new Date(formatDate(val.start)).setHours(0, 0, 0, 0)
    const end = new Date(formatDate(val.end)).setHours(23, 59, 59, 0)
    const diffDay = (end - start) / DAY_MS
    setSelectPeriod(Math.ceil(diffDay))
    setDateData({
      start,
      end,
    })
    setIsShow(false)
  }
  const dayPeriodArray = [
    { name: t`constants/assets/common-17`, value: 1 },
    { name: t`constants/assets/common-18`, value: 7 },
    { name: t`constants/assets/common-19`, value: 30 },
    { name: t`constants/assets/common-20`, value: 90 },
  ]
  // 进行日期区间选择设置
  const selectDateRange = value => {
    setSelectPeriod(value)
    const oneDay = 1
    const start = new Date(formatDate(getBeforeDate(value - oneDay) || new Date().getTime())).setHours(0, 0, 0, 0)
    const end = new Date(formatDate(new Date().setHours(23, 59, 59, 0))).getTime()
    setDateData({
      start,
      end,
    })
  }
  const confirmClick = () => {
    filterConfirm && filterConfirm(dateDate)
  }
  const resetClick = () => {
    selectDateRange(7)
  }
  useEffect(() => {
    selectConfirm(dateData)
  }, [dateData])
  return (
    <Popup
      position="bottom"
      className={classNames(Styles['filter-pop'])}
      title={t`features/assets/financial-record/record-screen-modal/index-0`}
      closeable
      onClickOverlay={cancelClick}
      onClickCloseIcon={cancelClick}
      visible={visable}
    >
      <div>
        <h4>{t`future.funding-history.funding-rate.column.time`}</h4>
        <div className="date">
          <span onClick={() => setIsShow(true)}>{formatDate(dateDate.start, 'YYYY-MM-DD')}</span>
          {t`features_assets_financial_record_datetime_search_index_602`}
          <span onClick={() => setIsShow(true)}>{formatDate(dateDate.end, 'YYYY-MM-DD')}</span>
        </div>
        <div className="date-tag">
          {dayPeriodArray.map(i => {
            return (
              <span
                key={i.value}
                className={classNames({
                  active: selectDayPeriod === i.value,
                })}
                onClick={() => selectDateRange(i.value)}
              >
                {i.name}
              </span>
            )
          })}
        </div>
        <div className="filter-btn">
          <Button
            className="reset"
            onClick={resetClick}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button className="confirm" onClick={confirmClick}>
            {t`common.confirm`}
          </Button>
        </div>
      </div>
      {isShow && (
        <SelectDateGroup
          dateData={dateDate}
          cancelFunc={() => setIsShow(false)}
          selectConfirm={selectConfirm}
          isShow={isShow}
        />
      )}
    </Popup>
  )
}
