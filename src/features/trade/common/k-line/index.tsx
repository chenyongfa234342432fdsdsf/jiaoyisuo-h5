import { t } from '@lingui/macro'
import { Collapse } from '@nbit/vant'
import { useRef, lazy, useState, useEffect, ReactNode } from 'react'
import AsyncSuspense from '@/components/async-suspense'
// 官网存在可以直接导出的类型，但是这个版本没有
import type { CollapseItemInstance } from '@nbit/vant/es/collapse/PropsType'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { useMarketStore } from '@/store/market'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'

import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { useCommonStore } from '@/store/common'
import { getQuoteDisplayName, onTradePairClickRedirectCommon } from '@/helper/market'
import styles from './index.module.css'

const Chart = lazy(() => import('@/components/chart'))
const TernaryChart = lazy(() => import('@/components/chart/ternary-chart'))

const option = 'option'

function TradeKLine(props: { isOption?: boolean; type?: KLineChartType; symbolName: ReactNode }) {
  const marketState = useMarketStore()
  let currentModule

  const theme = useCommonStore().theme
  const contractMarketState = useContractMarketStore()
  const [klineDetail, setKlineDetail] = useState<YapiGetV1TradePairListData>()
  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const [expanded, setExpanded] = useState(false)

  const [curSelectCoin, setCurSelectCoin] = useState<{
    baseSymbolName: string
    quoteSymbolName: string
    id: number
  }>({
    baseSymbolName: '',
    quoteSymbolName: '',
    id: 0,
  })

  useEffect(() => {
    // TODO-LEO switch to the correct store
    currentModule.loadCoinSelectedHistoryList()
  }, [currentModule.allTradePairs])

  useEffect(() => {
    if (currentModule.currentCoin.id) {
      const { baseSymbolName, quoteSymbolName, id } = currentModule.currentCoin
      setCurSelectCoin({
        baseSymbolName,
        quoteSymbolName,
        id,
      })

      currentModule.updateCoinSelectedHistoryList([currentModule.currentCoin as any as YapiGetV1TradePairListData])
    }
  }, [currentModule.currentCoin.id])
  const collapseItemRef = useRef<CollapseItemInstance>(null)
  const toggle = () => {
    setExpanded(!expanded)
    collapseItemRef.current?.toggle(!expanded)
  }

  const changeTradeCoin = item => {
    const { baseSymbolName, quoteSymbolName, id } = item
    setCurSelectCoin({
      baseSymbolName,
      quoteSymbolName,
      id,
    })
  }

  const isCurrentSelected = !expanded

  const left = !expanded ? (
    <div className="text-xs text-text_color_02">
      {props.symbolName && <span className="mr-2">{props.symbolName}</span>}
      <span>{t`features_trade_common_k_line_index_510273`}</span>
    </div>
  ) : (
    <div className="expanded-wrap" style={{ maxWidth: `calc(100vw - ${isCurrentSelected ? '80' : '120'}px)` }}>
      {currentModule.coinSelectedHistoryList.map((item: any) => {
        return (
          <div
            key={item.id}
            onClick={e => {
              e.stopPropagation()
              changeTradeCoin(item)
              setKlineDetail(item)
            }}
            className={classNames({
              'selected-coin': item.id === curSelectCoin.id,
            })}
          >
            {getQuoteDisplayName(item, false, false, 'trade')}
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      className={classNames(styles['trade-kline-wrapper'], 'rv-hairline--top rv-hairline--bottom', {
        'is-option': props.isOption,
        'is-expanded': expanded,
      })}
      onClick={toggle}
    >
      <Collapse>
        <Collapse.Item ref={collapseItemRef} title={left} name="1">
          <AsyncSuspense hasLoading>
            {!props.type ? (
              <TernaryChart />
            ) : (
              <Chart from="trade" type={props.type} klineDetail={klineDetail as YapiGetV1TradePairListData} />
            )}
          </AsyncSuspense>
        </Collapse.Item>
      </Collapse>
      <div className="expand">
        {expanded && currentModule.currentCoin.id !== curSelectCoin.id ? (
          <span className="inline-flex">
            <span className={`fade-${theme}`}></span>
            <span className="bg-bg_color">
              <span
                className="text-brand_color"
                onClick={() => {
                  onTradePairClickRedirectCommon(
                    currentModule.allTradePairs.find(item => item.id === curSelectCoin.id),
                    'trade'
                  )
                }}
              >{t`assets.coin.trade.go_to_trade`}</span>
              <span className="mx-1">|</span>
            </span>
          </span>
        ) : (
          <span className={`fade-${theme}`}></span>
        )}
        <span className="mr-1 text-xs">
          {!expanded
            ? t`features_market_market_quatation_market_sector_sector_glate_detail_index_510154`
            : t`features_market_detail_current_coin_describe_index_510215`}
        </span>
        <Icon
          className={classNames('transition-all text-[8px]', {
            'rotate-180': expanded,
            'mt-[2px]': expanded,
          })}
          name="icon_trade_drop"
          hiddenMarginTop
          hasTheme
        />
      </div>
    </div>
  )
}

export default TradeKLine
