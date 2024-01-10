/**
 * 合约资产 tab - 列表组件
 */
import { t } from '@lingui/macro'
import { useRef } from 'react'
import { useLongPress } from 'ahooks'
import { Button, Popover, PopoverInstance, SwipeCell } from '@nbit/vant'
import LazyImage from '@/components/lazy-image'
import { AssetsTransferTypeEnum } from '@/constants/assets/common'
import { DetailMarginListChild } from '@/typings/api/assets/futures'
import { CommonDigital } from '@/components/common-digital'
import CommonListEmpty from '@/components/common-list/list-empty'
import { formatCurrency } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { calculatorCoinRate } from '@/helper/assets/futures'

import { getCoinPrecision } from '@/helper/assets/spot'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'

function TradeAssetsList({
  list,
  baseCoin,
  onClick,
  swipeCellRef,
}: {
  list: DetailMarginListChild[]
  baseCoin: string
  onClick: (type: string, e?: DetailMarginListChild) => void
  swipeCellRef?: any
}) {
  const ListItem = ({ index, item }: { index: number; item: DetailMarginListChild }) => {
    const ref = useRef<any>(null)
    const popover = useRef<PopoverInstance>(null)
    const { coinName, amount, symbol, appLogo } = item || {}
    const { offset = 2 } = useAssetsFuturesStore().futuresCurrencySettings || {}

    useLongPress(() => popover.current?.show(), ref, {
      onClick: () => {
        popover.current?.hide()
      },
    })

    return (
      <SwipeCell
        ref={index === 0 ? swipeCellRef : null}
        onOpen={() => popover.current?.hide()}
        rightAction={
          <>
            <Button className="coin-withdraw-btn" onClick={() => onClick(AssetsTransferTypeEnum.from, item)}>
              {t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}
            </Button>
            <Button
              type="danger"
              className="coin-recharge-btn"
              onClick={() => onClick(AssetsTransferTypeEnum.to, item)}
            >
              {t`features_assets_overview_list_futures_assets_list_position_cell_index_87axu5vz34rcbqpmoaqok`}
            </Button>
          </>
        }
      >
        <Popover
          ref={popover}
          placement="top"
          offset={[0, -34]}
          theme="dark"
          trigger="manual"
          reference={
            <div className={'assets-list-item'} ref={ref}>
              <div className="coin-info">
                <LazyImage src={appLogo} width={24} height={24} alt="logo" />
                <span className="coin-name">{coinName}</span>
              </div>

              <div className="coin-right">
                <CommonDigital content={formatCurrency(amount, getCoinPrecision(symbol), false)} />
                <CommonDigital
                  className="coin-amount"
                  content={`≈ ${formatCurrency(
                    decimalUtils.SafeCalcUtil.mul(amount, calculatorCoinRate(symbol || '')),
                    offset,
                    false
                  )}
                   ${baseCoin}`}
                />
              </div>
            </div>
          }
        >
          <div className={styles['popover-content-wrapper']}>
            <div
              className="popover-btn"
              onClick={() => {
                popover.current?.hide()
                onClick(AssetsTransferTypeEnum.from, item)
              }}
            >
              {t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}
            </div>
            <div className="popover-line" />
            <div
              className="popover-btn"
              onClick={() => {
                popover.current?.hide()
                onClick(AssetsTransferTypeEnum.to, item)
              }}
            >
              {t`features_assets_overview_list_futures_assets_list_position_cell_index_87axu5vz34rcbqpmoaqok`}
            </div>
          </div>
        </Popover>
      </SwipeCell>
    )
  }

  return (
    <>
      <div className={styles['assets-list-wrapper']}>
        {list.length > 0 ? (
          list.map((item: DetailMarginListChild, index: number) => {
            return <ListItem item={item} key={index} index={index} />
          })
        ) : (
          <CommonListEmpty className="pt-8 pb-20" />
        )}
      </div>
    </>
  )
}

export { TradeAssetsList }
