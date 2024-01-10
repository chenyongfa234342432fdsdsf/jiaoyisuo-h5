import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import { useOrderBookStore } from '@/store/order-book'
import OrderBookContainer from '../../container'

interface SellOrderBookProps {
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  quantity: number
  width: number
  /** 交易模式 */
  tradeMode: string
}

export default function SellOrderBook({ width, onSelectPrice, quantity, tradeMode }: SellOrderBookProps) {
  const orderBookStore = useOrderBookStore()
  const { asksList } = orderBookStore
  return (
    <OrderBookContainer
      onSelectPrice={onSelectPrice}
      tableDatas={asksList}
      status={OrderBookButtonTypeEnum.sell}
      quantity={quantity}
      width={width}
      tradeMode={tradeMode}
      reverse
    />
  )
}
