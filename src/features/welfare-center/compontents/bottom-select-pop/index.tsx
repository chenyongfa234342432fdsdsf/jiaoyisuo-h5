// 底部弹出下拉选择框
import { t } from '@lingui/macro'
import { Cell, Popover, Popup, PopoverInstance } from '@nbit/vant'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

interface PopSelectOption {
  value: string | number
  name: string
}
interface PopSelectProps {
  // 下拉 options
  optionsData: PopSelectOption[]
  isShow?: boolean
  selectValue?: string | number
  close: () => void
  selectClick: (value: string) => void
}
function PopSelect(props: PopSelectProps) {
  const { optionsData, isShow, selectValue } = props
  const [popUpShow, setPopUpShow] = useState(false)

  useEffect(() => {
    setPopUpShow(!!isShow)
  }, [isShow])
  const onClose = () => {
    setPopUpShow(false)
    props.close()
  }
  // 选中更新
  const selectClick = val => {
    // 已经被选中了点击不触发
    if (val?.value === selectValue) {
      setPopUpShow(false)
      return
    }
    props.selectClick(val)
  }
  return (
    <Popup onClickOverlay={onClose} visible={popUpShow} position="bottom" onClose={onClose} round>
      <div className={styles['bottom-select-popup-style']}>
        <div className="bottom-select-popup-wrap">
          {optionsData?.map(v => (
            <div className="item" key={v.value} onClick={() => selectClick(v)}>
              {v.value === selectValue ? <label className="text-brand_color">{v.name}</label> : <label>{v.name}</label>}
            </div>
          ))}
          <div className="cancel" onClick={onClose}>
            <label className="cancel-text">{t`user.field.reuse_09`}</label>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default PopSelect
