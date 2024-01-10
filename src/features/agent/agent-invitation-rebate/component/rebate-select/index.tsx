import cn from 'classnames'
import Icon from '@/components/icon'
import { DropdownMenu, DropdownMenuInstance } from '@nbit/vant'
import { useState, useRef } from 'react'
import styles from './index.module.css'

export default Select

function Select({ overlay = false, ...props }: any) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<DropdownMenuInstance>(null)

  return (
    <div className={cn(styles.scoped)}>
      <DropdownMenu
        {...props}
        ref={menuRef}
        overlay={overlay}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
      />
      <Icon
        hasTheme
        className="arrow-icon"
        onClick={() => menuRef?.current?.toggleItem(0)}
        name={open ? 'regsiter_icon_away' : 'regsiter_icon_drop'}
      />
    </div>
  )
}
Select.Item = DropdownMenu.Item
