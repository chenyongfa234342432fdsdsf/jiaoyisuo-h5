import PriceInput from '@/features/trade/common/price-input'
import { TradeUnitEnum } from '@/constants/trade'
import TradeSelect from '@/features/trade/common/select'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { useFutureComputerContext } from './context'
import { FormBox } from './form-box'

export function AmountInput({ className = '' }) {
  const {
    onAmountChange,
    onTradeUnitChange,
    onEntrustAmountChange,
    buyDigit,
    sellDigit,
    sellSymbol,
    buySymbol,
    tradeInfo,
    unitIsQuote,
  } = useFutureComputerContext()

  const uFutureUnitOptions = [
    {
      value: TradeUnitEnum.indexBase,
      label: sellSymbol,
    },
    {
      value: TradeUnitEnum.quote,
      label: buySymbol,
    },
  ]
  const openTipNode = (
    <>
      {unitIsQuote && (
        <span>
          ≈ <span className="break-all">{tradeInfo.entrustAmount || 0}</span> {sellSymbol}
        </span>
      )}
      {!unitIsQuote && (
        <span>
          ≈ <span className="break-all">{tradeInfo.amount || 0}</span> {buySymbol}
        </span>
      )}
    </>
  )
  const value = unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount
  return (
    <FormBox
      className={className}
      title={
        unitIsQuote
          ? t`features_future_computer_common_input_control_qtzb-yvbxbnzjntqkjgty`
          : t`features/trade/future/exchange-17`
      }
    >
      <PriceInput
        onlyInput
        label={`${
          unitIsQuote
            ? t`features_future_computer_common_input_control_qtzb-yvbxbnzjntqkjgty`
            : t`features/trade/future/exchange-17`
        }${value ? ` (${unitIsQuote ? buySymbol : sellSymbol})` : ''}`}
        paddingSize="large"
        paddingRightZero
        className="bg-bg_sr_color"
        value={value}
        digit={unitIsQuote ? buyDigit : sellDigit}
        placeholder={
          unitIsQuote
            ? t`features_future_computer_common_input_control_oiyncb2gcx2cnydxhw_ec`
            : t`features_assets_futures_common_withdraw_modal_index_5101412`
        }
        onChange={unitIsQuote ? onAmountChange : onEntrustAmountChange}
        inputProps={{
          suffix: (
            <TradeSelect
              options={uFutureUnitOptions.map(i => ({
                text: i.label as any,
                value: i.value,
              }))}
              bgTradeParent
              className="sm-text pl-3 h-10"
              value={tradeInfo.tradeUnit}
              onChange={onTradeUnitChange}
            />
          ),
        }}
      />
      <div
        className={classNames('mt-1 text-text_color_02 text-xs', {
          hidden: Number(unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount) === 0,
        })}
      >
        {openTipNode}
      </div>
    </FormBox>
  )
}

export function EntrustPriceInput() {
  const { onEntrustPriceChange, buySymbol, priceDigit, tradeInfo } = useFutureComputerContext()

  return (
    <FormBox title={t`features_future_computer_common_input_control_5oauty3eqs1fnkjg39jo1`}>
      <PriceInput
        label={`${t`features_future_computer_common_input_control_5oauty3eqs1fnkjg39jo1`} (${buySymbol})`}
        paddingSize="large"
        placeholder={t`store_inmail_index_5101320`}
        digit={priceDigit}
        onChange={onEntrustPriceChange}
        value={tradeInfo.entrustPrice}
        onlyInput
      />
    </FormBox>
  )
}
