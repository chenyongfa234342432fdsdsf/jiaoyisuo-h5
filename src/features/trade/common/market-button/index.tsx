import Icon from '@/components/icon'
import classNames from 'classnames'
import styles from './index.module.css'

export type IMarketButton = {
  active: boolean
  onClick: () => void
}
/**
 * 市价图标按钮
 */
export function MarketButton({ active, onClick }: IMarketButton) {
  return (
    <div
      className={classNames(styles['market-button-wrapper'], {
        active,
      })}
      onClick={onClick}
    >
      <div className="icon">
        <Icon
          name={active ? 'icon_trade_market_price_selected' : 'icon_trade_market_price_unselected'}
          hasTheme={!active}
          className="text-xl"
        />
      </div>
    </div>
  )
}
