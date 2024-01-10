import {
  EntrustStopLimitType,
  EntrustTypeEnum,
  getEntrustTypeEnumName,
  getTradePriceTypeEnumName,
  SpotNormalOrderMarketUnitEnum,
  SpotPlanTriggerDirection,
  SpotStopLimitTypeEnum,
  TradeDirectionEnum,
  TradeUnitEnum,
} from '@/constants/trade'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { useMemoizedFn } from 'ahooks'
import { decimalUtils } from '@nbit/utils'
import { ReactNode, useState } from 'react'
import { Button, Checkbox, Toast } from '@nbit/vant'
import { createSpotNormalOrder, createSpotPlanOrder, createSpotStopLimitOrder } from '@/apis/trade'
import classNames from 'classnames'
import { useTradeCurrentSpotCoinWithPrice } from '@/hooks/features/trade'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { requestWithLoading } from '@/helper/order'
import { getCanOrderMore } from '@/helper/order/spot'
import { baseSpotTradeStore, useSpotTradeStore } from '@/store/trade/spot'
import { createCheckboxIconRender, createRadioIconRender } from '@/components/radio/icon-render'
import Tooltip from '@/components/tooltip'
import Icon from '@/components/icon'
import { alertWithTip } from '@/components/alert-tip'
import { getTradeSpotOrderParams } from '@/helper/trade/spot'
import { sendRefreshCouponSelectApiNotify } from '@/helper/welfare-center/coupon-select'
import TradeBottomModal from '../common/bottom-modal'
import { IExchangeBaseContext, useExchangeContext, useExchangeInTop } from '../common/exchange/context'
import styles from './common.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function validateStopLimit(context: ReturnType<typeof useExchangeInTop>, latestPrice: string) {
  const showStopLimitModal = () => {
    alertWithTip(t`features_trade_future_exchange_order_616`)
  }
  const { tradeInfo, isBuy, isStopLimit, isMarketPrice, bestBuyPrice, bestSellPrice } = context
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double
  if (!(isDouble && isStopLimit)) {
    return true
  }
  const buyOk =
    SafeCalcUtil.sub(tradeInfo.stopProfitTriggerPrice, latestPrice).lt(0) &&
    SafeCalcUtil.sub(tradeInfo.stopLossTriggerPrice, latestPrice).gt(0)

  const sellOk =
    SafeCalcUtil.sub(tradeInfo.stopProfitTriggerPrice, latestPrice).gt(0) &&
    SafeCalcUtil.sub(tradeInfo.stopLossTriggerPrice, latestPrice).lt(0)
  // 检查止损止盈
  if (isBuy ? !buyOk : !sellOk) {
    showStopLimitModal()
    return false
  }
  return true
}

