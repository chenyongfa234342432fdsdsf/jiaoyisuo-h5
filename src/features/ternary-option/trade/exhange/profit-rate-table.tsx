import { ITernaryOptionTradeProfitRate } from '@/typings/api/ternary-option'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { formatCurrency, formatNumberDecimalWhenExceed, getPercentDisplay } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useMount } from 'ahooks'
import { useRef } from 'react'
import { t } from '@lingui/macro'
import { useCommonStore } from '@/store/common'
import styles from './order-form-modal.module.css'
import { useOptionExchangeContext } from './context'

type IProfitRateTableProps = {
  value?: ITernaryOptionTradeProfitRate
  onChange: (value: ITernaryOptionTradeProfitRate) => void
  profitRates: ITernaryOptionTradeProfitRate[]
}

export function ProfitRateTable({ value, onChange, profitRates }: IProfitRateTableProps) {
  const { currentCoin } = useTernaryOptionStore()
  const { isUp } = useOptionExchangeContext()
  const { isFusionMode } = useCommonStore()
  const ref = useRef<HTMLDivElement>(null)

  useMount(() => {
    if (ref.current) {
      ref.current.scrollIntoView()
    }
  })

  return (
    <div className={classNames('rv-hairline--surround', styles['table-wrapper'])}>
      <div className="rate-list-table w-full">
        <div className="table-header rv-hairline--bottom">
          <div className="rv-hairline--right">{t`features_ternary_option_trade_exhange_order_form_tbcthunudb`}</div>
          <div className="rv-hairline--right">{t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}</div>
          <div>
            {isFusionMode
              ? t`features_ternary_option_trade_exhange_order_form_e0gztgzxmq`
              : t`features/assets/financial-record/record-detail/record-details-info/index-13`}
          </div>
        </div>
        <div className="table-body">
          {profitRates.map(item => {
            const isSelected = item.id === value?.id
            const onClick = () => {
              if (isSelected) return
              onChange(item)
            }
            return (
              <div
                key={item.id}
                className={classNames('rv-hairline--bottom table-tr', {
                  'is-selected': isSelected,
                })}
                ref={isSelected ? ref : undefined}
                onClick={onClick}
              >
                <div className="rv-hairline--right">
                  {isSelected && <Icon hiddenMarginTop name="choose-language_selected" className="text-xs icon" />}
                  {isUp ? '' : '-'}
                  {item.amplitude}
                </div>
                <div className="rv-hairline--right">
                  {formatCurrency(decimalUtils.SafeCalcUtil[isUp ? 'add' : 'sub'](currentCoin.last, item.amplitude))}
                </div>
                <div>{isFusionMode ? formatNumberDecimalWhenExceed(item.yield, 4) : getPercentDisplay(item.yield)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
