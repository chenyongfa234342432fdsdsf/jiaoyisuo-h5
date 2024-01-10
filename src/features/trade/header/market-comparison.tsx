import { getTradeList } from '@/apis/assets/coin'
import Icon from '@/components/icon'
import { rateFilter } from '@/helper/assets/spot'
import { link } from '@/helper/link'
import { getTradePagePath } from '@/helper/route'
import { useSpotCoinSubscribe } from '@/hooks/features/market'
import { TradeListSpotResp } from '@/typings/api/assets/assets'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { Popup } from '@nbit/vant'
import { usePrevious, useRequest } from 'ahooks'
import classNames from 'classnames'
import { useEffect } from 'react'
import styles from './index.module.css'

type IMarketComparisonProps = {
  visible: boolean
  onClose: () => void
  coinId: number
}
type ICoinItemProps = {
  item: TradeListSpotResp
  onSelect: (item: TradeListSpotResp) => void
  shouldSubscribe: boolean
}
function CoinItem({ item, onSelect, shouldSubscribe }: ICoinItemProps) {
  const latestData = useSpotCoinSubscribe({
    symbol: item.symbolName!,
    symbolWassName: item.symbolWassName!,
    baseSymbolName: item.baseSymbolName!,
    quoteSymbolName: item.quoteSymbolName!,
    shouldSubscribe,
  })
  const prePrice = usePrevious(latestData.last, () => true)

  return (
    <div className="coin-item" onClick={() => onSelect(item)}>
      <div>
        <div className="mb-2">
          {item.baseSymbolName}/{item.quoteSymbolName!}
        </div>
        <div className="flex whitespace-nowrap text-xs">
          <IncreaseTag hasPrefix={false} value={item.last} hasColor diffTarget={Number(prePrice || 0)} />
          <span className={classNames('ml-2 text-text_color_03')}>
            {rateFilter({
              amount: latestData.last || item.last!,
              symbol: item.quoteSymbolName || '',
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <IncreaseTag value={item.chg} hasColor hasPostfix />
        <Icon name="next_arrow" hasTheme />
      </div>
    </div>
  )
}

export function MarketComparison({ visible, coinId, onClose }: IMarketComparisonProps) {
  const {
    data = [],
    loading,
    run,
  } = useRequest(
    async () => {
      const res = await getTradeList({
        sellCoinId: coinId?.toString(),
      })
      if (!res.isOk || !res.data) {
        return []
      }
      return res.data.spot!
    },
    {
      manual: true,
    }
  )

  useEffect(() => {
    if (!coinId) {
      return
    }
    run()
  }, [coinId])
  const onSelect = (item: TradeListSpotResp) => {
    onClose()
    link(getTradePagePath(item), {
      overwriteLastHistoryEntry: true,
    })
  }

  return (
    <Popup visible={visible} onClose={onClose} className="rounded">
      <div className={styles['market-comparison-wrapper']}>
        <h3 className="title">{t`features_trade_header_more_features_510283`}</h3>
        <div className="list">
          {/* 直接用 visible 来隐藏的话会在弹窗动画结束前有闪烁 */}
          {data.map(item => {
            return <CoinItem shouldSubscribe={visible} item={item} key={item.id} onSelect={onSelect} />
          })}
        </div>
      </div>
    </Popup>
  )
}
