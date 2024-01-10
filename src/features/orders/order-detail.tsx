import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { OrderDirectionEnum, OrderMarketUnitEnum, OrderStatusEnum } from '@/constants/order'
import { EntrustTypeEnum, SpotNormalOrderMarketUnitEnum, TradeDirectionEnum } from '@/constants/trade'
import { formatDate } from '@/helper/date'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { getOrderValueEnumText } from '@/helper/order/spot'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { IBaseOrderItem, IBaseOrderTransactionLog } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { decimalUtils } from '@nbit/utils'
import { Toast } from '@nbit/vant'
import { useMount } from 'ahooks'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useCopyToClipboard } from 'react-use'
import styles from './order-detail.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type IOrderStatusProps = {
  order: IBaseOrderItem
  orderEnumType: number
}
function OrderStatus({ order, orderEnumType }: IOrderStatusProps) {
  const isBuy = order.side === OrderDirectionEnum.buy
  const [, copyToClipboard] = useCopyToClipboard()
  const enumsText = getOrderValueEnumText(
    order,
    {},
    Number(orderEnumType) === EntrustTypeEnum.stop ? EntrustTypeEnum.normal : Number(orderEnumType)
  )
  const statusText =
    parseFloat(order.completeness) > 0
      ? `${enumsText.statusText}(${parseFloat(order.completeness)}%)`
      : enumsText.statusText
  const statusConfigs = {
    [OrderStatusEnum.settled]: {
      icon: 'login_password_satisfy',
      textColor: 'text-success_color',
    },
    [OrderStatusEnum.partlySucceed]: {
      icon: 'prompt_close',
      textColor: 'text-brand_color',
    },
    [OrderStatusEnum.unsettled]: {
      text: t`constants_order_736`,
      hasTheme: true,
      icon: 'login_password-dissatisfy',
      textColor: 'text-text_color_02',
    },
    [OrderStatusEnum.partlyCanceled]: {
      icon: 'prompt_close',
      textColor: 'text-brand_color',
    },
    [OrderStatusEnum.systemCanceled]: {
      hasTheme: true,
      textColor: 'text-text_color_02',
      icon: 'login_password-dissatisfy',
    },
    [OrderStatusEnum.manualCanceled]: {
      textColor: 'text-text_color_02',
      hasTheme: true,
      icon: 'login_password-dissatisfy',
    },
  }
  const statusConfig = statusConfigs[order.status!]
  const copy = () => {
    copyToClipboard(order.id!.toString())
    Toast(t`features_orders_order_detail_5101067`)
  }

  return (
    <div className={styles['order-status-wrapper']}>
      <div className="px-4 w-full mb-6">
        <div className="order-no">
          <div>
            <span>{t`features_orders_order_detail_5101068`}</span>
            <span>{order.id}</span>
          </div>
          <div onClick={copy}>
            <Icon name="copy" hasTheme />
          </div>
        </div>
      </div>
      <div className="text-xs text-text_color_02 mb-2">{t`constants_order_742`}</div>
      <div className="mb-1 font-medium">
        {' '}
        <span>{replaceEmpty(order.sellCoinShortName)}</span>/<span>{replaceEmpty(order.buyCoinShortName)}</span>
      </div>
      {statusConfig && (
        <div className={classNames('flex items-center text-sm', statusConfig.textColor)}>
          <span className="mr-1">
            <Icon name={statusConfig.icon} hasTheme={statusConfig.hasTheme} />
          </span>
          <span>{statusText}</span>
        </div>
      )}
    </div>
  )
}

type IPropListProps = {
  list: {
    label: string | ReactNode
    id?: string
    value: string | ReactNode
  }[]
}
function PropList({ list }: IPropListProps) {
  return (
    <div className="px-5 bg-bg_color">
      {list.map(item => {
        return (
          <div key={typeof item.label === 'string' ? item.label : item.id} className={styles['prop-list-item-wrapper']}>
            <div className="text-text_color_02">{item.label}</div>
            <div>{item.value || replaceEmpty(item.value as any)}</div>
          </div>
        )
      })}
    </div>
  )
}

