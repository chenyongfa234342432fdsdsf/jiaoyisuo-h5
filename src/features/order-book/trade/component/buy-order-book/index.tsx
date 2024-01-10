import OrderBookContainer from '@/features/order-book/trade/container'
import { useOrderBookStore } from '@/store/order-book'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'

interface BuyOrderBookProps {
  onSelectPrice: (price: string, total: string, direction: number, amount: string) => void
  quantity: number
  width: number
  tradeMode: string
}

export default function BuyOrderBook({ width, onSelectPrice, quantity, tradeMode }: BuyOrderBookProps) {
  const orderBookStore = useOrderBookStore()
  const { bidsList } = orderBookStore
  return (
    <OrderBookContainer
      onSelectPrice={onSelectPrice}
      tableDatas={bidsList}
      status={OrderBookButtonTypeEnum.buy}
      quantity={quantity}
      width={width}
      tradeMode={tradeMode}
    />
  )
}
