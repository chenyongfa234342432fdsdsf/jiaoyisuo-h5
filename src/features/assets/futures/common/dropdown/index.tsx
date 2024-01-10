/**
 * 合约 - 下拉选择组件
 */
import { useRef, useState } from 'react'
import { Popover, PopoverInstance } from '@nbit/vant'
import Icon from '@/components/icon'
import { useCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import classNames from 'classnames'
import styles from './index.module.css'

type ActionListEnum = {
  label: string
  value: string
}

interface DropdownProps {
  /** 下拉框选项列表 */
  actionList: ActionListEnum[]
  /** 选中后的数据展示 */
  label: string
  /** 选中项 */
  value: string
  className?: string
  width?: string
  textAlign?: any
  textSize?: string
  /** 点击下拉框条目时触发 */
  onCommit: (val: string) => void
}

function Dropdown(props: DropdownProps) {
  const theme = useCommonStore().theme
  const popover = useRef<PopoverInstance>(null)
  const { actionList = [], value = null, label = '', width = '', textAlign = 'center', onCommit } = props || {}
  const [visible, setVisible] = useState(false)

  return (
    <Popover
      ref={popover}
      theme={theme === ThemeEnum.light ? 'light' : 'dark'}
      placement="bottom-start"
      closeOnClickAction
      reference={
        <div
          className={classNames(styles['dropdown-reference-root'], props.className)}
          onClick={() => setVisible(!visible)}
        >
          <span>{label}</span>
          <Icon className="dropdown-icon" name={visible ? 'icon_trade_away' : 'icon_trade_drop'} hasTheme />
        </div>
      }
      className={styles['dropdown-root']}
    >
      <div className={'flex flex-col py-0.5'} style={{ width: width || '120px' }}>
        {actionList.map((actionItem: ActionListEnum) => {
          return (
            <div
              key={actionItem.value}
              className={`w-full text-sm mb-4 last:mb-0 ${value === actionItem.value && 'text-brand_color'}`}
              style={{ textAlign, fontSize: props.textSize || '14px' }}
              onClick={() => {
                onCommit(actionItem.value)
                setVisible(false)
                popover.current?.hide()
              }}
            >
              {actionItem.label}
            </div>
          )
        })}
      </div>
    </Popover>
  )
}

export { Dropdown }