// 交易日志
function TransactionLog({
  feeCoinName,
  log,
  sellCoinName,
}: {
  log: IBaseOrderTransactionLog
  sellCoinName: string
  feeCoinName: string
}) {
  const props = [
    {
      label: t`future.funding-history.index-price.column.time`,
      value: formatDate(log.createdByTime!),
    },
    {
      label: t`features/trade/spot/price-input-0`,
      value: `${replaceEmpty(formatCurrency(log.count))} ${replaceEmpty(sellCoinName)}`,
    },
    {
      label: t`future.funding-history.index.table-type.price`,
      value: replaceEmpty(formatCurrency(log.price!)),
    },
    {
      label: t`features_assets_financial_record_financial_record_592`,
      value: `${replaceEmpty(formatCurrency(log.fees))} ${replaceEmpty(feeCoinName)}`,
    },
  ]

  return (
    <div className="rv-hairline--bottom">
      <PropList list={props} />
    </div>
  )
}

type IOrderDetailLayoutProps = {
  children?: ReactNode
  order: IBaseOrderItem
  orderEnumType: string
}

function OrderDetailPageLayout({ order, orderEnumType }: IOrderDetailLayoutProps) {
  const isBuy = order.side === OrderDirectionEnum.buy
  const isMarketPrice = order.orderType === EntrustTypeEnum.market
  const marketOrderIsEntrustAmount = order.marketUnit === SpotNormalOrderMarketUnitEnum.entrustAmount
  const feeCoinName = isBuy ? order.sellCoinShortName : order.buyCoinShortName
  const { fetchOrderEnums } = useBaseOrderSpotStore()
  useMount(fetchOrderEnums)

  const enumsText = getOrderValueEnumText(
    order,
    {},
    Number(orderEnumType) === EntrustTypeEnum.stop ? EntrustTypeEnum.normal : Number(orderEnumType)
  )
  const coinName = isMarketPrice
    ? marketOrderIsEntrustAmount
      ? order.sellCoinShortName
      : order.buyCoinShortName
    : order.sellCoinShortName

  const props1 = [
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-9`,
      value: !order.id ? (
        replaceEmpty()
      ) : (
        <span
          className={classNames({
            'text-sell_down_color': !isBuy,
            'text-buy_up_color': isBuy,
          })}
        >
          {enumsText.typeTextWithSuffix} / {enumsText.directionText}
        </span>
      ),
    },
    {
      label: t({
        id: 'features_orders_order_detail_510268',
        values: { 0: replaceEmpty(coinName) },
      }),
      value: (
        <span>
          <span>{formatCurrency(order.successCount)}</span>/
          <span className="text-text_color_02">{formatCurrency(order.entrustCount)}</span>
        </span>
      ),
    },
    {
      label: t`features_orders_order_detail_510269`,
      value: (
        <span>
          <span>{replaceEmpty(formatCurrency(order.averagePrice))}</span>/
          <span className="text-text_color_02">
            {isMarketPrice ? t`features/trade/future/price-input-3` : formatCurrency(order.entrustPrice || '')}
          </span>
        </span>
      ),
    },
  ]

  const feeDeduction = [] as Record<'label' | 'value', string>[]

  if (Number(order?.feeDeductionAmount)) {
    feeDeduction.push({
      label: t`features_orders_order_detail_azc1vnv0l0`,
      value: `${replaceEmpty(order.feeDeductionAmount)} ${replaceEmpty(feeCoinName)}`,
    })
  }

  const props2 = [
    {
      label: t`features_assets_financial_record_financial_record_592`,
      value: `${replaceEmpty(formatCurrency(order.fees))} ${replaceEmpty(feeCoinName)}`,
    },
    ...feeDeduction,
    {
      label: t`features_orders_order_detail_510270`,
      value: `${replaceEmpty(formatCurrency(order.totalAmount))} ${replaceEmpty(order.buyCoinShortName)}`,
    },
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(order.createdByTime!),
    },
    {
      label: t`features_orders_order_detail_510271`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  return (
    <div className={styles['order-detail-page-layout-wrapper']}>
      <NavBar title={t`features_orders_order_detail_510265`} />
      <div>
        <OrderStatus order={order} orderEnumType={Number(orderEnumType)} />
        <div className="">
          <PropList list={props1} />
          <div className="px-5">
            <div className="rv-hairline--bottom"></div>
          </div>
          <PropList list={props2} />
          <div className="mt-1 bg-bg_color">
            <div className="px-5 pt-3">
              <h3>{t`features_orders_order_detail_510272`}</h3>
            </div>
            <div>
              {order.transactionLogs?.map((log, index) => {
                return (
                  <TransactionLog
                    key={index}
                    log={log}
                    sellCoinName={order.sellCoinShortName!}
                    feeCoinName={feeCoinName!}
                  />
                )
              })}
              {(!order.transactionLogs || order.transactionLogs.length === 0) && (
                <div className="text-center text-text_color_02 py-9 text-xs">{t`features_orders_order_detail_510288`}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPageLayout
