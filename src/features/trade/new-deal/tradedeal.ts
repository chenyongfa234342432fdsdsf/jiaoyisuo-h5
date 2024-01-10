import { t } from '@lingui/macro'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { getMarketTrades } from '@/apis/trade'
import { getFutureMarketTrades } from '@/apis/future/common'
import spotWs from '@/plugins/ws'
import futureWs from '@/plugins/ws/futures'

export const useTradeDeal = () => {
  const tradeDeal = [
    { title: t`features_market_detail_index_510200`, id: 'latestTransaction' },
    { title: t`features_trade_new_deal_tradedeal_z6rfrzgs6gyyuuc9en7lu`, id: 'realTimeTransaction' },
  ]

  const subObj = {
    futures: {
      requestSubs: {
        biz: 'perpetual',
        type: 'perpetual_deal',
        contractCode: 'BTC_USDT',
      },
      getStore: useContractMarketStore,
      request: {
        latestTransaction: getFutureMarketTrades,
      },
      ws: futureWs,
    },
    quote: {
      requestSubs: {
        biz: 'spot',
        type: 'deal',
        contractCode: 'BTC_USDT',
      },
      getStore: useMarketStore,
      request: {
        latestTransaction: getMarketTrades,
      },
      ws: spotWs,
    },
  }

  const setChangeSubs = type => {
    return subObj[type]
  }

  return { tradeDeal, setChangeSubs }
}
