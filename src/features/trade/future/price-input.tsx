import { EntrustTypeEnum } from '@/constants/trade'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import TradeButtonRadios, { TradeButtonRadiosPresetClassNames } from '@/features/trade-button-radios'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useUpdateEffect } from 'ahooks'
import { useRef } from 'react'
import TradeFormItemBox from '../common/form-item-box'
import { useExchangeContext } from '../common/exchange/context'
import TradePriceInput from '../common/price-input'
import TradeSelect from '../common/select'
import { MarketPriceBox } from '../common/maret-price-box'
import { MarketButton } from '../common/market-button'

function MarketPriceInput() {
  return (
    <div className="mb-2">
      <MarketPriceBox />
    </div>
  )
}
function LimitPriceInput() {
  const currentFutureCoin = useTradeCurrentFutureCoin()

  const { tradeInfo, priceDigit, onEntrustPriceInputBlur, onEntrustPriceInputFocus, onEntrustPriceChange } =
    useExchangeContext()
  // 价格不取 buyDigit，而是取 priceOffset，下同
  return (
    <>
      <div className="mb-2">
        <TradePriceInput
          onlyInput
          digit={priceDigit}
          value={tradeInfo.entrustPrice}
          placeholder={`${t`features/trade/future/price-input-1`} (${currentFutureCoin.quoteSymbolName})`}
          onChange={onEntrustPriceChange}
          inputProps={{
            onBlur: onEntrustPriceInputBlur,
            onFocus: onEntrustPriceInputFocus,
          }}
        />
      </div>
    </>
  )
}
function PlanPriceInput() {
  const currentFutureCoin = useTradeCurrentFutureCoin()

  const {
    tradeInfo,
    priceTypeOptions,
    onEntrustPriceTypeChange,
    onEntrustPriceChange,
    onTriggerPriceTypeChange,
    onTriggerPriceChange,
    onEntrustPriceInputBlur,
    onEntrustPriceInputFocus,
    priceDigit,
  } = useExchangeContext()
  const entrustPriceTypeIsMarket = tradeInfo.entrustPriceType === EntrustTypeEnum.market
  const limitPriceInputRef = useRef<any>()
  useUpdateEffect(() => {
    if (limitPriceInputRef.current) {
      limitPriceInputRef.current.focus()
    }
  }, [entrustPriceTypeIsMarket])
  const triggerInput = () => {
    onEntrustPriceTypeChange(EntrustTypeEnum.limit)
  }
  const options = [
    {
      label: t`features/trade/future/price-input-3`,
      value: EntrustTypeEnum.market,
    },
  ]
  return (
    <>
      <div className="mb-2 flex justify-between">
        <TradePriceInput
          onlyInput
          digit={priceDigit}
          className="bg-bg_sr_color"
          value={tradeInfo.triggerPrice}
          placeholder={`${t`features/trade/future/price-input-2`}(${currentFutureCoin.quoteSymbolName})`}
          onChange={onTriggerPriceChange}
        />
        <TradeSelect
          className="text-xs ml-1 flex-1"
          onChange={onTriggerPriceTypeChange}
          options={priceTypeOptions}
          value={tradeInfo.triggerPriceType}
        />
      </div>
      <div className="mb-2 flex justify-between">
        {entrustPriceTypeIsMarket ? (
          <TradeFormItemBox className="flex-1 flex items-center" onClick={triggerInput}>
            <div className="text-text_color_03 text-sm">{t`features/trade/future/price-input-0`}</div>
          </TradeFormItemBox>
        ) : (
          <TradePriceInput
            ref={limitPriceInputRef}
            className="flex-1"
            digit={priceDigit}
            onlyInput
            value={tradeInfo.entrustPrice}
            placeholder={`${t`features/trade/future/price-input-1`}(${currentFutureCoin.quoteSymbolName})`}
            onChange={onEntrustPriceChange}
            inputProps={{
              onBlur: onEntrustPriceInputBlur,
              onFocus: onEntrustPriceInputFocus,
            }}
          />
        )}
        {/* 这里暂时写死为市价 */}
        <div className="ml-1">
          <MarketButton
            onClick={() =>
              onEntrustPriceTypeChange(entrustPriceTypeIsMarket ? EntrustTypeEnum.limit : EntrustTypeEnum.market)
            }
            active={entrustPriceTypeIsMarket}
          />
        </div>
      </div>
    </>
  )
}

export const EntrustTypePriceInput = {
  [EntrustTypeEnum.market]: MarketPriceInput,
  [EntrustTypeEnum.limit]: LimitPriceInput,
  [EntrustTypeEnum.plan]: PlanPriceInput,
}
