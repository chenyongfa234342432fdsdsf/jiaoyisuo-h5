import { SelectActionSheet } from '@/components/select-action-sheet'
import Slider from '@/components/slider'
import { EntrustTypeEnum, TradeUnitEnum } from '@/constants/trade'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { Toast } from '@nbit/vant'
import CouponSelect from '@/features/welfare-center/compontents/coupon-select'
import { decimalUtils } from '@nbit/utils'
import { onGetExpectedProfit } from '@/helper/assets/futures'
import { findFuturesPositionItem } from '@/helper/trade'
import { useMemo } from 'react'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { useExchangeContext } from '../common/exchange/context'
import TradePriceInput from '../common/price-input'

export function FutureMargin() {
  const {
    tradeInfo,
    onTradeUnitChange,
    onEntrustAmountChange,
    uFutureUnitOptions,
    onAmountChange,
    baseBalance,
    onPercentChange,
    positionQuoteBalance,
    onPositionAmountChange,
    buyDigit,
    sellDigit,
    isBuy,
    onCouponChange,
    couponsRef,
    isMarketPrice,
  } = useExchangeContext()

  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const placeholder = tradeInfo.onlyReduce
    ? unitIsQuote
      ? t`features_trade_future_exchange_margin_5101470`
      : t`features_trade_future_exchange_margin_5101471`
    : unitIsQuote
    ? t`features/trade/future/exchange-16`
    : t`features/trade/future/exchange-17`
  const closeTipNode = (
    <span>
      {t`features_trade_future_exchange_margin_5101472`} ≈{' '}
      {unitIsQuote ? (
        <>
          {positionQuoteBalance || 0} {currentFutureCoin.quoteSymbolName}
        </>
      ) : (
        <>
          {baseBalance || 0} {currentFutureCoin.baseSymbolName}
        </>
      )}
    </span>
  )
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
  const amountValue = tradeInfo.onlyReduce
    ? unitIsQuote
      ? tradeInfo.positionAmount
      : tradeInfo.entrustAmount
    : unitIsQuote
    ? tradeInfo.amount
    : tradeInfo.entrustAmount
  const onInputChange = tradeInfo.onlyReduce
    ? unitIsQuote
      ? onPositionAmountChange
      : onEntrustAmountChange
    : unitIsQuote
    ? onAmountChange
    : onEntrustAmountChange
  const isMarketEntrust = tradeInfo.entrustType === EntrustTypeEnum.market
  // 手动选择而且市价的时候不再重新计算
  const reCalcCouponWhenPriceChange = !(isMarketEntrust && couponsRef.current.isManual)
  const entrustPriceEffectDep = reCalcCouponWhenPriceChange ? tradeInfo.entrustPrice : ''
  // 交易额
  const quoteAmount = useMemo(() => {
    return tradeInfo.onlyReduce
      ? tradeInfo.positionAmount
      : decimalUtils.SafeCalcUtil.mul(tradeInfo.amount, tradeInfo.lever).toString()
  }, [
    // 市价委托时候价格推送引起的变化不重新计算，下同
    tradeInfo.onlyReduce,
    unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount,
    entrustPriceEffectDep,
    tradeInfo.lever,
  ])
  const openMargin = useMemo(() => {
    // 这里非市价时已委托数量计算，避免精度差导致下单失败
    return isMarketPrice
      ? tradeInfo.amount
      : formatNumberDecimalWhenExceed(
          decimalUtils.SafeCalcUtil.mul(tradeInfo.entrustAmount, tradeInfo.entrustPrice),
          buyDigit
        )
  }, [entrustPriceEffectDep, unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount])
  const position = findFuturesPositionItem(isBuy, tradeInfo.group?.groupId || '', currentFutureCoin.id, tradeInfo.lever)
  // 预计盈利
  const estimatedProfit = useMemo(() => {
    return tradeInfo.onlyReduce
      ? onGetExpectedProfit({
          price: tradeInfo.entrustPrice,
          closeSize: tradeInfo.entrustAmount,
          openPrice: position?.openPrice || '',
          takerFeeRate: currentFutureCoin.takerFeeRate || '',
          sideInd: position?.sideInd || '',
        })
      : '0'
  }, [
    tradeInfo.onlyReduce,
    unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount,
    entrustPriceEffectDep,
    tradeInfo.lever,
  ])

  return (
    <>
      <div className="flex flex-col relative">
        <div id={GUIDE_ELEMENT_IDS_ENUM.futureCount} className="exchange-item z-1">
          {/* <TradeButtonRadios
          inactiveClassName="text-text_color_03 bg-bg_sr_color"
          activeClassName="text-text_color_01 bg-bg_button_disabled"
          options={uFutureUnitOptions}
          onChange={onTradeUnitChange}
          value={tradeInfo.tradeUnit}
        /> */}
          <TradePriceInput
            onlyInput
            className="exchange-input"
            value={amountValue}
            digit={unitIsQuote ? buyDigit : sellDigit}
            label={placeholder}
            onChange={onInputChange}
            inputProps={{
              suffix: (
                <SelectActionSheet
                  actions={uFutureUnitOptions.map(i => ({
                    name: i.label as any,
                    value: i.value,
                  }))}
                  labelClassName="font-medium"
                  value={tradeInfo.tradeUnit}
                  onChange={val => {
                    Toast(t`features_user_personal_center_settings_converted_currency_index_587`)
                    onTradeUnitChange(val)
                  }}
                />
              ),
              labelTipContent: tradeInfo.onlyReduce ? '' : openTipNode,
            }}
          />

          <div
            className={classNames('my-2 text-text_color_02 text-xs', {
              hidden: !tradeInfo.onlyReduce,
            })}
          >
            {tradeInfo.onlyReduce ? closeTipNode : openTipNode}
          </div>
        </div>
        <CouponSelect
          className="!-top-5"
          fee={`${decimalUtils.SafeCalcUtil.mul(quoteAmount, currentFutureCoin.takerFeeRate)}`}
          amount={quoteAmount}
          loss={Number(estimatedProfit) >= 0 ? '' : estimatedProfit}
          symbol={currentFutureCoin.quoteSymbolName || ''}
          onChange={onCouponChange}
          margin={tradeInfo.onlyReduce ? '' : openMargin}
        />
      </div>

      <div className="exchange-item py-2">
        <Slider
          tooltipBgColor="var(--toast_bg_color)"
          points={[0, 25, 50, 75, 100]}
          showTooltip
          hidePointText
          onChange={onPercentChange}
          value={tradeInfo.percent}
        />
      </div>
    </>
  )
}
