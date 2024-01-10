import { ReactNode } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Cell } from '@nbit/vant'
// import LazyImage from '@/components/lazy-image'
// import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

interface UserSecurityItemProps {
  /** 图标 */
  icon: ReactNode
  /** 验证文字 */
  text: string
  /** 是否绑定 */
  bind: boolean
  /** 未绑定文字 */
  unBindText?: string
  /** 是否启用 */
  enable: boolean
  /** 跳转路由 */
  onLink: () => void
}

interface UserSecurityItemTagProps {
  /** 类名 */
  styleName: string
  // /** 文本 */
  // text: string
  /** 是否绑定或启动 */
  isEnable: boolean
  /** 禁用还是未启用，true 未启用 */
  isBind?: boolean
}

function UserSecurityItemTag({ styleName, isEnable, isBind }: UserSecurityItemTagProps) {
  return (
    <>
      <div className={styleName}>
        <div className="icon">
          {isEnable ? (
            <Icon name="login_password_satisfy" className="satisfy-icon" />
          ) : isBind ? (
            <Icon name="msg" className="tag-icon" />
          ) : (
            <Icon name="del_input-box" hasTheme className="tag-icon" />
          )}
        </div>
        {/* <div className="text">
          <label>{text}</label>
        </div> */}
      </div>
    </>
  )
}

function UserSecurityItem({ icon, text, bind, unBindText, enable, onLink }: UserSecurityItemProps) {
  return (
    <Cell
      title={<div className="text">{text}</div>}
      icon={<div className="icon">{icon}</div>}
      rightIcon={<Icon name="next_arrow" hasTheme />}
      value={
        <div className="tag">
          {enable ? (
            <UserSecurityItemTag styleName="on" isEnable />
          ) : (
            <UserSecurityItemTag styleName="off" isBind={bind} isEnable={false} />
          )}
        </div>
      }
      onClick={onLink}
      className={styles['user-security-item']}
    />
  )
}

export default UserSecurityItem
