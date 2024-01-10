import { t } from '@lingui/macro'
import TradeFormItemBox from './form-item-box'

export function MarketPriceBox({ onClick }: { onClick?: () => void }) {
  return (
    <TradeFormItemBox className="flex-1 flex items-center border border-dashed border-line_color_01" onClick={onClick}>
      <div className="text-text_color_03 text-sm font-medium">{t`features/trade/future/price-input-0`}</div>
    </TradeFormItemBox>
  )
}
