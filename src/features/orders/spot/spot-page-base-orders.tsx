import { useEventEmitter, useUpdateEffect } from 'ahooks'
import { SpotOpenOrderItem } from '@/features/orders/spot/open-order-item'
import { IOrderListLayoutInstance, OrderListLayout } from '@/features/orders/order-list-layout'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { IQuerySpotOrderReqParams, ISpotBatchCancelOrderReq } from '@/typings/api/order'
// import { useBaseOrderSpotStore } from '@/store/order/spot'
import { subscribeSpotOrders } from '@/helper/order/spot'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { OpenSpots } from '@/hooks/features/order'
import { SpotCurrentFilters } from './spot-select-filters'
import { IOrderHeaderFiltersProps, OrderHeaderFilters } from '../order-filters'

type EventEmitter<T> = ReturnType<typeof useEventEmitter<T>>

export type IBaseOrdersProps = {
  params: IQuerySpotOrderReqParams
  setParams: (newParams: IQuerySpotOrderReqParams) => void
  types?: any[]
  showDirection?: boolean
  $cancelAll: EventEmitter<any>
  search: (params: any) => Promise<any>
  visible?: boolean
  isCurrentTab?: boolean
  onCancelAll?: () => void
  headerFiltersProps: IOrderHeaderFiltersProps
  removeOrderItem?: (id: any) => void
  onRefresh?: () => void
  paramsMapFn?: (params: IQuerySpotOrderReqParams) => IQuerySpotOrderReqParams
  openSpots: OpenSpots
  orderType: number
  tradeShowCancelAll?: number | false | undefined
  cancelAll?: (params: ISpotBatchCancelOrderReq) => Promise<boolean>
  setTypeParams?: (newParams: any) => void
}
export function BaseOrders(props: IBaseOrdersProps) {
  const onChange = (newParams: IQuerySpotOrderReqParams) => {
    // const { tradeId } = newParams || {}
    // if (tradeId || tradeId === '')
    //   props.setParams({
    //     ...props.params,
    //     tradeId,
    //   })

    if (newParams?.orderType) {
      props?.setTypeParams?.({ statusArr: props.params.statusArr, orderType: newParams?.orderType })
      return
    }

    props.setParams({
      ...props.params,
      ...newParams,
    })
  }
  // const { openOrderModule } = useBaseOrderSpotStore()
  useEffect(() => {
    // TODO: 保留不可见时参数变化不更新的逻辑可能，看后面怎么处理吧
  }, [props.visible])
  const layoutInstanceRef = useRef<IOrderListLayoutInstance>(null as any)
  useUpdateEffect(() => {
    if (props.visible) {
      layoutInstanceRef.current?.refresh()
    }
  }, [props.visible])
  const visibleRef = useRef(props.visible)
  visibleRef.current = props.visible
  useEffect(() => {
    const unsubscribeFn = subscribeSpotOrders(() => {
      return () => {
        if (visibleRef.current) {
          layoutInstanceRef.current?.refresh()
        }
      }
    })
    return unsubscribeFn
  }, [])
  const [list, setList] = useState<any[]>([])
  const { headerFiltersProps } = props
  const showCancelAll = props.isCurrentTab && list.length > 0

  return (
    <div
      className={classNames({
        'fixed -top-full -left-full opacity-0 invisible': !props.visible,
      })}
    >
      <div>
        <OrderHeaderFilters
          {...headerFiltersProps}
          openSpots={props.openSpots}
          isCurrentTab={props.isCurrentTab}
          onCancelAll={showCancelAll ? headerFiltersProps.onCancelAll : undefined}
        />
      </div>
      <div className="flex justify-between items-center rv-hairline--bottom">
        <SpotCurrentFilters
          params={props.params}
          showDirection={props.showDirection}
          types={props.types}
          onChange={onChange}
        />
        {props.tradeShowCancelAll && (
          <div
            className="text-text_color_01 text-xs px-2 py-1 rounded bg-bg_sr_color mr-4"
            onClick={() => headerFiltersProps?.onCancelAll?.()}
          >{t`features_orders_order_filters_510216`}</div>
        )}

        {headerFiltersProps?.onHideCanceledChange && (
          <div className="flex items-center pr-4">
            {/* <Switch size={12} checked={hideCanceled} onChange={onHideCanceledChange} /> */}
            <div
              onClick={() => {
                headerFiltersProps?.onHideCanceledChange?.(!headerFiltersProps?.hideCanceled)
              }}
              className="flex justify-between items-center"
            >
              <span>
                {headerFiltersProps?.hideCanceled ? (
                  <Icon name="login_agreement_selected" className="text-xs w-3 h-3 -mt-1" />
                ) : (
                  <Icon name="login_agreement_unselected" className="text-xs w-3 h-3 -mt-1" />
                )}
              </span>
              <span className="text-xs text-text_color_03 ml-1">{t`features_orders_order_filters_5101235`}</span>
            </div>
          </div>
        )}
      </div>

      <OrderListLayout
        paramsMapFn={props.paramsMapFn}
        key="1"
        removeOrderItem={props.removeOrderItem}
        instanceRef={layoutInstanceRef}
        params={props.params}
        isCurrentTab={props.isCurrentTab}
        search={props.search}
        onListChange={setList}
        onRefresh={props.onRefresh}
        OrderItem={SpotOpenOrderItem}
        openSpots={props.openSpots}
        orderType={props.orderType}
      />
    </div>
  )
}
