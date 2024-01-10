import { useMemo } from 'react'
import { useTradeStore } from '@/store/trade'
import { DepthColorBlockEnum } from '@/constants/future/settings'
import {
  OrderBookDepthDataType,
  OrderBookButtonTypeEnum,
  HandlingEmptyData,
  handleOrderBookPopUpValue,
} from '@/store/order-book/common'
import { TradeModeEnum, TradeUnitEnum } from '@/constants/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import styles from './index.module.css'

interface OrderContainerProps {
  tableDatas: OrderBookDepthDataType[]
  status: number
  quantity: number
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  width: number
  tradeMode: string
  reverse?: boolean
}

function OrderBookContainer({
  tableDatas,
  quantity,
  status,
  onSelectPrice,
  reverse,
  width,
  tradeMode,
}: OrderContainerProps) {
  const { generalSettings } = useTradeStore()
  const { settings } = useFutureTradeStore()

  const emptyData = useMemo(() => {
    if (tableDatas.length < quantity) {
      return HandlingEmptyData(quantity - tableDatas.length)
    }

    return []
  }, [tableDatas.length, quantity])

  const list = [...tableDatas.slice(0, quantity), ...emptyData]
  const renderList = handleOrderBookPopUpValue([...list])
  const maximumQuantity =
    renderList.length > 0
      ? Math.max(
          ...renderList.map(item =>
            Number(
              generalSettings.depthColorBlock === DepthColorBlockEnum.grandTotal
                ? item.totalInitialValue !== '--'
                  ? item.totalInitialValue
                  : 0
                : item.volumeInitialValue !== '--'
                ? item.volumeInitialValue
                : 0
            )
          )
        )
      : 0

  if (reverse) renderList.reverse()

  const colorBlockWidth = (v: OrderBookDepthDataType, bodyWidth: number) => {
    const value =
      generalSettings.depthColorBlock === DepthColorBlockEnum.grandTotal ? v.totalInitialValue : v.volumeInitialValue
    return value !== '--' && maximumQuantity ? (Number(value) / maximumQuantity) * width : bodyWidth
  }

  return (
    <div
      className={`trade-order-book-container ${styles.scoped} 
      ${status === OrderBookButtonTypeEnum.sell ? styles['trade-order-book-sell-container'] : ''}`}
    >
      <div className="trade-order-book-containe-wrap">
        {renderList.map((v, index) => (
          <div
            key={index}
            className={status === OrderBookButtonTypeEnum.buy ? 'buy' : 'sell'}
            onClick={() => onSelectPrice(v.tagPrice, v.totalInitialValue, status, v.volumeInitialValue)}
          >
            <div className="price">{v.formatPrice}</div>
            <div className="volume">
              {tradeMode === TradeModeEnum.spot
                ? v.volume
                : settings.tradeUnit === TradeUnitEnum.indexBase
                ? v.volume
                : v.turnover}
            </div>
            <div
              className="progress"
              style={{
                width: colorBlockWidth(v, v.bodyWidth as number),
              }}
            ></div>
            {v.isEntrust && (
              <div
                className={`entrust ${status === OrderBookButtonTypeEnum.buy ? 'buy-entrust' : 'sell-entrust'}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderBookContainer
