/**
 * 合约组详情 - 保证金列表组件
 */
import { t } from '@lingui/macro'
import { useRef } from 'react'
import { useLongPress } from 'ahooks'
import { Button, Popover, PopoverInstance, SwipeCell } from '@nbit/vant'
import LazyImage from '@/components/lazy-image'
import { AssetsGuideIdEnum, AssetsTransferTypeEnum } from '@/constants/assets/common'
import { DetailMarginListChild } from '@/typings/api/assets/futures'
import { CommonDigital } from '@/components/common-digital'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCurrency } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { calculatorCoinRate } from '@/helper/assets/futures'
import CommonList from '@/components/common-list/list'
import { getCoinPrecision } from '@/helper/assets/spot'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'
import { MarginOperateGuide } from './margin-operate-guide'

function MarginList({
  onClick,
  swipeCellRef,
}: {
  onClick: (type: string, e?: DetailMarginListChild) => void
  swipeCellRef?: any
}) {
  const {
    futuresDetails: {
      margin: { list: marginList, baseCoin },
    },
    futuresCurrencySettings: { offset },
  } = useAssetsFuturesStore()
  const { isFusionMode } = useCommonStore()

  function ListItem({ index, item }: { index: number; item: DetailMarginListChild }) {
    const ref = useRef<any>(null)
    const popover = useRef<PopoverInstance>(null)
    const { coinName, amount, symbol, appLogo } = item || {}

    useLongPress(() => popover.current?.show(), ref, {
      onClick: () => {
        popover.current?.hide()
      },
    })

    return (
      <div id={index === 0 ? AssetsGuideIdEnum.futuresDetailAssetsListCell : ''}>
        <SwipeCell
          ref={index === 0 ? swipeCellRef : null}
          onOpen={() => popover.current?.hide()}
          rightAction={
            <>
              <Button
                className="coin-withdraw-btn"
                onClick={() => onClick(AssetsTransferTypeEnum.from, item)}
              >{t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}</Button>
              <Button
                type="danger"
                className="coin-recharge-btn"
                onClick={() => onClick(AssetsTransferTypeEnum.to, item)}
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
              <div className={`margin-list-item ${index + 1 === marginList.length && '!border-b-0'}`} ref={ref}>
                <div className="coin-info">
                  <LazyImage src={appLogo} width={24} height={24} />
                  <span className="coin-name">{coinName}</span>
                </div>

                <div className="coin-right">
                  <CommonDigital content={formatCurrency(amount, getCoinPrecision(symbol), false)} />
                  {!isFusionMode && (
                    <CommonDigital
                      className="coin-amount"
                      content={`≈ ${formatCurrency(
                        decimalUtils.SafeCalcUtil.mul(amount, calculatorCoinRate(symbol || '')),
                        offset,
                        false
                      )}
                   ${baseCoin}`}
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
                  onClick(AssetsTransferTypeEnum.from, item)
                }}
              >{t`features_assets_overview_list_futures_assets_list_position_cell_index_b4lpi9drxb96arjutxoqj`}</div>
              <div className="popover-line" />
              <div
                className="popover-btn"
                onClick={() => {
                  popover.current?.hide()
                  onClick(AssetsTransferTypeEnum.to, item)
                }}
              >{t`features_assets_overview_list_futures_assets_list_position_cell_index_87axu5vz34rcbqpmoaqok`}</div>
            </div>
          </Popover>
        </SwipeCell>
      </div>
    )
  }

  return (
    <>
      <div className={styles['margin-list-wrapper']}>
        <CommonList
          finished
          showEmpty={marginList.length === 0}
          listChildren={marginList.map((item: DetailMarginListChild, index: number) => {
            return <ListItem item={item} key={index} index={index} />
          })}
        />
      </div>

      <MarginOperateGuide />
    </>
  )
}

export { MarginList }
