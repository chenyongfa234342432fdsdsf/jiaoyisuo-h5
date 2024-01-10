import { useEventEmitter } from 'ahooks'
import { useRef, Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import ContractLayoutList, {
  IFutureListLayoutInstance,
} from '@/features/ternary-option/option-order/ternary-layout-list/index'
import { TernaryOpenItem } from '@/features/ternary-option/option-order/ternary-order-item/index'
import { SpotCurrentFilters } from './ternary-select-filters'

type EventEmitter<T> = ReturnType<typeof useEventEmitter<T>>

export type IBaseOrdersProps = {
  params: IQuerySpotOrderReqParams
  setParams: Dispatch<SetStateAction<Record<'period' | 'sideInd' | 'optionId', string>>>
  $cancelAll: EventEmitter<any>
  search?: (params: any) => Promise<any>
  visible?: boolean
  onCancelAll?: () => void
  removeOrderItem?: (id: any) => void
  onRefresh?: () => void
  paramsMapFn?: (params: IQuerySpotOrderReqParams) => IQuerySpotOrderReqParams
  orderTab?: string
  listType?: string
}

export function BaseOrders(props: IBaseOrdersProps) {
  const onChange = newParams => {
    props.setParams({
      ...props.params,
      ...newParams,
    })
  }
  const layoutInstanceRef = useRef<IFutureListLayoutInstance>(null as any)
  return (
    <div
      className={classNames({
        'fixed -top-full -left-full opacity-0 invisible': false,
      })}
    >
      <SpotCurrentFilters params={props.params} onChange={onChange} />
      <ContractLayoutList
        paramsMapFn={props.paramsMapFn}
        removeOrderItem={props.removeOrderItem}
        instanceRef={layoutInstanceRef}
        params={props.params}
        search={props?.search}
        orderTab={props.orderTab}
        onRefresh={props.onRefresh}
        OrderItem={TernaryOpenItem}
        listType={props?.listType}
      />
    </div>
  )
}
