import { ReactNode } from 'react'
import { Switch } from '@nbit/vant'
import Link from '@/components/link'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

interface UserSecurityVerificationStatusProps {
  /** 中间展示图标 */
  icon?: ReactNode
  /** 邮箱/手机/谷歌秘钥 */
  text: string
  /** 路由文字 */
  href: string
  /** 插槽，插入 cell 组件 */
  slotCotent: ReactNode
  /** 是否绑定 */
  bind: boolean
  /** 未绑定文字 */
  unBinText?: string
  /** 是否启用 */
  enable: boolean
  /** 设置启用状态 */
  setEnable(enable: boolean): void
}

function UserSecurityVerificationStatus({
  icon,
  text,
  href,
  slotCotent,
  bind,
  unBinText,
  enable,
  setEnable,
}: UserSecurityVerificationStatusProps) {
  return (
    <div className={`security-verification-status ${styles.scoped}`}>
      <div className="security-verification-status-wrap">
        <div className="verify-info">
          <div className="icon">{icon}</div>
          {bind ? (
            <div className="text">
              <label>{text}</label>
            </div>
          ) : (
            <Link href={href} prefetch className="customize-link-style">
              {text || t`user.security_verification_status_02`}
              <Icon name="next_arrow" />
            </Link>
          )}
          <div className="tag">
            {enable ? (
              <label className="on">
                <LazyImage src={`${oss_svg_image_domain_address}verify_label_open.png`} className="on-image" />
                <span className="on-text">{t`user.security_verification_status_03`}</span>
              </label>
            ) : (
              <label className="off">
                <LazyImage src={`${oss_svg_image_domain_address}user_unverified.png`} className="off-image" />
                <span className="off-text">
                  {bind ? t`user.security_verification_status_04` : unBinText || t`user.security_item_03`}
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="status">
          <div className="status-wrap">
            <label>{t`user.security_verification_status_05`}</label>
            <Switch checked={enable} size="22px" onChange={v => setEnable(v)} />
          </div>
        </div>
        <div className="settins">{slotCotent}</div>
      </div>
    </div>
  )
}

export default UserSecurityVerificationStatus
