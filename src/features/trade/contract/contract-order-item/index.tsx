import Icon from '@/components/icon'
import {
  getFutureRequestId,
  useFutureEnum,
  getTradePriceTypeEnumName,
  SelectSideIdEnum,
} from '@/constants/future/future-const'
import { EntrustTypeEnum, EntrustVersion, TradeUnitTextEnum } from '@/constants/trade'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { envIsServer } from '@/helper/env'
import { replaceEmpty } from '@/helper/filters'
import { link } from '@/helper/link'
import { requestWithLoading } from '@/helper/order'
import { getOrderValueEnumText } from '@/helper/order/future'
import { OpenFuture } from '@/hooks/features/contract'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { IBaseOrderItem, ISpotPlanOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { Button, Circle, Toast } from '@nbit/vant'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import classNames from 'classnames'
import React, { ReactNode, useRef, useState } from 'react'
import { FutureTabTypeEnum } from '@/constants/future/future-history'
import {
  useContractComputedPrice,
  getCoinPrecisionChangePrice,
  getQuoteDisplayDigit,
} from '@/hooks/features/contract-computed-price'
import { useContractElements } from '../contract-elements/useContractElements'
import ContractAdjustmentModal from '../contract-adjustment-modal'
import styles from './index.module.css'

type IProps = {
  order: any
  isPlanOrder?: boolean
  leftCircle?: ReactNode
  rightTableContent?: ReactNode
  onCanceled?: (id: string) => void
  futureEntrustType?: number
  openFuture?: OpenFuture
  setShowBond?: React.Dispatch<React.SetStateAction<number | undefined>>
  marginMode?: boolean
}
export function SpotBaseOpenOrderItem({
  order,
  leftCircle,
  rightTableContent,
  futureEntrustType,
  openFuture,
  setShowBond,
  marginMode,
}: IProps) {
  const isBuy = order?.[SelectSideIdEnum[futureEntrustType as number]] === 'open_long'
  const onCancel = async e => {
    e.stopPropagation()
    if (openFuture) {
      const res = await requestWithLoading(
        openFuture[futureEntrustType as number].request({
          id: order.id,
        })
      )
      if (!res.isOk) {
        return
      }
      // 先去掉这一步，后端达不到要求再加回来 onCanceled?.(order.id!)
      Toast(t`features_orders_spot_open_order_item_5101061`)
    }
  }

  const { typeInd } = useTradeCurrentFutureCoin()

  const id = getFutureRequestId(futureEntrustType)

  const { statusConfigs } = useFutureEnum()

  const enumsText = getOrderValueEnumText(order, undefined, statusConfigs, futureEntrustType)

  const statusConfig = statusConfigs[order.statusCd]

  const toDetail = () => {
    if (!order[id] || !statusConfig.showButton) {
      return
    }
    link(`/my/futrue/detail?futureEntrustType=${futureEntrustType}&id=${order[id]}`)
  }

  const ContractAdjustmentModalRef = useRef<Record<'setContractSheetVisible', () => void>>()

  const scaleRef = useScaleDom(envIsServer ? 375 : window.innerWidth * 0.9, order[id])

  const { getTypeIndName } = useContractElements()

  const setAdjustmentBonds = () => {
    if (!marginMode) {
      Toast(t`features_trade_contract_contract_order_item_index_y1ttyv9g7yehgjylmuowh`)
      return
    }
    ContractAdjustmentModalRef.current?.setContractSheetVisible()
  }

  return (
    <div onClick={toDetail} className={classNames(styles['open-order-item-wrapper'], 'rv-hairline--bottom')}>
      <ContractAdjustmentModal
        totalMargin={order?.totalMargin}
        initMargin={order?.initMargin}
        id={order?.id}
        setShowBond={setShowBond}
        ref={ContractAdjustmentModalRef}
      />
      <div className="flex justify-between mb-2 items-start">
        <div>
          <div className="text-base flex items-center">
            <span>
              {order.baseCoinShortName}
              {order.quoteCoinShortName}
            </span>
            <span className="ml-1">{getTypeIndName[typeInd as string]}</span>
            <span className="future-group-name">
              {order.groupName ||
                t`features_assets_financial_record_record_detail_record_details_info_index_qlxkmuwdvjiibzzhbgurg`}
            </span>
          </div>
          <div
            className={classNames('flex items-center', {
              'text-buy_up_color': isBuy,
              'text-sell_down_color': !isBuy,
            })}
          >
            <span>{enumsText.typeText}</span>/<span>{enumsText.directionText}</span>
            <span
              className={classNames('text-sm ml-1', {
                'text-buy_up_color': isBuy,
                'text-sell_down_color': !isBuy,
              })}
            >
              {order?.lever}x
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div>
            <span className="text-xs text-text_color_03">{formatDate(Number(order.createdByTime!))}</span>
            {order[id] && statusConfig?.showButton && <Icon name="next_arrow" className="text-base ml-1" hasTheme />}
          </div>
          {statusConfig?.showButton && (
            <div className={classNames('status-tag', statusConfig.bgColor, statusConfig.textColor)}>
              {enumsText.statusText}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div ref={scaleRef} className="flex flex-1">
          {!statusConfig?.showButton && leftCircle}
          <table className="flex-1">
            <tbody>{rightTableContent}</tbody>
          </table>
        </div>
        <div className="flex flex-col">
          {!statusConfig?.showButton && (
            <Button onClick={onCancel} size="small" className="cancel-button ml-4">
              {t`features_orders_spot_open_order_item_510219`}
            </Button>
          )}
          {futureEntrustType === EntrustTypeEnum.plan &&
            order?.marginType === 'wallet' &&
            order.statusCd === 'not_triggered' && (
              <Button size="small" className="adjustment-button ml-4 mt-1" onClick={setAdjustmentBonds}>
                {t`features_trade_contract_contract_order_item_index_5101492`}
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}
type OrderItemProps<T> = {
  order?: T
  onCanceled?: IProps['onCanceled']
  futureEntrustType?: number
  futureHooksType?: number
  orderTab?: string
  openFuture?: OpenFuture
  marginMode?: boolean
  placeUnitType?: string
  getJudgeDivOrMulPriceChange?: (placeUnit) => any
}
export function SpotNormalOpenOrderItem({
  order,
  onCanceled,
  futureEntrustType,
  orderTab,
  openFuture,
  marginMode,
  placeUnitType,
  getJudgeDivOrMulPriceChange,
}: OrderItemProps<any>) {
  const isBuy = order?.[SelectSideIdEnum[futureEntrustType as number]] === 'open_long'
  const isMarketPrice = order?.entrustTypeInd === 'market'
  const coinName = placeUnitType === TradeUnitTextEnum.BASE ? order?.baseCoinShortName : order?.quoteCoinShortName

  const rate = parseFloat(order.completeness)

  const getDivOrMulPrice = getJudgeDivOrMulPriceChange && getJudgeDivOrMulPriceChange(order?.placeUnit)

  const [showBond, setShowBond] = useState<number>()

  const leftCircle = (
    <div className="mr-2 mt-1">
      <Circle
        strokeWidth={100}
        className={classNames({
          [styles['zero-circle']]: rate === 0,
          'buy-circle-text': isBuy,
          'sell-circle-text': !isBuy,
        })}
        size={50}
        color={isBuy ? 'var(--buy_up_color)' : 'var(--sell_down_color)'}
        layerColor="var(--bg_sr_color)"
        rate={rate}
        text={order?.completeness}
      />
    </div>
  )

  const showProfitOrLossStatus = orderTab !== 'history'

  const divOrMulPrice = isMarketPrice ? order?.tradePrice : order?.price

  const setInspectProfitloss = e => {
    e.stopPropagation()
    link(
      `/future/stop-profitloss?id=${order.id}&futureEntrustType=${futureEntrustType}&orderTab=strategy&showProfitOrLossStatus=${showProfitOrLossStatus}&divOrMulPrice=${divOrMulPrice}`
    )
  }

  const rightTableContent = (
    <>
      <tr className="mt-2 number-item">
        <td className="number-label">
          <div>
            {t`features_trade_contract_contract_order_item_index_5101496`}
            <span>
              {t`features_trade_contract_contract_order_item_index_frpx0hjuwsdk2gxjhldfs`}
              <div>
                {t`features/trade/spot/price-input-0`} ({coinName})
              </div>
            </span>
          </div>
        </td>
        <td className="number-value">
          <span className="text-text_color_01">
            {replaceEmpty(
              getDivOrMulPrice === true
                ? getQuoteDisplayDigit(order?.tradeSize, order?.quoteCoinShortName, placeUnitType)
                : getDivOrMulPrice(order?.tradeSize, order?.tradePrice, order?.baseCoinShortName)
            )}
          </span>
          /
          <span>
            {replaceEmpty(
              getDivOrMulPrice === true
                ? getQuoteDisplayDigit(order?.size, order?.quoteCoinShortName, placeUnitType)
                : getDivOrMulPrice(order?.size, divOrMulPrice, order?.baseCoinShortName)
            )}
          </span>
        </td>
      </tr>
      <tr className="mt-2 number-item">
        <td className="number-label">
          <div>
            {t`features_trade_contract_contract_order_item_index_5101497`}
            <span>
              {t`features_trade_contract_contract_order_item_index_frpx0hjuwsdk2gxjhldfs`}
              <div>{t`future.funding-history.index.table-type.price`}</div>
            </span>
          </div>
        </td>
        <td className="number-value">
          <span className="text-text_color_01">
            {replaceEmpty(
              order?.tradePrice && getCoinPrecisionChangePrice(order?.tradePrice, order?.baseCoinShortName, 'price')
            )}
            /
          </span>
          <span>
            {isMarketPrice
              ? t`features/trade/future/price-input-3`
              : replaceEmpty(
                  order?.price && getCoinPrecisionChangePrice(order?.price, order?.baseCoinShortName, 'price')
                )}
          </span>
        </td>
      </tr>
      {order?.marginType === 'wallet' && (
        <tr className="mt-2 number-item">
          <td className="number-label">
            {t`features_trade_contract_contract_order_item_index_5101494`} ({order.quoteCoinShortName})
          </td>
          <td className="number-value">
            <span className="text-text_color_01">
              {showBond
                ? replaceEmpty(getQuoteDisplayDigit(showBond, order?.quoteCoinShortName, placeUnitType))
                : replaceEmpty(getQuoteDisplayDigit(order?.totalMargin, order?.quoteCoinShortName, placeUnitType))}
            </span>
          </td>
        </tr>
      )}
      {order?.hasStrategy && (
        <tr className="mt-2 number-item">
          <td className="number-label">{t`features/trade/future/exchange-0`}</td>
          <td className="inspect" onClick={setInspectProfitloss}>
            {t`features_trade_contract_contract_order_item_index_5101495`}
          </td>
        </tr>
      )}
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      openFuture={openFuture}
      onCanceled={onCanceled}
      marginMode={marginMode}
      leftCircle={orderTab !== 'history' ? leftCircle : undefined}
      rightTableContent={rightTableContent}
      order={order as IBaseOrderItem}
      setShowBond={setShowBond}
      futureEntrustType={futureEntrustType}
    />
  )
}
export function SpotPlanOpenOrderItem({
  order,
  onCanceled,
  futureEntrustType,
  openFuture,
  marginMode,
  orderTab,
  placeUnitType,
  getJudgeDivOrMulPriceChange,
}: OrderItemProps<any>) {
  const isMarketPrice = order?.entrustTypeInd === 'market'
  const triggerPriceTypeName = getTradePriceTypeEnumName(order?.triggerPriceTypeInd)
  const coinName = placeUnitType === TradeUnitTextEnum.BASE ? order?.baseCoinShortName : order?.quoteCoinShortName

  const showProfitOrLossStatus = orderTab !== 'history'

  const [showBond, setShowBond] = useState<number>()

  const getRequestId = orderTab === FutureTabTypeEnum.history ? (order.refOrderId ? 'refOrderId' : 'id') : 'id'

  const getDivOrMulPrice = getJudgeDivOrMulPriceChange && getJudgeDivOrMulPriceChange(order?.placeUnit)

  const divOrMulPrice = isMarketPrice ? order?.triggerPrice : order?.price

  const setInspectProfitloss = e => {
    e.stopPropagation()
    link(
      `/future/stop-profitloss?id=${order[getRequestId]}&futureEntrustType=${futureEntrustType}&orderTab=${
        getRequestId === 'id' ? 'planstrategy' : 'strategy'
      }&showProfitOrLossStatus=${showProfitOrLossStatus}&divOrMulPrice=${divOrMulPrice}`
    )
  }

  const orderSize = order?.size || order?.orderPrice

  const rightTableContent = (
    <>
      <tr className="mt-2 number-item">
        <td className="number-label">
          {t`features/assets/financial-record/record-detail/record-details-info/index-10`}({coinName})
        </td>
        <td className="number-value">
          <span>
            {replaceEmpty(
              getDivOrMulPrice === true
                ? orderSize && getQuoteDisplayDigit(orderSize, order?.quoteCoinShortName, placeUnitType)
                : getDivOrMulPrice(
                    orderSize,
                    isMarketPrice ? order?.triggerPrice : order?.price,
                    order?.baseCoinShortName
                  )
            )}
          </span>
        </td>
      </tr>
      <tr className="mt-2 number-item">
        <td className="number-label">{t`features/trade/future/price-input-1`}</td>
        <td className="number-value">
          <span>
            {isMarketPrice
              ? t`features/trade/future/price-input-3`
              : formatCurrency(
                  order?.price && getCoinPrecisionChangePrice(order?.price, order?.baseCoinShortName, 'price')
                )}
          </span>
        </td>
      </tr>
      <tr className="mt-2 number-item">
        <td className="number-label">{t`features_trade_future_exchange_order_617`}</td>
        <td className="number-value">
          <span>
            {triggerPriceTypeName}
            <span className="mx-1">{order?.triggerDirectionInd === 'up' ? '≥' : '≤'}</span>
            {replaceEmpty(formatCurrency(order?.triggerPrice))}
          </span>
        </td>
      </tr>
      {order?.marginType === 'wallet' && (
        <tr className="mt-2 number-item">
          <td className="number-label">
            {t`features_trade_contract_contract_order_item_index_5101494`} ({order.quoteCoinShortName})
          </td>
          <td className="number-value">
            <span>
              {showBond
                ? replaceEmpty(getQuoteDisplayDigit(showBond, order?.quoteCoinShortName, placeUnitType))
                : replaceEmpty(getQuoteDisplayDigit(order?.totalMargin, order?.quoteCoinShortName, placeUnitType))}
            </span>
          </td>
        </tr>
      )}
      {order?.hasStrategy && (
        <tr className="mt-2 number-item">
          <td className="number-label">{t`features/trade/future/exchange-0`}</td>
          <td className="inspect" onClick={setInspectProfitloss}>
            {t`features_trade_contract_contract_order_item_index_5101495`}
          </td>
        </tr>
      )}
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      openFuture={openFuture}
      onCanceled={onCanceled}
      rightTableContent={rightTableContent}
      setShowBond={setShowBond}
      futureEntrustType={futureEntrustType}
      marginMode={marginMode}
      order={order as ISpotPlanOrderItem}
    />
  )
}

export function SpotStopOrderItem({
  order,
  onCanceled,
  openFuture,
  futureEntrustType,
  marginMode,
  orderTab,
  placeUnitType,
  getJudgeDivOrMulPriceChange,
}: OrderItemProps<any>) {
  const isMarketPrice = order?.entrustTypeInd === 'market'
  const triggerPriceTypeName = getTradePriceTypeEnumName(order?.triggerPriceTypeInd)

  const coinName = placeUnitType === TradeUnitTextEnum.BASE ? order?.baseCoinShortName : order?.quoteCoinShortName

  const getDivOrMulPrice = getJudgeDivOrMulPriceChange && getJudgeDivOrMulPriceChange(TradeUnitTextEnum.BASE)

  const isHistory = orderTab === FutureTabTypeEnum.history

  const rightTableContent = (
    <>
      <tr className="mt-2 number-item">
        <td className="number-label">
          <div>
            {isHistory && <span>{t`features_trade_contract_contract_order_item_index_5101496`}</span>}
            <span>
              {t`features/assets/financial-record/record-detail/record-details-info/index-10`} ({coinName})
            </span>
          </div>
        </td>
        <td className="number-value">
          {isHistory && (
            <span>
              {replaceEmpty(
                getDivOrMulPrice === true
                  ? getQuoteDisplayDigit(order?.tradeSize, order?.quoteCoinShortName, placeUnitType)
                  : getDivOrMulPrice(order?.tradeSize, order?.triggerPrice, order?.baseCoinShortName)
              )}
              /
            </span>
          )}
          <span>
            {replaceEmpty(
              getDivOrMulPrice === true
                ? getQuoteDisplayDigit(order?.size, order?.quoteCoinShortName, placeUnitType)
                : getDivOrMulPrice(
                    order?.size,
                    isMarketPrice ? order?.triggerPrice : order?.price,
                    order?.baseCoinShortName
                  )
            )}
          </span>
        </td>
      </tr>
      <tr className="mt-2 number-item">
        <td className="number-label">
          <div>
            {isHistory && <span>{t`features_trade_contract_contract_order_item_index_5101497`}</span>}
            <span>{t`features/trade/future/price-input-1`}</span>
          </div>
        </td>
        <td className="number-value">
          {isHistory && (
            <span>
              {replaceEmpty(
                order?.tradePrice && getCoinPrecisionChangePrice(order?.tradePrice, order?.baseCoinShortName, 'price')
              )}
              /
            </span>
          )}
          <span>
            {isMarketPrice
              ? t`features/trade/future/price-input-3`
              : replaceEmpty(
                  order?.price && getCoinPrecisionChangePrice(order?.price, order?.baseCoinShortName, 'price')
                )}
          </span>
        </td>
      </tr>
      <tr className="mt-2 number-item">
        <td className="number-label">{t`features_trade_future_exchange_order_617`}</td>
        <td className="number-value">
          <span>
            {triggerPriceTypeName}
            <span className="mx-1">{order?.triggerDirectionInd === 'up' ? '≥' : '≤'}</span>
            {replaceEmpty(formatCurrency(order?.triggerPrice))}
          </span>
        </td>
      </tr>
    </>
  )
  return (
    <SpotBaseOpenOrderItem
      futureEntrustType={futureEntrustType}
      openFuture={openFuture}
      onCanceled={onCanceled}
      marginMode={marginMode}
      rightTableContent={rightTableContent}
      order={order as any}
    />
  )
}

export function SpotOpenContractItem({
  order,
  onCanceled,
  futureHooksType,
  orderTab = 'open',
  openFuture,
  marginMode,
}: OrderItemProps<IBaseOrderItem | ISpotPlanOrderItem>) {
  const spotPlanOpenOrderObj = {
    [EntrustTypeEnum.plan]: <SpotPlanOpenOrderItem />,
    [EntrustTypeEnum.normal]: <SpotNormalOpenOrderItem />,
    [EntrustTypeEnum.stop]: <SpotStopOrderItem />,
  }

  const { placeUnitType, getCoinsDivPrice, getCoinsMulPrice, getJudgeDivOrMulPriceChange } = useContractComputedPrice()

  return React.cloneElement(spotPlanOpenOrderObj[futureHooksType as number], {
    order,
    onCanceled,
    futureEntrustType: futureHooksType,
    orderTab,
    openFuture,
    marginMode,
    placeUnitType,
    getCoinsDivPrice,
    getCoinsMulPrice,
    getJudgeDivOrMulPriceChange,
  })
}
