import {
  createCheckboxIconRender,
  futureReduceCheckboxIconRender,
  futureStopLimitCheckboxIconRender,
} from '@/components/radio/icon-render'
import Slider from '@/components/slider'
import { FutureHelpCenterEnum } from '@/constants/future/future-const'
import { PersonProtectTypeEnum, TradeFutureMarginTypeInReqEnum } from '@/constants/trade'
import { useFutureVersionIsPro, useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import { useFutureTradeStore } from '@/store/trade/future'
import { t } from '@lingui/macro'
import { Checkbox } from '@nbit/vant'
import classNames from 'classnames'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useToggle } from 'ahooks'
import Icon from '@/components/icon'
import { formatCurrency } from '@/helper/decimal'
import { useCommonStore } from '@/store/common'
import { useExchangeContext } from '../common/exchange/context'
import TradePriceInput from '../common/price-input'
import TradeSelect from '../common/select'
import UnderlineTip from '../common/underline-tip'
import styles from './common.module.css'

function PercentButtons({ disabled = false }) {
  const { tradeInfo, isBuy, onExtraMarginPercentChange } = useExchangeContext()
  const percentButtons = [
    {
      text: '25%',
      value: 25,
    },
    {
      text: '50%',
      value: 50,
    },
    {
      text: '75%',
      value: 75,
    },
    {
      text: t`constants_order_746`,
      value: 100,
    },
  ]

  return (
    <div className={styles['percent-buttons-wrapper']}>
      {percentButtons.map(item => {
        const lastActive = percentButtons.find(v => tradeInfo.extraMarginPercent === v.value)
        const onClick = () => {
          if (disabled) return
          onExtraMarginPercentChange(lastActive?.value === item.value ? 0 : item.value)
        }
        return (
          <div
            onClick={onClick}
            key={item.value}
            className={classNames('percent-button', {
              'is-buy': isBuy,
              disabled,
              // 不仅要大于，最后一个还要相等
              'active': !!lastActive && tradeInfo.extraMarginPercent >= item.value,
              'current-active': lastActive?.value === item.value,
            })}
          >
            <div className="bg-block"></div>
            <div>{item.text}</div>
          </div>
        )
      })}
    </div>
  )
}

/** 抽离出来主要是新手引导需要 */
export function useFutureExtraVisible() {
  const { tradeInfo } = useExchangeContext()
  const isPro = useFutureVersionIsPro()
  const { preferenceSettings } = useFutureTradeStore()
  // 当选择“开仓资金可作为额外保证金“同时在开仓保证金来源中选择”使用当前合约组的额外保证金开仓“，
  // 则在开仓页面隐藏“额外保证金区域”
  const extraMarginVisible = tradeInfo.marginSource === TradeFutureMarginTypeInReqEnum.assets
  const autoAddMarginInSetting = preferenceSettings.isAutoAdd === PersonProtectTypeEnum.open
  const autoAddMarginVisible = autoAddMarginInSetting && isPro

  return {
    extraMarginVisible,
    autoAddMarginVisible,
  }
}

