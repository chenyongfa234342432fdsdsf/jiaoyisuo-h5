import { t } from '@lingui/macro'
import { useFutureTradeStore } from '@/store/trade/future'
import { TradeModeEnum, TradeUnitEnum } from '@/constants/trade'
import styles from './index.module.css'

const OrderBookHeader = ({ targetCoin, denominatedCurrency, tradeMode }) => {
  const { settings } = useFutureTradeStore()
  return (
    <div className={`order-book-header ${styles.scoped}`}>
      <div className="price">
        <label>{t`future.funding-history.index.table-type.price`}</label>
        <label>{`(${denominatedCurrency})`}</label>
      </div>
      <div className="amount">
        <label>{t`features/trade/spot/price-input-0`}</label>
        <label>
          {tradeMode === TradeModeEnum.spot
            ? `(${targetCoin})`
            : settings.tradeUnit === TradeUnitEnum.indexBase
            ? `(${targetCoin})`
            : `(${denominatedCurrency})`}
        </label>
      </div>
    </div>
  )
}

export default OrderBookHeader
