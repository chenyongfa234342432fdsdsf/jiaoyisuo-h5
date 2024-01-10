import Icon from '@/components/icon'
import {
  OrderDirectionEnum,
  OrderStatusEnum,
  PlanOrderMatchTypeEnum,
  SpotPlanOrderStatusEnum,
  SpotStopProfitOrderStatusEnum,
} from '@/constants/order'
import {
  EntrustTypeEnum,
  getTradePriceTypeEnumName,
  SpotPlanTriggerDirection,
  SpotTriggerDirection,
} from '@/constants/trade'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { envIsServer } from '@/helper/env'
import { replaceEmpty } from '@/helper/filters'
import { link } from '@/helper/link'
import { requestWithLoading } from '@/helper/order'
import { getOrderValueEnumText } from '@/helper/order/spot'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { IBaseOrderItem, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Button, Circle, Toast } from '@nbit/vant'
import classNames from 'classnames'
// import { useMarketListStore } from '@/store/market/market-list'
import { ReactNode } from 'react'
import { OpenSpots } from '@/hooks/features/order'
// import { getSymbolLabelInfo } from '@/apis/market'
// import { onTradePairClickRedirectCommon } from '@/helper/market'
import styles from './index.module.css'

type IProps = {
  order: any
  isPlanOrder?: boolean
  leftCircle?: ReactNode
  rightTableContent?: ReactNode
  onCanceled?: (id: any) => void
  openSpots: OpenSpots
  orderType: number
  isCurrentTab: boolean | undefined
}
export function SpotBaseOpenOrderItem({
  order,
  // onCanceled,
  // isPlanOrder,
  leftCircle,
  rightTableContent,
  openSpots,
  orderType,
  isCurrentTab,
}: IProps) {
  const isBuy = order.side === OrderDirectionEnum.buy
  const onCancel = async (e: any) => {
    e.stopPropagation()
    const res = await requestWithLoading(openSpots?.[orderType].request({ id: order.id }))
    if (!res.isOk) {
      return
    }
    // 先去掉这一步，后端达不到要求再加回来 onCanceled?.(order.id!)
    Toast(t`features_orders_spot_open_order_item_5101061`)
  }

  const succeedConfig = {
    textColor: 'text-success_color',
    bgColor: 'bg-success_color_special_02',
  }
  const failedConfig = {
    bgColor: 'bg-card_bg_color_02',
    textColor: 'text-text_color_03',
  }
  const enumsText = getOrderValueEnumText(order, {}, orderType)
  const normalStatusConfigs = {
    [OrderStatusEnum.settled]: {
      text: t`features_orders_spot_open_order_item_510252`,
      ...succeedConfig,
    },
    [OrderStatusEnum.partlyCanceled]: {
      text: t`constants/assets/common-32`,
      bgColor: 'bg-brand_color_special_02',
      textColor: 'text-brand_color',
    },
    [OrderStatusEnum.systemCanceled]: {
      text: t`constants/assets/common-33`,
      ...failedConfig,
    },
    [OrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
      ...failedConfig,
    },
  }
  const planStatusConfigs = {
    [SpotPlanOrderStatusEnum.triggered]: {
      text: t`features_orders_spot_open_order_item_510255`,
      ...succeedConfig,
    },
    [SpotPlanOrderStatusEnum.triggeredEntrustFailed]: {
      text: t`features_orders_spot_open_order_item_510256`,
      ...failedConfig,
    },
    [SpotPlanOrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
      ...failedConfig,
    },
  }

  const stopProfitStatusConfigs = {
    [SpotStopProfitOrderStatusEnum.triggered]: {
      text: t`features_orders_spot_open_order_item_510255`,
      ...succeedConfig,
    },
    [SpotStopProfitOrderStatusEnum.triggeredEntrustFailed]: {
      text: t`features_orders_spot_open_order_item_510256`,
      ...failedConfig,
    },
    [SpotStopProfitOrderStatusEnum.manualCanceled]: {
      text: t`constants/assets/common-33`,
      ...failedConfig,
    },
    [SpotStopProfitOrderStatusEnum.systemCanceled]: {
      text: t`constants/assets/common-33`,
      ...failedConfig,
    },
  }

  const statusConfiguration = {
    [EntrustTypeEnum.normal]: {
      config: normalStatusConfigs,
      requestId: order.id,
      textWithSuffix: enumsText.typeText,
    },
    [EntrustTypeEnum.plan]: {
      config: planStatusConfigs,
      requestId: order.refOrderId,
      textWithSuffix: enumsText.typeTextWithSuffix,
    },
    [EntrustTypeEnum.stop]: {
      config: stopProfitStatusConfigs,
      requestId: order.refOrderId,
      textWithSuffix: t`features_orders_order_filters_rfvgyk8h6q`,
    },
  }

  const statusConfig = statusConfiguration[orderType]?.config?.[order?.orderStatusCd || order?.status]

  const id = statusConfiguration[orderType]?.requestId

  // const statusConfig = isPlanOrder
  //   ? planStatusConfigs[planOrder.orderStatusCd]
  //   : normalStatusConfigs[normalOrder.status!]
  const toDetail = () => {
    if (!id || !statusConfig) {
      return
    }
    link(`/my/orders/detail?id=${id}&orderEnumType=${orderType}`)
  }

  // const { setsearchHistory, resetSearchState } = useMarketListStore().spotMarketsTradeModule

  const scaleRef = useScaleDom(envIsServer ? 375 : window.innerWidth * 0.9, order)

  // const goToSymbolTradePage = async symbol => {
  //   const { isOk, data } = await getSymbolLabelInfo({})
  //   if (isOk) {
  //     const item = data?.list?.find(items => items?.symbolName === symbol)
  //     setsearchHistory(item)
  //     resetSearchState()
  //     onTradePairClickRedirectCommon(item, 'trade')
  //   }
  // }

  return (
    <div onClick={toDetail} className={classNames(styles['open-order-item-wrapper'], 'rv-hairline--bottom')}>
      <div className="flex justify-between mb-2 w-full">
        <div className="w-full">
          <div className="text-base flex justify-between items-center">
            <div
              onClick={() => {
                link(`/trade/${order.symbol}`)
              }}
            >
              <span className="font-medium">{order.sellCoinShortName}</span>/
              <span className="font-medium">{order.buyCoinShortName}</span>
              {isCurrentTab && <Icon name="icon_trade_next" className="text-xs ml-1" hasTheme />}
            </div>
            {!statusConfig ? (
              <Button onClick={onCancel} size="small" className="cancel-button ml-4">
                {t`features_orders_spot_open_order_item_510219`}
              </Button>
            ) : (
              <div className="flex items-center status-tag-container">
                {statusConfig && (
                  <div className={classNames('status-tag', '', statusConfig.textColor)}>{enumsText.statusText}</div>
                )}
                <div>{id && statusConfig && <Icon name="next_arrow" className="text-xs ml-1" hasTheme />}</div>
              </div>
            )}
          </div>
          <div className="mt-1">
            <span
              className={classNames('p-1 rounded-sm text-xs', {
                'bg-buy_up_color_special_02 text-buy_up_color': isBuy,
                'bg-sell_down_color_special_02 text-sell_down_color': !isBuy,
              })}
            >
              {statusConfiguration[orderType]?.textWithSuffix}
            </span>
            <span
              className={classNames('p-1 ml-1 rounded-sm text-xs', {
                'bg-buy_up_color_special_02 text-buy_up_color': isBuy,
                'bg-sell_down_color_special_02 text-sell_down_color': !isBuy,
              })}
            >
              {enumsText.directionText}
            </span>
            <span className="text-xs text-text_color_03 ml-3">{formatDate(Number(order.createdByTime!))}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div ref={scaleRef} className="flex flex-1 items-center">
          {!statusConfig && leftCircle}

          {orderType === EntrustTypeEnum.normal ? (
            <table className="flex-1">
              <tbody>{rightTableContent}</tbody>
            </table>
          ) : (
            <div className="flex-1">{rightTableContent}</div>
          )}
        </div>
      </div>
    </div>
  )
}
type OrderItemProps<T> = {
  order: T
  onCanceled: IProps['onCanceled']
  openSpots: OpenSpots
  orderType: number
  isCurrentTab: boolean | undefined
}
export function SpotNormalOpenOrderItem({
  order,
  onCanceled,
  openSpots,
  orderType,
  isCurrentTab,
}: OrderItemProps<IBaseOrderItem>) {
  const isBuy = order.side === OrderDirectionEnum.buy
  const isMarketPrice = order.orderType === EntrustTypeEnum.market
  const coinName = isMarketPrice
    ? order.marketUnit === 'amount'
      ? order.sellCoinShortName
      : order.buyCoinShortName
    : order.sellCoinShortName
  const rate = parseFloat(order.completeness)
  const leftCircle = (
    <div className="mr-2">
      <Circle
        strokeWidth={100}
        size={34}
        className={classNames({
          [styles['zero-circle']]: rate === 0,
        })}
        color={isBuy ? 'var(--buy_up_color)' : 'var(--sell_down_color)'}
        layerColor="var(--bg_sr_color)"
        rate={rate}
        text={order.completeness}
      />
    </div>
  )
  const rightTableContent = (
    <>
      <tr className="mt-2 number-item-normal">
        <td className="number-label">
          {t`features_orders_spot_open_order_item_510217`} <div>({coinName})</div>
        </td>
        <td className="number-value">
          <span>{replaceEmpty(formatCurrency(order.successCount))}</span>/
          <span className="text-text_color_02">{replaceEmpty(formatCurrency(order.entrustCount))}</span>
        </td>
      </tr>
      <tr className="mt-2 number-item-normal">
        <td className="number-label">
          {/* {t`features_orders_spot_open_order_item_510218`} */}
          {t`features_assets_financial_record_record_detail_record_details_info_index_5101335`}/
          {t`features_trade_contract_contract_order_item_index_frpx0hjuwsdk2gxjhldfs`}
          <div>{t`future.funding-history.index.table-type.price`}</div>
        </td>
        <td className="number-value">
          <span>
            {replaceEmpty(formatCurrency(order.averagePrice))}/
            <span className="text-text_color_02">
              {isMarketPrice ? t`features/trade/future/price-input-3` : formatCurrency(order.entrustPrice)}
            </span>
          </span>
        </td>
      </tr>
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      isPlanOrder={false}
      onCanceled={onCanceled}
      leftCircle={leftCircle}
      rightTableContent={rightTableContent}
      order={order}
      openSpots={openSpots}
      orderType={orderType}
      isCurrentTab={isCurrentTab}
    />
  )
}
export function SpotPlanOpenOrderItem({
  order,
  onCanceled,
  openSpots,
  orderType,
  isCurrentTab,
}: OrderItemProps<ISpotPlanOrderItem>) {
  const isMarketPrice = order.matchType === PlanOrderMatchTypeEnum.marketPrice
  const triggerPriceTypeName = getTradePriceTypeEnumName(order.triggerTypeInd)
  const coinName = isMarketPrice
    ? order.orderPrice
      ? order.buyCoinShortName
      : order.sellCoinShortName
    : order.sellCoinShortName
  const rightTableContent = (
    <>
      <div className="mt-2 number-item number-item-plan">
        <div className="number-label">
          {t`features/assets/financial-record/record-detail/record-details-info/index-10`}({coinName})
        </div>
        <div className="number-value">{replaceEmpty(formatCurrency(order.orderAmount || order.orderPrice))}</div>
      </div>
      <div className="mt-2 number-item">
        <div className="number-label">{t`features/trade/future/price-input-1`}</div>
        <div className="number-value">
          <span>{isMarketPrice ? t`features/trade/future/price-input-3` : formatCurrency(order.orderPrice!)}</span>
        </div>
      </div>
      <div className="mt-2 number-item">
        <div className="number-label">{t`features_trade_future_exchange_order_617`}</div>
        <div className="number-value">
          <span>
            {triggerPriceTypeName}
            <span className="mx-1">{order.triggerDirectionInd === SpotPlanTriggerDirection.up ? '≥' : '≤'}</span>
            {formatCurrency(order.triggerPrice)}
          </span>
        </div>
      </div>
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      isPlanOrder
      onCanceled={onCanceled}
      rightTableContent={rightTableContent}
      order={order}
      openSpots={openSpots}
      orderType={orderType}
      isCurrentTab={isCurrentTab}
    />
  )
}

