import { Button } from '@nbit/vant'

import React, { useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'

import { SwitchTimeType, timeLocaleLanguageMap } from '@nbit/chart-utils'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useMarketStore } from '@/store/market'

interface PropsType {
  currentChart: string
  setCurrentChart: (value: string) => void
  locale: string
  // getKlineHistoryData: (tradeId: number, timeSharing: SwitchTimeType) => void
  tradeId: number
  curTime: SwitchTimeType
  setCurTime: (value: SwitchTimeType) => void
  setPopState: Dispatch<SetStateAction<boolean>>
  from: 'kline' | 'trade'
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

enum ChartVersion {
  Normal = 'normal',
  Dept = 'dept',
}

function HeaderData(props: PropsType) {
  const { currentChart, setCurrentChart, locale, tradeId, curTime, setCurTime } = props

  const marketState = useMarketStore()
  const initialShareTimeList = marketState.initialShareTimeList
  const totalShareTimeList = marketState.totalShareTimeList
  const restShareTimeList = marketState.restShareTimeList
  const timePopRef = useRef<HTMLDivElement | null>(null)

  const [expand, setExpand] = useState(false)
  const [moreTime, setMoreTime] = useState({
    unit: '',
    value: 0,
  })

  /**
   * 点击分时
   * @param value
   * @param type
   */
  const timeSharingChange = (value, type, e) => {
    e.stopPropagation()
    setCurrentChart(ChartVersion.Normal)

    setCurTime({
      unit: type,
      value,
    })

    setMoreTime({
      unit: '',
      value: 0,
    })
  }

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

  /** tab 切换 */
  const onTabChange = item => {
    setCurrentChart(item)
  }

  /** 点击更多 */
  const moreClick = e => {
    e.stopPropagation()
    setExpand(!expand)
  }

  /** 重置 */
  const restButtonClick = (item, e) => {
    e.stopPropagation()

    setExpand(false)
    setMoreTime(item)
    setCurTime(item)
    setCurrentChart(ChartVersion.Normal)
  }

  /** 设置图表指标 */
  const setChartIndicator = () => {
    props.setPopState(true)
  }

  /** 点击页面 */
  const handleDocumentClick = e => {
    if (!timePopRef.current) {
      return
    }
    /** 点击弹窗之内的，不关闭；点击弹窗之外的，关闭 */
    if (!timePopRef.current.contains(e.target as Node) && timePopRef.current !== e.target) {
      setExpand(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return props.from === 'kline' ? (
    <div className="k-set-wrap">
      <div className="left-wrap">
        <div className="tile">
          {initialShareTimeList.map((item, index) => {
            return (
              <div
                key={index}
                onClick={e => {
                  timeSharingChange(item.value, item.unit, e)
                  setExpand(false)
                }}
                className={classNames({
                  'text-brand_color': curTime.value === item.value && curTime.unit === item.unit,
                })}
              >
                {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}
              </div>
            )
          })}
        </div>
        <div className={classNames('icon-wrap')} onClick={moreClick}>
          {moreTime.value ? (
            <span className="text-brand_color">
              {timeLocaleLanguageMap[locale][`${moreTime.value}${moreTime.unit}`]}
            </span>
          ) : (
            <span className="text-text_color_03">{t`features_home_more_toolbar_header_toolbar_index_510105`}</span>
          )}
          <Icon name={expand ? 'regsiter_icon_away_white' : 'regsiter_icon_drop_white'} className="icon" />
        </div>
      </div>
      <div
        ref={timePopRef}
        className={classNames('rest-warp', {
          'show': expand,
          'not-show': !expand,
        })}
      >
        <div className="button-wrap">
          {restShareTimeList.map((item, index) => {
            return (
              <Button
                onClick={e => {
                  restButtonClick(item, e)
                }}
                style={{ border: '0.5px solid var(--line_color_01)' }}
                className={classNames('button', {
                  'bg-brand_color font-semibold': `${moreTime.value}${moreTime.unit}` === `${item.value}${item.unit}`,
                  'bg-bg_color': `${moreTime.value}${moreTime.unit}` !== `${item.value}${item.unit}`,
                })}
                key={index}
              >
                {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}
              </Button>
            )
          })}
        </div>
      </div>
      <div
        onClick={() => {
          onTabChange(ChartVersion.Dept)
        }}
        className={classNames('dept-wrap', {
          'text-text_color_03': currentChart !== ChartVersion.Dept,
          'text-brand_color': currentChart === ChartVersion.Dept,
        })}
      >
        {t`components_chart_header_data_510196`}
      </div>
      <div className="right-wrap">
        <Icon name={'indicator_settings_white'} className="icon" onClick={setChartIndicator} />
      </div>
    </div>
  ) : (
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
