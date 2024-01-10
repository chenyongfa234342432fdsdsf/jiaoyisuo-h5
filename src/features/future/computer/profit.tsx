import PriceInput from '@/features/trade/common/price-input'
import { Button } from '@nbit/vant'
import { replaceEmpty } from '@/helper/filters'
import { IncreaseTag } from '@nbit/react'
import { useEffect, useState } from 'react'
import { calcMakerFee, calcMargin, calcProfit, calcProfitRate, calcTakerFee } from '@/helper/computer'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useFutureComputerContext } from './common/context'
import { DirectionLever } from './common/direction-lever'
import { FormBox } from './common/form-box'
import { AmountInput, EntrustPriceInput } from './common/input-control'

const defaultResult = { profit: '', profitRate: '', takerFee: '', makerFee: '', margin: '' }

function Result({ result }: { result: typeof defaultResult }) {
  const { buySymbol, tradeInfo } = useFutureComputerContext()

  const { profit, profitRate, takerFee, makerFee, margin } = result

  const props = [
    {
      label: t`features_trade_contract_contract_adjustment_modal_index_5101520`,
      value: (
        <div>
          <IncreaseTag hasColor={false} hasPrefix={false} value={replaceEmpty(margin)} kSign /> {buySymbol}
        </div>
      ),
    },
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-12`,
      value: (
        <div>
          <IncreaseTag right={` ${buySymbol}`} hasPrefix={false} kSign hasColor value={replaceEmpty(profit)} />
        </div>
      ),
    },
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-13`,
      value: (
        <div>
          <IncreaseTag hasPrefix={false} needPercentCalc hasPostfix kSign hasColor value={replaceEmpty(profitRate)} />
        </div>
      ),
    },
    {
      label: t`features_future_computer_profit_cs_q8q-5b4hysjsgofobj`,
      value: `${replaceEmpty(takerFee)} ${buySymbol}`,
    },
    {
      label: t`features_future_computer_profit_idbym0dai7wx2wl7mfovb`,
      value: `${replaceEmpty(makerFee)} ${buySymbol}`,
    },
  ]

  return (
    <div className="px-4">
      {props.map(prop => {
        return (
          <div key={prop.label} className="mb-2 flex items-center justify-between">
            <div className="text-text_color_02">{prop.label}</div>
            <div className="break-all w-8/12 text-right">{profit ? prop.value : '--'}</div>
          </div>
        )
      })}
    </div>
  )
}

export function Profit() {
  const { onClosePriceChange, unitIsQuote, buySymbol, buyDigit, priceDigit, tradeInfo } = useFutureComputerContext()
  const disabled =
    !tradeInfo.entrustPrice || !tradeInfo.closePrice || (unitIsQuote ? !tradeInfo.amount : !tradeInfo.entrustAmount)
  const [calcResult, setCalcResult] = useState(defaultResult)
  const calc = () => {
    const params = {
      ...tradeInfo,
      digit: buyDigit || 2,
    }
    setCalcResult({
      profit: calcProfit(params),
      profitRate: calcProfitRate(params),
      takerFee: calcTakerFee(params),
      makerFee: calcMakerFee(params),
      margin: calcMargin(params),
    })
  }

  useEffect(() => {
    setCalcResult(defaultResult)
  }, [tradeInfo.selectedFuture])
  return (
    <div>
      <DirectionLever />
      <div className="h-4"></div>
      <EntrustPriceInput />
      <FormBox title={t`features_future_computer_index_9q3e3ep2oexxprflu2u0p`}>
        <PriceInput
          label={`${t`features_future_computer_index_9q3e3ep2oexxprflu2u0p`} (${buySymbol})`}
          paddingSize="large"
          placeholder={t`store_inmail_index_5101320`}
          digit={priceDigit}
          onChange={onClosePriceChange}
          value={tradeInfo.closePrice}
          onlyInput
        />
      </FormBox>
      <div
        className={classNames(Number(unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount) === 0 ? 'pb-8' : 'pb-3')}
      >
        <AmountInput className="!mb-0" />
      </div>
      <Result result={calcResult} />
      <div className="px-4 fixed bottom-10 w-full">
        <Button onClick={calc} block className="rounded" disabled={disabled} type="primary">
          {t`features_future_computer_close_price_d4z3kvrmrzbh7romfbg19`}
        </Button>
      </div>
    </div>
  )
}
