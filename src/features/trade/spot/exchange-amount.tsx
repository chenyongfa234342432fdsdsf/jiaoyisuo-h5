import Slider from '@/components/slider'
import { EntrustTypeEnum, SpotStopLimitTypeEnum, TradeDirectionEnum, TradeUnitEnum } from '@/constants/trade'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useMemo, useRef } from 'react'
import CouponSelect from '@/features/welfare-center/compontents/coupon-select'
import { ScenesBeUsedEnum } from '@/constants/welfare-center/common'
import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { useExchangeContext } from '../common/exchange/context'
import TradePriceInput from '../common/price-input'
import TradeSelect from '../common/select'

export function SpotAmount() {
  const {
    tradeInfo,
    maxEntrustAmount,
    maxAmount,
    buyDigit,
    sellDigit,
    isBuy,
    symbol,
    isStopLimit,
    currentCoin,
    isMarketPrice,
    onTradeUnitChange,
    onEntrustAmountChange,
    onAmountChange,
    onPercentChange,
    onCouponChange,
    couponsRef,
  } = useExchangeContext()
  const spotUnitOptions = [
    {
      value: TradeUnitEnum.indexBase,
      text: currentCoin.baseSymbolName || '',
    },
    {
      value: TradeUnitEnum.quote,
      text: currentCoin.quoteSymbolName || '',
    },
  ]
  const unitIsQuote = tradeInfo.tradeUnit === TradeUnitEnum.quote
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const amountRef = useRef<any>()
  const entrustAmountRef = useRef<any>()
  // hack 解决拖动滑块时，输入框未失去焦点，导致值不一致的问题，根本还是要后面空了重写 stepper 组件
  const onDragStart = () => {
    amountRef.current?.blur()
    entrustAmountRef.current?.blur()
  }
  const amountValue = unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount
  const onInputChange = unitIsQuote ? onAmountChange : onEntrustAmountChange
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double && isStopLimit
  const doubleStopLimitIsMarketPrice =
    tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market &&
    isDouble &&
    tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
  const placeholder = !unitIsQuote
    ? t`features/trade/spot/price-input-0`
    : t`features_trade_spot_exchange_amount_510108`
  // 手续费
  // 这里只需要是市场价格，不需要是市价委托，计算一次是为了精度
  let feeBase = isMarketPrice
    ? tradeInfo.amount
    : decimalUtils.SafeCalcUtil.mul(tradeInfo.entrustAmount, tradeInfo.entrustPrice).toString()
  if (isStopLimit && isDouble) {
    // 双向止盈止损取二者中较大的，始终以委托数量计算
    feeBase = decimalUtils.SafeCalcUtil.mul(
      tradeInfo.entrustAmount,
      Math.max(Number(tradeInfo.stopProfitPrice), Number(tradeInfo.stopLossPrice))
    ).toString()
  }
  const isMarketEntrust = tradeInfo.entrustType === EntrustTypeEnum.market
  // 手动选择而且市价的时候不再重新计算
  const reCalcCouponWhenPriceChange = !(isMarketEntrust && couponsRef.current.isManual)
  const entrustPriceEffectDep = reCalcCouponWhenPriceChange ? tradeInfo.entrustPrice : ''
  const quoteAmount = useMemo(() => {
    return formatNumberDecimalWhenExceed(feeBase.toString(), buyDigit)
  }, [
    reCalcCouponWhenPriceChange ? tradeInfo.amount : '',
    reCalcCouponWhenPriceChange ? tradeInfo.entrustAmount : '',
    entrustPriceEffectDep,
  ])

  return (
    <>
      {(isMarketPrice || doubleStopLimitIsMarketPrice) && (
        <div className="exchange-item">
          <TradePriceInput
            onlyInput
            className="bg-bg_sr_color"
            value={amountValue}
            digit={unitIsQuote ? buyDigit : sellDigit}
            label={placeholder}
            onChange={onInputChange}
            inputProps={{
              paddingRightZero: true,
              suffix: (
                <TradeSelect
                  bgTradeParent
                  titlePaddingLeft="16px"
                  className="text-xs"
                  dropdownTop="calc(100% + 14px)"
                  onChange={onTradeUnitChange}
                  options={spotUnitOptions}
                  value={tradeInfo.tradeUnit}
                />
              ),
              labelTipContent: amountValue && (
                <>
                  {unitIsQuote && (
                    <span>
                      {t`features/trade/spot/price-input-0`} ≈ {tradeInfo.entrustAmount || 0}{' '}
                      {currentSpotCoin.baseSymbolName}
                    </span>
                  )}
                  {!unitIsQuote && (
                    <span>
                      {t`features_trade_spot_exchange_amount_510108`} ≈ {tradeInfo.amount || 0}{' '}
                      {currentSpotCoin.quoteSymbolName}
                    </span>
                  )}
                </>
              ),
            }}
          />

          <div
            className={classNames('my-2 text-text_color_02 text-xs', {
              hidden: Number(unitIsQuote ? tradeInfo.amount : tradeInfo.entrustAmount) === 0,
            })}
          ></div>
        </div>
      )}
      {!isMarketPrice && !doubleStopLimitIsMarketPrice && (
        <div className="exchange-item ">
          <TradePriceInput
            onlyInput
            max={maxEntrustAmount}
            digit={sellDigit}
            value={tradeInfo.entrustAmount}
            ref={entrustAmountRef}
            label={`${t`features/trade/spot/price-input-0`}(${currentSpotCoin.baseSymbolName})`}
            onChange={onEntrustAmountChange}
          />
        </div>
      )}
      <CouponSelect
        className="!pt-1"
        businessScene={ScenesBeUsedEnum.spot}
        fee={`${decimalUtils.SafeCalcUtil.mul(quoteAmount, isBuy ? currentSpotCoin.buyFee : currentSpotCoin.sellFee)}`}
        amount={quoteAmount}
        symbol={currentSpotCoin.quoteSymbolName || ''}
        onChange={onCouponChange}
      />
      <div className="exchange-item py-3">
        <Slider
          tooltipBgColor="var(--toast_bg_color)"
          onDragStart={onDragStart}
          hideCenterPointText
          points={[0, 25, 50, 75, 100]}
          pointSuffix="%"
          showTooltip
          onChange={onPercentChange}
          value={tradeInfo.percent}
        />
      </div>
      {!isMarketPrice && !isStopLimit && (
        <div className="exchange-item ">
          <TradePriceInput
            onlyInput
            digit={buyDigit}
            max={maxAmount}
            value={tradeInfo.amount}
            ref={amountRef}
            label={`${t`features_trade_spot_exchange_amount_510108`}(${currentSpotCoin.quoteSymbolName})`}
            onChange={onAmountChange}
          />
        </div>
      )}
    </>
  )
}
