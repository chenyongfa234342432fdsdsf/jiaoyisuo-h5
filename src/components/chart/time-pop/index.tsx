import { Button, Popup, Toast } from '@nbit/vant'
import { useState } from 'react'
import classNames from 'classnames'
import { SwitchTimeType, timeLocaleLanguageMap } from '@nbit/chart-utils'
import { initialShareTimeList as _initialShareTimeList } from '@/constants/market'

import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useMarketStore } from '@/store/market'
import { usePageContext } from '@/hooks/use-page-context'

interface PropsType {
  setPopTimeState: (v) => void
  popTimeState: boolean
}

function TimePop(props: PropsType) {
  const marketState = useMarketStore()
  const { setPopTimeState, popTimeState } = props
  const totalShareTimeList = marketState.totalShareTimeList
  const initialShareTimeList = marketState.initialShareTimeList

  const [initialShareTimeListCopy, setInitialShareTimeListCopy] = useState<Array<SwitchTimeType>>(
    JSON.parse(JSON.stringify(initialShareTimeList))
  )
  const restShareTimeList = marketState.restShareTimeList

  const updateInitialShareTimeList = marketState.updateInitialShareTimeList
  const updateRestShareTimeList = marketState.updateRestShareTimeList

  const pageContext = usePageContext()
  const locale = pageContext.locale || ''

  const onTimeClose = () => setPopTimeState(false)

  /** 是否选中 */
  const checkShareTime = (list, value) => {
    const result = list.filter(item => {
      return `${item.value}${item.unit}` === `${value.value}${value.unit}`
    }).length

    return !!result
  }

  /** 选择时间 */
  const selectTime = item => {
    if (!checkShareTime(initialShareTimeListCopy, item)) {
      if (initialShareTimeListCopy.length === 5) {
        Toast.info(t`components_chart_time_pop_index_510194`)
        return
      }
      setInitialShareTimeListCopy(initialShareTimeListCopy.concat([{ ...item }]))
    } else {
      const list: Array<SwitchTimeType> = []
      initialShareTimeListCopy.forEach(_item => {
        if (`${item.unit}${item.value}` !== `${_item.unit}${_item.value}`) {
          list.push(_item)
        }
      })
      setInitialShareTimeListCopy(list)
    }
  }

  /** 重置时间 */
  const resetTime = () => {
    setInitialShareTimeListCopy(_initialShareTimeList)
  }

  /** 确认选择时间 */
  const confirmTime = () => {
    if (initialShareTimeListCopy.length !== 5) {
      Toast.info(t`components_chart_time_pop_index_510194`)
      return
    }
    updateInitialShareTimeList(initialShareTimeListCopy)
    setPopTimeState(false)
  }

  /** 返回 */
  const backHeightPop = () => {
    setPopTimeState(false)
  }

  return (
    <Popup visible={popTimeState} className="h-full" position="bottom" onClose={onTimeClose}>
      <div className="chart-time-set-pop">
        <Icon onClick={backHeightPop} hasTheme name={'back'} className="icon" />

        <h1 className="title">{t`components_chart_chart_pop_index_510151`}</h1>

        <div className="divide"></div>

        <h2 className="show-cycle">
          {t`components_chart_time_pop_index_510195`}(
          <span className="text-brand_color">{`${initialShareTimeListCopy.length}`}</span>
          {`/5)`}
        </h2>

        <div className="time-select">
          {totalShareTimeList.map((item, index) => {
            return (
              <Button
                className={classNames('button', {
                  'bg-brand_color_special_02': checkShareTime(initialShareTimeListCopy, item),
                  'text-text_color_01': checkShareTime(initialShareTimeListCopy, item),
                  'text-text_color_02': !checkShareTime(initialShareTimeListCopy, item),
                  'button-border': checkShareTime(initialShareTimeListCopy, item),
                })}
                key={`${item.unit}${item.value}`}
                onClick={() => {
                  selectTime(item)
                }}
              >
                {timeLocaleLanguageMap[locale][`${item.value}${item.unit}`]}
              </Button>
            )
          })}
        </div>

        <div className="oper">
          <Button className="button bg-bg_sr_color" onClick={resetTime}>
            {t`features/assets/financial-record/record-screen-modal/index-1`}
          </Button>
          <Button
            onClick={confirmTime}
            disabled={initialShareTimeListCopy?.length < 5}
            type="primary"
            className={classNames('button', 'bg-brand_color')}
          >
            {t`user.field.reuse_10`}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default TimePop
