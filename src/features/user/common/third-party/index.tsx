import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Button, Divider } from '@nbit/vant'
// TODO: 需要外部化处理 firebase
import { initializeApp } from 'firebase/app'
import { getThirdPartyConfig } from '@/apis/user'
import { UserVerifyTypeEnum, SignInWithEnum } from '@/constants/user'
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { useMount } from 'ahooks'
import styles from './index.module.css'

let googleProvider
let appleProvider
let auth
function ThirdParty({ onSuccess }) {
  const getConfigInfo = async () => {
    const res = await getThirdPartyConfig({})
    if (res.isOk) {
      initializeApp(res.data!)
      googleProvider = new GoogleAuthProvider()
      appleProvider = new OAuthProvider('apple.com')

      auth = getAuth()
    }
  }

  const handleGoogleLogin = async () => {
    /** google 登录弹窗 */
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user as any
        const type = user.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone
        const params = {
          loginType: SignInWithEnum.google,
          accessToken: user.accessToken,
          account: user.email || user.phoneNumber,
        }
        onSuccess && onSuccess(type, params)
      })
      .catch(error => {
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }

  const handleAppleLogin = async () => {
    appleProvider.addScope('email')
    appleProvider.addScope('name')
    /** apple 登录弹窗 */
    signInWithPopup(auth, appleProvider)
      .then(result => {
        const user = result?.user as any
        const type = user.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone
        const params = {
          loginType: SignInWithEnum.apple,
          accessToken: user?.accessToken,
          account: user.email || user.phoneNumber,
        }
        onSuccess && onSuccess(type, params)
      })
      .catch(error => {
        const credential = OAuthProvider.credentialFromError(error)
        console.error(credential)
      })
  }
  useMount(() => {
    getConfigInfo()
  })
  return (
    <div className={styles.scoped}>
      <Divider>{t`user.third_party_01`}</Divider>

      <div className="third-party">
        <Button size="large" type="default" icon={<Icon name="login_icon_apple" hasTheme />} onClick={handleAppleLogin}>
          {t`user.third_party_02`}
        </Button>

        <Button size="large" type="default" icon={<Icon name="login_icon_google" />} onClick={handleGoogleLogin}>
          {t`user.third_party_03`}
        </Button>
      </div>
    </div>
  )
}

export default ThirdParty
