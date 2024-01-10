import classNames from 'classnames'
import { TradeDirectionEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import styles from './index.module.css'
import { useExchangeContext } from '../exchange/context'

function DirectionButtons() {
  // 这里的样式设定是因为可以保证百分百不会过低
  const downWidth = `calc(48% - 8px)`
  const upWidth = `calc(48% - 8px)`
  const { tradeInfo, onDirectionChange } = useExchangeContext()

  return (
    <div className={classNames(styles['percent-wrapper'])}>
      <div className="bar-wrapper">
        <div
          className={classNames('bar buy', {
            'is-active': tradeInfo.direction === TradeDirectionEnum.buy,
          })}
          style={{
            width: downWidth,
          }}
          onClick={() => {
            onDirectionChange(TradeDirectionEnum.buy)
          }}
        >
          <span className="text">{t`features/market/detail/index-1`}</span>
        </div>
        <div className="h-7 w-4"></div>
        <div
          style={{
            width: upWidth,
          }}
          className={classNames('bar sell', {
            'is-active': tradeInfo.direction === TradeDirectionEnum.sell,
          })}
          onClick={() => {
            onDirectionChange(TradeDirectionEnum.sell)
          }}
        >
          <span className="text">{t`features/market/detail/index-2`}</span>
        </div>
      </div>
    </div>
  )
}

export default DirectionButtons