function validateRequired(tradeInfo: IExchangeBaseContext) {
  if (tradeInfo.entrustPriceType === EntrustTypeEnum.limit && !tradeInfo.entrustPrice) {
    Toast({
      message: t`features_trade_future_exchange_order_613`,
    })
    return false
  }
  const isStopLimit = tradeInfo.entrustType === EntrustTypeEnum.stop
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double
  // 双向的才单独判断，单向就和计划委托一样
  if (isStopLimit && isDouble) {
    if (!tradeInfo.stopProfitTriggerPrice) {
      Toast({
        message: t({
          id: 'common.input.enter',
          values: {
            0: t`features_trade_spot_exchange_order_qy4shhvdh1`,
          },
        }),
      })
      return false
    }
    if (tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.limit && !tradeInfo.stopProfitPrice) {
      Toast({
        message: t({
          id: 'common.input.enter',
          values: {
            0: t`features_trade_spot_exchange_order_zarcavxrw_`,
          },
        }),
      })
      return false
    }
    if (!tradeInfo.stopLossTriggerPrice) {
      Toast({
        message: t({
          id: 'common.input.enter',
          values: {
            0: t`features_trade_spot_exchange_order_t4yfm_i7mk`,
          },
        }),
      })
      return false
    }
    if (tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.limit && !tradeInfo.stopLossPrice) {
      Toast({
        message: t({
          id: 'common.input.enter',
          values: {
            0: t`features_trade_spot_exchange_order_586ocw2w76`,
          },
        }),
      })
      return false
    }
  }
  if (!tradeInfo.entrustAmount) {
    Toast({
      message: t`features_trade_future_exchange_order_614`,
    })
    return false
  }
  // 计划委托和单向止盈止损
  if (
    ([EntrustTypeEnum.plan].includes(tradeInfo.entrustType) || (isStopLimit && !isDouble)) &&
    !tradeInfo.triggerPrice
  ) {
    Toast({
      message: t`features_trade_future_exchange_order_615`,
    })
    return false
  }
  return true
}
/** 价格精度和数量等限制 */
function validateLimit(
  context: ReturnType<typeof useExchangeInTop>,
  currentSpotCoin: ReturnType<typeof useTradeCurrentSpotCoinWithPrice>
) {
  const { tradeInfo, isBuy, balance, isMarketPrice } = context
  if (
    !getCanOrderMore(
      tradeInfo.entrustType === EntrustTypeEnum.plan ? EntrustTypeEnum.plan : EntrustTypeEnum.normal,
      tradeInfo.direction
    )
  ) {
    Toast(t`features_trade_spot_exchange_order_5101297`)
    return false
  }
  if ((isBuy && balance < Number(tradeInfo.amount)) || (!isBuy && balance < Number(tradeInfo.entrustAmount))) {
    Toast(t`features_trade_spot_exchange_order_5101222`)
    return false
  }
  const latestPrice = currentSpotCoin.last!
  if (Number(tradeInfo.entrustAmount) < currentSpotCoin.minCount!) {
    Toast({
      message: t`features_trade_spot_exchange_order_510260`,
    })
    return false
  }
  if (Number(tradeInfo.entrustAmount) > currentSpotCoin.maxCount!) {
    Toast({
      message: t`features_trade_spot_exchange_order_510261`,
    })
    return false
  }
  // 市价单不对委托价格做限制
  if (isMarketPrice) {
    return true
  }
  const minPrice = Number(
    formatNumberDecimalWhenExceed(
      SafeCalcUtil.mul(latestPrice, SafeCalcUtil.sub(1, currentSpotCoin.priceFloatRatio)),
      Number(currentSpotCoin.priceOffset)
    )
  )
  if (Number(tradeInfo.entrustPrice) < minPrice!) {
    Toast({
      message: t({
        id: 'features_trade_spot_exchange_order_510262',
        values: { 0: minPrice },
      }),
    })
    return false
  }
  const maxPrice = Number(
    formatNumberDecimalWhenExceed(
      SafeCalcUtil.mul(latestPrice, SafeCalcUtil.add(1, currentSpotCoin.priceFloatRatio)),
      Number(currentSpotCoin.priceOffset)
    )
  )
  if (Number(tradeInfo.entrustPrice) > maxPrice!) {
    Toast({
      message: t({
        id: 'features_trade_spot_exchange_order_510263',
        values: { 0: maxPrice },
      }),
    })
    return false
  }

  return true
}
function needConfirmModal(tradeInfo: IExchangeBaseContext) {
  const types = baseSpotTradeStore.getState().settings.orderConfirmSettings
  const isNormalEntrust = [EntrustTypeEnum.limit, EntrustTypeEnum.market, EntrustTypeEnum.stop].includes(
    tradeInfo.entrustType
  )
  const isStopLimit = tradeInfo.entrustType === EntrustTypeEnum.stop
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double
  const doubleStopLimitIsMarketPrice =
    tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market &&
    isDouble &&
    tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
  const currentType = [
    // 普通还是计划
    isStopLimit ? EntrustTypeEnum.stop : isNormalEntrust ? EntrustTypeEnum.normal : EntrustTypeEnum.plan,
    // 限价还是市价
    isStopLimit
      ? // 止盈止损写死为限价
        EntrustTypeEnum.limit
      : // 双向止盈止损有一个为限价就为限价，单向止盈止损就按计划委托处理，注释掉是这块逻辑还未正式确定采用哪种
      // isStopLimit && isDouble
      //   ? doubleStopLimitIsMarketPrice
      //     ? EntrustTypeEnum.market
      //     : EntrustTypeEnum.limit
      isNormalEntrust && !isStopLimit
      ? tradeInfo.entrustType
      : tradeInfo.entrustPriceType,
    isStopLimit ? EntrustStopLimitType.stopProfitAndLoss : EntrustStopLimitType.none,
  ] as const
  // 找到三个值都相同
  return types.find(item => item.every((v, i) => v === currentType[i]))
}

