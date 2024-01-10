import { useFutureTradeStore } from '@/store/trade/future'
import { formatNumberDecimal } from '@/helper/decimal'
// import { useAssetsFuturesStore } from '@/store/assets/futures'
import Decimal from 'decimal.js'
// import { getCoinPrecision } from '@/helper/assets/spot'
import { TradeUnitEnum, TradeUnitTextEnum } from '@/constants/trade'
import { baseOrderFutureStore } from '@/store/order/future'
import { decimalUtils } from '@nbit/utils'
import { USDT_FUTURE_DIGIT, USDT_SYMBOL } from '@/helper/futures/digits'
import { useFutureQuoteDisplayDigit } from './assets'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

const getCoinPrecision = (name, type) => {
  const getPrecisionsType = {
    amount: 'amountOffset',
    price: 'priceOffset',
  }
  const { pairFilterList } = baseOrderFutureStore.getState() || {}

  const precisions = pairFilterList?.find(item => item?.baseSymbolName === name)

  return precisions?.[getPrecisionsType[type]]
}

const getCoinPrecisionChangePrice = (price, name, type) => {
  return formatNumberDecimal(price, getCoinPrecision(name, type))
}

const useContractComputedPrice = () => {
  const { tradeUnit } = useFutureTradeStore()?.settings

  const offset = useFutureQuoteDisplayDigit()

  const placeUnitType = tradeUnit === TradeUnitEnum.indexBase ? TradeUnitTextEnum.BASE : TradeUnitTextEnum.QUOTE

  const getCoinsDivPrice = (targetCurrency, priceCurrency, symbol) => {
    if (targetCurrency && priceCurrency && symbol) {
      return formatNumberDecimal(
        SafeCalcUtil.div(targetCurrency, priceCurrency),
        getCoinPrecision(symbol, 'amount'),
        Decimal.ROUND_DOWN
      )
    } else {
      return undefined
    }
  }

  const getCoinsMulPrice = (targetCurrency, priceCurrency) => {
    if (targetCurrency && priceCurrency) {
      return formatNumberDecimal(SafeCalcUtil.mul(targetCurrency, priceCurrency), offset, Decimal.ROUND_DOWN)
    } else {
      return undefined
    }
  }

  const getJudgeDivOrMulPriceChange = placeUnit => {
    return placeUnit === placeUnitType
      ? true
      : placeUnit === TradeUnitTextEnum.BASE
      ? getCoinsMulPrice
      : getCoinsDivPrice
  }

  return { placeUnitType, getCoinsDivPrice, getCoinsMulPrice, getJudgeDivOrMulPriceChange }
}

const getQuoteDisplayDigit = (targetCurrency, coinName, placeUnitType) => {
  console.log(targetCurrency, coinName, placeUnitType, ' targetCurrency, coinName, placeUnitType')

  if (coinName === USDT_SYMBOL && placeUnitType === TradeUnitTextEnum.QUOTE && targetCurrency) {
    return formatNumberDecimal(targetCurrency, USDT_FUTURE_DIGIT)
  } else {
    return targetCurrency
  }
}

export { useContractComputedPrice, getCoinPrecisionChangePrice, getQuoteDisplayDigit }
