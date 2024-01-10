/**
 * 合约 - 历史仓位 - 列表单元格
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import { IFuturesPositionHistoryList } from '@/typings/api/assets/futures'
import { FuturesPositionHistoryTypeEnum, getFuturesGroupTypeName } from '@/constants/assets/futures'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCurrency } from '@/helper/decimal'
import { TradeUnitEnum } from '@/constants/trade'
import { decimalUtils } from '@nbit/utils'
import { useFutureTradeStore } from '@/store/trade/future'
import { formatDate } from '@/helper/date'
import { getAssetsHistoryPositionDetailPageRoutePath, getFutureTradePagePath } from '@/helper/route'
import { link } from '@/helper/link'
import { TradeDirectionTag } from '../../common/trade-direction-tag'
import styles from './index.module.css'
import { RevenueDetails } from '../revenue-details'

interface IFuturesPositionHistoryCellProps {
  data: IFuturesPositionHistoryList
}
function FuturesPositionHistoryCell(props: IFuturesPositionHistoryCellProps) {
  const SafeCalcUtil = decimalUtils.SafeCalcUtil
  const { data } = props || {}
  const {
    symbol,
    swapTypeInd,
    operationTypeCd,
    quoteSymbolName,
    baseSymbolName,
    openPrice,
    closePrice,
    profitRatio,
    profit,
    size,
    closeSize,
    openPositionTime,
    closePositionTime,
    lever,
    sideInd,
    amountOffset,
    priceOffset,
    latestPrice,
  } = data || {}
  const { futuresEnums, updateFuturesPosition } = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const { tradeUnit } = useFutureTradeStore().settings || {}
  const isLiquidation = operationTypeCd === FuturesPositionHistoryTypeEnum.liquidation

  /**
   * 根据合约交易下单单位，折算持仓数量
   * 切换为计价币时=标的币数量*标记价格（结果保留计价法币精度）
   */
  const onFormatPositionSize = (val: string) => {
    if (tradeUnit === TradeUnitEnum.indexBase) {
      return formatCurrency(val, +amountOffset, false)
    } else {
      const positionMargin = `${SafeCalcUtil.mul(val, latestPrice)}`
      return formatCurrency(positionMargin, offset)
    }
  }

  const positionInfo = [
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101428',
        values: { 0: quoteSymbolName },
      }),
      value: formatCurrency(openPrice, Number(priceOffset)),
    },
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101432',
        values: { 0: quoteSymbolName },
      }),
      value: <IncreaseTag value={profit} hasPrefix={false} kSign digits={offset} />,
      isDeduction: +profit < 0,
    },
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101426',
        values: { 0: tradeUnit === TradeUnitEnum.indexBase ? baseSymbolName : quoteSymbolName },
      }),
      value: onFormatPositionSize(size),
      className: 'content-last',
    },
    {
      label: isLiquidation
        ? t({
            id: 'features_assets_futures_liquidation_details_details_index_nygz2gmwbm',
            values: { 0: quoteSymbolName },
          })
        : t({
            id: 'features_assets_futures_futures_position_history_cell_index_5sggfkg7sd',
            values: { 0: quoteSymbolName },
          }),
      value: formatCurrency(closePrice, Number(priceOffset)),
    },
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-13`,
      value: <IncreaseTag value={profitRatio} digits={2} hasPostfix needPercentCalc />,
    },
    {
      label: isLiquidation
        ? t({
            id: 'features_assets_futures_liquidation_details_details_index_loeednsfye',
            values: { 0: tradeUnit === TradeUnitEnum.indexBase ? baseSymbolName : quoteSymbolName },
          })
        : t({
            id: 'features_assets_futures_futures_position_history_cell_index_816vwyr_jb',
            values: { 0: tradeUnit === TradeUnitEnum.indexBase ? baseSymbolName : quoteSymbolName },
          }),
      value: onFormatPositionSize(closeSize),
      className: 'content-last',
    },
  ]

  const dateInfo = [
    {
      label: t`features_assets_futures_futures_position_history_cell_index_3cpd00tlhn`,
      value: formatDate(openPositionTime),
    },
    {
      label: isLiquidation
        ? t`features_assets_futures_futures_position_history_cell_index__ywf3y2y_e`
        : t`features_assets_futures_futures_position_history_cell_index_gjlube83ep`,
      value: formatDate(closePositionTime),
    },
  ]
  return (
    <div className={styles['futures-history-position-cell-root']}>
      <div className="header-wrap">
        <div className="position-info" onClick={() => link(getFutureTradePagePath({ symbolName: symbol }))}>
          <div className="name">
            {symbol} {getFuturesGroupTypeName(swapTypeInd)}
          </div>
          <Icon name="next_arrow" hasTheme className="next-icon" />

          <TradeDirectionTag showFutures={false} sideInd={sideInd} lever={`${lever}`} />
        </div>

        <div
          className={`close-type ${isLiquidation && '!text-warning_color'}`}
          onClick={() => {
            if (operationTypeCd !== FuturesPositionHistoryTypeEnum.liquidation) return

            updateFuturesPosition({ liquidationDetails: data })
            link(getAssetsHistoryPositionDetailPageRoutePath())
          }}
        >
          <span>{getTextFromStoreEnums(operationTypeCd, futuresEnums.historyPositionCloseTypeEnum.enums)}</span>
          {isLiquidation && <Icon name="next_arrow" hasTheme className="type-next-icon" />}
        </div>
      </div>

      <div className="content">
        {positionInfo.map((item, i) => {
          return (
            <div className={`info-cell ${item.className}`} key={i}>
              <div className="info-label">
                <span>{item.label}</span>
                {item.isDeduction && <RevenueDetails data={data} />}
              </div>
              <div className="info-content">{item.value}</div>
            </div>
          )
        })}
      </div>

      {dateInfo.map((dateItem, i) => {
        return (
          <div className="date-cell" key={i}>
            <div className="date-label">{dateItem.label}</div>
            <div className="date-content">{dateItem.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export { FuturesPositionHistoryCell }
