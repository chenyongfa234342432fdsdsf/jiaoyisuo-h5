import classnames from 'classnames'
import { DropdownMenu } from '@nbit/vant'
import { FC, ReactNode, useRef, useState } from 'react'
import { DropdownMenuInstance, DropdownMenuProps } from '@nbit/vant/es/dropdown-menu/PropsType'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { useClickAway } from 'ahooks'
import styles from './index.module.css'

export type ITradeSelectProps = {
  children?: ReactNode
  onTipClick?: () => void
  options: {
    text: string
    value: any
  }[]
  value: any
  onChange?: (v: any) => void
  /** 打开之前的回调，如果返回 false，则不打开 */
  beforeOpen?: () => boolean
  bgTradeParent?: boolean
  dropdownTop?: string | number
  dropDownLeft?: string | number
  titlePaddingLeft?: string | number
  titlePaddingRight?: string | number
  prefix?: ReactNode
} & Omit<DropdownMenuProps, 'value' | 'onChange'>

const TradeSelect: FC<ITradeSelectProps> = ({
  beforeOpen,
  className,
  value,
  onTipClick,
  options,
  prefix,
  onChange,
  bgTradeParent,
  dropdownTop = 'calc(100%)',
  dropDownLeft = '0',
  titlePaddingRight = '20px',
  titlePaddingLeft = '8px',
  ...props
}) => {
  const [opened, setOpened] = useState(false)
  const selectedOption = options.find(i => i.value === value)
  const dropdownRef = useRef<DropdownMenuInstance>(null)

  const toggleOpened = () => {
    if (opened) {
      dropdownRef?.current?.close()
    } else {
      dropdownRef?.current?.showItem(0)
    }
  }
  const containerRef = useRef(null)
  // 自带的要点击两次才可以关闭
  useClickAway(
    () => {
      dropdownRef?.current?.close()
    },
    [containerRef],
    // click 事件可能会被子元素阻止冒泡
    ['touchstart', 'click', 'mousedown']
  )
  const stopPropagation = (e: Event) => {
    e.stopPropagation()
  }

  return (
    <div
      className={classnames(styles.scoped, className, {
        'is-transparent': bgTradeParent,
      })}
      ref={containerRef}
      onClick={toggleOpened}
      style={{
        // @ts-ignore
        '--dropdown_top': dropdownTop,
        '--dropdown_left': dropDownLeft,
        '--title_padding_right': titlePaddingRight,
        '--title_padding_left': titlePaddingLeft,
      }}
    >
      {prefix && (
        <div className="prefix" onClick={stopPropagation as any}>
          {prefix}
        </div>
      )}
      <DropdownMenu
        ref={dropdownRef}
        overlay={false}
        onOpen={() => {
          if (beforeOpen?.() || !beforeOpen) {
            setOpened(true)
          }
        }}
        onClose={() => {
          setOpened(false)
        }}
        value={selectedOption}
        onChange={({ value: optionValue }) => {
          onChange?.(optionValue)
        }}
        {...props}
      >
        <DropdownMenu.Item name="value" options={options} />
      </DropdownMenu>
      <div
        className={classNames('arrow-icon', {
          'rotate-180': opened,
        })}
      >
        <Icon name="icon_trade_drop" hiddenMarginTop className="" hasTheme />
      </div>
    </div>
  )
}

export default TradeSelect
