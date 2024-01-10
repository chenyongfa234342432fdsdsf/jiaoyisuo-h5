import { SelectActionSheet } from '@/components/select-action-sheet'
import { useMemo } from 'react'
import { t } from '@lingui/macro'
import { OrderBookDepthTypeDefaultEnum } from '@/store/order-book/common'
import styles from './index.module.css'

function MarketOrderBookHeader({ onMergeDepth, mergeDepth, depthOffset }) {
  const mergeDepthOptions = useMemo(() => {
    if (depthOffset && depthOffset.length > 0) {
      return [...depthOffset].reverse().map(v => {
        return { name: v, value: v }
      })
    }

    const mergeDepthValue =
      depthOffset && depthOffset.length > 0
        ? depthOffset[depthOffset.length - 1]
        : OrderBookDepthTypeDefaultEnum.default

    return [{ name: mergeDepthValue, value: mergeDepthValue }]
  }, [depthOffset])

  return (
    <div className={`market-order-book-header ${styles.scoped}`}>
      <div className="buy">
        <label>{t`features_order_book_market_header_index_510274`}</label>
      </div>
      <div className="sell">
        <label>{t`features_order_book_market_header_index_510275`}</label>
        <SelectActionSheet value={mergeDepth} actions={mergeDepthOptions} onChange={onMergeDepth} />
      </div>
    </div>
  )
}

export default MarketOrderBookHeader
