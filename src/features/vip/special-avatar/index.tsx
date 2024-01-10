import NavBar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { Button, Toast } from '@nbit/vant'
import classNames from 'classnames'
import { ThemeEnum } from '@/constants/base'
import { useCommonStore } from '@/store/common'
import { postV1MemberVipBaseDressAvatarApiRequest } from '@/apis/vip'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { YapiGetV1MemberVipBaseAvatarListData } from '@/typings/yapi/MemberVipBaseAvatarListV1GetApi'
import { useVipCenterStore } from '@/store/vip'
import UserAvatar from '@/features/user/personal-center/components/user-avatar'
import styles from './index.module.css'

export default function SpecialAvatar() {
  const { getVipAvatarList, vipAvatarList } = useVipCenterStore()

  const commonState = useCommonStore()
  const { theme } = commonState

  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState<number | undefined>()
  const [selected, setSelected] = useState<YapiGetV1MemberVipBaseAvatarListData>()

  useEffect(() => {
    getVipAvatarList()
  }, [getVipAvatarList])

  useEffect(() => {
    if (vipAvatarList && vipAvatarList.length > 0) {
      const item = vipAvatarList.find(i => i.dressing === true)
      if (item && item.levelCode) setSelected(item)
    }
  }, [vipAvatarList])

  const onSelect = idx => {
    if (idx !== index) {
      setIndex(idx)
    } else {
      setIndex(undefined)
    }
  }

  const submit = async () => {
    if (typeof index === 'number' && vipAvatarList[index]?.allowDress) {
      setLoading(true)
      const res = await postV1MemberVipBaseDressAvatarApiRequest({
        dressLevelCode: vipAvatarList[index]?.levelCode === selected?.levelCode ? '' : vipAvatarList[index]?.levelCode,
      })
      setLoading(false)
      if (res.data) {
        Toast.info(t`user.field.reuse_34`)
        window.history.back()
      }
    }
  }

  return (
    <section className={styles['vip-special-avatar-page']}>
      <FullScreenLoading isShow={loading} className="h-screen" mask />
      <NavBar title={t`features_user_personal_center_vip_special_avatar_index_jvj7jftagh`} />
      <div className="wrap">
        <div className="avatar-wrap">
          <LazyImage
            src={`${oss_svg_image_domain_address}${
              ThemeEnum.dark === theme ? 'vip_avatar_bg_dark.png' : 'vip_avatar_bg.png'
            }`}
          />
          <UserAvatar className="avatar" withoutBorder />
          {typeof index === 'number' ? (
            <LazyImage src={vipAvatarList[index]?.vipIcon} className="avatar-decorate" />
          ) : selected?.vipIcon ? (
            <LazyImage src={selected?.vipIcon} className="avatar-decorate" />
          ) : null}
        </div>
        <div className="list-content">
          <div className="list-wrap">
            {vipAvatarList.map((item, idx) => (
              <div
                key={item.level}
                className={classNames('list-item-wrap', {
                  checked: idx === index,
                  dark: ThemeEnum.dark === theme,
                })}
                onClick={() => onSelect(idx)}
              >
                <LazyImage src={item.vipIcon} className="list-item-img" />
                <span>{item.levelCode}</span>
                {item.dressing ? (
                  <div className="checked-tag">{t`features_user_personal_center_vip_special_avatar_index_tg6wsnlu6e`}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="btn-wrap">
          <Button
            nativeType="submit"
            type="primary"
            block
            className={classNames('button', {
              'selected':
                typeof index === 'number' &&
                vipAvatarList[index]?.dressing &&
                vipAvatarList[index]?.level !== selected?.level,
              'over-level': typeof index === 'number' && vipAvatarList[index]?.allowDress === false,
            })}
            onClick={submit}
            disabled={index === undefined}
          >
            {typeof index === 'number' && vipAvatarList[index]?.dressing
              ? t`features_user_personal_center_vip_special_avatar_index_mkvfxkcsfd`
              : typeof index === 'number' && vipAvatarList[index]?.allowDress === false
              ? t({
                  id: 'features_user_personal_center_vip_special_avatar_index_if8u49ldkq',
                  values: { 0: vipAvatarList[index]?.levelCode },
                })
              : t`features_user_personal_center_vip_special_avatar_index__9r60zmdme`}
          </Button>
        </div>
      </div>
    </section>
  )
}
