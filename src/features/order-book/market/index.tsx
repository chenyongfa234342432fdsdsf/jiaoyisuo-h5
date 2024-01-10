import { useEffect, useState } from 'react'
import { OrderBookDepthTypeDefaultEnum } from '@/store/order-book/common'
import { useTradeCurrentSpotCoin, useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { TradeModeEnum } from '@/constants/trade'
import MarketOrderBookHeader from './header'
import MarketOrderBookContainer from './container'

function MarketOrderBook({ tradeMode }) {
  const [mergeDepth, setMergeDepth] = useState<string>(OrderBookDepthTypeDefaultEnum.default)

  const spotCoin = useTradeCurrentSpotCoin()
  const contractCoin = useTradeCurrentFutureCoin()
  const currentCoin = tradeMode === TradeModeEnum.spot ? spotCoin : contractCoin

  useEffect(() => {
    currentCoin.depthOffset &&
      setMergeDepth(
        currentCoin.depthOffset.length > 0
          ? currentCoin.depthOffset[currentCoin.depthOffset.length - 1]
          : OrderBookDepthTypeDefaultEnum.default
      )
  }, [currentCoin.depthOffset])

  return (
    <section className="market-order-book">
      <MarketOrderBookHeader
        mergeDepth={mergeDepth}
        onMergeDepth={setMergeDepth}
        depthOffset={currentCoin?.depthOffset}
      />
      <MarketOrderBookContainer mergeDepth={mergeDepth} tradeMode={tradeMode} />
    </section>
  )
}

export default MarketOrderBook
