import { t } from '@lingui/macro'
import classNames from 'classnames'
import { HTMLAttributes, ReactNode, useState } from 'react'
import { Popup, Radio } from '@nbit/vant'
import Icon from '@/components/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { ActionSheetAction } from '@nbit/vant/es/action-sheet/PropsType'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

export type ISelectActionSheetProps = {
  label?: string
  actions?: (ActionSheetAction & {
    value?: number | string
    src: string
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

export function SelectSheet({
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
  const onSelect = (action: any) => {
    onChange?.(action.value)
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
          <Radio.Group value={value}>
            <div className="sheet-wrap">
              {actions.map((action, index) => {
                return (
                  <div key={index} className="sheet-wrap-item" onClick={() => onSelect(action)}>
                    <div className="content">
                      <LazyImage
                        hasTheme
                        imageType={'.png'}
                        className="w-full h-full"
                        src={`${oss_svg_image_domain_address}${action?.src}`}
                      />
                      <Radio
                        name={action?.value as number}
                        className="content-radio"
                        iconRender={({ checked }) =>
                          checked ? (
                            <Icon name="login_agreement_selected" className="select-icon" />
                          ) : (
                            <Icon name="login_agreement_unselected" className="select-icon" />
                          )
                        }
                      />
                    </div>
                    <div className="text">{action?.name || ''}</div>
                  </div>
                )
              })}
            </div>
          </Radio.Group>
        </div>
        <div className="setting-popup-sheet-cancel" onClick={onClose}>
          {t`assets.financial-record.cancel`}
        </div>
      </Popup>
    </>
  )
}
