import { EntrustTypeEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { Switch } from '@nbit/vant'
import classNames from 'classnames'
import Icon from '@/components/icon'
import TradeButtonRadios, { TradeButtonRadiosPresetClassNames } from '../../../trade-button-radios'
import styles from './index.module.css'

export type IFutureHeaderFiltersProps = {
  orderType: EntrustTypeEnum
  onOrderTYpeChange: (value: EntrustTypeEnum) => void
  onCancelAll?: () => void
  hideCanceled?: boolean
  onHideCanceledChange?: (value: boolean) => void
  rightExtra?: React.ReactNode
}
/**
 * 顶部筛选栏，包括操作和普通、计划的筛选
 */
export function ContractHeaderFilters({
  orderType,
  rightExtra,
  onOrderTYpeChange,
  onCancelAll,
  hideCanceled,
  onHideCanceledChange,
}: IFutureHeaderFiltersProps) {
  const types = [
    {
      label: t`features_trade_future_settings_order_confirm_634`,
      value: EntrustTypeEnum.normal,
    },
    {
      label: t`features_trade_contract_contract_filters_index_5101498`,
      value: EntrustTypeEnum.stop,
    },
    {
      label: t`constants/trade-3`,
      value: EntrustTypeEnum.plan,
    },
  ]

  const setOnOrderTYpeChange = e => {
    e && onOrderTYpeChange(e)
  }

  return (
    <div className={classNames(styles['order-filters-header-wrapper'], 'rv-hairline--bottom')}>
      <TradeButtonRadios
        cancelable
        hasGap
        bothClassName="px-2 py-1 leading-4"
        inactiveClassName={classNames(TradeButtonRadiosPresetClassNames.inActive.sr, 'text-text_color_02')}
        activeClassName={classNames(TradeButtonRadiosPresetClassNames.active.brand)}
        options={types}
        onChange={setOnOrderTYpeChange}
        value={orderType}
      />
      {onCancelAll && (
        <div className="text-brand_color" onClick={onCancelAll}>
          {t`features_orders_order_filters_510216`}
        </div>
      )}
      {onHideCanceledChange && (
        <div className="headers">
          <Icon
            className="hide-icon"
            name={hideCanceled ? 'asset_view_coin_hide_open' : 'asset_view_coin_hide_close'}
            onClick={() => onHideCanceledChange(!hideCanceled)}
          />

          <span>{t`features_orders_order_filters_5101235`}</span>
        </div>
      )}
      {rightExtra}
    </div>
  )
}