function getConditionText(triggerPrice, triggerLatestOrMarkPrice, triggerPriceType, quoteSymbolName) {
  return `${getTradePriceTypeEnumName(triggerPriceType)}${
    SafeCalcUtil.sub(triggerPrice, triggerLatestOrMarkPrice).gte(0) ? '≥' : '≤'
  }${formatCurrency(triggerPrice)} ${quoteSymbolName}`
}
function ConfirmOrderModal({ onConfirm }: { onConfirm: (closeConfirm: boolean) => void }) {
  const currentSpotCoin = useTradeCurrentSpotCoinWithPrice()
  const { tradeInfo, isStopLimit, unitIsQuote, triggerLatestOrMarkPrice, isBuy, isMarketPrice } = useExchangeContext()
  const [closeConfirm, setCloseConfirm] = useState(false)
  const isDouble = tradeInfo.spotStopLimitType === SpotStopLimitTypeEnum.double

  const infos: {
    label: ReactNode
    value: ReactNode
    hide?: boolean
  }[] = [
    {
      label: t`features_trade_future_exchange_order_5101462`,
      value: <div>{getEntrustTypeEnumName(tradeInfo.entrustType)}</div>,
    },
    {
      label: t`features_trade_spot_exchange_order_arqzuotiro`,
      hide: !(isStopLimit && isDouble),
      value: getConditionText(
        tradeInfo.stopProfitTriggerPrice,
        triggerLatestOrMarkPrice,
        // 暂时用最新价
        tradeInfo.triggerPriceType,
        currentSpotCoin.quoteSymbolName
      ),
    },
    {
      label: t`features_trade_spot_exchange_order_zarcavxrw_`,
      hide: !(isStopLimit && isDouble),
      value:
        tradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market
          ? t`features/trade/future/price-input-3`
          : `${formatCurrency(tradeInfo.stopProfitPrice)} ${currentSpotCoin.quoteSymbolName}`,
    },
    {
      label: t`features_trade_spot_exchange_order_1ij5d4tpoa`,
      hide: !(isStopLimit && isDouble),
      value: getConditionText(
        tradeInfo.stopLossTriggerPrice,
        triggerLatestOrMarkPrice,
        // 暂时用最新价
        tradeInfo.triggerPriceType,
        currentSpotCoin.quoteSymbolName
      ),
    },
    {
      label: t`features_trade_spot_exchange_order_586ocw2w76`,
      hide: !(isStopLimit && isDouble),
      value:
        tradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market
          ? t`features/trade/future/price-input-3`
          : `${formatCurrency(tradeInfo.stopLossPrice)} ${currentSpotCoin.quoteSymbolName}`,
    },
    {
      label: t`features_trade_future_exchange_order_617`,
      hide: !(tradeInfo.entrustType === EntrustTypeEnum.plan || (isStopLimit && !isDouble)),
      value: getConditionText(
        tradeInfo.triggerPrice,
        triggerLatestOrMarkPrice,
        tradeInfo.triggerPriceType,
        currentSpotCoin.quoteSymbolName
      ),
    },
    {
      label: t`features/trade/future/price-input-1`,
      hide: isStopLimit && isDouble,
      value: isMarketPrice
        ? t`features/trade/future/price-input-3`
        : `${formatCurrency(tradeInfo.entrustPrice)} ${currentSpotCoin.quoteSymbolName}`,
    },
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-10`,
      value:
        isMarketPrice && unitIsQuote
          ? `${formatCurrency(tradeInfo.amount)} ${currentSpotCoin.quoteSymbolName}`
          : `${formatCurrency(tradeInfo.entrustAmount)} ${currentSpotCoin.baseSymbolName}`,
    },
    {
      label: t`features_trade_spot_exchange_amount_510108`,
      hide: isMarketPrice,
      value: `${formatCurrency(tradeInfo.amount)} ${currentSpotCoin.quoteSymbolName}`,
    },
  ]
  return (
    <div className={classNames(styles['exchange-order-modal-wrapper'], 'text-sm text-leading-1-5')}>
      <div className="flex px-4 -mt-3 font-medium items-center pb-2 rv-hairline--bottom">
        <div
          className={classNames('tag', {
            'bg-buy_up_color_special_02': isBuy,
            'text-buy_up_color': isBuy,
            'bg-sell_down_color_special_02': !isBuy,
            'text-sell_down_color': !isBuy,
          })}
        >
          {isBuy
            ? t`features_order_book_market_header_index_510274`
            : t`features_order_book_market_header_index_510275`}
        </div>
        {currentSpotCoin.baseSymbolName}/{currentSpotCoin.quoteSymbolName}
      </div>
      <div className="list mb-2">
        {infos
          .filter(item => !item.hide)
          .map((item, index) => (
            <div key={index} className="list-item">
              <div className="list-item__label">{item.label}</div>
              <div className="list-item__content">{item.value}</div>
            </div>
          ))}
      </div>
      <div className="px-4">
        <div className="flex items-center">
          <Checkbox
            iconRender={createRadioIconRender(classNames('text-xs text-brand_color'))}
            checked={closeConfirm}
            onChange={setCloseConfirm}
            iconSize={12}
            shape="square"
          >
            <span className="text-xs text-text_color_03 -ml-1">{t`features_trade_future_exchange_order_fixkgv_gfk`}</span>
          </Checkbox>
          <Tooltip className="flex ml-1" content={t`features_trade_future_exchange_order_xtryivuopg`}>
            <Icon hiddenMarginTop className="text-xs translate-y-px" name="property_icon_tips" hasTheme />
          </Tooltip>
        </div>
        <Button
          onClick={() => onConfirm(closeConfirm)}
          className="mt-4 w-full h-10 rounded"
          type="primary"
        >{t`user.field.reuse_10`}</Button>
      </div>
    </div>
  )
}

/** 下单组件，使用 tsx 可以更好管理弹窗和数据流 */
export function OnOrder() {
  const context = useExchangeContext()
  const { tradeInfo, onOrder$, resetData, isStopLimit } = context
  const { settings: spotSettings } = useSpotTradeStore()
  const isBuy = tradeInfo.direction === TradeDirectionEnum.buy
  const currentSpotCoin = useTradeCurrentSpotCoinWithPrice()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const validate = useMemoizedFn(() => {
    return (
      validateRequired(tradeInfo) &&
      validateLimit(context, currentSpotCoin) &&
      validateStopLimit(context, currentSpotCoin.last!)
    )
  })
  const latestPrice = currentSpotCoin.last
  const order = useMemoizedFn(async (closeConfirm?: boolean) => {
    const { isPlanOrder, normalParams, planParams, stopLimitParams } = getTradeSpotOrderParams(context, currentSpotCoin)
    const res = await requestWithLoading(
      isStopLimit
        ? createSpotStopLimitOrder(stopLimitParams)
        : isPlanOrder
        ? createSpotPlanOrder(planParams)
        : createSpotNormalOrder(normalParams)
    )
    setShowConfirmModal(false)
    if (closeConfirm === true) {
      spotSettings.updateOrderConfirmSettings(null)
    }
    if (!res.isOk) {
      return
    }

    Toast(t`features_orders_future_holding_close_681`)
    resetData()
    sendRefreshCouponSelectApiNotify()
  })
  const onOrderFn = useMemoizedFn(() => {
    if (!validate()) {
      return
    }
    if (needConfirmModal(tradeInfo)) {
      setShowConfirmModal(true)
      return
    }
    order()
  })
  onOrder$.useSubscription(onOrderFn)
  if (showConfirmModal) {
    const titleNode = (
      <div className={styles['exchange-order-modal-title-wrapper']}>
        <div className="text-base font-medium">
          <div>{t`features_trade_future_settings_index_631`}</div>
        </div>
      </div>
    )
    return (
      <TradeBottomModal title={titleNode} visible onVisibleChange={setShowConfirmModal}>
        <ConfirmOrderModal onConfirm={order} />
      </TradeBottomModal>
    )
  }
  return null
}
