import { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { ListInstance } from '@nbit/vant'
import { MarkcoinResponse } from '@/plugins/request'
import { t } from '@lingui/macro'
import CommonList from '@/components/common-list/list'
import { useLoadMore } from '@/hooks/use-load-more'
import { useUpdateEffect } from 'ahooks'
import { OpenSpots } from '@/hooks/features/order'
import styles from './order.module.css'

export type IOrderListLayoutInstance = {
  refresh: () => void
  clearAll: () => void
  list: any[]
}
export type IBasePrams = {
  page?: number
}
export type IOrderListLayoutProps<T, P> = {
  params: any
  OrderItem: (props: {
    order: P
    onCanceled: (id: any) => void
    openSpots: OpenSpots
    orderType: number
    isCurrentTab: boolean | undefined
  }) => JSX.Element
  removeOrderItem?: (id: any) => void
  filters?: ReactNode
  onRefresh?: () => void
  search?: (params: T & IBasePrams) => Promise<
    MarkcoinResponse<{
      list?: P[]
    }>
  >
  propList?: P[]
  onListChange?: (list: P[]) => void
  instanceRef?: MutableRefObject<IOrderListLayoutInstance>
  /** 参数映射，用于改名 */
  paramsMapFn?: (params: T) => T
  openSpots: OpenSpots
  orderType: number
  isCurrentTab: boolean | undefined
}
export function OrderListLayout<
  T,
  P extends {
    id?: any
  }
>({
  filters,
  instanceRef,
  propList,
  removeOrderItem,
  paramsMapFn = a => a,
  onRefresh,
  OrderItem,
  params,
  search,
  onListChange,
  openSpots,
  orderType,
  isCurrentTab,
}: IOrderListLayoutProps<T, P>) {
  const listRef = useRef<ListInstance>(null)
  const [refreshDisabled, setRefreshDisabled] = useState(true)
  const {
    list,
    loadMore,
    // loading,
    setList,
    finished,
    refresh: refreshList,
    cancelLoad,
  } = useLoadMore({
    async fetchData(page) {
      if (!search || propList) {
        return [] as P[]
      }
      const res = await search({
        ...paramsMapFn({ ...params, orderType: params?.orderType === 'all' ? '' : params?.orderType }),
        pageNum: page,
      })
      if (!res.isOk || !res.data || !res.data.list) {
        return
      }
      return res.data.list
    },
  })
  // TODO: 这个组件设计导致现在的触发刷新是有问题的，最好还是改一下组件
  const refresh = async () => {
    if (onRefresh) {
      onRefresh()
    }
    return refreshList()
  }
  // 计算 touch 事件时是否可触发下拉刷新
  const onTouch = (e: any) => {
    const el = document.documentElement
    const disabled = el.scrollTop > 5
    setRefreshDisabled(disabled)
    if (disabled) {
      e.stopPropagation()
    }
  }
  useUpdateEffect(() => {
    // 刷新结束后检查是否继续请求
    listRef.current?.check()
  }, [list])
  useUpdateEffect(() => {
    cancelLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  useUpdateEffect(() => {
    onListChange?.(list)
  }, [list])
  const displayList = propList || list
  if (instanceRef) {
    instanceRef.current = {
      refresh,
      list,
      clearAll() {
        setList([])
      },
    }
  }
  const removeItem = (id: any, idKey = 'id') => {
    if (removeOrderItem) {
      removeOrderItem(id)
    }
    if (!propList) {
      setList(list.filter(item => (item as any)[idKey] !== id))
    }
  }

  return (
    <div className={styles['order-list-layout-wrapper']} onTouchStart={onTouch}>
      <div>{filters}</div>
      <CommonList
        refreshing
        emptyClassName="pt-8 pb-20"
        onRefreshing={refresh}
        onLoadMore={loadMore}
        finished={finished}
        listChildren={undefined}
        showEmpty={displayList.length === 0}
      >
        <div>
          {displayList.map(order => {
            return (
              <OrderItem
                onCanceled={removeItem}
                key={order.id}
                order={order}
                isCurrentTab={isCurrentTab}
                openSpots={openSpots}
                orderType={orderType}
              />
            )
          })}
        </div>
      </CommonList>
    </div>
  )
}