export function FutureExtra() {
  const {
    tradeInfo,
    onStopLimitEnabledChange,
    onStopLimitPriceTypeChange,
    onStopLossPriceChange,
    onStopProfitPriceChange,
    onAutoAddMarginChange,
    onOnlyReduceChange,
    positionValue,
    futureGroupAutoAddMarginEnabled,
    onExtraMarginChange,
    priceTypeOptions,
    onExtraMarginPercentChange,
    isBuy,
    buyDigit,
    priceDigit,
    maxExtraMarginAmount,
  } = useExchangeContext()
  const { stopLimitEnabled } = tradeInfo

  const currentFutureCoin = useTradeCurrentFutureCoin()
  const extraMarginUrl = useHelpCenterUrl(FutureHelpCenterEnum.extraMargin)
  const { extraMarginVisible, autoAddMarginVisible } = useFutureExtraVisible()
  const extraMarginDisabled = tradeInfo.onlyReduce || tradeInfo.extraMarginPercent === 100
  const { isFusionMode } = useCommonStore()
  // 融合模式默认收起
  const [extraMarginInputVisible, { toggle: toggleExtraMarginInputVisible }] = useToggle(!isFusionMode)

  return (
    <>
      <div className="exchange-item">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Checkbox
              shape="square"
              iconRender={createCheckboxIconRender('text-sm')}
              checked={stopLimitEnabled}
              onChange={onStopLimitEnabledChange}
            />
            <UnderlineTip
              className={classNames('text-xs ml-2')}
              title={t`features/trade/future/exchange-0`}
              popup={t`features/trade/future/exchange-1`}
            >{t`features/trade/future/exchange-0`}</UnderlineTip>
          </div>

          {stopLimitEnabled && (
            <TradeSelect
              className="text-xs"
              onChange={onStopLimitPriceTypeChange}
              options={priceTypeOptions}
              value={tradeInfo.stopLimitPriceType}
            />
          )}
        </div>
        {stopLimitEnabled && (
          <div className="flex mt-2">
            <TradePriceInput
              onlyInput
              digit={priceDigit}
              className="flex-1 h-26 text-xs bg-bg_sr_color"
              placeholder={t`features/trade/future/exchange-2`}
              value={tradeInfo.stopProfitPrice}
              onChange={onStopProfitPriceChange}
            />
            <TradePriceInput
              digit={priceDigit}
              onlyInput
              placeholder={t`features/trade/future/exchange-3`}
              className="flex-1 h-26 ml-4 text-xs bg-bg_sr_color"
              value={tradeInfo.stopLossPrice}
              onChange={onStopLossPriceChange}
            />
          </div>
        )}
      </div>
      <div className="exchange-item">
        <div className="flex items-center">
          <Checkbox
            shape="square"
            checked={tradeInfo.onlyReduce}
            iconRender={createCheckboxIconRender('text-sm')}
            onChange={onOnlyReduceChange}
          />
          <UnderlineTip
            className="text-xs ml-2"
            title={t`features/trade/future/exchange-4`}
            popup={t`features/trade/future/exchange-5`}
          >{t`features/trade/future/exchange-4`}</UnderlineTip>
        </div>
      </div>
      <div className="exchange-item">
        <div className="flex justify-between mb-2">
          {tradeInfo.onlyReduce ? (
            <span className="text-xs text-text_color_02">
              {t`features_trade_future_exchange_extra_5101529`} ({currentFutureCoin.quoteSymbolName})
            </span>
          ) : (
            <UnderlineTip
              className={classNames('text-xs', tradeInfo.onlyReduce ? 'text-text_color_04' : 'text-text_color_02')}
              title={t`features/trade/future/exchange-6`}
              popup={t`features_trade_future_exchange_extra_5101527`}
            >{t`features/trade/future/exchange-7`}</UnderlineTip>
          )}

          <div className="text-xs text-text_color_03">
            {formatCurrency((tradeInfo.onlyReduce ? tradeInfo.amount : positionValue) || 0)}
          </div>
        </div>
      </div>
      {extraMarginVisible && (
        <>
          <div id={GUIDE_ELEMENT_IDS_ENUM.futureTradeExtraMargin} className="exchange-item">
            <div className="mb-2.5 flex justify-between items-center">
              <UnderlineTip
                className={classNames('text-xs', tradeInfo.onlyReduce ? 'text-text_color_04' : 'text-text_color_02')}
                title={t`features_trade_future_exchange_extra_tip_002`}
                moreLink={extraMarginUrl}
                popup={
                  <div>
                    <p className="mb-2">{t`features_trade_future_exchange_extra_re0m7rpj1d`}</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t`features_trade_future_exchange_extra_tip_001`,
                      }}
                    ></p>
                  </div>
                }
              >
                {t`features_trade_future_exchange_extra_tip_002`}
                {t({
                  id: 'common.bracket',
                  values: {
                    0: currentFutureCoin.quoteSymbolName,
                  },
                })}
              </UnderlineTip>
              <Icon
                onClick={toggleExtraMarginInputVisible}
                name="regsiter_icon_drop"
                hasTheme
                hiddenMarginTop
                className={classNames('text-xs scale-75 translate-x-px', {
                  'rotate-180': extraMarginInputVisible,
                })}
              />
            </div>
            <TradePriceInput
              onlyInput
              className={classNames('h-26', {
                '!hidden': !extraMarginInputVisible,
              })}
              digit={buyDigit}
              disabled={tradeInfo.onlyReduce}
              value={tradeInfo.extraMargin!}
              onChange={onExtraMarginChange}
              inputProps={{
                disabled: extraMarginDisabled,
                suffix:
                  tradeInfo.extraMarginPercent > 0 ? (
                    <span
                      className={classNames('text-xs', {
                        'text-text_color_04': extraMarginDisabled,
                      })}
                    >
                      {tradeInfo.extraMarginPercent}%
                    </span>
                  ) : null,
              }}
            />
          </div>
          <div
            className={classNames('exchange-item', {
              hidden: !extraMarginInputVisible,
            })}
          >
            {/* <Slider
              activeColor={isBuy ? 'var(--buy_up_color)' : 'var(--sell_down_color)'}
              showTooltip
              points={[
                0,
                {
                  value: 100,
                  text: maxExtraMarginAmount.toString(),
                },
              ]}
              disabled={tradeInfo.onlyReduce}
              onChange={onExtraMarginPercentChange}
              value={tradeInfo.extraMarginPercent}
            /> */}
            <PercentButtons disabled={tradeInfo.onlyReduce} />
          </div>
        </>
      )}
      {autoAddMarginVisible && (
        <div className="exchange-item flex">
          <div id={GUIDE_ELEMENT_IDS_ENUM.futureTradeAutoAddMargin} className="flex items-center">
            {!futureGroupAutoAddMarginEnabled && (
              <Checkbox
                disabled={futureGroupAutoAddMarginEnabled || tradeInfo.onlyReduce}
                onChange={onAutoAddMarginChange}
                shape="square"
                className="text-xs"
                checked={futureGroupAutoAddMarginEnabled || tradeInfo.autoAddMargin}
                iconRender={createCheckboxIconRender('text-sm')}
              />
            )}
            <UnderlineTip
              className={classNames(
                'text-xs ml-2',
                futureGroupAutoAddMarginEnabled || tradeInfo.onlyReduce ? ' text-text_color_04' : ' text-text_color_01'
              )}
              title={
                futureGroupAutoAddMarginEnabled
                  ? t`features_trade_future_exchange_extra_5101528`
                  : t`features/trade/future/exchange-12`
              }
              popup={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t`features/trade/future/exchange-13`,
                  }}
                ></div>
              }
            >
              {futureGroupAutoAddMarginEnabled
                ? t`features_trade_future_exchange_extra_5101528`
                : t`features/trade/future/exchange-12`}
            </UnderlineTip>
          </div>
        </div>
      )}
    </>
  )
}
