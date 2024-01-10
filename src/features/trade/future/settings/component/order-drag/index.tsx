import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { OrderDragArrayType } from '@/typings/api/trade'
import { getFutureSettingModuleOrderObject } from '@/constants/future/settings'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import styles from './index.module.css'

type OrderDragType = {
  onChange?: (v) => void
  data?: Array<OrderDragArrayType>
}

const OrderDrag = (props: OrderDragType) => {
  const [items, setItems] = useState<Array<OrderDragArrayType>>([])
  const { data, onChange } = props

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove([...items], oldIndex, newIndex))
    onChange && onChange(arrayMove([...items], oldIndex, newIndex))
  }

  const OrderDragContainers: any = SortableContainer(({ children }) => {
    return <div>{children}</div>
  })

  const OrderDragItem: any = SortableElement(({ value }) => (
    <div className={styles['order-drag-item']}>
      <div className="currency">
        <label>{getFutureSettingModuleOrderObject()[value] || ''}</label>
      </div>
      <Icon name="contract_drag" className="drag-icon" hasTheme />
    </div>
  ))

  useEffect(() => {
    data && setItems(data)
  }, [data])

  return (
    <div className={styles.scoped}>
      <OrderDragContainers
        lockAxis={'y'}
        lockOffset={0}
        pressDelay={0}
        lockToContainerEdges
        useDragHandle={false}
        onSortEnd={onSortEnd}
      >
        {items?.map((v, index) => (
          <OrderDragItem key={v?.value} index={index} value={v?.value} />
        ))}
      </OrderDragContainers>
    </div>
  )
}
export default OrderDrag
