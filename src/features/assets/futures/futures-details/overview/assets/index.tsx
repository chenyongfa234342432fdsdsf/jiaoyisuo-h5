/**
 * 合约账户详情 - 资产分布
 */
import { t } from '@lingui/macro'
import { Popover, PopoverInstance } from '@nbit/vant'
import { useEffect, useRef, useState } from 'react'
import { FuturesDetailsChartTabEnum } from '@/constants/assets/futures'
import Icon from '@/components/icon'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { decimalUtils } from '@nbit/utils'
import { useUpdateEffect } from 'ahooks'
import { GroupDetailMarginCoin, GroupDetailPositionAsset } from '@/typings/api/assets/futures'
import { ResponsivePie } from '@nivo/pie'
import { handlePositionChartRatioData } from '@/helper/assets/futures'
import { CommonDigital } from '@/components/common-digital'
import { formatCurrency } from '@/helper/decimal'
import { useCommonStore } from '@/store/common'
import { TradeDirectionTag } from '../../../common/trade-direction-tag'
import styles from './index.module.css'

function FuturesOverviewAssets() {
  const { isFusionMode } = useCommonStore()
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const popover = useRef<PopoverInstance>(null)
  const {
    futuresDetails: {
      details,
      details: { baseCoin, marginAvailable, positionMargin, marginCoin, positionAsset, openLockAsset },
    },
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const [assetsInfo, setAssetsInfo] = useState({
    label: t`features_assets_futures_futures_details_chart_modal_index_5101387`,
    id: FuturesDetailsChartTabEnum.assets,
  })

  const assetsTypeList = [
    {
      label: t`features_assets_futures_futures_details_chart_modal_index_5101387`,
      id: FuturesDetailsChartTabEnum.assets,
    },
    {
      label: t`features_assets_futures_futures_details_chart_modal_index_5101388`,
      id: FuturesDetailsChartTabEnum.bail,
    },
    {
      label: t`features_assets_futures_futures_details_chart_modal_index_5101389`,
      id: FuturesDetailsChartTabEnum.positionAssetRisk,
    },
  ]
  const [pieData, setPieData] = useState<any>([])
  const colorList = ['#6195F6', '#61C1F6', '#61DEF6', '#7B61F6', '#4E65E4']
  const [pct, setPct] = useState(0)

  /**
   * 计算资产占比图表数据
   */
  const onSetPieValue = (num: string | number, total: string) => {
    if (!num || !total) {
      return 0
    }
    return Math.max(1, Math.min(99, +SafeCalcUtil.mul(SafeCalcUtil.div(num, total), 100))).toFixed()
  }

  const onTotalStatistics = list => {
    let newTotal = 0
    for (let index = 0; index < list.length; index += 1) {
      newTotal += Number(list[index]?.coinConvert) || Number(list[index]?.nominalValue)
    }

    return newTotal
  }

  const CenterLabelLayer = ({ centerX, centerY }) => (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '16px', fontWeight: 'bold', fill: 'var(--text_color_01)' }}
    >
      {pct}%
    </text>
  )

  useEffect(() => {
    let newPieData
    let newTotal
    switch (assetsInfo.id) {
      case FuturesDetailsChartTabEnum.assets:
        newTotal = `${SafeCalcUtil.add(SafeCalcUtil.add(positionMargin, marginAvailable), openLockAsset)}`
        newPieData = [
          {
            id: t`features_assets_futures_common_migrate_modal_index_5101344`,
            coinName: t`features_assets_futures_common_migrate_modal_index_5101344`,
            value: marginAvailable || 0,
            color: '#6195F6',
            percent: onSetPieValue(marginAvailable, newTotal),
            isArcActive: true,
          },
          {
            id: t`features_assets_futures_futures_details_overview_tyfixyyu5ifz2vf5ix6ra`,
            coinName: t`features_assets_futures_futures_details_overview_tyfixyyu5ifz2vf5ix6ra`,
            value: positionMargin || 0,
            color: '#61C1F6',
            percent: onSetPieValue(positionMargin, newTotal),
            active: true,
          },
          {
            id: t`features_assets_futures_futures_details_overview_k9va1ke3ja7_fvplkrudf`,
            coinName: t`features_assets_futures_futures_details_overview_k9va1ke3ja7_fvplkrudf`,
            value: openLockAsset || 0,
            color: '#61DEF6',
            percent: onSetPieValue(openLockAsset, newTotal),
          },
        ].filter(item => item.value && +item.value > 0)
        break
      case FuturesDetailsChartTabEnum.bail:
        newTotal = `${onTotalStatistics(marginCoin)}`
        newPieData = marginCoin.map((item: GroupDetailMarginCoin, index: number) => {
          return {
            ...item,
            id: item.coinName,
            value: item.coinConvert,
            color: colorList[index],
            percent: onSetPieValue(item.coinConvert, newTotal),
          }
        })
        break
      case FuturesDetailsChartTabEnum.positionAssetRisk:
        newTotal = `${onTotalStatistics(positionAsset)}`
        newPieData = positionAsset.map((item: GroupDetailPositionAsset, index: number) => {
          return {
            ...item,
            id: item.coinName,
            value: item.nominalValue,
            color: colorList[index],
            percent: onSetPieValue(item.nominalValue, newTotal),
          }
        })
        break
      default:
        break
    }

    setPieData(newPieData)
  }, [assetsInfo])

  useUpdateEffect(() => {}, [details])

  useUpdateEffect(() => {
    if (!pieData || pieData.length === 0) return

    const maxPie = pieData.reduce((max, item) => {
      return item?.value > max.value ? item : max
    }, pieData[0])

    setPct(handlePositionChartRatioData(maxPie, pieData))
  }, [pieData])

  return (
    <div className={styles['futures-overview-assets-root']}>
      <div className="popover-wrap">
        <Popover
          ref={popover}
          placement="bottom"
          className={styles['futures-overview-assets-popover-root']}
          reference={
            <div className="popover-reference">
              <div className="popover-reference-text">{assetsInfo?.label}</div>
              <Icon name="regsiter_icon_drop" hasTheme className="popover-reference-icon" />
            </div>
          }
        >
          <div className="futures-overview-assets-popover-wrap">
            {assetsTypeList.map(item => {
              return (
                <div
                  key={item?.id}
                  className={`assets-popover-cell ${assetsInfo?.id === item?.id && 'assets-popover-cell-active'}`}
                  onClick={() => {
                    setAssetsInfo(item)
                    popover.current?.hide()
                  }}
                >
                  {item?.label}
                </div>
              )
            })}
          </div>
        </Popover>
      </div>

      <div className="assets-wrap">
        {pieData.length === 0 ||
        (assetsInfo?.id === FuturesDetailsChartTabEnum.assets &&
          +positionMargin === 0 &&
          assetsInfo?.id === FuturesDetailsChartTabEnum.assets &&
          +marginAvailable === 0) ? (
          <div className="empty">
            <div className="empty-img">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="40" fill="none" stroke="var(--bg_button_disabled)" strokeWidth="30" />
                <circle cx="60" cy="60" r="24" fill="none" stroke="var(--card_bg_color_02)" strokeWidth="3" />
              </svg>
            </div>
            <div className="empty-text">{t`components/common-list/list-empty/index-0`}</div>
          </div>
        ) : (
          <>
            <div className="chart-wrap">
              <ResponsivePie
                sortByValue
                data={pieData}
                margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                activeOuterRadiusOffset={8}
                arcLinkLabelsDiagonalLength={4} // 链接对角线长度
                arcLinkLabelsStraightLength={8} // 链接直线段的长度
                arcLinkLabelsTextOffset={5} // 距链接末端的 X 偏移量
                innerRadius={0.5} // 内圈半径
                enableArcLinkLabels={false} // 启用/禁用弧标签
                enableArcLabels={false} // 启用/禁用弧标签
                colors={(node: any) => {
                  return `${node.data.color}`
                }}
                tooltip={() => {
                  return null
                }}
                layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenterLabelLayer]}
                onClick={node => {
                  const data: any = node.data
                  setPct(handlePositionChartRatioData(data, pieData))
                }}
              />
            </div>

            <div className="chart-info-wrap">
              {pieData.map((pieItem, index: number) => {
                return (
                  <div key={index} className="legend-cell">
                    <div className="legend-header">
                      <div className="legend-icon" style={{ background: pieItem.color }} />
                      <span className="legend-title">
                        {pieItem.coinName && pieItem.coinName === 'other'
                          ? t`assets.financial-record.tabs.other`
                          : pieItem.coinName}
                      </span>
                      {assetsInfo?.id === FuturesDetailsChartTabEnum.positionAssetRisk && (
                        <TradeDirectionTag
                          sideInd={pieItem.sideInd}
                          showFutures={false}
                          showLever={false}
                          className={'legend-tag'}
                        />
                      )}
                    </div>

                    <CommonDigital
                      className="legend-num"
                      content={`${formatCurrency(pieItem.value, offset)} ${!isFusionMode ? baseCoin : ''}`}
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {assetsInfo?.id === FuturesDetailsChartTabEnum.positionAssetRisk && (
        <div className="chart-hint">{t`features_assets_futures_futures_details_chart_modal_index_5101390`}</div>
      )}
    </div>
  )
}

export { FuturesOverviewAssets }
