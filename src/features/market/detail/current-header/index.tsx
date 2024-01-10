import { ReactNode, useState } from 'react'
import { IncreaseTag } from '@nbit/react'
import { useMarketStore } from '@/store/market'
import { getQuoteDisplayName } from '@/helper/market'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { getMarketDetailPagePath, getContractMarketDetailPagePath } from '@/helper/route'
import CollectStar from '@/components/collect-star'
import { MarketComparison } from '@/features/trade/header/market-comparison'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { useMarketListStore } from '@/store/market/market-list'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'
import classNames from 'classnames'
import { getHistoryStack } from '@/helper/cache'
import Styles from './index.module.css'

type ICurrentHeaderProps = {
  extra?: ReactNode
  type: 'trade' | 'kline'
  coinType: KLineChartType | 'ternary-option'
}

function CurrentHeader({ extra, type, coinType }: ICurrentHeaderProps) {
  let currentModule
  let marketListState

  const marketState = useMarketStore()
  const contractMarketState = useContractMarketStore()
  const marketListStore = useMarketListStore()

  if (coinType === KLineChartType.Quote) {
    currentModule = marketState
    marketListState = marketListStore.spotMarketsTradeModule
  } else {
    currentModule = contractMarketState
    marketListState = marketListStore.futuresMarketsTradeModule
  }

  const [marketVisible, setMarketVisible] = useState(false)

  const currentCoin = currentModule.currentCoin
  const linkChart = () => {
    coinType === KLineChartType.Quote
      ? link(getMarketDetailPagePath(currentCoin))
      : link(getContractMarketDetailPagePath(currentCoin))
  }

  const historyStack = getHistoryStack() || []

  const backTradePage = () => {
    // coinType === KLineChartType.Quote
    //   ? link(getTradePagePath(currentModule.currentCoin))
    //   : link(getFutureTradePagePath(currentCoin))
    if (historyStack.length === 0) {
      link('/home-page')
      return
    }
    history.back()
  }

  return (
    <div className={Styles.scoped}>
      {type === 'trade' ? (
        <div className="trade-header">
          <div className="left-wrap">
            <marketListState.TradeSearchComponent from="trade" />
            <div
              className="coin"
              onClick={() => {
                marketListState.setIsSearchPopoverVisible(true)
              }}
            >
              {getQuoteDisplayName(currentModule.currentCoin, false, false, 'trade')}
            </div>
            <div
              className={classNames('p-0.5 chg-tag rounded-sm text-xs', {
                'bg-buy_up_color_special_02': parseFloat(currentModule.currentCoin.chg) > 0,
                'bg-sell_down_color_special_02': parseFloat(currentModule.currentCoin.chg) < 0,
                'bg-button_hover_01': parseFloat(currentModule.currentCoin.chg) === 0,
              })}
            >
              <IncreaseTag hasPostfix digits={2} value={currentModule.currentCoin.chg} />
            </div>
            {coinType === KLineChartType.Quote
              ? currentModule.currentCoin.conceptList?.slice(0, 1).map(item => {
                  return (
                    <div className="group" key={item.id}>
                      {item.name}
                    </div>
                  )
                })
              : null}
          </div>
          <div className="right-wrap">
            <CollectStar
              className="star"
              needWrap={false}
              {...(currentModule.currentCoin as unknown as YapiGetV1FavouriteListData)}
            />
            <Icon className="common-icon mr-3" onClick={linkChart} name="contract_k_line" hasTheme />
            <div className="extra-wrap">{extra}</div>
          </div>
        </div>
      ) : (
        <div className="kline-header">
          <div className="left-wrap">
            <Icon onClick={backTradePage} className="back" name="back" hasTheme />
          </div>
          <div className="center-wrap">
            <marketListState.TradeSearchComponent from="kline" />
            <div
              className={classNames({
                'coin': coinType === KLineChartType.Quote,
                'contract-coin': coinType === KLineChartType.Futures,
              })}
              onClick={() => {
                marketListState.setIsSearchPopoverVisible(true)
              }}
            >
              {getQuoteDisplayName(currentModule.currentCoin, false, false, 'kline', coinType)}
            </div>
          </div>
          <div className="right-wrap">
            {coinType === KLineChartType.Quote && (
              <Icon
                onClick={() => {
                  setMarketVisible(true)
                }}
                className="common-icon"
                name="spot_comparison_white"
              />
            )}
            <CollectStar
              className="star"
              needWrap={false}
              {...(currentModule.currentCoin as unknown as YapiGetV1FavouriteListData)}
            />
          </div>
          <MarketComparison
            coinId={currentModule.currentCoin.sellCoinId!}
            visible={marketVisible}
            onClose={() => setMarketVisible(false)}
          />
        </div>
      )}
    </div>
  )
}

export default CurrentHeader
