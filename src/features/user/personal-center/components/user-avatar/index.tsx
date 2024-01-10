import LazyImage from '@/components/lazy-image'
import { ThemeEnum } from '@/constants/base'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useCommonStore } from '@/store/common'
import { useUserStore } from '@/store/user'
import { baseVipCenterStore } from '@/store/vip'
import { useMemo } from 'react'
import styles from './index.module.css'

export default function UserAvatar(props: { src?: string; className?: string; withoutBorder?: boolean }) {
  const commonStore = useCommonStore()
  const useStore = useUserStore()
  const { vipBaseInfo } = baseVipCenterStore.getState()
  const { userInfo } = useStore

  const isLight = useMemo(() => {
    return commonStore.theme === ThemeEnum.light
  }, [commonStore.theme])

  return props?.withoutBorder ? (
    <LazyImage
      src={
        props.src ||
        userInfo?.avatarPath ||
        `${oss_svg_image_domain_address}${isLight ? 'user_default_avatar_white.png' : 'user_default_avatar_dark.png'}`
      }
      className={props.className}
    />
  ) : (
    <div className={styles.scoped}>
      <LazyImage
        src={
          props.src ||
          userInfo?.avatarPath ||
          `${oss_svg_image_domain_address}${isLight ? 'user_default_avatar_white.png' : 'user_default_avatar_dark.png'}`
        }
        className={props.className}
      />
      <LazyImage src={vipBaseInfo?.avatarIcon} className="vip-border" />
    </div>
  )
}
