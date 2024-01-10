/**
 * 资产总览 - 合约资产列表 - 逐仓单元格
 */
import { t } from '@lingui/macro'
import { useRef } from 'react'
import { Button, Popover, PopoverInstance, SwipeCell } from '@nbit/vant'
import { useLongPress } from 'ahooks'
import { CommonDigital } from '@/components/common-digital'
import { IFuturesAssetsGroupList } from '@/typings/api/assets/futures'
import { useAssetsStore } from '@/store/assets/spot'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCoinAmount } from '@/helper/assets/spot'
import { link } from '@/helper/link'
import { getAssetsFuturesTransferPageRoutePath } from '@/helper/route'
import { AssetsTransferTypeEnum } from '@/constants/assets/common'
import { formatCurrency } from '@/helper/decimal'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'

interface IFuturesMarginPositionCellProps {
  isHideLine: boolean
  data: IFuturesAssetsGroupList
  symbol: string
}

function FuturesMarginPositionCell(props: IFuturesMarginPositionCellProps) {
  const { isFusionMode } = useCommonStore()
  const { isHideLine, data, symbol } = props || {}
  const ref = useRef<any>(null)
  const popover = useRef<PopoverInstance>(null)
  const { groupName, amount, convertedValue, groupId = '' } = data || {}
  const { futuresAssets } = useAssetsStore().assetsModule || {}
  const { offset = 2 } = useAssetsFuturesStore().futuresCurrencySettings || {}

  useLongPress(() => popover.current?.show(), ref, {
    onClick: () => {
      popover.current?.hide()
    },
  })

  /**
   * 划转
   */
  const onTransfer = (type: string) => {
    link(getAssetsFuturesTransferPageRoutePath({ groupId, type, symbol }))
  }

  return (
    <SwipeCell
      // ref={isSwipeFuturesAssets ? swipeCellRef : null}
      onOpen={() => popover.current?.hide()}
      rightAction={
        <>
          <Button
            className="coin-out-btn"
            onClick={() => onTransfer(AssetsTransferTypeEnum.from)}
          >{t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}</Button>
          <Button
            type="danger"
            className="coin-into-btn"
            onClick={() => onTransfer(AssetsTransferTypeEnum.to)}
          >{t`features_assets_overview_list_futures_assets_list_position_cell_index_87axu5vz34rcbqpmoaqok`}</Button>
        </>
      }
    >
      <Popover
        ref={popover}
        placement="top"
        theme="dark"
        trigger="manual"
        reference={
          <div className={`${styles['futures-margin-position-cell-root']} ${isHideLine && '!border-none'}`} ref={ref}>
            <span className="position-name">{groupName}</span>

            <div className="position-assets">
              <CommonDigital content={formatCoinAmount(symbol, amount)} className="quantity" />
              {!isFusionMode && (
                <CommonDigital
                  content={`≈${formatCurrency(convertedValue, offset)} ${futuresAssets?.baseCoin || '--'}`}
                  className="assets"
                />
              )}
            </div>
          </div>
        }
      >
        <div className={styles['popover-content-wrapper']}>
          <div
            className="popover-btn"
            onClick={() => {
              popover.current?.hide()
              onTransfer(AssetsTransferTypeEnum.from)
            }}
          >{t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}</div>
          <div className="popover-line" />
          <div
            className="popover-btn"
            onClick={() => {
              popover.current?.hide()
              onTransfer(AssetsTransferTypeEnum.to)
            }}
          >{t`features_assets_overview_list_futures_assets_list_position_cell_index_87axu5vz34rcbqpmoaqok`}</div>
        </div>
      </Popover>
    </SwipeCell>
  )
}

export { FuturesMarginPositionCell }
