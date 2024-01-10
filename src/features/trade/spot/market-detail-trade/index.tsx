import { TradeModeEnum } from '@/constants/trade'
import { getTradePagePath } from '@/helper/route'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { KLineChartType } from '@nbit/chart-utils'
import { useExchangeInTop } from '../../common/exchange/context'
import { spotTradeCalcHelper } from '../../common/exchange/calc/spot'
import { TradeModal } from './trade-modal'
import { OnOrder } from '../exchange-order'
import MarketDetailTrade from '../../common/market-detail-trade'

function MarketDetailSpotTrade() {
  const useExchangeResult = useExchangeInTop(spotTradeCalcHelper, TradeModeEnum.spot, true)
  const currentSpotCoin = useTradeCurrentSpotCoin()

  const tradePath = getTradePagePath(currentSpotCoin)

  return (
    <MarketDetailTrade
      useExchangeResult={useExchangeResult}
      isTrade
      tradePath={tradePath}
      TradeModal={TradeModal}
      onOrderNode={<OnOrder />}
      type={KLineChartType.Quote}
    />
  )
}

export default MarketDetailSpotTrade
