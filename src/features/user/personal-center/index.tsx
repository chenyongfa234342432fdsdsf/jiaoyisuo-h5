import { useEffect, useState } from 'react'
import { Cell, Toast, Dialog } from '@nbit/vant'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import NavBar from '@/components/navbar'
import { ThemeEnum, ThemeBackGroundColor, ThemeColorEnum } from '@/constants/base'
import { getIsLogin } from '@/helper/auth'
import { getMemberUserInfo } from '@/apis/user'
import { useCopyToClipboard } from 'react-use'
import { useUserStore } from '@/store/user'
import { useCommonStore } from '@/store/common'
import { UserInfoType } from '@/typings/api/user'
import { UserEnabledStateTypeEnum, UserKycTypeEnum } from '@/constants/user'
import { UpdateMetaThemeColor } from '@/features/user/utils/common'
import Icon from '@/components/icon'
import { getAgentCenterPageRoutePath } from '@/helper/route/agent'
import styles from './index.module.css'
import UserAvatar from './components/user-avatar'

export default function UserPersonalCenter() {
  const [showKycTip, setShowKycTip] = useState<boolean>(false)
  const UserKycLabelMap = {
    [UserKycTypeEnum.notCertified]: t`user.personal_center_03`,
    [UserKycTypeEnum.standardCertification]: t`features_user_personal_center_index_5101255`,
    [UserKycTypeEnum.advancedCertification]: t`features_user_personal_center_index_5101256`,
    [UserKycTypeEnum.enterpriseCertification]: t`features_kyc_index_5101112`,
  }

  const commonStore = useCommonStore()
  const useStore = useUserStore()
  const userInfo = useStore.userInfo

  const [state, copyToClipboard] = useCopyToClipboard()

  const isLogin = getIsLogin()

  const getUserInfo = async () => {
    const res = await getMemberUserInfo({})
    if (res.isOk) {
      useStore.setUserInfo(res.data as UserInfoType)
    }
  }

  useEffect(() => {
    if (isLogin) {
      getUserInfo()
    }
  }, [])

  useEffect(() => {
    if (userInfo?.kycType === UserKycTypeEnum.notCertified) {
      setShowKycTip(true)
    }
  }, [userInfo?.kycType])

  const handleCopy = () => {
    copyToClipboard(userInfo?.uid as string)
    state.error
      ? Toast({ message: t`user.secret_key_02`, position: 'top' })
      : Toast({ message: t`user.secret_key_01`, position: 'top' })
  }

  const updateTheme = () => {
    let themeSetting: ThemeEnum
    commonStore.theme === ThemeEnum.light ? (themeSetting = ThemeEnum.dark) : (themeSetting = ThemeEnum.light)
    UpdateMetaThemeColor(ThemeBackGroundColor[themeSetting])
    commonStore.setTheme(themeSetting)
  }

  const handleUnLoginStatus = (url: string, isCheck: boolean) => {
    if (isCheck) {
      isLogin ? link(url) : Toast.info(t`features_user_personal_center_index_510102`)
      return
    }

    link(url)
  }

  const onClickVip = () => {
    if (userInfo?.vipKycLimit) {
      if (userInfo?.kycType === UserKycTypeEnum.notCertified) {
        Dialog.alert({
          title: t`features_user_personal_center_index__ysjx_22a2`,
          className: 'dialog-confirm-wrapper confirm-black cancel-bg-gray',
          message: t`features_user_personal_center_index_pub13qpxf_`,
          confirmButtonText: t`features_user_personal_center_index_jtbsdoyozp`,
          cancelButtonText: t`features_user_personal_center_index__sgh0dhw3u`,
          showCancelButton: true,
          onConfirm: () => {
            link('/kyc')
          },
        })
      } else {
        handleUnLoginStatus('/vip/vip-center', true)
      }
    } else {
      handleUnLoginStatus('/vip/vip-center', true)
    }
  }

  return (
    <div className={`personal-center ${styles.scoped}`}>
      <NavBar
        onClickLeft={() => link('/home-page')}
        title=""
        right={
          <div className="navbar">
            <div className="navbar-right">
              {commonStore.themeColor !== ThemeColorEnum.blue && (
                <div className="theme" onClick={updateTheme}>
                  <Icon name="btn_theme" hasTheme />
                </div>
              )}
              <div className="customer-service">
                <Icon name="nav_service" hasTheme />
              </div>
            </div>
          </div>
        }
      />

      <div className="personal-center-wrap">
        <div className="info">
          {isLogin ? (
            <div className="info-wrap">
              <div className="icon">
                <UserAvatar className="avatar" />
              </div>

              <div className="name">
                <div className="text">
                  {userInfo?.setNicknameInd === UserEnabledStateTypeEnum.enable ? (
                    <label className="name-label">{userInfo.nickName}</label>
                  ) : (
                    <label className="name-label">{t`user.personal_center_01`}</label>
                  )}
                  {!commonStore?.isFusionMode && (
                    <div className="status" onClick={() => link('/kyc')}>
                      <div className="flex items-center">
                        {userInfo?.kycType === UserKycTypeEnum.notCertified && (
                          <div className="kyc-tag none">
                            <Icon className="kyc-icon" name="icon_personalcenter_unverified" />
                            <label>{t`user.personal_center_03`}</label>
                          </div>
                        )}
                        {userInfo?.kycType === UserKycTypeEnum.standardCertification && (
                          <div className="kyc-tag normal">
                            <Icon className="kyc-icon" name="icon_personalcenter_authenticated" />
                            <label>{t`features_user_personal_center_index_5101255`}</label>
                          </div>
                        )}
                        {userInfo?.kycType === UserKycTypeEnum.advancedCertification && (
                          <div className="kyc-tag normal">
                            <Icon className="kyc-icon" name="icon_personalcenter_authenticated" />
                            <label>{t`features_user_personal_center_index_5101256`}</label>
                          </div>
                        )}
                        {userInfo?.kycType === UserKycTypeEnum.enterpriseCertification && (
                          <div className="kyc-tag enter">
                            <Icon className="kyc-icon" name="icon_personalcenter_enterprise" />
                            <label>{t`features_kyc_index_5101112`}</label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="number">
                  <label>
                    UID: {userInfo?.uid}{' '}
                    <Icon name="property_icon_copy" onClick={handleCopy} className="text-icon_color_01" />
                  </label>
                </div>
              </div>

              <span className="next-arrow">
                <Icon name="next_arrow" hasTheme onClick={() => link('/personal-center/info')} />
              </span>
            </div>
          ) : (
            <div className="login-wrap">
              <div className="login" onClick={() => link('/login')}>
                <label>{t`user.personal_center_04`}</label>
              </div>
              <div className="text">
                <label>Slogan</label>
              </div>
            </div>
          )}
        </div>
        {showKycTip && isLogin && (
          <div className="popup">
            <div className="left">
              <div className="row1">
                <Icon name="msg" className="msg-icon" />
                {t`features_user_personal_center_index_mpglcef4fe`}
              </div>
              <div className="row2">{t`features_user_personal_center_index_pkguumvmvf`}</div>
            </div>
            <div className="btn" onClick={() => link('/kyc')}>
              <span>{t`features_assets_withdraw_operate_index_qbugklenkj`}</span>
            </div>

            <Icon
              name="property_icon_close"
              onClick={() => {
                setShowKycTip(false)
              }}
              className="close-icon text-icon_color_01"
            />
          </div>
        )}

        <div className="invitation-and-help">
          <div className="item">
            <div className="item-wrap" onClick={() => link('/agent')}>
              <div className="icon">
                <Icon name="user_icon_invite_commission" hasTheme className="icon-wrap" />
              </div>
              <div className="text">
                <label>{t`user.personal_center_05`}</label>
              </div>
            </div>
          </div>

          <div className="item">
            <div className="item-wrap" onClick={() => handleUnLoginStatus('/personal-center/account-security', true)}>
              <div className="icon">
                <Icon name="user_icon_safety" hasTheme className="icon-wrap" />
              </div>
              <div className="text">
                <label>{t`user.personal_center_09`}</label>
              </div>
            </div>
          </div>

          {/* <div className="item">
            <div className="item-wrap" onClick={() => handleUnLoginStatus('/', true)}>  // todo 到合约带单
              <div className="icon">
                <Icon name="icon_user_homepage" hasTheme className="icon-wrap" />
              </div>
              <div className="text">
                <label>{`个人主页`}</label>
              </div>
            </div>
          </div> */}

          <div className="item">
            <div className="item-wrap" onClick={() => handleUnLoginStatus('/support', false)}>
              <div className="icon">
                <Icon name="user_icon_help" hasTheme className="icon-wrap" />
              </div>
              <div className="text">
                <label>{t`user.personal_center_06`}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="cell-item-wrap">
          <div className="cell-item">
            <Cell
              title={t`modules_agent_agent_apply_index_page_jaworf6qns`}
              isLink
              icon={<Icon name="icon_user_acting" hasTheme />}
              onClick={() => handleUnLoginStatus(getAgentCenterPageRoutePath(), false)}
            />

            {isLogin && userInfo?.showVipMenu ? (
              <Cell
                title={t`features_user_personal_center_index_xmipdketh9`}
                value={t({ id: 'features_user_personal_center_index_mdylzlu_8m', values: { 0: userInfo?.levelCode } })}
                isLink
                icon={<Icon name="icon_user_vip" hasTheme />}
                onClick={onClickVip}
              />
            ) : null}

            <Cell
              title={t`features_welfare_center_index_bi_wfzlnl6`}
              isLink
              icon={<Icon name="icon_personalpublic_weal" hasTheme />}
              onClick={() => handleUnLoginStatus('/welfare-center', false)}
            />

            <div className="divider"></div>

            {/* <Cell
              title={t`user.personal_center_07`}
              isLink
              icon={<Icon name="user_icon_activity" hasTheme />}
              onClick={() => handleUnLoginStatus('/stay-tuned', false)}
            /> */}

            {/* <Cell
              title={t`user.personal_center_08`}
              isLink
              icon={<Icon name="user_down_address" hasTheme />}
              onClick={() => handleUnLoginStatus('/assets/withdraw/address', true)}
            /> */}

            <Cell
              title={t`features_kyc_index_5101113`}
              isLink
              icon={<Icon name="icon_user_kyc" hasTheme />}
              onClick={() => link('/kyc')}
              value={UserKycLabelMap[userInfo?.kycType]}
            />

            <Cell
              title={t`user.field.reuse_08`}
              isLink
              icon={<Icon name="user_icon_set" hasTheme />}
              onClick={() => link('/personal-center/settings')}
            />

            <div className="divider"></div>

            <Cell
              title={t`user.personal_center_10`}
              isLink
              icon={<Icon name="user_icon_network" hasTheme />}
              onClick={() => link('/personal-center/network-check')}
            />

            {/* <Cell
              title={t`user.personal_center_11`}
              isLink
              icon={<Icon name="share" hasTheme />}
              onClick={() => Toast.info(t`features_user_personal_center_index_510103`)}
            /> */}

            <Cell
              title={t`user.field.reuse_29`}
              isLink
              icon={<Icon name="property_icon_tips" hasTheme />}
              onClick={() => link('/personal-center/about-us')}
            >
              {/* <>
                <div className="version">
                  <div className="punctuation-wrap">
                    <span className="punctuation"></span>
                  </div>
                  <span>
                    {t`user.personal_center_12`} {userInfo?.version}
                  </span>
                </div>
              </> */}
            </Cell>
          </div>
        </div>
      </div>
    </div>
  )
}
