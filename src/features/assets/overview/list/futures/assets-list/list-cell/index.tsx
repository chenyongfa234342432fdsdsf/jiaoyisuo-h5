/**
 * 资产总览 - 合约资产列表 - 列表单元格
 */
import { useState } from 'react'
import LazyImage from '@/components/lazy-image'
import Icon from '@/components/icon'
import { CommonDigital } from '@/components/common-digital'
import { IFuturesAssetsList } from '@/typings/api/assets/futures'
import { useAssetsStore } from '@/store/assets/spot'
import { formatCoinAmount } from '@/helper/assets/spot'
import { formatCurrency } from '@/helper/decimal'
import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapEnum } from '@/constants/common'
import { AssetsGuideIdEnum } from '@/constants/assets/common'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'
import { FuturesMarginPositionCell } from '../position-cell'
import { FuturesAssetsListIntro } from '../list-intro'

interface IFuturesAssetsCellProps {
  isExpand: boolean
  data: IFuturesAssetsList
}

function FuturesAssetsCell(props: IFuturesAssetsCellProps) {
  const { isFusionMode } = useCommonStore()
  const { postGuideMapUpdate } = useBaseGuideMapStore()
  const { futuresCurrencySettings } = useAssetsFuturesStore()
  const [expand, setExpand] = useState(props.isExpand || false)
  const { appLogo, coinName, symbol, amount, convertedValue, groupList = [] } = props.data || {}
  const { futuresAssets } = useAssetsStore().assetsModule || {}
  const [introVisible, setIntroVisible] = useState(props.isExpand || false)

  const onCloseIntro = () => {
    setIntroVisible(false)
    postGuideMapUpdate(GuideMapEnum.contractAssetListMargin)
  }

  return (
    <>
      <div className={styles['futures-assets-list-cell-root']}>
        <div className="cell-parent">
          <div className="coin-info">
            <LazyImage src={appLogo} width={24} height={24} />
            <span className="coin-name">{coinName}</span>
          </div>

          <div className="coin-right">
            <div className="coin-assets">
              <CommonDigital content={formatCoinAmount(symbol, amount)} className="quantity" />
              {!isFusionMode && (
                <CommonDigital
                  content={`≈${formatCurrency(convertedValue, futuresCurrencySettings?.offset || 2)} ${
                    futuresAssets?.baseCoin || '--'
                  }`}
                  className="assets"
                />
              )}
            </div>
            <Icon
              name={expand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
              hasTheme
              className="coin-icon"
              onClick={(e: any) => {
                e.stopPropagation()
                setExpand(!expand)
              }}
            />
          </div>
        </div>
        {expand && (
          <div className={`cell-detail ${expand && 'border-b'}`}>
            {groupList.map((expandItem, index) => {
              return (
                <div
                  className="futures-margin-position-cell"
                  key={index}
                  id={index === 0 ? AssetsGuideIdEnum.assetsFuturesAssetsListCell : ''}
                >
                  <FuturesMarginPositionCell
                    data={expandItem}
                    isHideLine={index + 1 === groupList.length}
                    symbol={symbol}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {introVisible && <FuturesAssetsListIntro visible={introVisible} onExit={onCloseIntro} />}
    </>
  )
}

export { FuturesAssetsCell }
