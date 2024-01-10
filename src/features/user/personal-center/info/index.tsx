import { Toast, Cell, ActionSheet, Uploader, UploaderValueItem } from '@nbit/vant'
import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import { useUserStore } from '@/store/user'
import { useCopyToClipboard } from 'react-use'
import { UserEnabledStateTypeEnum } from '@/constants/user'
import { useState } from 'react'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import styles from './index.module.css'
import { FILE_LIMIT_SIZE, TIMES_LIMIT } from './common'
import UserAvatar from '../components/user-avatar'

export default function MyInfo() {
  const useStore = useUserStore()
  const userInfo = useStore.userInfo
  const { setInitialAvatarUrl } = usePersonalCenterStore()

  const [visible, setVisible] = useState(false)
  const [state, copyToClipboard] = useCopyToClipboard()

  const onChangeNickname = () => {
    if (userInfo?.nickNameChangeTime >= TIMES_LIMIT) {
      Toast.info(t({ id: 'features_user_personal_center_info_index_zpaufqukfb', values: { 0: TIMES_LIMIT } }))
    } else {
      link('/personal-center/modify-username')
    }
  }

  const handleCopy = () => {
    copyToClipboard(userInfo?.uid as string)
    state.error ? Toast({ message: t`user.secret_key_02` }) : Toast({ message: t`user.secret_key_01` })
  }

  const handleUploader = async (list: Array<UploaderValueItem>) => {
    if (list.length > 0) {
      const imageList = list.slice(-1)[0]
      const file = imageList.file as File
      const url = imageList.url as string

      if (file.size > FILE_LIMIT_SIZE) {
        Toast.info(t`features_user_personal_center_info_index_j0tva8dczd`)
        return
      }

      let name = file.name.substring(file.name.lastIndexOf('.') + 1).toLocaleLowerCase()
      if (name !== 'png' && name !== 'jpg' && name !== 'jpeg' && name !== 'PNG' && name !== 'JPG' && name !== 'JPEG') {
        Toast.info(t`features_kyc_load_vip_index_5101359`)
        return
      }
      setVisible(false)
      setInitialAvatarUrl(url)
      link('/personal-center/info/avatar-setting')
    }
  }

  const onChangeAvatar = () => {
    if (userInfo?.avatarApprove) {
      setVisible(true)
    } else {
      Toast.info(t`features_user_personal_center_info_index_pvoztomzw6`)
    }
  }

  return (
    <section className={styles['info-homepage']}>
      <NavBar title={t`features_user_personal_center_info_index_x8exarcbsh`} />

      <div className="avatar-content">
        <div className="avatar-wrap" onClick={onChangeAvatar}>
          <UserAvatar className="avatar" />

          <div className="icon-wrap">
            <Icon
              name={userInfo?.avatarApprove ? 'icon_personal_amend' : 'icon_personal_time'}
              className="edit-icon text-icon_color_02"
            />
          </div>
        </div>
      </div>
      <div className="cell-list">
        <Cell
          title={t`features_user_personal_center_info_index_2qctxhdcpu`}
          value={
            <>
              {userInfo?.setNicknameInd === UserEnabledStateTypeEnum.enable ? (
                <>{userInfo?.nickName}</>
              ) : (
                <>{t`user.personal_center_01`}</>
              )}
            </>
          }
          isLink
          onClick={onChangeNickname}
        />
        <Cell
          className="overflow-cell"
          title={t`features/market/detail/current-coin-describe/index-6`}
          value={userInfo?.introduction}
          isLink
          onClick={() => link('/personal-center/info/profile')}
        />
        <Cell
          title={`UID`}
          value={
            <div onClick={handleCopy}>
              {userInfo?.uid} <Icon name="property_icon_copy" className="text-icon_color_01" />
            </div>
          }
        />
        <Cell title={t`features_user_personal_center_info_index_ocutxbcwbk`} value={userInfo?.levelCode} />

        {/* <Cell title={t`features_user_personal_center_info_index_gw_gccllud`} value={<Switch size={22} />} />
        <Cell title={t`features_user_personal_center_info_index_cu76te4of7`} value={<Switch size={22} />} /> */}
      </div>

      <ActionSheet
        visible={visible}
        onCancel={() => setVisible(false)}
        cancelText={t`assets.financial-record.cancel`}
        className={styles['info-homepage-as']}
      >
        <div className="upload-wrap">
          <Uploader
            onChange={handleUploader}
            accept=".jpg, .jpeg, .png"
            maxSize={10 * 1000 * 1024}
            previewImage={false}
          >
            <div>
              <Icon name="icon_avatar_upload" hasTheme className="icon_avatar_upload" />
              {t`features_user_personal_center_info_index_aqsibs03mj`}
            </div>
          </Uploader>
        </div>
      </ActionSheet>
    </section>
  )
}
