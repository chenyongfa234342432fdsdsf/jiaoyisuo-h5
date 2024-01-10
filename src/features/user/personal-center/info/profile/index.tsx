import { Toast, Input, Button } from '@nbit/vant'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { postV1MemberBaseExtendInfoApiRequest } from '@/apis/vip'
import { useUserStore } from '@/store/user'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import styles from './index.module.css'

export default function Profile() {
  const useStore = useUserStore()
  const { userInfo, setUserInfo } = useStore

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(userInfo?.introduction || '')

  const onSubmit = async () => {
    setLoading(true)
    const res = await postV1MemberBaseExtendInfoApiRequest({ introduction: content })
    setLoading(false)
    if (res.isOk) {
      setUserInfo({ introduction: content })
      Toast.info(t`user.field.reuse_34`)
      window.history.back()
    }
  }

  return (
    <section className={styles['profile-homepage']}>
      <FullScreenLoading isShow={loading} className="h-screen" mask />

      <NavBar title={t`features_user_personal_center_info_profile_index_tp2l1izjbl`} />

      <div className="content">
        <div className="form-wrap">
          <Input.TextArea maxLength={300} showWordLimit value={content} onChange={val => setContent(val)} />
          <div className="desc-list">
            <div className="desc">
              <Icon name="prompt-symbol" className="add-icon" />
              {t`features_user_personal_center_info_profile_index_lknyclb3im`}
            </div>
            <div className="desc">
              <Icon name="prompt-symbol" className="add-icon" />
              {t`features_user_personal_center_info_profile_index_mb890fn31q`}
            </div>
          </div>
        </div>

        <div className="btn-wrap">
          <Button
            block
            type="primary"
            nativeType="submit"
            disabled={!content || content === userInfo?.introduction}
            onClick={onSubmit}
          >{t`user.field.reuse_17`}</Button>
        </div>
      </div>
    </section>
  )
}
