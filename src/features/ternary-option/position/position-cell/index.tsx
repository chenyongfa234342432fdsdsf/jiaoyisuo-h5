/**
 * 三元期权 - 当前持仓 - 持仓单元格
 */
import classNames from 'classnames'
import { IncreaseTag } from '@nbit/react'
import { CommonDigital } from '@/components/common-digital'
import { CountDown } from '@nbit/vant'
import { CurrentTime } from '@nbit/vant/es/hooks/use-count-down'
import { useEffect, useState } from 'react'
import Icon from '@/components/icon'
import { IOptionPositionList } from '@/typings/api/ternary-option/position'
import { formatCurrency } from '@/helper/decimal'
import { getFuturesGroupTypeName } from '@/constants/assets/futures'
import { OptionSideIndCallEnum, OptionsSideIndPutEnum, getOptionProductPeriodUnit } from '@/constants/ternary-option'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import { getTextFromStoreEnums } from '@/helper/store'
import { formatDate } from '@/helper/date'
import { decimalUtils } from '@nbit/utils'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { OptionsOrderProfitTypeEnum } from '@/constants/assets/common'
import LazyImage from '@/components/lazy-image'
import { OptionOrder_Body } from '@/plugins/ws/protobuf/ts/proto/OptionOrder'
import { useCommonStore } from '@/store/common'
import { HintModal } from '@/features/assets/futures/common/hint-modal'
import styles from './index.module.css'

interface IOptionsPositionCellProps {
  data: IOptionPositionList
  className?: string
  result?: OptionOrder_Body
}