export function SpotStopOpenOrderItem({ order, onCanceled, openSpots, orderType, isCurrentTab }: OrderItemProps<any>) {
  const isMarketPrice = order.matchType === PlanOrderMatchTypeEnum.marketPrice
  const coinName = isMarketPrice
    ? order.orderPrice
      ? order.buyCoinShortName
      : order.sellCoinShortName
    : order.sellCoinShortName

  const numberCommissions = (
    <div className="mt-2 number-item">
      <div className="number-label">
        {t`features/assets/financial-record/record-detail/record-details-info/index-10`}({coinName})
      </div>
      <div className="number-value">
        {replaceEmpty(formatCurrency(order?.lossPlaceCount || order?.profitPlaceCount))}
      </div>
    </div>
  )

  const rightTableContent = (
    <>
      {order?.profitTriggerDirectionInd && (
        <>
          <div className="mt-2 number-item">
            <div className="number-label">{t`features_trade_spot_exchange_order_qy4shhvdh1`}</div>
            <div className="number-value">
              <span className="mr-1">{order.profitTriggerDirectionInd === SpotTriggerDirection.up ? '≥' : '≤'}</span>
              {replaceEmpty(formatCurrency(order.profitTriggerPrice))}
            </div>
          </div>
          <div className="mt-2 number-item">
            <div className="number-label">{t`features_trade_spot_exchange_order_zarcavxrw_`}</div>
            <div className="number-value">
              <span>
                {order.profitOrderType === EntrustTypeEnum.limit ? (
                  <>
                    {/* <span className="mx-1">
                      {order.profitTriggerDirectionInd === SpotTriggerDirection.up ? '≥' : '≤'}
                    </span> */}
                    {formatCurrency(order.profitPlacePrice)}
                  </>
                ) : (
                  t`features/trade/future/price-input-3`
                )}
              </span>
            </div>
          </div>
        </>
      )}
      {!(order?.lossTriggerDirectionInd && !order?.profitTriggerDirectionInd) && numberCommissions}
      {order?.lossTriggerDirectionInd && (
        <>
          <div className="mt-2 number-item">
            <div className="number-label">{t`features_trade_spot_exchange_order_t4yfm_i7mk`}</div>
            <div className="number-value">
              <span>
                {order?.lossTriggerDirectionInd === SpotTriggerDirection.up ? '≥' : '≤'}
                {isMarketPrice ? t`features/trade/future/price-input-3` : formatCurrency(order.lossTriggerPrice!)}
              </span>
            </div>
          </div>
          <div className="mt-2 number-item">
            <div className="number-label">{t`features_trade_spot_exchange_order_586ocw2w76`}</div>
            <div className="number-value">
              <span>
                {order.lossOrderType === EntrustTypeEnum.limit ? (
                  <>
                    {/* <span className="mx-1">
                      {order.lossTriggerDirectionInd === SpotTriggerDirection.up ? '≥' : '≤'}
                    </span> */}
                    {formatCurrency(order.lossPlacePrice)}
                  </>
                ) : (
                  t`features/trade/future/price-input-3`
                )}
              </span>
            </div>
          </div>
        </>
      )}
      {order?.lossTriggerDirectionInd && !order?.profitTriggerDirectionInd && numberCommissions}
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      isPlanOrder
      onCanceled={onCanceled}
      rightTableContent={rightTableContent}
      order={order}
      openSpots={openSpots}
      orderType={orderType}
      isCurrentTab={isCurrentTab}
    />
  )
}

export function SpotOpenOrderItem({
  order,
  onCanceled,
  openSpots,
  orderType,
  isCurrentTab,
}: OrderItemProps<IBaseOrderItem | ISpotPlanOrderItem>) {
  const normalOrder = order as IBaseOrderItem
  const planOrder = order as ISpotPlanOrderItem

  const itemParams = {
    isCurrentTab,
    onCanceled,
    openSpots,
    orderType,
  }

  const spotPlanOpenOrderObj = {
    [EntrustTypeEnum.plan]: <SpotPlanOpenOrderItem {...itemParams} order={planOrder} />,
    [EntrustTypeEnum.normal]: <SpotNormalOpenOrderItem {...itemParams} order={normalOrder} />,
    [EntrustTypeEnum.stop]: <SpotStopOpenOrderItem {...itemParams} order={planOrder} />,
  }

  return orderType && spotPlanOpenOrderObj?.[orderType]
}
