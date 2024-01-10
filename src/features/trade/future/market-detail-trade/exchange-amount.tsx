import { EntrustTypeEnum, TradeUnitEnum } from '@/constants/trade'
import TradeButtonRadios from '@/features/trade-button-radios'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useExchangeContext } from '../../common/exchange/context'
import { PercentButtons } from '../../common/market-detail-trade/percent-buttons'
import TradePriceInput from '../../common/price-input'
import styles from '../../common/market-detail-trade/index.module.css'

export function MarketDetailTradeFutureAmount() {
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const futureUnitOptions = [
    {
      value: TradeUnitEnum.indexBase,
      label: currentFutureCoin.baseSymbolName!,
    },
    {
      value: TradeUnitEnum.quote,
      label: currentFutureCoin.quoteSymbolName!,
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
  const isMarketPriceType =
    tradeInfo.entrustType === EntrustTypeEnum.market || tradeInfo.entrustPriceType === EntrustTypeEnum.market
  const openTipNode = (
    <>
      {unitIsQuote && (
        <span>
          {t`features/trade/future/exchange-18`} ≈ {tradeInfo.entrustAmount || 0} {currentFutureCoin.baseSymbolName}
        </span>
      )}
      {!unitIsQuote && (
        <span>
          {t`features/trade/future/exchange-16`} ≈ {tradeInfo.amount || 0} {currentFutureCoin.quoteSymbolName}
        </span>
      )}
    </>
  )

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
            currentFutureCoin.quoteSymbolName
          })`}</span>
        </div>
      )}
      <div className="mb-2">
        <TradeButtonRadios
          bothClassName="text-xs py-1"
          inactiveClassName="text-text_color_02 bg-bg_sr_color"
          activeClassName="text-text_color_01 bg-bg_button_disabled"
          options={futureUnitOptions}
          onChange={onTradeUnitChange}
          value={tradeInfo.tradeUnit}
        />
        <TradePriceInput
          onlyInput
          isWhite
          className={classNames('text-sm', styles['price-input-only-bottom-radius'])}
          digit={unitIsQuote ? buyDigit : sellDigit}
          value={unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount}
          max={unitIsQuote ? maxAmount : maxEntrustAmount}
          placeholder={unitIsQuote ? t`features/trade/future/exchange-16` : t`features/trade/future/exchange-17`}
          onChange={unitIsQuote ? onAmountChange : onEntrustAmountChange}
        />
        <div
          className={classNames('my-2 text-text_color_02 text-xs', {
            hidden: Number(unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount) === 0,
          })}
        >
          {openTipNode}
        </div>
      </div>
      <PercentButtons />
    </div>
  )
}
