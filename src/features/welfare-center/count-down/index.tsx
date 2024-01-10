import { useCountDown } from 'ahooks'

import { memo, useState } from 'react'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { TernaryOptionTradeDirectionEnum } from '@/constants/ternary-option'
import Icon from '@/components/icon'
import Styles from './index.module.css'

interface CountDownProps {
  restSecond: number
  fromActivity?: boolean
  // setRestSecond: (v) => void
}

function CountDown(props: CountDownProps) {
  const { restSecond, fromActivity } = props

  const [isOver, setIsOver] = useState<boolean>(false)
  const [countdown, formattedRes] = useCountDown({
    targetDate: Number(restSecond),
    onEnd: () => {
      setIsOver(true)
    },
  })

  const { days, hours, minutes, seconds, milliseconds } = formattedRes

  return isOver || !restSecond ? null : (
    <div
      className={classNames(Styles.scoped, 'over-hidden')}
      style={{
        borderRadius: fromActivity ? '4px' : '0 4px',
      }}
    >
      <Icon name="icon_personal_time" className="text-[10px] text-text_color_02 h-[10px] !mt-0" />
      <span className="time ml-1">{`${t`features_welfare_center_count_down_index_nejnqsowtd`} ${days || ''}${
        days ? `${t`components_chart_indicator_pop_index_510190`}` : ''
      }${hours}${t`features_welfare_center_count_down_index_iayksjsbv2`}${minutes}${t`features_ternary_option_option_order_ternary_history_spot_select_filters_hdyxin04z4`}`}</span>
    </div>
  )
}

export default memo(CountDown)
