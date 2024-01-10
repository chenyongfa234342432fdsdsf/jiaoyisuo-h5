import { useEffect } from 'react'
import { Button, Toast } from '@nbit/vant'
import Link from '@/components/link'
import ThirdParty from '@/features/user/common/third-party'
import { t } from '@lingui/macro'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import SignInWith from '@/features/user/login/component/sign-in-with'
import { UserRegisterTypeEnum, UserEnabledStateTypeEnum } from '@/constants/user'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'

export default function UserRegister() {
  const { headerData, columnsDataByCd } = useLayoutStore()

  const {
    setUserTransitionDatas,
    getMerchantTrialQualification,
    setTrialAccountInfo,
    hasMerchantTrialQualification,
    isLogin,
  } = useUserStore()
  const pageContext = usePageContext()
  const { invitationCode } = pageContext.urlParsed.search
  const hasInvitationCode = invitationCode ? `?invitationCode=${invitationCode}` : ''

  const handleTrialPlay = () => {
    setTrialAccountInfo()
  }

  useEffect(() => {
    !isLogin && getMerchantTrialQualification()
  }, [isLogin])

  const handleNextStep = async () => {
    await setUserTransitionDatas({
      thirdPartyAccountType: 0,
      thirdPartyAccount: '',
      registerType: UserRegisterTypeEnum.default,
    })
    // link(`/register/residence${hasInvitationCode}`)
    link(`/register/flow${hasInvitationCode}`)
  }

  // const handleThirdPartyOnSuccess = async (thirdPartyAccountType: string, thirdPartyAccount) => {
  //   if (!thirdPartyAccount.account) {
  //     Toast.info(t`features_user_register_index_5101258`)
  //     return
  //   }
  //   await setUserTransitionDatas({
  //     thirdPartyAccountType,
  //     thirdPartyAccount: thirdPartyAccount?.account,
  //     registerType: UserRegisterTypeEnum.thirdParty,
  //   })
  //   link(`/register/residence${hasInvitationCode}`)
  // }
  return (
    <section className={`register ${styles.scoped}`}>
      <NavBar
        title=""
        right={<Icon name="close" hasTheme className="close-icon" />}
        onClickRight={() => link('/home-page')}
      />

      {/* <div className="background-gradient"></div> */}

      <div className="register-wrap">
        <div className="logo">
          <LazyImage whetherManyBusiness src={`${oss_svg_image_domain_address}image_login_illustration.png`} />
        </div>
        <div className="title">
          <label>
            {t({
              id: 'features_user_register_index_5101295',
              values: { 0: headerData?.businessName },
            })}
          </label>
        </div>
        <div className="register-btn">
          <Button type="primary" size="large" onClick={handleNextStep}>
            {t`features_user_register_index_covobb8muc`}
          </Button>
        </div>

        <SignInWith />

        <div className="login">
          <div className="register-tips">
            <label>{t`user.field.reuse_06`}</label>
            <Link href="/login" prefetch className="customize-link-style">
              {t`user.field.reuse_07`}
            </Link>
          </div>

          {hasMerchantTrialQualification && (
            <div className="trial-play">
              <label>{t`features_user_register_index_il9pgj1gld`}</label>
              <span
                className="customize-link-style"
                onClick={handleTrialPlay}
              >{t`features_user_register_index_wvdg2uy5cw`}</span>
            </div>
          )}
        </div>

        <div className="tips">
          <label>
            {t`user.register_03`}
            <Link
              href={
                columnsDataByCd?.terms_service?.isLink === UserEnabledStateTypeEnum.enable
                  ? columnsDataByCd?.terms_service?.appUrl
                  : columnsDataByCd?.terms_service?.webUrl
              }
              prefetch
              className="customize-link-style"
            >
              {t`user.register_04`}
            </Link>
            {t`user.register_05`}
            <Link
              href={
                columnsDataByCd?.terms_service?.isLink === UserEnabledStateTypeEnum.enable
                  ? columnsDataByCd?.privacy_policy?.appUrl
                  : columnsDataByCd?.privacy_policy?.webUrl
              }
              prefetch
              className="customize-link-style"
            >
              {t`user.register_06`}
            </Link>
          </label>
        </div>
      </div>
    </section>
  )
}
