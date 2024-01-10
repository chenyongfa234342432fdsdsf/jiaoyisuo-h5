import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useExchangeContext } from '../exchange/context'
import styles from './index.module.css'

export function PercentButtons() {
  const { tradeInfo, isBuy, onPercentChange } = useExchangeContext()
  const percentButtons = [
    {
      text: '1/5',
      value: 25,
    },
    {
      text: '1/3',
      value: 50,
    },
    {
      text: '1/2',
      value: 75,
    },
    {
      text: t`common.all`,
      value: 100,
    },
  ]

  return (
    <div className={styles['percent-buttons-wrapper']}>
      {percentButtons.map(item => {
        const lastActive = percentButtons.find(v => tradeInfo.percent === v.value)
        return (
          <div
            onClick={() => onPercentChange(item.value)}
            key={item.value}
            className={classNames('percent-button', {
              'is-buy': isBuy,
              // 不仅要大于，最后一个还要相等
              'active': !!lastActive && tradeInfo.percent >= item.value,
            })}
          >
            <div className="bg-block"></div>
            <div>{item.value}%</div>
          </div>
        )
      })}
    </div>
  )
}
