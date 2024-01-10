import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { useState } from 'react'
import NavBar from '@/components/navbar'
import { useUserStore } from '@/store/user'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import UserPopUp from '@/features/user/components/popup'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { Radio, Button, Checkbox, Input, Toast } from '@nbit/vant'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import UserPopupContent from '@/features/user/components/popup/content'
import { postLogoffRequest, getAgentDelAccLogoutRequest } from '@/apis/user'
import { ManageAccountEnum, UserAgreementEnum, UserSendValidateCodeBusinessTypeEnum } from '@/constants/user'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import styles from './index.module.css'

type ManageAccountReasonProps = {
  email?: string
  mobileCountry?: string
  mobileNumber?: string
  reason: string
  verifyCode: string
}

export default function ManageAccount() {
  const [loading, setLoading] = useState<boolean>(false)
  const [accountCheck, setAccountCheck] = useState<boolean>(false)
  const [checkVisible, setCheckVisible] = useState<boolean>(false)
  const [radioName, setRadioName] = useState<string>(ManageAccountEnum.noAccount)
  const [otherText, setOtherText] = useState<string>('')
  const [workOrderPopUp, setWorkOrderPopUp] = useState<boolean>(false)
  const [isShowVerification, setIsShowVerification] = useState<boolean>(false)

  const manageAccountRadio = [
    {
      name: t`features_user_personal_center_account_security_manage_account_index_mh5hvbcpwm`,
      value: ManageAccountEnum.noAccount,
    },
    {
      name: t`features_user_personal_center_account_security_manage_account_index_z9nruxh1tu`,
      value: ManageAccountEnum.allAccount,
    },
    { name: t`assets.financial-record.tabs.other`, value: ManageAccountEnum.other },
  ]
  const footerStore = useLayoutStore()
  const { clearUserCacheData } = useUserStore()
  const { baseInfoResult } = usePersonalCenterStore()
  const { headerData } = useLayoutStore()

  const onRadioChange = v => {
    setOtherText('')
    v && setRadioName(v)
  }

  const onTextChange = (v: string) => setOtherText(v)

  const onThirdPartyChange = async option => {
    const isOther = radioName === ManageAccountEnum.other
    const radioData = manageAccountRadio?.find(item => item.value === radioName)
    let params = {
      reason: isOther ? otherText : radioData?.name,
      verifyCode: option?.mobileVerifyCode || option?.emailVerifyCode,
    } as ManageAccountReasonProps
    if (option?.mobileVerifyCode) {
      params = {
        ...params,
        mobileCountry: baseInfoResult?.mobileCountryCd,
        mobileNumber: baseInfoResult?.mobileNumber,
      }
    } else {
      params = {
        ...params,
        email: baseInfoResult?.email,
      }
    }
    setLoading(true)
    const { data, isOk } = await postLogoffRequest(params)
    if (isOk && data) {
      link('/home-page')
      Toast.info(t`features_user_personal_center_account_security_manage_account_index_iehfjuo7np`)
      await clearUserCacheData()
      // await getAgentDelAccLogoutRequest({})
    }
    setLoading(false)
  }

  const onDelSureChange = () => {
    if (!checkVisible) {
      return Toast.info(t`features_user_register_flow_index_625`)
    }
    setWorkOrderPopUp(true)
  }

  return (
    <>
      <NavBar title={t`features_user_personal_center_account_security_manage_account_index_lsl5auuhrn`} />
      <div className={styles['manage-account-wrap']}>
        <label>
          {t({
            id: 'features_user_personal_center_account_security_manage_account_index_0ybnj7xzxo',
            values: { 0: headerData?.businessName },
          })}
        </label>
        <Radio.Group defaultValue={ManageAccountEnum.noAccount} onChange={onRadioChange}>
          {manageAccountRadio?.map(item => {
            return (
              <Radio
                key={item.value}
                name={item.value}
                labelPosition="left"
                iconRender={({ checked }) => (
                  <Icon
                    className="settlement-select-icon"
                    name={checked ? 'login_agreement_selected' : 'login_agreement_unselected'}
                  />
                )}
              >
                {item.name}
              </Radio>
            )
          })}
        </Radio.Group>
        {radioName === ManageAccountEnum.other && (
          <Input.TextArea
            rows={4}
            showWordLimit
            maxLength={100}
            value={otherText}
            onChange={onTextChange}
            className="manage-account-input"
            placeholder={t`features_user_personal_center_account_security_manage_account_index_karwiwaubk`}
          />
        )}
        <div className="manage-account-footer">
          <Checkbox
            checked={checkVisible}
            onChange={setCheckVisible}
            className="footer-checkobx"
            iconRender={({ checked: isActive }) => (
              <Icon
                hasTheme={!isActive}
                className="footer-checkobx-icon"
                name={isActive ? 'icon_agree_yes' : 'icon_agree_no'}
              />
            )}
          >
            <span>{t`components/questionnaire/index-0`}</span>
            <label onClick={() => link(footerStore.columnsDataByCd?.[UserAgreementEnum.termsService]?.webUrl)}>
              {t`features_user_personal_center_account_security_manage_account_index_19xspm6zn0`}
            </label>
            <span>{t`components/questionnaire/index-2`}</span>
            <label
              onClick={() => link(footerStore.columnsDataByCd?.[UserAgreementEnum.termsService]?.webUrl)}
            >{t`user.validate_form_10`}</label>
          </Checkbox>
          <Button type="primary" className="footer-button" loading={loading} onClick={onDelSureChange}>
            {t`common.confirm`}
          </Button>
        </div>
      </div>
      <UserPopUp
        visible={workOrderPopUp}
        onClose={() => {
          setWorkOrderPopUp(false)
        }}
        slotContent={
          <UserPopupContent
            content={
              <div className="manage-account-popup-content">
                <p>{t`features_user_personal_center_account_security_manage_account_index_ceu48flndx`}</p>
                <div className="content-box">
                  <Checkbox
                    checked={accountCheck}
                    onChange={setAccountCheck}
                    className="popup-content-checkobx"
                    iconRender={({ checked: isActive }) => (
                      <Icon
                        hasTheme={!isActive}
                        className="popup-content-checkobx-icon"
                        name={isActive ? 'icon_agree_yes' : 'icon_agree_no'}
                      />
                    )}
                  />
                  <label>{t`features_user_personal_center_account_security_manage_account_index_izqgbevfcn`}</label>
                </div>
              </div>
            }
            rightButtonText={t`user.field.reuse_17`}
            onClose={v => {
              setAccountCheck(v)
              setWorkOrderPopUp(v)
            }}
            onContinue={() => {
              if (!accountCheck) {
                return Toast.info(t`features_user_register_flow_index_625`)
              }
              setWorkOrderPopUp(false)
              setIsShowVerification(true)
            }}
            icon={<LazyImage src={`${oss_svg_image_domain_address}tips.png`} />}
            className={styles['manage-account-popup']}
          />
        }
      />

      <UniversalSecurityVerification
        isShow={isShowVerification}
        businessType={UserSendValidateCodeBusinessTypeEnum.userLogoutApplication}
        onSuccess={(isSuccess: boolean, option) => {
          isSuccess && onThirdPartyChange(option)
        }}
        onClose={() => {
          setIsShowVerification(false)
        }}
      />
    </>
  )
}
