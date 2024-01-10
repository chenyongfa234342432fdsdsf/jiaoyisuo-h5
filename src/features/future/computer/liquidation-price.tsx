import PriceInput from '@/features/trade/common/price-input'
import { Button } from '@nbit/vant'
import { replaceEmpty } from '@/helper/filters'
import { IncreaseTag } from '@nbit/react'
import { useEffect, useState } from 'react'
import { calcLiquidationPrice } from '@/helper/computer'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useFutureComputerContext } from './common/context'
import { DirectionLever } from './common/direction-lever'
import { FormBox } from './common/form-box'
import { AmountInput, EntrustPriceInput } from './common/input-control'

const defaultResult = { liquidationPrice: '' }

function Result({ result }: { result: typeof defaultResult }) {
  const { buySymbol } = useFutureComputerContext()

  const { liquidationPrice } = result

  const props = [
    {
      label: t`features_future_computer_index_7umxmqpwefqektdsnv52f`,
      value: (
        <div>
          <IncreaseTag hasColor={false} hasPrefix={false} value={replaceEmpty(liquidationPrice)} kSign /> {buySymbol}
        </div>
      ),
    },
  ]

  return (
    <div className="px-4">
      {props.map(prop => {
        return (
          <div key={prop.label} className="mb-2 flex items-center justify-between">
            <div className="text-text_color_02">{prop.label}</div>
            <div className="break-all w-8/12 text-right">{liquidationPrice ? prop.value : '--'}</div>
          </div>
        )
      })}
      <div className="mb-2 text-xs">
        <Icon name="prompt-symbol" className="text-xs scale-50 origin-left" />
        <span className="text-text_color_02">{t`features_future_computer_liquidation_price_30rx0c5-sqj0nwao9tedu`}</span>
      </div>
    </div>
  )
}

export function LiquidationPrice() {
  const { onExtraMarginChange, unitIsQuote, buySymbol, buyDigit, priceDigit, tradeInfo } = useFutureComputerContext()
  // 可不输入额外保证金
  const disabled = !tradeInfo.entrustPrice || (unitIsQuote ? !tradeInfo.amount : !tradeInfo.entrustAmount)
  const [calcResult, setCalcResult] = useState(defaultResult)
  const calc = () => {
    const params = {
      ...tradeInfo,
      digit: priceDigit || 2,
    }
    setCalcResult({
      liquidationPrice: calcLiquidationPrice(params),
    })
  }
  useEffect(() => {
    setCalcResult(defaultResult)
  }, [tradeInfo.selectedFuture])

  return (
    <div>
      <DirectionLever />
      <div className="mb-4"></div>
      <EntrustPriceInput />
      <AmountInput />
      <FormBox title={t`features/trade/future/exchange-8`}>
        <PriceInput
          label={`${t`features/trade/future/exchange-8`} (${buySymbol})`}
          placeholder={t`features_assets_futures_common_withdraw_modal_index_5101412`}
          paddingSize="large"
          digit={priceDigit}
          onChange={onExtraMarginChange}
          value={tradeInfo.extraMargin}
          onlyInput
        />
      </FormBox>
      <div className="h-4"></div>
      <Result result={calcResult} />
      <div className="px-4 fixed bottom-10 w-full">
        <Button onClick={calc} block className="rounded" disabled={disabled} type="primary">
          {t`features_future_computer_close_price_d4z3kvrmrzbh7romfbg19`}
        </Button>
      </div>
    </div>
  )
}
