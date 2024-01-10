/**
 * 强平详情
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { getFuturesGroupTypeName, getFuturesPositionTypeName } from '@/constants/assets/futures'
import { TradeUnitEnum } from '@/constants/trade'
import { calculatorPositionSize } from '@/helper/assets/futures'
import { formatDate } from '@/helper/date'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useFutureTradeStore } from '@/store/trade/future'
import { IncreaseTag } from '@nbit/react'
import { formatCurrency } from '@/helper/decimal'

function LiquidationPositionDetails() {
  const {
    futuresPosition,
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()
  const { tradeUnit } = useFutureTradeStore().settings || {}
  const {
    closePrice,
    closeSize,
    profit,
    closePositionTime,
    baseSymbolName,
    quoteSymbolName,
    priceOffset,
    amountOffset,
    latestPrice,
    symbol,
    swapTypeInd,
    lever,
    sideInd,
  } = futuresPosition.liquidationDetails || {}

  const infoList = [
    {
      label: t({
        id: 'features_assets_futures_liquidation_details_details_index_nygz2gmwbm',
        values: { 0: quoteSymbolName },
      }),
      content: formatCurrency(closePrice, Number(priceOffset)),
    },
    {
      label: t({
        id: 'features_assets_futures_liquidation_details_details_index_loeednsfye',
        values: { 0: tradeUnit === TradeUnitEnum.indexBase ? baseSymbolName : quoteSymbolName },
      }),
      content: calculatorPositionSize(closeSize, amountOffset, latestPrice, offset),
    },
    {
      label: t({
        id: 'features_assets_futures_common_position_cell_index_5101432',
        values: { 0: quoteSymbolName },
      }),
      content: <IncreaseTag value={profit} kSign digits={offset} />,
    },
  ]

  const typeName = getFuturesGroupTypeName(swapTypeInd)
  const price = formatCurrency(closePrice, Number(priceOffset))
  const futuresName = `${symbol} ${typeName}`

  const futuresInfo = `${symbol} ${typeName}${getFuturesPositionTypeName(sideInd)} ${lever}X`

  return (
    <div className="details-wrap">
      <div className="details-header">
        <div className="header-title">{t`features_assets_futures_liquidation_details_details_index__8chzvpvfm`}</div>
        <div className="header-date">{formatDate(closePositionTime)}</div>
      </div>

      <div className="details-list">
        {infoList.map((info, i: number) => {
          return (
            <div className="list-cell" key={i}>
              <div className="label">{info.label}</div>
              <div className="value">{info.content}</div>
            </div>
          )
        })}
      </div>

      <div className="hint-wrap">
        <Icon name="prompt-symbol" className="hint-icon" />
        <span
          className="hint-text"
          dangerouslySetInnerHTML={{
            __html: t({
              id: 'features_assets_futures_liquidation_details_details_index_7txbt3xzoc',
              values: {
                0: futuresName,
                1: price,
                2: futuresInfo,
              },
            }),
          }}
        ></span>
      </div>
    </div>
  )
}

export { LiquidationPositionDetails }
