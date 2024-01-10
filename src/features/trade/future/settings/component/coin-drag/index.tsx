import Icon from '@/components/icon'
import { Checkbox } from '@nbit/vant'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { MarginCoinArrayType } from '@/typings/api/trade'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import styles from './index.module.css'

type CoinDragType = {
  onChange?: (v) => void
  data?: Array<MarginCoinArrayType>
}

const CoinDrag = (props: CoinDragType) => {
  const [items, setItems] = useState<Array<MarginCoinArrayType>>([])
  const [values, setValues] = useState<string[]>([])

  const { data, onChange } = props

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove([...items], oldIndex, newIndex))
    onChange && onChange(arrayMove([...items], oldIndex, newIndex))
  }

  const onCheckboxChange = params => {
    const checkData = cloneDeep(items)
    checkData.forEach(v => {
      v.selected = false
      const newFindList = params.find(item => item === v.coinName)
      newFindList && (v.selected = true)
    })
    setValues(params)
    onChange && onChange(checkData)
  }

  const CoinDragContainers: any = SortableContainer(({ children }) => {
    return (
      <Checkbox.Group value={values} onChange={v => onCheckboxChange(v)}>
        {children}
      </Checkbox.Group>
    )
  })

  const CoinDragItem: any = SortableElement(({ value, price }) => (
    <Checkbox
      name={value}
      shape="square"
      className={styles['currency-setting-checkbox']}
      iconRender={({ checked }) =>
        checked ? (
          <Icon name="login_verify_selected" className="check-icon" />
        ) : (
          <Icon name="login_verify_unselected" hasTheme className="check-icon" />
        )
      }
    >
      <div className="coin-drag-item">
        <div className="currency">
          <label>{`1 ${value || ''}`}</label>
        </div>
        <div className="price">
          <label>{`≈ ${price || ''}`}</label>
        </div>
        <Icon name="contract_drag" className="drag-icon" hasTheme />
      </div>
    </Checkbox>
  ))

  useEffect(() => {
    data && setItems(data)
    const newData = data?.filter(v => v.selected).map(item => item.coinName)
    setValues(newData || [])
  }, [data])

  return (
    <div className={styles.scoped}>
      <CoinDragContainers
        lockAxis={'y'}
        lockOffset={0}
        pressDelay={150}
        lockToContainerEdges
        useDragHandle={false}
        onSortEnd={onSortEnd}
      >
        {items?.map((v, index) => (
          <CoinDragItem key={v?.coinId} index={index} value={v?.coinName} price={v.rate + v.currencySymbol} />
        ))}
      </CoinDragContainers>
    </div>
  )
}
export default CoinDrag