function OptionsPositionCell(props: IOptionsPositionCellProps) {
  const safeCalcUtil = decimalUtils.SafeCalcUtil
  const { optionDictionaryEnums } = useOptionPositionStore()
  const { data, className, result } = props || {}
  const {
    openPrice,
    amount,
    symbol,
    typeInd,
    periodDisplay,
    periodUnit,
    amplitude,
    sideInd,
    targetPrice,
    coinSymbol,
    realYield,
    createdByTime,
    settlementTime,
    currentPrice,
    id,
    voucherAmount,
  } = data || {}

  const { orderId, profitable, profitValue, coinSymbol: resultCoinSymbol } = result || {}
  const [progress, setProgress] = useState(100)
  // 是否展开
  const [isExpand, setIsExpand] = useState(false)
  const isProfit = profitable === OptionsOrderProfitTypeEnum.profit
  const { isFusionMode } = useCommonStore()
  const [profit, setProfit] = useState('')
  const [hintVisible, setHintVisible] = useState(false)

  const dateList = [
    {
      title: t`features_future_computer_common_input_control_5oauty3eqs1fnkjg39jo1`,
      content: formatCurrency(openPrice),
      styles: { width: '46%' },
    },
    {
      title: t`features_assets_futures_futures_position_history_cell_index_3cpd00tlhn`,
      content: formatDate(createdByTime),
    },
    {
      title: t`features_ternary_option_option_order_ternary_order_item_index_5m9_o0qhxe`,
      content: formatDate(settlementTime),
    },
  ]

  useEffect(() => {
    if (!currentPrice) return
    const isProfitable = OptionSideIndCallEnum.includes(sideInd)
      ? +currentPrice > +targetPrice
      : +currentPrice < +targetPrice

    setProfit(isProfitable ? `${safeCalcUtil.mul(realYield, amount)}` : `-${amount}`)
  }, [currentPrice])

  return (
    <>
      <div className={classNames(styles['option-position-cell-root'], className)}>
        <div
          className={classNames('flip-card', {
            animation: orderId === `${id}`,
          })}
        >
          <div className="front">
            <div className="position-header">
              <div className="header-info">
                <div className="header-title">
                  {symbol} {getFuturesGroupTypeName(typeInd)}
                </div>

                <div
                  className={`tag ${
                    OptionSideIndCallEnum.includes(sideInd) && '!bg-buy_up_color_special_02 !text-buy_up_color'
                  } ${
                    OptionsSideIndPutEnum.includes(sideInd) && '!bg-sell_down_color_special_02 !text-sell_down_color'
                  }`}
                >
                  {getTextFromStoreEnums(sideInd, optionDictionaryEnums.optionsSideIndEnum.enums)} {amplitude}
                </div>
              </div>

              <Icon
                name={isExpand ? 'asset_view_coin_fold' : 'asset_view_coin_unfold'}
                hasTheme
                className="expand-icon"
                onClick={() => setIsExpand(!isExpand)}
              />
            </div>

            <div className="income-wrap">
              <div className="income-cell">
                <div className="income-label">
                  {isFusionMode
                    ? t`features_ternary_option_trade_exhange_order_form_e0gztgzxmq`
                    : t`features/assets/financial-record/record-detail/record-details-info/index-13`}
                </div>
                <IncreaseTag
                  value={(isFusionMode ? decimalUtils.SafeCalcUtil.add(realYield, 1) : realYield) || ''}
                  digits={isFusionMode ? 4 : 2}
                  hasPostfix={!isFusionMode}
                  hasPrefix={!isFusionMode}
                  needPercentCalc
                />
              </div>

              <div className="income-num">
                <IncreaseTag value={profit} digits={2} kSign delZero={false} />
              </div>
            </div>

            <div className="target-price-wrap">
              <div className="price-cell">
                <div className="info-label">
                  {t({
                    id: 'features_ternary_option_position_position_cell_index_mgwo8ckonc',
                    values: { 0: coinSymbol },
                  })}
                  {voucherAmount && +voucherAmount > 0 && (
                    <Icon name="msg" hasTheme className="msg-icon" onClick={() => setHintVisible(true)} />
                  )}
                </div>
                <CommonDigital content={formatCurrency(amount)} className="info-amount" />
              </div>

              <div className="price-cell">
                <div className="info-label">
                  {t`features_ternary_option_option_order_ternary_order_item_index_v_orp_rzdo`}
                </div>
                <div className="info-amount">
                  {periodDisplay} {getOptionProductPeriodUnit(periodUnit)}
                </div>
              </div>

              <div className="mark-price-wrap">
                <div className="current-wrap">
                  <div
                    className={classNames('current-price', {
                      'animation-left !text-sell_down_color': currentPrice && +currentPrice < +targetPrice,
                      'animation-right !text-buy_up_color': currentPrice && +currentPrice > +targetPrice,
                      'animation-center !text-text_color_01': currentPrice && +currentPrice === +targetPrice,
                    })}
                  >
                    {formatCurrency(currentPrice)}
                  </div>
                </div>

                <div className="separation-wrap">
                  <div className="separation-cell border-r">
                    <div className="separation-line rounded-l-full" />
                  </div>

                  <div className="separation-cell border-l !border-buy_up_color">
                    <div className="separation-line rounded-r-full !bg-buy_up_color" />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <span className="info-label self-center mt-0.5">
                    {t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}:
                  </span>
                  <span className="target-price">{formatCurrency(targetPrice)}</span>
                </div>
              </div>
            </div>

            {isExpand && (
              <div className="info-wrap mb-1">
                {dateList.map((date, i: number) => {
                  return (
                    <div key={i} className="info-cell">
                      <div className="info-title">{date.title}</div>
                      <div className="info-content">{date.content}</div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="bottom-wrap">
              <div className="time-label">{t`features_ternary_option_position_position_cell_index_fenvjquvue`}</div>

              {Number(safeCalcUtil.sub(settlementTime, new Date().getTime())) > 0 ? (
                <div className="time-cell">
                  <CountDown
                    time={
                      Number(safeCalcUtil.sub(settlementTime, new Date().getTime())) > 0
                        ? Number(safeCalcUtil.sub(settlementTime, new Date().getTime()))
                        : 0
                    }
                    format="mm:ss"
                    onChange={(currentTime: CurrentTime) => {
                      const totalDuration = +safeCalcUtil.sub(settlementTime, createdByTime)
                      const progressPercentage = +safeCalcUtil.mul(
                        safeCalcUtil.div(currentTime.total, totalDuration),
                        100
                      )
                      setProgress(progressPercentage)
                    }}
                  />

                  <div className="time-progress-wrap">
                    <div className="time-progress" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="settlement-text">{t`features_ternary_option_position_position_cell_index_kuflsfmgya`}</div>
              )}
            </div>
          </div>

          {orderId === `${id}` && (
            <div className="result-wrap">
              <LazyImage
                lazyload={false}
                src={`${oss_svg_image_domain_address}option/${
                  isProfit ? 'icon_position_result_profit' : 'icon_position_result_loss'
                }.png`}
                className="result-img"
              />

              <div className="result-title">
                {isProfit
                  ? t`features_ternary_option_position_result_modal_index_hc1lotqu_a`
                  : t`features_ternary_option_position_result_modal_index_tfphzsuobg`}
              </div>
              <div
                className={classNames('result-text', {
                  profit: isProfit,
                  loss: !isProfit,
                })}
              >
                {`${
                  isProfit ? t`features_orders_future_holding_close_685` : t`features_orders_future_holding_close_686`
                } ${formatCurrency(profitValue)} ${resultCoinSymbol} `}
              </div>
            </div>
          )}
        </div>
      </div>

      {hintVisible && (
        <HintModal
          visible={hintVisible}
          title={t`features_ternary_option_option_order_ternary_order_item_index_oyozmhztxn`}
          content={t({
            id: 'features_ternary_option_position_position_cell_index_dd_f1wcfwo',
            values: { 0: formatCurrency(amount), 1: coinSymbol, 2: voucherAmount, 3: coinSymbol },
          })}
          onCommit={() => setHintVisible(false)}
          onClose={() => setHintVisible(false)}
        />
      )}
    </>
  )
}

export { OptionsPositionCell }
