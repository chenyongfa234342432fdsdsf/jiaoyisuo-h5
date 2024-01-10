import PriceInput from '@/features/trade/common/price-input'
import { Button } from '@nbit/vant'
import { replaceEmpty } from '@/helper/filters'
import { IncreaseTag } from '@nbit/react'
import { useEffect, useState } from 'react'
import { calcClosePrice } from '@/helper/computer'
import TradeSelect from '@/features/trade/common/select'
import { t } from '@lingui/macro'
import { useFutureComputerContext } from './common/context'
import { DirectionLever } from './common/direction-lever'
import { FormBox } from './common/form-box'
import { AmountInput, EntrustPriceInput } from './common/input-control'

const defaultResult = { closePrice: '' }

function Result({ result }: { result: typeof defaultResult }) {
  const { buySymbol } = useFutureComputerContext()

  const { closePrice } = result

  const props = [
    {
      label: t`features_future_computer_close_price_6qaxptc489nh72pe142tq`,
      value: (
        <div>
          <IncreaseTag hasColor={false} hasPrefix={false} value={replaceEmpty(closePrice)} kSign /> {buySymbol}
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
            <div className="break-all w-7/12 text-right">{closePrice ? prop.value : '--'}</div>
          </div>
        )
      })}
    </div>
  )
}

export function ClosePrice() {
  const {
    onProfitChange,
    unitIsQuote,
    onProfitIsRateChange,
    buyDigit,
    onProfitRateChange,
    buySymbol,
    priceDigit,
    tradeInfo,
  } = useFutureComputerContext()
  const profitIsRate = tradeInfo.profitIsRate
  const [calcResult, setCalcResult] = useState(defaultResult)
  const disabled =
    !tradeInfo.entrustPrice ||
    (profitIsRate ? !tradeInfo.profitRate : !tradeInfo.profit) ||
    (unitIsQuote ? !tradeInfo.amount : !tradeInfo.entrustAmount)
  const calc = () => {
    const params = {
      ...tradeInfo,
      digit: priceDigit || 2,
    }
    setCalcResult({
      closePrice: calcClosePrice(params),
    })
  }
  const profitOptions = [
    {
      value: false,
      text: t`features/assets/financial-record/record-detail/record-details-info/index-12`,
    },
    {
      value: true,
      text: t`features/assets/financial-record/record-detail/record-details-info/index-13`,
    },
  ]
  useEffect(() => {
    setCalcResult(defaultResult)
  }, [tradeInfo.selectedFuture])

  return (
    <div>
      <DirectionLever />
      <div className="mb-4"></div>
      <EntrustPriceInput />
      <AmountInput />
      <FormBox title={t`features_future_computer_close_price_fc9ti-cuyqlgpwb3e-u5f`}>
        <div className="flex items-center">
          <div className="bg-bg_sr_color rounded mr-1">
            <div className="h-10 w-24 flex items-center">
              <TradeSelect
                className="w-full sm-text px-1 h-10"
                options={profitOptions}
                bgTradeParent
                value={profitIsRate}
                onChange={onProfitIsRateChange}
              />
            </div>
          </div>
          <PriceInput
            onlyInput
            paddingSize="large"
            className="bg-bg_sr_color flex-1"
            value={profitIsRate ? tradeInfo.profitRate : tradeInfo.profit}
            digit={profitIsRate ? 2 : buyDigit}
            label={`${
              profitIsRate
                ? t`features_future_computer_close_price_-vbn-gcealxhkzfwbwdgs`
                : t`features_future_computer_close_price_fc9ti-cuyqlgpwb3e-u5f`
            } ${profitIsRate ? '%' : `(${buySymbol})`}`}
            onChange={profitIsRate ? onProfitRateChange : onProfitChange}
          />
        </div>
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
