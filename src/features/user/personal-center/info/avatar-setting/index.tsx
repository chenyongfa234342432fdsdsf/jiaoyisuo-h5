import { Button, Toast } from '@nbit/vant'
import NavBar from '@/components/navbar'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import Cropper from 'react-easy-crop'
import { postUpload } from '@/apis/kyc'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { postV1MemberBaseExtendInfoApiRequest } from '@/apis/vip'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import styles from './index.module.css'
import { blobToBase64, getCroppedImg } from './utils'

export default function AvatarSetting() {
  const { avatar_url } = usePersonalCenterStore()

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (avatar_url === '') history.back()
  }, [avatar_url])

  const onSubmit = async () => {
    try {
      setUploading(true)
      const croppedBlob = await getCroppedImg(avatar_url, croppedAreaPixels)
      const image = await blobToBase64(croppedBlob)
      const img = await postUpload({ image })
      const res = await postV1MemberBaseExtendInfoApiRequest({ avatarPath: img?.data?.url })

      setUploading(false)
      if (res.code === 3402 || res.isOk) {
        Toast.info({ message: t`features_user_personal_center_info_avatar_setting_index_c7xunpxo13` })
        fetchAndUpdateUserInfo()
        setTimeout(() => {
          history.back()
        }, 300)
      }
    } catch (e) {
      setUploading(false)
      console.error(e)
    }
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  return (
    <section className={styles['avatar-setting']}>
      <FullScreenLoading isShow={uploading} className="h-screen" mask />

      <NavBar title="" />

      <div className="content">
        <div className="avatar-wrap">
          <Cropper
            image={avatar_url}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            showGrid={false}
            cropSize={{ width: 290, height: 290 }}
          />
        </div>

        <div className="bm-wrap">
          <div className="tip">{t`features_user_personal_center_info_avatar_setting_index_lu5r0imsx8`}</div>
          <div className="btn-wrap">
            <Button block onClick={() => history.back()}>{t`assets.financial-record.cancel`}</Button>
            <Button block type="primary" onClick={onSubmit}>
              {t`features_user_personal_center_info_avatar_setting_index_frrxddflvn`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
