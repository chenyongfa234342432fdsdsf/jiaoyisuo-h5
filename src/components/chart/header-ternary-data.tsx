import { Button } from '@nbit/vant'

import React, { useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'

import { SwitchTimeType, timeLocaleLanguageMap } from '@nbit/chart-utils'
import { t } from '@lingui/macro'

interface PropsType {
  currentChart: string
  setCurrentChart: (value: string) => void
  locale: string
  // getKlineHistoryData: (tradeId: number, timeSharing: SwitchTimeType) => void
  tradeId: number
  curTime: SwitchTimeType
  setCurTime: (value: SwitchTimeType) => void
  setPopState: Dispatch<SetStateAction<boolean>>
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

function HeaderData(props: PropsType) {
  const { locale, curTime, setCurTime } = props

  const totalShareTimeList = [
    {
      unit: 'time',
      value: 1,
    },
    {
      unit: 's',
      value: 1,
    },
    {
      unit: 'm',
      value: 1,
    },
    {
      unit: 'm',
      value: 5,
    },
    {
      unit: 'm',
      value: 15,
    },
  ]
  /**
   * 交易页点击分时
   * @param value
   * @param type
   */
  const tradePageTimeSharingChange = (value, type, e) => {
    e.stopPropagation()

    setCurTime({
      unit: type,
      value,
    })
  }

  return (
    <div className="k-set-wrap">
      <div className="left-wrap trade-left-wrap">
        <div className="tile">
          {totalShareTimeList.map((item, index) => {
            return (
              <div
                key={index}
                onClick={e => tradePageTimeSharingChange(item.value, item.unit, e)}
                className={classNames({
                  'text-brand_color': curTime.value === item.value && curTime.unit === item.unit,
                })}
              >
                {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HeaderData
