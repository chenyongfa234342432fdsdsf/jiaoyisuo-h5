import { useEventEmitter } from 'ahooks'
import { SpotOpenContractItem } from '@/features/trade/contract/contract-order-item/index'
import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import ContractLayoutList, { IFutureListLayoutInstance } from '@/features/trade/contract/contract-layout-list/index'
import { OpenFuture } from '@/hooks/features/contract'
import { IFutureHeaderFiltersProps, ContractHeaderFilters } from '../contract-filters'
import { SpotCurrentFilters } from './spot-select-filters'
import { HistorySelectParams, CurrentNormalParams, HistoryNormalParams } from '../contract'

type EventEmitter<T> = ReturnType<typeof useEventEmitter<T>>

export type IBaseOrdersProps = {
  params: IQuerySpotOrderReqParams
  setParams: Dispatch<SetStateAction<Partial<HistorySelectParams>>>
  types?: {
    name: string
    value: any
  }[]
  showDirection?: boolean
  $cancelAll: EventEmitter<any>
  search?: (params: any) => Promise<any>
  visible?: boolean
  isCurrentTab?: boolean
  onCancelAll?: () => void
  headerFiltersProps: IFutureHeaderFiltersProps
  removeOrderItem?: (id: any) => void
  onRefresh?: () => void
  paramsMapFn?: (params: IQuerySpotOrderReqParams) => IQuerySpotOrderReqParams
  futureHooksType?: number
  orderTab?: string
  openFuture?: OpenFuture
  marginMode: boolean
  setTypeParams?: Dispatch<SetStateAction<Partial<CurrentNormalParams | HistoryNormalParams>>>
}
export function BaseOrders(props: IBaseOrdersProps) {
  const onChange = (newParams: any) => {
    const { entrustTypeInd, tradeId, typeInd } = newParams || {}
    if (tradeId || tradeId === '') {
      props.setParams({
        ...props.params,
        tradeId,
      })
    }
    if (entrustTypeInd || entrustTypeInd === '') {
      props?.setTypeParams && props?.setTypeParams({ statusArr: props.params.statusArr, entrustTypeInd })
    }

    if (typeInd || typeInd === '') {
      props?.setTypeParams && props?.setTypeParams({ statusArr: props.params.statusArr, typeInd })
    }
  }
  useEffect(() => {
    // TODO: 保留不可见时参数变化不更新的逻辑可能，看后面怎么处理吧
  }, [props.visible])
  const layoutInstanceRef = useRef<IFutureListLayoutInstance>(null as any)
  // useUpdateEffect(() => {
  //   if (props.visible) {
  //     layoutInstanceRef.current?.refresh()
  //   }
  // }, [props.visible, props.futureHooksType])
  const [list, setList] = useState<any[]>([])
  const { headerFiltersProps, futureHooksType } = props
  const showCancelAll = list.length > 0

  return (
    <div
      className={classNames({
        'fixed -top-full -left-full opacity-0 invisible': false,
      })}
    >
      <ContractHeaderFilters
        {...headerFiltersProps}
        onCancelAll={showCancelAll ? headerFiltersProps.onCancelAll : undefined}
      />
      <SpotCurrentFilters
        params={props.params}
        showDirection={props.showDirection}
        futureHooksType={futureHooksType}
        types={props.types}
        onChange={onChange}
      />
      <ContractLayoutList
        paramsMapFn={props.paramsMapFn}
        key="1"
        removeOrderItem={props.removeOrderItem}
        instanceRef={layoutInstanceRef}
        params={props.params}
        search={props?.search}
        orderTab={props.orderTab}
        onListChange={setList}
        futureHooksType={futureHooksType}
        onRefresh={props.onRefresh}
        OrderItem={SpotOpenContractItem}
        openFuture={props.openFuture as OpenFuture}
        marginMode={props?.marginMode}
      />
    </div>
  )
}
