import { EntrustTypeEnum, SpotStopLimitTypeEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { useRef } from 'react'
import { useUpdateEffect } from 'ahooks'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { rateFilter } from '@/helper/assets/spot'
import { useExchangeContext } from '../common/exchange/context'
import TradePriceInput from '../common/price-input'
import { MarketButton } from '../common/market-button'
import { MarketPriceBox } from '../common/maret-price-box'

function MarketPriceInput() {
  return (
    <div className="mb-2">
      <MarketPriceBox />
    </div>
  )
}
function LimitPriceInput() {
  const currentSpotCoin = useTradeCurrentSpotCoin()

  const { tradeInfo, onEntrustPriceInputBlur, onEntrustPriceInputFocus, onEntrustPriceChange, buyDigit, priceDigit } =
    useExchangeContext()
  return (
    <>
      <div className="mb-2">
        <TradePriceInput
          onlyInput
          digit={priceDigit}
          value={tradeInfo.entrustPrice}
          label={`${t`features_trade_spot_price_input_hlaczyk4hr`} (${currentSpotCoin.quoteSymbolName})`}
          onChange={onEntrustPriceChange}
          inputProps={{
            onBlur: onEntrustPriceInputBlur,
            onFocus: onEntrustPriceInputFocus,
            labelTipContent: rateFilter({
              amount: tradeInfo.entrustPrice,
              symbol: currentSpotCoin.quoteSymbolName || '',
            }),
          }}
        />
      </div>
    </>
  )
}
function PlanPriceInput() {
  const currentSpotCoin = useTradeCurrentSpotCoin()

  const {
    tradeInfo,
    priceDigit,
    isMarketPrice,
    onEntrustPriceTypeChange,
    buyDigit,
    onEntrustPriceChange,
    onTriggerPriceChange,
    onEntrustPriceInputBlur,
    onEntrustPriceInputFocus,
  } = useExchangeContext()
  const options = [
    {
      label: t`features/trade/future/price-input-3`,
      value: EntrustTypeEnum.market,
    },
  ]
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

  return (
    <>
      <div className="mb-2 flex justify-between">
        <TradePriceInput
          onlyInput
          className="flex-1"
          digit={priceDigit}
          value={tradeInfo.triggerPrice}
          label={`${t`features/trade/future/price-input-2`}(${currentSpotCoin.quoteSymbolName})`}
          onChange={onTriggerPriceChange}
        />
        {/* <TradeSelect
          className="text-xs ml-1 flex-1"
          onChange={onTriggerPriceTypeChange}
          options={priceTypeOptions}
          value={tradeInfo.triggerPriceType}
        /> */}
      </div>
      <div className="mb-2 flex justify-between">
        {entrustPriceTypeIsMarket ? (
          <MarketPriceBox onClick={triggerInput} />
        ) : (
          <TradePriceInput
            onlyInput
            ref={limitPriceInputRef}
            className="flex-1"
            digit={priceDigit}
            value={tradeInfo.entrustPrice}
            label={`${t`features_trade_spot_price_input_hlaczyk4hr`}(${currentSpotCoin.quoteSymbolName})`}
            onChange={onEntrustPriceChange}
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
function StopLimitPriceInput() {
  const currentSpotCoin = useTradeCurrentSpotCoin()

  const {
    tradeInfo,
    isMarketPrice,
    onStopLossPriceChange,
    onStopProfitPriceChange,
    onStopLossTriggerPriceChange,
    onStopProfitTriggerPriceChange,
    onStopProfitEntrustPriceTypeChange,
    onStopLossEntrustPriceTypeChange,
    buyDigit,
    priceDigit,
  } = useExchangeContext()
  const isSingle = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.single

  const triggerProfitInput = () => {
    onStopProfitEntrustPriceTypeChange(EntrustTypeEnum.limit)
  }
  const triggerLossInput = () => {
    onStopLossEntrustPriceTypeChange(EntrustTypeEnum.limit)
  }
  const profitEntrustPriceTypeIsMarket = tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market
  const lossEntrustPriceTypeIsMarket = tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
  const profitPriceInputRef = useRef<any>()
  const lossPriceInputRef = useRef<any>()

  useUpdateEffect(() => {
    if (profitPriceInputRef.current) {
      profitPriceInputRef.current.focus()
    }
  }, [profitEntrustPriceTypeIsMarket])
  useUpdateEffect(() => {
    if (lossPriceInputRef.current) {
      lossPriceInputRef.current.focus()
    }
  }, [lossEntrustPriceTypeIsMarket])

  // 单向就按计划委托处理
  if (isSingle) {
    return <PlanPriceInput />
  }

  return (
    <>
      <div className="mb-2 flex justify-between">
        <TradePriceInput
          onlyInput
          className="flex-1"
          digit={priceDigit}
          value={tradeInfo.stopProfitTriggerPrice}
          label={`${t`features_trade_spot_exchange_order_qy4shhvdh1`}(${currentSpotCoin.quoteSymbolName})`}
          onChange={onStopProfitTriggerPriceChange}
        />
      </div>
      <div className="mb-2 flex justify-between">
        {profitEntrustPriceTypeIsMarket ? (
          <MarketPriceBox onClick={triggerProfitInput} />
        ) : (
          <TradePriceInput
            onlyInput
            ref={profitPriceInputRef}
            className="flex-1"
            digit={priceDigit}
            value={tradeInfo.stopProfitPrice}
            label={`${t`features_trade_spot_price_input_hlaczyk4hr`}(${currentSpotCoin.quoteSymbolName})`}
            onChange={onStopProfitPriceChange}
          />
        )}
        {/* 这里暂时写死为市价 */}
        <div className="ml-1">
          <MarketButton
            onClick={() =>
              onStopProfitEntrustPriceTypeChange(
                profitEntrustPriceTypeIsMarket ? EntrustTypeEnum.limit : EntrustTypeEnum.market
              )
            }
            active={profitEntrustPriceTypeIsMarket}
          />
        </div>
      </div>
      <div className="mb-2 flex justify-between">
        <TradePriceInput
          onlyInput
          className="flex-1"
          digit={priceDigit}
          value={tradeInfo.stopLossTriggerPrice}
          label={`${t`features_trade_spot_exchange_order_t4yfm_i7mk`}(${currentSpotCoin.quoteSymbolName})`}
          onChange={onStopLossTriggerPriceChange}
        />
      </div>
      <div className="mb-2 flex justify-between">
        {lossEntrustPriceTypeIsMarket ? (
          <MarketPriceBox onClick={triggerLossInput} />
        ) : (
          <TradePriceInput
            onlyInput
            ref={lossPriceInputRef}
            className="flex-1"
            digit={priceDigit}
            value={tradeInfo.stopLossPrice}
            label={`${t`features_trade_spot_price_input_hlaczyk4hr`}(${currentSpotCoin.quoteSymbolName})`}
            onChange={onStopLossPriceChange}
          />
        )}
        {/* 这里暂时写死为市价 */}
        <div className="ml-1">
          <MarketButton
            onClick={() =>
              onStopLossEntrustPriceTypeChange(
                lossEntrustPriceTypeIsMarket ? EntrustTypeEnum.limit : EntrustTypeEnum.market
              )
            }
            active={lossEntrustPriceTypeIsMarket}
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
  [EntrustTypeEnum.stop]: StopLimitPriceInput,
}
