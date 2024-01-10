import { EntrustStopLimitType, EntrustTypeEnum, getTradePriceTypeEnumName, TradeUnitEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { useMemoizedFn } from 'ahooks'
import classNames from 'classnames'
import { decimalUtils } from '@nbit/utils'
import { useState } from 'react'
import { Button, Checkbox, Dialog, Toast } from '@nbit/vant'
import { createFutureNormalOrder, createFuturePlanOrder } from '@/apis/trade'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { requestWithLoading } from '@/helper/order'
import { getCanOrderMore } from '@/helper/order/future'
import { useFutureVersionIsPro, useTradeCurrentFutureCoinWithMarkPrice } from '@/hooks/features/trade'
import {
  calcStepFromOffset,
  checkStrategyPrice,
  findFuturesPositionItem,
  getFutureGroupNameDisplay,
  getFutureVersionIsPro,
  getTradeFutureOrderParams,
} from '@/helper/trade'
import { baseFutureTradeStore, useFutureTradeStore } from '@/store/trade/future'
import AlertTip, { alertWithTip } from '@/components/alert-tip'
import { onGetExpectedProfit, onGetGroupPurchasingPower } from '@/helper/assets/futures'
import { IFutureCoinDetail } from '@/typings/api/trade'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import Tooltip from '@/components/tooltip'
import Icon from '@/components/icon'
import { sendRefreshCouponSelectApiNotify } from '@/helper/welfare-center/coupon-select'
import styles from './common.module.css'
import { IExchangeBaseContext, useExchangeContext, useExchangeInTop } from '../common/exchange/context'
import TradeBottomModal from '../common/bottom-modal'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function validateRequired(tradeInfo: IExchangeBaseContext) {
  if (tradeInfo.entrustPriceType === EntrustTypeEnum.limit && !tradeInfo.entrustPrice) {
    Toast(t`features_trade_future_exchange_order_613`)
    return false
  }
  if (!tradeInfo.entrustAmount && tradeInfo.tradeUnit === TradeUnitEnum.indexBase) {
    Toast(
      tradeInfo.onlyReduce
        ? t`features_assets_futures_common_close_position_modal_index_5101451`
        : t`features_trade_future_exchange_order_5101542`
    )
    return false
  }
  if (!tradeInfo.amount && tradeInfo.tradeUnit === TradeUnitEnum.quote) {
    Toast(
      tradeInfo.onlyReduce
        ? t`features_assets_futures_common_close_position_modal_index_5101450`
        : t`features_trade_future_exchange_order_5101543`
    )
    return false
  }
  if (tradeInfo.entrustType === EntrustTypeEnum.plan && !tradeInfo.triggerPrice) {
    Toast(t`features_trade_future_exchange_order_615`)
    return false
  }
  return true
}
function validateStopLimit(context: ReturnType<typeof useExchangeInTop>, latestPrice: string) {
  const showStopLimitModal = () => {
    alertWithTip(t`features_trade_future_exchange_order_616`)
  }
  const { tradeInfo, isBuy, isMarketPrice, bestBuyPrice, bestSellPrice } = context
  // 检查止损止盈
  if (
    !checkStrategyPrice({
      isBuy,
      entrustPrice: tradeInfo.entrustPrice,
      entrustType: tradeInfo.entrustType,
      profitPrice: tradeInfo.stopProfitPrice,
      lossPrice: tradeInfo.stopLossPrice,
      triggerPrice: tradeInfo.triggerPrice,
      depthQuotePrice: [bestBuyPrice, bestSellPrice],
      isMarketPrice,
    })
  ) {
    showStopLimitModal()
    return false
  }
  return true
}
function validateLockPosition(context: ReturnType<typeof useExchangeInTop>) {
  const { isBuy, tradeInfo, currentCoin } = context
  const futurePosition = findFuturesPositionItem(
    !isBuy,
    tradeInfo.group?.groupId || '',
    currentCoin.id || '',
    tradeInfo.lever
  )
  if (futurePosition && Number(futurePosition.lockSize) > 0) {
    Toast(t`features_trade_future_exchange_order_5101544`)
    return false
  }

  return true
}
// 验证标记价格和最新价格
async function validateMarkPrice(context: ReturnType<typeof useExchangeInTop>) {
  const { markPrice, latestPrice, tradeInfo } = context
  const target = 0.02
  if (tradeInfo.onlyReduce) {
    return true
  }
  if (SafeCalcUtil.sub(markPrice, latestPrice).div(latestPrice).abs().gt(target)) {
    await Dialog.confirm({
      message: (
        <AlertTip>
          <span
            className="break-all"
            dangerouslySetInnerHTML={{
              __html: t({
                id: 'features_trade_future_exchange_order_1qnzih3wsqgf6u4vr',
                values: {
                  0: `${SafeCalcUtil.mul(target, 100).toString()}%`,
                },
              }),
            }}
          ></span>
        </AlertTip>
      ),
      className: 'dialog-confirm-wrapper confirm-black cancel-gray',
      confirmButtonText: t`user.login_04`,
      cancelButtonText: t`assets.financial-record.cancel`,
    })
    return true
  }

  return true
}
async function validateCloseable(context: ReturnType<typeof useExchangeInTop>) {
  const { tradeInfo, isBuy, currentCoin, baseBalance } = context
  if (!tradeInfo.onlyReduce) {
    return true
  }
  const position = findFuturesPositionItem(isBuy, tradeInfo.group?.groupId || '', currentCoin.id, tradeInfo.lever)
  if (!position) {
    return false
  }
  const estimatedProfit = onGetExpectedProfit({
    price: tradeInfo.entrustPrice,
    closeSize: tradeInfo.entrustAmount,
    openPrice: position?.openPrice || '',
    takerFeeRate: (currentCoin as IFutureCoinDetail).takerFeeRate!,
    sideInd: position!.sideInd,
  })
  // 仓位预计亏损>=仓位初始保证金 + 合约组可用
  const groupAvailableMargin = await requestWithLoading(onGetGroupPurchasingPower(tradeInfo.group?.groupId || ''))
  if (SafeCalcUtil.add(SafeCalcUtil.add(position?.initMargin, groupAvailableMargin), estimatedProfit).lte(0)) {
    alertWithTip(t`features_assets_futures_common_close_position_modal_index_5101537`)
    return false
  }
  const voucherAmount = Number(position.voucherAmount) || 0
  if (voucherAmount > 0 && Number(tradeInfo.entrustAmount) < Number(baseBalance)) {
    Toast(t`features_assets_futures_common_close_position_modal_index_7hz7pajy9t`)
    return
  }
  return true
}

/** 价格精度和数量等限制 */
function validateLimit(
  context: ReturnType<typeof useExchangeInTop>,
  currentFutureCoin: ReturnType<typeof useTradeCurrentFutureCoinWithMarkPrice>
) {
  const { tradeInfo, buyDigit, unitIsQuote, positionValue, sellDigit, isMarketPrice, isBuy, balance } = context
  if (tradeInfo.onlyReduce && balance === 0) {
    alertWithTip(t`features_trade_future_exchange_order_5101466`)
    return false
  }
  if (
    !getCanOrderMore(
      tradeInfo.entrustType === EntrustTypeEnum.plan ? EntrustTypeEnum.plan : EntrustTypeEnum.normal,
      tradeInfo.direction
    )
  ) {
    Toast(t`features_trade_spot_exchange_order_5101297`)
    return false
  }
  if (!tradeInfo.onlyReduce && balance < Number(tradeInfo.amount)) {
    Toast(t`features_trade_future_exchange_order_5101545`)
    return false
  }
  if (tradeInfo.onlyReduce && balance < Number(tradeInfo.entrustAmount)) {
    Toast(t`features_trade_future_exchange_order_5101541`)
    return
  }
  const latestPrice = currentFutureCoin.last!
  const symbol = unitIsQuote ? currentFutureCoin.quoteSymbolName : currentFutureCoin.baseSymbolName
  // 限价或者按数量买入时做判断
  if (unitIsQuote) {
    if (tradeInfo.onlyReduce) {
      // 计价币减仓最小值为最小精度
      const minAmount = Number(
        formatNumberDecimalWhenExceed(SafeCalcUtil.mul(calcStepFromOffset(sellDigit), tradeInfo.entrustPrice), buyDigit)
      )
      if (Number(tradeInfo.positionAmount) < minAmount) {
        Toast({
          message: t({
            id: 'features_trade_future_exchange_order_wxbemhh_1gcgdqbwfuuwa',
            values: { 0: minAmount, 1: symbol },
          }),
        })
        return false
      }
    } else {
      const minAmount = Number(
        formatNumberDecimalWhenExceed(SafeCalcUtil.mul(currentFutureCoin.minCount, latestPrice), buyDigit)
      )
      if (Number(tradeInfo.onlyReduce ? tradeInfo.positionAmount : positionValue) < minAmount) {
        Toast({
          message: t({
            id: 'features_trade_future_exchange_order_5101521',
            values: { 0: minAmount, 1: symbol },
          }),
        })
        return false
      }
    }
    const maxAmount = Number(
      formatNumberDecimalWhenExceed(SafeCalcUtil.mul(currentFutureCoin.maxCount, latestPrice), buyDigit)
    )
    if (Number(tradeInfo.onlyReduce ? tradeInfo.positionAmount : positionValue) > maxAmount) {
      Toast({
        message: t({
          id: 'features_trade_future_exchange_order_5101522',
          values: { 0: maxAmount, 1: symbol },
        }),
      })
      return false
    }
  } else {
    // 减仓不校验最小值
    if (!tradeInfo.onlyReduce && Number(tradeInfo.entrustAmount) < currentFutureCoin.minCount!) {
      Toast({
        message: t({
          id: 'features_trade_future_exchange_order_5101523',
          values: { 0: currentFutureCoin.minCount!, 1: symbol },
        }),
      })
      return false
    }
    if (Number(tradeInfo.entrustAmount) > currentFutureCoin.maxCount!) {
      Toast({
        message: t({
          id: 'features_trade_future_exchange_order_5101524',
          values: { 0: currentFutureCoin.maxCount!, 1: symbol },
        }),
      })
      return false
    }
  }
  const minPrice = Number(
    formatNumberDecimalWhenExceed(
      SafeCalcUtil.mul(latestPrice, SafeCalcUtil.sub(1, currentFutureCoin.priceFloatRatio)),
      Number(currentFutureCoin.priceOffset)
    )
  )
  if (Number(tradeInfo.entrustPrice) < minPrice!) {
    Toast({
      message: t({
        id: 'features_trade_spot_exchange_order_510262',
        values: { 0: minPrice, 1: currentFutureCoin.quoteSymbolName },
      }),
    })
    return false
  }
  const maxPrice = Number(
    formatNumberDecimalWhenExceed(
      SafeCalcUtil.mul(latestPrice, SafeCalcUtil.add(1, currentFutureCoin.priceFloatRatio)),
      Number(currentFutureCoin.priceOffset)
    )
  )
  if (Number(tradeInfo.entrustPrice) > maxPrice!) {
    Toast({
      message: t({
        id: 'features_trade_spot_exchange_order_510263',
        values: { 0: maxPrice, 1: currentFutureCoin.quoteSymbolName },
      }),
    })
    return false
  }

  return true
}
function needConfirmModal(tradeInfo: IExchangeBaseContext) {
  const { settings: futuresSettings } = baseFutureTradeStore.getState()
  const types = futuresSettings.orderConfirmSettings
  const isNormalEntrust = [EntrustTypeEnum.limit, EntrustTypeEnum.market].includes(tradeInfo.entrustType)
  const currentType = [
    // 普通还是计划
    isNormalEntrust ? EntrustTypeEnum.normal : EntrustTypeEnum.plan,
    // 限价还是市价
    isNormalEntrust ? tradeInfo.entrustType : tradeInfo.entrustPriceType,
    // 是否有止盈止损
    tradeInfo.stopLossPrice || tradeInfo.stopProfitPrice
      ? EntrustStopLimitType.stopProfitAndLoss
      : EntrustStopLimitType.none,
  ] as const
  // 找到三个值都相同
  return types.find(item => item.every((v, i) => v === currentType[i]))
}

function ConfirmOrderModal({ onConfirm }: { onConfirm: (closeConfirm: boolean) => void }) {
  const currentFutureCoin = useTradeCurrentFutureCoinWithMarkPrice()
  const { tradeInfo, triggerLatestOrMarkPrice, unitIsQuote, isMarketPrice, positionValue } = useExchangeContext()
  const [closeConfirm, setCloseConfirm] = useState(false)
  const isPro = useFutureVersionIsPro()
  const infos: {
    label: string
    value: string
    hide?: boolean
  }[] = [
    {
      label: t`features/trade/future/price-input-1`,
      value: isMarketPrice
        ? t`features/trade/future/price-input-3`
        : `${formatCurrency(tradeInfo.entrustPrice)} ${currentFutureCoin.quoteSymbolName}`,
    },
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-10`,
      value: unitIsQuote
        ? `${formatCurrency(tradeInfo.onlyReduce ? tradeInfo.positionAmount : positionValue)} ${
            currentFutureCoin.quoteSymbolName
          }`
        : `${formatCurrency(tradeInfo.entrustAmount)} ${currentFutureCoin.baseSymbolName}`,
    },
    {
      label: t`features/trade/future/exchange-8`,
      value: `${formatCurrency(tradeInfo.extraMargin || 0)} ${currentFutureCoin.quoteSymbolName}`,
      hide: tradeInfo.onlyReduce,
    },
    {
      label: t`features_trade_future_exchange_order_617`,
      hide: tradeInfo.entrustType !== EntrustTypeEnum.plan,
      value: `${getTradePriceTypeEnumName(tradeInfo.triggerPriceType)}${
        SafeCalcUtil.sub(tradeInfo.triggerPrice, triggerLatestOrMarkPrice).gt(0) ? '≥' : '≤'
      }${formatCurrency(tradeInfo.triggerPrice)} ${currentFutureCoin.quoteSymbolName}`,
    },
    {
      label: t`features/trade/future/exchange-0`,
      hide: (!tradeInfo.stopLossPrice && !tradeInfo.stopProfitPrice) || tradeInfo.onlyReduce,
      value: `${tradeInfo.stopProfitPrice ? formatCurrency(tradeInfo.stopProfitPrice) : '--'}/${
        tradeInfo.stopLossPrice ? formatCurrency(tradeInfo.stopLossPrice) : '--'
      } ${currentFutureCoin.quoteSymbolName}`,
    },
    {
      label: t`features_trade_future_exchange_order_5101462`,
      value: tradeInfo.onlyReduce
        ? t`features_trade_future_exchange_order_5101463`
        : t`features_trade_future_exchange_order_5101464`,
    },
  ]
  return (
    <div className={styles['exchange-order-modal-wrapper']}>
      <div className="pb-2"></div>
      <div className="list mb-7">
        {infos
          .filter(item => !item.hide)
          .map(item => (
            <div key={item.label} className="list-item">
              <div className="list-item__label">{item.label}</div>
              <div className="list-item__content">{item.value}</div>
            </div>
          ))}
      </div>
      <div className="px-4">
        <div className="flex items-center">
          <Checkbox
            iconRender={createCheckboxIconRender('text-xs')}
            checked={closeConfirm}
            onChange={setCloseConfirm}
            shape="square"
          >
            <span className="text-xs text-text_color_03">{t`features_trade_future_exchange_order_fixkgv_gfk`}</span>
          </Checkbox>
          <Tooltip className="flex ml-1" content={t`features_trade_future_exchange_order_xtryivuopg`}>
            <Icon hiddenMarginTop className="text-xs translate-y-0.5" name="msg" hasTheme />
          </Tooltip>
        </div>
        <Button
          onClick={() => onConfirm(closeConfirm)}
          className="mt-7 w-full h-10 rounded"
          type="primary"
        >{t`user.field.reuse_10`}</Button>
      </div>
    </div>
  )
}

/** 下单组件，使用 tsx 可以更好管理弹窗和数据流 */
export function OnOrder() {
  const context = useExchangeContext()
  const { tradeInfo, onOrder$, resetData, isBuy } = context
  const currentFutureCoin = useTradeCurrentFutureCoinWithMarkPrice()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { settings: futuresSettings, futureGroups } = useFutureTradeStore()
  const validate = useMemoizedFn(async () => {
    if (!tradeInfo.group?.groupId && futureGroups.length >= 26) {
      Toast(t`features_trade_future_exchange_order_5101467`)
      return false
    }
    return (
      validateRequired(tradeInfo) &&
      validateStopLimit(context, currentFutureCoin.last!) &&
      validateLimit(context, currentFutureCoin) &&
      validateLockPosition(context) &&
      (await validateMarkPrice(context)) &&
      (await validateCloseable(context))
    )
  })
  const order = useMemoizedFn(async (closeConfirm?: boolean) => {
    const { isPlanOrder, planParams, normalParams } = getTradeFutureOrderParams(context, currentFutureCoin)
    const res = await requestWithLoading(
      isPlanOrder ? createFuturePlanOrder(planParams) : createFutureNormalOrder(normalParams)
    )
    setShowConfirmModal(false)
    if (closeConfirm === true) {
      futuresSettings.updateOrderConfirmSettings(null)
    }
    if (!res.isOk) {
      return
    }
    Toast(t`features_orders_future_holding_close_681`)
    sendRefreshCouponSelectApiNotify()
    resetData()
  })
  const onOrderFn = useMemoizedFn(async () => {
    if (!(await validate())) {
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
        <div className="mr-4">
          {currentFutureCoin.symbolName}
          <span> {t`assets.enum.tradeCoinType.perpetual`}</span>
        </div>
        <div
          className={classNames('tag', {
            'bg-buy_up_color_special_02': isBuy,
            'text-buy_up_color': isBuy,
            'bg-sell_down_color_special_02': !isBuy,
            'text-sell_down_color': !isBuy,
          })}
        >
          {isBuy ? t`features_trade_future_exchange_order_619` : t`features_trade_future_exchange_order_620`}
          <span> {tradeInfo.lever}X</span>
        </div>
        <div className="tag text-brand_color bg-brand_color_special_02">
          {getFutureGroupNameDisplay(tradeInfo.group?.groupName)}
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
