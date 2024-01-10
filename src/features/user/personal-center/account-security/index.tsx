import { useEffect, useState } from 'react'
import { useMount } from 'react-use'
import { Cell, Popup, Toast, Loading } from '@nbit/vant'
import UserSecurityItem from '@/features/user/common/security-item'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { UserEnabledStateTypeEnum } from '@/constants/user'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import styles from './index.module.css'

const hours = 60 * 60 * 1000 // 一小时

export default function UserPersonalCenterAccountSecurity() {
  const durationList = [
    {
      key: 1,
      value: 4,
      text: t`user.account_security_01`,
    },
    {
      key: 2,
      value: 12,
      text: t`user.account_security_02`,
    },
    {
      key: 3,
      value: 24,
      text: t`user.account_security_03`,
    },
    {
      key: 4,
      value: 7 * 24,
      text: t`user.account_security_04`,
    },
  ]
  const [visible, setVisible] = useState<boolean>(false)
  const [duration, setDuration] = useState<string>('')
  const [loading, setloading] = useState<boolean>(true)
  const [manageAccountVisible, setManageAccountVisible] = useState<boolean>(false)

  const store = useUserStore()
  const { getBaseInfo, baseInfoResult, turnOnVerification } = usePersonalCenterStore()

  const info = store.personalCenterSettings

  useMount(() => {
    getBaseInfo()
  })

  useMount(() => {
    const values = durationList.find(v => v.value === (info.tokenTtl as number) / hours)
    setDuration(values?.text || t`user.account_security_02`)
  })

  useEffect(() => {
    if (baseInfoResult.uid) {
      setTimeout(() => {
        setloading(false)
      }, 1000)
    }
  }, [baseInfoResult])

  const handleSetDuration = async (item: { value: number; text: string; key: number }) => {
    const { value, text } = item

    await store.setPersonalCenterSettings({ tokenTtl: value * hours })
    setDuration(text)
    setVisible(false)
    Toast.success(t`features_user_personal_center_account_security_index_613`)
  }

  const handleModifyPassword = () => {
    if (turnOnVerification) {
      Toast.info(t`features_user_personal_center_account_security_email_index_591`)
      return
    }

    link('/personal-center/account-security/modify-password')
  }

  return (
    <div className={`account-security ${styles.scoped}`}>
      <NavBar title={t`user.pageContent.title_21`} />

      {loading ? (
        <div className="account-layer">
          <Loading />
        </div>
      ) : null}

      <div className="account-security-wrap">
        <div className="login-item">
          <UserSecurityItem
            icon={
              <div className="login-item-box">
                <Icon name="user_icon_mailbox" hasTheme className="login-item-icon" />
              </div>
            }
            text={t`user.field.reuse_13`}
            bind={baseInfoResult.isBindEmailVerify === UserEnabledStateTypeEnum.enable}
            enable={baseInfoResult.isOpenEmailVerify === UserEnabledStateTypeEnum.enable}
            onLink={() => link('/personal-center/account-security/email')}
          />

          <UserSecurityItem
            icon={
              <div className="login-item-box">
                <Icon name="user_icon_phone" hasTheme className="login-item-icon" />
              </div>
            }
            text={t`user.field.reuse_14`}
            bind={baseInfoResult.isBindPhoneVerify === UserEnabledStateTypeEnum.enable}
            enable={baseInfoResult.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable}
            onLink={() => link('/personal-center/account-security/phone')}
          />

          <UserSecurityItem
            icon={
              <div className="login-item-box">
                <Icon name="user_icon_google" hasTheme className="login-item-icon" />
              </div>
            }
            text={t`user.field.reuse_15`}
            bind={baseInfoResult.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable}
            unBindText={t`features_user_personal_center_settings_index_5101268`}
            enable={baseInfoResult.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable}
            onLink={() => link('/personal-center/account-security/google')}
          />
        </div>

        <div className="login-item-divide" />

        <div className="login-item">
          <Cell
            title={t`user.field.reuse_16`}
            rightIcon={<Icon name="next_arrow" hasTheme />}
            value={t`user.field.reuse_08`}
            onClick={() => link('/personal-center/account-security/anti-phishing')}
          />

          <Cell
            title={t`user.account_security_05`}
            rightIcon={<Icon name="next_arrow" hasTheme />}
            value={t`user.account_security_06`}
            onClick={handleModifyPassword}
          />

          {/* <Cell
            title={t`features_user_personal_center_account_security_transaction_password_index_607`}
            isLink
            value={
              baseInfoResult.setTradePwdInd === UserEnabledStateTypeEnum.enable
                ? t`user.account_security_06`
                : t`user.pageContent.title_12`
            }
            onClick={() =>
              link(
                `/personal-center/account-security/transaction-password?type=${
                  baseInfoResult.setTradePwdInd === UserEnabledStateTypeEnum.enable
                    ? UserAccountSettingsTypeEnum.modify
                    : UserAccountSettingsTypeEnum.bind
                }`
              )
            }
          /> */}

          <Cell
            title={t`user.account_security_07`}
            rightIcon={<Icon name="next_arrow" hasTheme />}
            value={duration}
            onClick={() => setVisible(true)}
          />
        </div>

        <div className="login-item-divide" />

        <div className="login-item">
          <Cell
            title={t`features_user_personal_center_account_security_manage_account_index_lsl5auuhrn`}
            rightIcon={<Icon name="next_arrow" hasTheme />}
            onClick={() => setManageAccountVisible(true)}
          />
          <Cell
            title={t`features_user_personal_center_account_security_bind_account_index_yixzhpyugo`}
            rightIcon={<Icon name="next_arrow" hasTheme />}
            onClick={() => link('/personal-center/bind-account')}
          />
        </div>
      </div>

      <Popup visible={manageAccountVisible} position="bottom" onClose={() => setManageAccountVisible(false)} round>
        <div className={styles['manage-account-popup']}>
          <div className="duration-wrap">
            <div className="title-account">
              <label>{t`features_user_personal_center_account_security_index_pahrwkshjt`}</label>
              <Icon
                hasTheme
                name={'close'}
                className="title-account-icon"
                onClick={() => setManageAccountVisible(false)}
              />
            </div>
            <div className="title-account-body" onClick={() => link('/personal-center/manage-account')}>
              <p>{t`features_user_personal_center_account_security_index_is1pi0dodm`}</p>
              <div>{t`features_user_personal_center_account_security_index_vp3v4otamq`}</div>
            </div>
            <div
              className="cancel"
              style={{ borderTop: '3px solid #F2F2F2' }}
              onClick={() => setManageAccountVisible(false)}
            >
              <label className="cancel-text">{t`user.field.reuse_09`}</label>
            </div>
          </div>
        </div>
      </Popup>

      <Popup visible={visible} position="bottom" onClose={() => setVisible(false)} round>
        <div className={styles['account-security-duration']}>
          <div className="duration-wrap">
            <div className="title">
              <label>{t`user.account_security_07`}</label>
            </div>
            {durationList.map(v => (
              <div className="item" key={v.key} onClick={() => handleSetDuration(v)}>
                {v.text === duration ? <label className="text-brand_color">{v.text}</label> : <label>{v.text}</label>}
              </div>
            ))}
            <div className="cancel" style={{ borderTop: '3px solid #F2F2F2' }} onClick={() => setVisible(false)}>
              <label className="cancel-text">{t`user.field.reuse_09`}</label>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}
