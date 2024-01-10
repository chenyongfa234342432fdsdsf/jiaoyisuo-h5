import { useCountDown } from 'ahooks'

import { memo } from 'react'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { TernaryOptionTradeDirectionEnum } from '@/constants/ternary-option'
import Styles from './index.module.css'

interface CountDownProps {
  type: string
  restSecond: number
}

function QuickTradeCountDown(props: CountDownProps) {
  const { restSecond, type } = props

  return (
    <div
      className={classNames(Styles.scoped, {
        'bg-buy_up_color_disable': type === TernaryOptionTradeDirectionEnum.call,
        'bg-sell_down_color_disable': type === TernaryOptionTradeDirectionEnum.put,
      })}
    >
      <span className="time">
        {restSecond}
        {t`features_ternary_option_option_order_ternary_order_item_index_h6owzk3zf6`}
      </span>
    </div>
  )
}

export default memo(QuickTradeCountDown)
