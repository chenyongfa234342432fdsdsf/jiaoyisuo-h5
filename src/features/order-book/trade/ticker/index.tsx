import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import { TradeModeEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { useOrderBookStore } from '@/store/order-book'
import { formatCurrency } from '@/helper/decimal'
import { rateFilter } from '@/helper/assets/spot'
import styles from './index.module.css'

interface OrderBookTickerProps {
  /** 是否展示符号 */
  hasRoundingSymbol?: boolean
  /** 交易模式 */
  tradeMode: string
  /** 是否展示指数价格 */
  hasIndexPrice?: boolean
}

const OrderBookTicker = ({ hasRoundingSymbol, tradeMode, hasIndexPrice }: OrderBookTickerProps) => {
  const spotStore = useMarketStore()
  const contractStore = useContractMarketStore()
  const orderBookStore = useOrderBookStore()
  const store = tradeMode === TradeModeEnum.spot ? spotStore : contractStore
  const { checkStatus: status, marketPrice: price, rate, contractMarkPrice, contractIndexPrice } = orderBookStore
  const { symbolWassName, priceOffset, last, markPrice, indexPrice } = store.currentCoin
  const subPrice =
    tradeMode === TradeModeEnum.spot
      ? rate || rateFilter({ amount: last as string, symbol: symbolWassName })
      : contractMarkPrice || formatCurrency(markPrice, priceOffset)
  return (
    <div className={`order-book-ticker ${styles.scoped}`}>
      <div
        className={`price ${
          status === OrderBookButtonTypeEnum.buy ? 'buy' : status === OrderBookButtonTypeEnum.sell ? 'sell' : 'primary'
        }`}
      >
        <label>{price}</label>
      </div>
      <div className="rate">
        {tradeMode === TradeModeEnum.futures ? (
          <div className="contract">
            <label>{t`future.funding-history.index-price.column.mark-price`}</label>
            <label>{subPrice}</label>
          </div>
        ) : (
          <div className="spot">
            <label>{hasRoundingSymbol && '≈'}</label>
            <label>{subPrice}</label>
          </div>
        )}
      </div>
      {tradeMode === TradeModeEnum.futures && hasIndexPrice && (
        <div className="index-price">
          <div className="contract">
            <label>{t`future.funding-history.index-price.column.index-price`}</label>
            <label>{contractIndexPrice || indexPrice}</label>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderBookTicker
