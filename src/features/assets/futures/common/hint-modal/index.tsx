/**
 * 合约 - 提示文案展示弹窗组件
 */
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import { ReactNode } from 'react'
import LazyImage, { Type } from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

export interface HintModalProps {
  visible?: boolean
  showIcon?: boolean
  title?: string
  content: string | ReactNode
  cancelText?: string
  commitText?: string
  onClose?: () => void
  onCommit: () => void
}

function HintModal(props: HintModalProps) {
  const {
    visible,
    showIcon,
    title,
    content,
    cancelText,
    commitText = t`features_trade_common_notification_index_5101066`,
    onClose,
    onCommit,
  } = props || {}

  return (
    <Popup
      visible={visible}
      closeOnPopstate
      safeAreaInsetBottom
      round
      className={styles['hint-modal-root']}
      onClose={onClose || onCommit}
    >
      <div className="hint-modal-wrapper">
        {showIcon && (
          <LazyImage
            src={`${oss_svg_image_domain_address}assets/icon_futures_tips`}
            imageType={Type.png}
            className="modal-icon"
          />
        )}
        {title && <span className="modal-title">{title}</span>}

        <div className="modal-content">{content}</div>

        <div className="modal-bottom">
          {cancelText && (
            <Button plain className="modal-btn modal-cancel-btn" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button type="primary" className={`modal-btn ${!cancelText && 'w-full'}`} onClick={onCommit}>
            {commitText}
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export { HintModal }
