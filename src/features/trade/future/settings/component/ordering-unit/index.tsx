import { t } from '@lingui/macro'
import classNames from 'classnames'
import { HTMLAttributes, ReactNode, useState } from 'react'
import { Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import { ActionSheetAction } from '@nbit/vant/es/action-sheet/PropsType'
import styles from './index.module.css'

export type ISelectActionSheetProps = {
  label?: string
  actions?: (ActionSheetAction & {
    value?: number | string
    nameInLabel?: ReactNode
  })[]
  onChange?: (value) => void
  /** 自定义触发元素，可以置为 null 来不显示 */
  triggerElement?: ReactNode
  defaultVisible?: boolean
  value?: any
  cartIcon?: ReactNode
  labelClassName?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title' | 'actions'>

export function OrderingUnit({
  label,
  value,
  actions = [],
  className,
  onChange,
  triggerElement,
  defaultVisible = false,
  cartIcon,
  labelClassName,
}: ISelectActionSheetProps) {
  const [visible, setVisible] = useState(defaultVisible)
  const selectedAction = actions.find(action => action.value === value)

  const onUnitChange = (v: string) => {
    onChange && onChange(v)
    setVisible(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      {triggerElement !== undefined ? (
        <div
          className={className}
          onClick={() => {
            setVisible(true)
          }}
        >
          {triggerElement}
        </div>
      ) : (
        <div className={classNames(styles['select-action-sheet-wrapper'], className)}>
          <div
            className="flex items-center justify-between"
            onClick={() => {
              setVisible(true)
            }}
          >
            <div
              className={classNames('label', labelClassName, {
                'only-name': !label,
              })}
            >
              {label && (
                <span>
                  <span>{label}</span>:{' '}
                </span>
              )}
              <span>{selectedAction?.nameInLabel || selectedAction?.name}</span>
            </div>
            {cartIcon || <Icon name="regsiter_icon_drop" className="text-xs scale-75 translate-y-px" hasTheme />}
          </div>
        </div>
      )}
      <Popup visible={visible} position="bottom" onClose={onClose} className={styles['setting-popup-sheet']}>
        <div className="setting-popup-sheet-content">
          <div className="sheet-title">{label || ''}</div>
          <div className="sheet-wrap">
            {actions?.map(item => {
              return (
                <div
                  key={item.value}
                  onClick={() => onUnitChange((item?.value as string) || '')}
                  className={`sheet-wrap-item ${value === item.value ? 'select-sheet-item' : ''}`}
                >
                  {item?.name}
                </div>
              )
            })}
          </div>
        </div>
        <div className="setting-popup-sheet-cancel" onClick={onClose}>
          {t`assets.financial-record.cancel`}
        </div>
      </Popup>
    </>
  )
}
