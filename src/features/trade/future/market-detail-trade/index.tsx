import { TradeModeEnum } from '@/constants/trade'
import { getFutureTradePagePath } from '@/helper/route'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { KLineChartType } from '@nbit/chart-utils'
import { useExchangeInTop } from '../../common/exchange/context'
import { futureTradeCalcHelper } from '../../common/exchange/calc/future'
import { TradeModal } from './trade-modal'
import { OnOrder } from '../exchange-order'
import MarketDetailTrade from '../../common/market-detail-trade'

function MarketDetailFutureTrade() {
  const useExchangeResult = useExchangeInTop(futureTradeCalcHelper, TradeModeEnum.futures, true)
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const tradePath = getFutureTradePagePath(currentFutureCoin)

  return (
    <MarketDetailTrade
      useExchangeResult={useExchangeResult}
      tradePath={tradePath}
      TradeModal={TradeModal}
      onOrderNode={<OnOrder />}
      type={KLineChartType.Futures}
    />
  )
}

export default MarketDetailFutureTrade
