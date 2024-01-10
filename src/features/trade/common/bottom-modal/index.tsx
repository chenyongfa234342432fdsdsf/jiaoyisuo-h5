import Icon from '@/components/icon'
import { ReactNode } from 'react'
import { Popup } from '@nbit/vant'
import { OnlyOnePopup } from '@/components/only-one-overlay'
import styles from './index.module.css'

export type ITradeBottomModalProps = {
  title: ReactNode
  cancelText?: string
  children?: ReactNode
  visible?: boolean
  onVisibleChange?: (v: boolean) => void
  destroyOnClose?: boolean
  titleRightExtra?: ReactNode
}

function TradeBottomModal({
  title,
  visible,
  destroyOnClose,
  onVisibleChange,
  cancelText,
  children,
  titleRightExtra,
}: ITradeBottomModalProps) {
  return (
    <OnlyOnePopup
      className={styles['trade-bottom-modal-wrapper']}
      onClose={() => onVisibleChange?.(false)}
      destroyOnClose={destroyOnClose}
      visible={visible}
      position="bottom"
    >
      <div className="modal-header">
        <div className="title">{title}</div>
        <div className="flex items-center">
          {titleRightExtra}
          <div className="cancel" onClick={() => onVisibleChange?.(false)}>
            {cancelText || <Icon name="close" className="text-xl" hasTheme />}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </OnlyOnePopup>
  )
}

export default TradeBottomModal
