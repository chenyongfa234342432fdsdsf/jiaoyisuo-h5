import Icon from '@/components/icon'
import Slider from '@/components/slider'
import { formatCurrency } from '@/helper/decimal'
import TradePriceInput from '@/features/trade/common/price-input'
import { getCurrentLeverConfig, getLeverSliderPoints } from '@/helper/trade'
import { ITradePairLever } from '@/typings/api/trade'
import classNames from 'classnames'
import TradeButtonRadios from '@/features/trade-button-radios'
import { TradeDirectionEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import BaseLever from '@/components/lever'
import styles from './index.module.css'
import { useFutureComputerContext } from './context'

export function DirectionLever() {
  const directionOptions = [
    {
      label: t`constants_order_743`,
      value: TradeDirectionEnum.buy,
    },
    {
      label: t`constants_order_744`,
      value: TradeDirectionEnum.sell,
    },
  ]

  const { onLeverChange, onDirectionChange, tradeInfo } = useFutureComputerContext()
  const leverList = tradeInfo.selectedFuture!.tradePairLeverList || []
  const currentLeverConfig = getCurrentLeverConfig(tradeInfo.lever, leverList)

  return (
    <div className={classNames(styles['direction-lever-wrapper'], 'px-4')}>
      <div className="mb-6">
        <TradeButtonRadios
          hasGap
          gapSize="sm"
          bothClassName="text-sm py-1 font-medium h-30 first:mr-4"
          inactiveClassName="text-text_color_01 bg-bg_sr_color rounded"
          activeClassName={classNames('text-white', {
            'bg-buy_up_color': tradeInfo.direction === TradeDirectionEnum.buy,
            'bg-sell_down_color': tradeInfo.direction === TradeDirectionEnum.sell,
          })}
          options={directionOptions}
          onChange={onDirectionChange}
          value={tradeInfo.direction}
        />
      </div>
      <div className="mb-2">
        <BaseLever value={tradeInfo.lever} onChange={onLeverChange} leverList={leverList} />
      </div>
      <div>
        <div className="text-xs text-text_color_02">
          <Icon name="prompt-symbol" className="text-xs scale-50 origin-left" />
          <span>{t`features_future_computer_common_direction_lever_qmt81twbdvona-tvkel4n`}</span>
          <span className="text-text_color_01 font-medium">
            {formatCurrency(currentLeverConfig.maxLimitAmount)} {tradeInfo.selectedFuture?.baseSymbolName}
          </span>
        </div>
      </div>
    </div>
  )
}
