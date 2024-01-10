import { EntrustTypeEnum, TradeUnitEnum } from '@/constants/trade'
import TradeButtonRadios from '@/features/trade-button-radios'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useExchangeContext } from '../../common/exchange/context'
import TradePriceInput from '../../common/price-input'
import styles from '../../common/market-detail-trade/index.module.css'
import { PercentButtons } from '../../common/market-detail-trade/percent-buttons'

export function MarketDetailTradeSpotAmount() {
  const spotUnitOptions = [
    {
      value: TradeUnitEnum.indexBase,
      label: t`features/trade/spot/price-input-0`,
    },
    {
      value: TradeUnitEnum.quote,
      label: t`features_trade_spot_exchange_amount_510108`,
    },
  ]
  const {
    tradeInfo,
    maxEntrustAmount,
    maxAmount,
    buyDigit,
    sellDigit,
    onTradeUnitChange,
    onEntrustAmountChange,
    onAmountChange,
    onEntrustPriceChange,
  } = useExchangeContext()

  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const isMarketPriceType =
    tradeInfo.entrustType === EntrustTypeEnum.market || tradeInfo.entrustPriceType === EntrustTypeEnum.market

  return (
    <div className={styles['exchange-amount-wrapper']}>
      {isMarketPriceType ? (
        <div
          className={classNames(styles['trade-form-item-box'], 'market-price-tip-box')}
        >{t`features/trade/future/price-input-0`}</div>
      ) : (
        <div className={classNames(styles['trade-form-item-box'], 'with-stepper-box')}>
          <TradePriceInput digit={buyDigit} value={tradeInfo.entrustPrice} onChange={onEntrustPriceChange} />
          <span className="label">{`${t`future.funding-history.index.table-type.price`} (${
            currentSpotCoin.quoteSymbolName
          })`}</span>
        </div>
      )}
      {isMarketPriceType && (
        <div className="mb-2">
          <TradeButtonRadios
            bothClassName="text-base py-1"
            inactiveClassName="text-text_color_02 bg-bg_sr_color"
            activeClassName="text-text_color_01 bg-bg_button_disabled"
            options={spotUnitOptions}
            onChange={onTradeUnitChange}
            value={tradeInfo.tradeUnit}
          />
          <TradePriceInput
            onlyInput
            className={classNames('text-sm', styles['price-input-only-bottom-radius'])}
            isWhite
            digit={unitIsQuote ? buyDigit : sellDigit}
            value={unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount}
            max={unitIsQuote ? maxAmount : maxEntrustAmount}
            placeholder={
              unitIsQuote ? (currentSpotCoin.quoteSymbolName as any) : (currentSpotCoin.baseSymbolName as any)
            }
            onChange={unitIsQuote ? onAmountChange : onEntrustAmountChange}
          />
          <div
            className={classNames('my-2 text-text_color_02 text-xs', {
              hidden: Number(unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount) === 0,
            })}
          >
            {unitIsQuote && (
              <span>
                ≈ {tradeInfo.entrustAmount || 0} {currentSpotCoin.baseSymbolName}
              </span>
            )}
            {!unitIsQuote && (
              <span>
                ≈ {tradeInfo.amount || 0} {currentSpotCoin.quoteSymbolName}
              </span>
            )}
          </div>
        </div>
      )}
      {!isMarketPriceType && (
        <TradePriceInput
          max={maxEntrustAmount}
          digit={sellDigit}
          onlyInput
          isWhite
          inputProps={{
            align: 'right',
            prefix: `${t`features/trade/spot/price-input-0`}(${currentSpotCoin.baseSymbolName})`,
          }}
          value={tradeInfo.entrustAmount}
          onChange={onEntrustAmountChange}
        />
      )}
      <PercentButtons />
      {!isMarketPriceType && (
        <TradePriceInput
          digit={buyDigit}
          max={maxAmount}
          className="mb-4"
          onlyInput
          isWhite
          inputProps={{
            align: 'right',
            prefix: `${t`features_trade_spot_exchange_amount_510108`}(${currentSpotCoin.quoteSymbolName})`,
          }}
          value={tradeInfo.amount}
          onChange={onAmountChange}
        />
      )}
    </div>
  )
}
