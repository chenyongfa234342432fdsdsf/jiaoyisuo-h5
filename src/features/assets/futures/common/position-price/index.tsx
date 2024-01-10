/**
 * 合约 - 仓位价格展示组件
 */
import { t } from '@lingui/macro'
import { PositionList } from '@/typings/api/assets/futures'
import { IncreaseTag } from '@nbit/react'
import styles from './index.module.css'

function PositionPrice({
  positionData,
  onSelectLatestPrice,
}: {
  positionData: PositionList
  onSelectLatestPrice?: () => void
}) {
  const { openPrice, markPrice, latestPrice, quoteSymbolName, priceOffset } = positionData

  const priceList = [
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101428',
        values: { 0: quoteSymbolName },
      }),
      value: <IncreaseTag value={openPrice || ''} hasPrefix={false} hasColor={false} digits={+priceOffset} />,
    },
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101429',
        values: { 0: quoteSymbolName },
      }),
      value: <IncreaseTag value={markPrice || ''} hasPrefix={false} hasColor={false} digits={+priceOffset} />,
    },
    {
      label: t({
        id: 'features_assets_futures_common_position_price_index_5101443',
        values: { 0: quoteSymbolName },
      }),
      value: (
        <span className={`${onSelectLatestPrice && 'text-brand_color'}`}>
          <IncreaseTag value={latestPrice || ''} hasPrefix={false} hasColor={false} digits={+priceOffset} />
        </span>
      ),
      onClick: onSelectLatestPrice,
    },
  ]
  return (
    <div className={styles['position-price-root']}>
      {priceList.map((item, index: number) => {
        return (
          <div
            className="price-item"
            key={index}
            onClick={() => {
              if (!item.onClick) return

              item?.onClick()
            }}
          >
            <span>{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export { PositionPrice }
