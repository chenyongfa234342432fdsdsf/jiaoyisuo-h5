import { EntrustTypeEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
// import Icon from '@/components/icon'
import classNames from 'classnames'
import { OpenSpots } from '@/hooks/features/order'
import TradeButtonRadios, { TradeButtonRadiosPresetClassNames } from '../trade-button-radios'
import styles from './order.module.css'

export type IOrderHeaderFiltersProps = {
  orderType: EntrustTypeEnum
  onOrderTYpeChange: (value: EntrustTypeEnum) => void
  onCancelAll?: () => void
  hideCanceled?: boolean
  onHideCanceledChange?: (value: boolean) => void
  rightExtra?: React.ReactNode
  openSpots?: OpenSpots
  isCurrentTab?: boolean
}
/**
 * 顶部筛选栏，包括操作和普通、计划的筛选
 */
export function OrderHeaderFilters({
  orderType,
  rightExtra,
  onOrderTYpeChange,
  // hideCanceled,
  // onHideCanceledChange,
  openSpots,
  isCurrentTab,
}: IOrderHeaderFiltersProps) {
  const types = [
    {
      label: `${t`features_orders_order_filters_kwaishj7g9`} ${
        isCurrentTab ? ` (${openSpots?.[EntrustTypeEnum.normal]?.listNums})` : ''
      }`,
      value: EntrustTypeEnum.normal,
    },
    {
      label: `${t`constants/trade-3`} ${isCurrentTab ? ` (${openSpots?.[EntrustTypeEnum.plan]?.listNums})` : ''}`,
      value: EntrustTypeEnum.plan,
    },
    {
      label: `${t`features_orders_order_filters_rfvgyk8h6q`} ${
        isCurrentTab ? ` (${openSpots?.[EntrustTypeEnum.stop]?.listNums})` : ''
      } `,
      value: EntrustTypeEnum.stop,
    },
  ]

  return (
    <div className={classNames(styles['order-filters-header-wrapper'])}>
      <TradeButtonRadios
        cancelable
        hasGap
        bothClassName="px-2 py-1 leading-4"
        inactiveClassName={classNames(TradeButtonRadiosPresetClassNames.spotInActive.sr)}
        activeClassName={classNames(TradeButtonRadiosPresetClassNames.spotActive.brand)}
        options={types}
        onChange={onOrderTYpeChange}
        value={orderType}
      />
      {/* {true && <div className="text-brand_color">{t`features_orders_order_filters_510216`}</div>} */}
      {/* {onHideCanceledChange && (
        <div className="flex items-center">
          {/* <Switch size={12} checked={hideCanceled} onChange={onHideCanceledChange} /> */}
      {/* <div
            onClick={() => {
              onHideCanceledChange(!hideCanceled)
            }}
            className="flex justify-between items-center"
          >
            {hideCanceled ? <Icon name="login_agreement_unselected" /> : <Icon name="login_agreement_selected" />}
            <span className="text-xs text-text_color_03 ml-1">{t`features_orders_order_filters_5101235`}</span>
          </div>
        </div>
      )}  */}

      {rightExtra}
    </div>
  )
}
