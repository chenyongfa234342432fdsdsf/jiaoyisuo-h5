import classNames from 'classnames'
import styles from './index.module.css'
import Icon from '../icon'

export type IPopupHeaderProps = {
  title?: string
  className?: string
  onClose?: () => void
}

function PopupHeader({ title, className, onClose }: IPopupHeaderProps) {
  return (
    <div className={classNames(styles['popup-header-wrapper'], className)}>
      <div className="title">{title}</div>
      <Icon onClick={onClose} name="close" hasTheme className="icon" />
    </div>
  )
}

export default PopupHeader
