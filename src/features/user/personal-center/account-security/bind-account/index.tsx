import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { useState, useRef } from 'react'
import NavBar from '@/components/navbar'
import { useUserStore } from '@/store/user'
import { initializeApp } from 'firebase/app'
import { useLayoutStore } from '@/store/layout'
import { Button, NoticeBar, Cell, Toast } from '@nbit/vant'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import UserPopUp from '@/features/user/components/popup'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import UserPopupContent from '@/features/user/components/popup/content'
import { SignInWithEnum, UserSendValidateCodeBusinessTypeEnum, BindTypeEnum } from '@/constants/user'
import { postThirdBindBindRequest, postThirdBindBindRemoveRequest, getThirdPartyConfig } from '@/apis/user'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { useMount } from 'ahooks'
import styles from './index.module.css'

let googleProvider
let appleProvider
let auth
export default function BindAccount() {
  const [workOrderPopUp, setWorkOrderPopUp] = useState<boolean>(false)
  const [isShowVerification, setIsShowVerification] = useState<boolean>(false)
  const [appleLoad, setAppleLoad] = useState<boolean>(false)
  const [googleLoad, setGoogleLoad] = useState<boolean>(false)

  const isBind = useRef<boolean>(false)
  const currentBindType = useRef<BindTypeEnum>(BindTypeEnum.google)

  const { headerData } = useLayoutStore()
  const { userInfo, clearUserCacheData } = useUserStore()

  const getConfigInfo = async () => {
    const res = await getThirdPartyConfig({})
    if (res.isOk) {
      initializeApp(res.data!)
      googleProvider = new GoogleAuthProvider()
      appleProvider = new OAuthProvider('apple.com')

      auth = getAuth()
    }
  }

  const handleClearData = async (url: string) => {
    clearUserCacheData()
    link(url)
  }

  const handleBindChange = async (token: string) => {
    const params = {
      token,
      type: currentBindType.current,
    }
    const bindType = currentBindType.current === BindTypeEnum.google
    bindType ? setGoogleLoad(true) : setAppleLoad(true)
    if (isBind.current) {
      const { data, isOk } = await postThirdBindBindRequest(params)
      if (isOk && data) {
        fetchAndUpdateUserInfo()
        link('/home-page')
        Toast.success(t`user.field.reuse_37`)
      } else {
        link('/personal-center/account-security')
      }
    } else {
      const { data, isOk } = await postThirdBindBindRemoveRequest(params)
      if (isOk && data) {
        Toast.success(t`features_c2c_payments_payment_details_index_qkq1q4-eqwowa3chppay5`)
        handleClearData('/home-page')
      } else {
        link('/personal-center/account-security')
      }
    }
    setAppleLoad(false)
    setGoogleLoad(false)
  }

  const handleGoogleLogin = async () => {
    /** google 登录弹窗 */
    signInWithPopup(auth, googleProvider)
      .then(async result => {
        const user = result.user as any
        const token = user.accessToken
        token && handleBindChange(token)
      })
      .catch(error => {
        setGoogleLoad(false)
        const credential = OAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }

  const handleAppleLogin = async () => {
    appleProvider.addScope('email')
    appleProvider.addScope('name')
    /** apple 登录弹窗 */
    signInWithPopup(auth, appleProvider)
      .then(result => {
        const user = result.user as any
        const token = user.accessToken
        token && handleBindChange(token)
      })
      .catch(error => {
        setAppleLoad(false)
        const credential = OAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }

  /** 绑定处理 */
  const onBindChange = (type: BindTypeEnum) => {
    isBind.current = true
    currentBindType.current = type
    setIsShowVerification(true)
  }

  /** 解绑处理 */
  const onRemoveBindChange = (type: BindTypeEnum) => {
    isBind.current = false
    setWorkOrderPopUp(true)
    currentBindType.current = type
  }

  const onUnBindChange = () => {
    setWorkOrderPopUp(false)
    setIsShowVerification(true)
  }

  const onThirdPartyChange = () => {
    const bindType = currentBindType.current === BindTypeEnum.google
    bindType ? handleGoogleLogin() : handleAppleLogin()
  }

  useMount(() => {
    getConfigInfo()
  })
  return (
    <>
      <NavBar title={t`features_user_personal_center_account_security_bind_account_index_yixzhpyugo`} />
      <div className={styles['bind-account-wrap']}>
        <NoticeBar wrapable scrollable={false} className="bind-account-notice-bar">
          <Icon name={'msg'} className="bind-account-icon" />
          <label>
            {t({
              id: 'features_user_personal_center_account_security_bind_account_index_hq80w5pf05',
              values: { 0: headerData?.businessName },
            })}
          </label>
        </NoticeBar>
        <Cell
          title={t`features_user_personal_center_account_security_bind_account_index_mmkhmtl6w8`}
          icon={<Icon name="login_icon_apple" hasTheme />}
          label={
            userInfo?.thirdAppleBind
              ? t`features_user_personal_center_account_security_bind_account_index_hggmc8qvza`
              : t`user.security_item_03`
          }
          rightIcon={
            <div className="bind-account-button">
              {userInfo?.thirdAppleBind ? (
                <Button onClick={() => onRemoveBindChange(BindTypeEnum.apple)} loading={appleLoad}>
                  {t`features_user_personal_center_account_security_bind_account_index_xr1yb_cpb5`}
                </Button>
              ) : (
                <Button type={'primary'} onClick={() => onBindChange(BindTypeEnum.apple)} loading={appleLoad}>
                  {t`features_user_personal_center_account_security_bind_account_index_72in7wv6rt`}
                </Button>
              )}
            </div>
          }
        />
        <Cell
          title={t`features_user_personal_center_account_security_bind_account_index_lhjwpmymzz`}
          icon={<Icon name="login_icon_google" />}
          label={
            userInfo?.thirdGoogleBind
              ? t`features_user_personal_center_account_security_bind_account_index_hggmc8qvza`
              : t`user.security_item_03`
          }
          rightIcon={
            <div className="bind-account-button">
              {userInfo?.thirdGoogleBind ? (
                <Button onClick={() => onRemoveBindChange(BindTypeEnum.google)} loading={googleLoad}>
                  {t`features_user_personal_center_account_security_bind_account_index_xr1yb_cpb5`}
                </Button>
              ) : (
                <Button type={'primary'} onClick={() => onBindChange(BindTypeEnum.google)} loading={googleLoad}>
                  {t`features_user_personal_center_account_security_bind_account_index_72in7wv6rt`}
                </Button>
              )}
            </div>
          }
        />
      </div>

      <UserPopUp
        visible={workOrderPopUp}
        onClose={() => setWorkOrderPopUp(false)}
        slotContent={
          <UserPopupContent
            rightButtonText={t`features_trade_common_notification_index_5101066`}
            onClose={setWorkOrderPopUp}
            onContinue={() => onUnBindChange()}
            className={styles['bind-account-popup']}
            icon={<LazyImage src={`${oss_svg_image_domain_address}tips.png`} />}
            content={
              <p className="bind-account-popup-content">{t`features_user_personal_center_account_security_bind_account_index_bsvmaqe1pb`}</p>
            }
          />
        }
      />

      <UniversalSecurityVerification
        isShow={isShowVerification}
        onSuccess={(isSuccess: boolean) => {
          isSuccess && onThirdPartyChange()
        }}
        onClose={() => {
          setIsShowVerification(false)
        }}
        businessType={UserSendValidateCodeBusinessTypeEnum.apiManage}
      />
    </>
  )
}
