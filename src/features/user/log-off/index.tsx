import { useState } from 'react'
import { Form, Button, Field, Flex, Input, Toast, Image } from '@nbit/vant'
import { useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
// import Link from '@/components/link'
import { RegisterFlowRules, formatPhoneNumber } from '@/features/user/utils/validate'
import { PasswordValidate } from '@/features/user/common/password-validate'
import UserSearchArea from '@/features/user/common/search-area'
import NavBar from '@/components/navbar'
import UserCountDown from '@/features/user/components/count-down'
import { postMemberSafeVerifyEmailSend, postMemberSafeVerifyPhoneSend, postV1UserLogoffApiRequest } from '@/apis/user'
import { MemberMemberAreaType } from '@/typings/user'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { checkValidEmailInput } from '@/helper/reg'
import {
  UserValidateMethodEnum,
  // UserVerifyTypeEnum,
  UserSelectAreaTypeEnum,
  // UserEnabledStateTypeEnum,
  UserSendValidateCodeBusinessTypeEnum,
  // UserAgreementEnum,
  ChinaAreaCodeEnum,
} from '@/constants/user'
import { useUserStore } from '@/store/user'
import { FormValuesTrim } from '@/features/user/utils/common'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

export default function UserRegisterFlow() {
  const [method, setMethod] = useState<string>(UserValidateMethodEnum.email)
  const [selectArea, setSelectArea] = useState<boolean>(false)
  // const [passwordValue, setPasswordValue] = useState<string>('')
  // const [passwordValidate, setPasswordValidate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isSend, setIsSend] = useState<boolean>(false)
  const [emailValidated, setemailValidated] = useState(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_verification_index_599`,
    remark: ChinaAreaCodeEnum.remark,
  })
  const [passwordShow, setPasswordShow] = useState({
    newPasswordShow: false,
    confirmPasswordShow: false,
  })
  const [form] = Form.useForm()
  const email = Form.useWatch('email', form)
  const mobile = Form.useWatch('mobileNumber', form)
  const loginPassword = Form.useWatch('loginPassword', form)
  const confirmPassword = Form.useWatch('confirmPassword', form)

  const rules = RegisterFlowRules(loginPassword)
  const store = useUserStore()

  const info = store.userTransitionDatas

  useUpdateEffect(() => {
    loginPassword && confirmPassword && form.validateFields(['loginPassword', 'confirmPassword'])
  }, [loginPassword, confirmPassword])

  const handleClearPassword = (key: string) => {
    form.setFieldValue(key, '')
  }

  const handleChoosMethod = (type: string) => {
    setMethod(type)
    form.resetFields()
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    // if (v.enableInd === UserEnabledStateTypeEnum.enable) setIsEnble(true)
    setArea(v)
    setSelectArea(false)
  }

  const onFinish = async values => {
    const requestParams = {
      [UserValidateMethodEnum.phone]: {
        mobileNumber: values?.mobileNumber?.replace(/\s+/g, ''),
        mobileCountry: area?.codeVal,
      },
      [UserValidateMethodEnum.email]: {
        email: values?.email,
      },
    }
    setLoading(true)
    const res = await postV1UserLogoffApiRequest({
      password: values?.loginPassword,
      reason: values?.reason,
      verifyCode: values?.verifyCode,
      ...requestParams?.[method],
    })

    if (res?.isOk) {
      Toast.info(t`features_user_log_off_index_z2cavvtnsr`)
      form.setFieldsValue({
        email: '',
        loginPassword: '',
        mobileNumber: '',
        confirmPassword: '',
        reason: '',
        verifyCode: '',
      })
      store?.clearUserCacheData()
    }
    setLoading(false)
  }

  const handleSendEmailValidateCode = async () => {
    const isEmail = method === UserValidateMethodEnum.email
    const checkValidObj = {
      [UserValidateMethodEnum.email]: checkValidEmailInput,
      [UserValidateMethodEnum.phone]: value => {
        if (value.length < 8) {
          return false
        }
        return true
      },
    }

    if (!checkValidObj?.[method](isEmail ? email : mobile)) {
      isEmail
        ? Toast.info(t`features_user_log_off_index_4keaydzn7y`)
        : Toast.info(t`features_user_log_off_index_uozvahkfss`)
      return false
    }
    form.validateFields(['emailCode'])
    setIsSend(true)

    const requestMethods = {
      [UserValidateMethodEnum.email]: postMemberSafeVerifyEmailSend,
      [UserValidateMethodEnum.phone]: postMemberSafeVerifyPhoneSend,
    }

    const requestParams = {
      [UserValidateMethodEnum.email]: {
        type: UserSendValidateCodeBusinessTypeEnum.userLogoutApplication,
        email,
      },
      [UserValidateMethodEnum.phone]: {
        type: UserSendValidateCodeBusinessTypeEnum.userLogoutApplication,
        mobile: mobile?.replace(/\s+/g, ''),
        mobileCountryCode: area?.codeVal,
      },
    }

    const res = await requestMethods?.[method]?.({
      ...requestParams?.[method],
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    isTrue && Toast.info(t`user.field.reuse_38`)
    return true
  }

  return (
    <section className={`register ${styles.scoped}`}>
      <NavBar
        title={t`features_user_log_off_index_odjfj0ebbb`}
        right={<Icon name="close" hasTheme />}
        onClickRight={() => link('/home-page')}
      />
      <div className="text-tips_color bg-brand_color_special_02 px-4 py-2 text-xs mb-2 flex">
        <div>
          <Icon name="msg" />
        </div>
        <span className="ml-1">{t`features_user_log_off_index_zmfqzed2pa`}</span>
      </div>
      <div className="register-wrap user-validate mb-14">
        <div className="tab">
          <div
            className={`email ${method === UserValidateMethodEnum.email && 'active'}`}
            onClick={() => handleChoosMethod(UserValidateMethodEnum.email)}
          >
            <label>{t`user.safety_items_04`}</label>
          </div>
          <div
            className={`phone ${method === UserValidateMethodEnum.phone && 'active'}`}
            onClick={() => handleChoosMethod(UserValidateMethodEnum.phone)}
          >
            <label>{t`user.validate_form_03`}</label>
          </div>
        </div>

        <Form
          layout="vertical"
          className="form-input-large-size"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger="onFinish"
          // onChange={handleValidateChange}
        >
          {method === UserValidateMethodEnum.email && (
            <>
              <FormItem name="email" rules={[rules.email]} label={t`user.safety_items_04`} validateTrigger="onFinish">
                <Field
                  rightIcon={
                    <>{email && <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword('email')} />}</>
                  }
                  placeholder={t`user.validate_form_02`}
                  disabled={info?.thirdPartyAccount}
                />
              </FormItem>

              <FormItem
                name="loginPassword"
                rules={[
                  {
                    required: true,
                    validator: (_, value: string | undefined) => {
                      if (!value) return Promise.reject(new Error(t`user.validate_form_06`))
                      if ((value && value.length < 8) || (value && value.length > 16)) {
                        return Promise.reject(new Error(t`features_user_utils_validate_5101257`))
                      }
                      const validateTipsList = PasswordValidate(value)
                      const isTrue = validateTipsList.find(v => !v.pattern) as Record<'text', string>
                      if (isTrue) {
                        return Promise.reject(new Error(isTrue?.text))
                      }

                      return Promise.resolve(true)
                    },
                  },
                ]}
                label={t`user.validate_form_06`}
                validateTrigger="onFinish"
              >
                <Field
                  formatter={FormValuesTrim}
                  maxLength={16}
                  type={passwordShow.newPasswordShow ? 'text' : 'password'}
                  rightIcon={
                    <>
                      {loginPassword && (
                        <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword('loginPassword')} />
                      )}

                      {passwordShow.newPasswordShow ? (
                        <Icon name="eyes_open" hasTheme />
                      ) : (
                        <Icon name="eyes_close" hasTheme />
                      )}
                    </>
                  }
                  onClickRightIcon={() =>
                    setPasswordShow({
                      ...passwordShow,
                      newPasswordShow: !passwordShow.newPasswordShow,
                    })
                  }
                  placeholder={t`user.validate_form_06`}
                />
              </FormItem>
            </>
          )}

          {method === UserValidateMethodEnum.phone && (
            <>
              <FormItem
                name="mobileNumber"
                rules={[rules.phone]}
                label={t`user.validate_form_03`}
                validateTrigger="onFinish"
              >
                <Field
                  formatter={value => formatPhoneNumber(String(value), area?.codeVal)}
                  rightIcon={
                    <>
                      {mobile && <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword('mobile')} />}
                    </>
                  }
                  prefix={
                    <Flex align="center" onClick={() => setSelectArea(true)}>
                      {
                        // isEnble ? (
                        <>
                          <Image lazyload src={`${oss_area_code_image_domain_address}${area?.remark}.png`} /> +
                          {area?.codeVal}
                        </>
                        // ) : (
                        //   `-- : --`
                        // )
                      }
                      <Icon name="regsiter_icon_drop" hasTheme />
                    </Flex>
                  }
                  placeholder={t`user.field.reuse_11`}
                />
              </FormItem>

              <FormItem
                name="loginPassword"
                rules={[
                  {
                    required: true,
                    validator: (_, value: string | undefined) => {
                      if (!value) return Promise.reject(new Error(t`user.validate_form_06`))
                      if ((value && value.length < 8) || (value && value.length > 16)) {
                        return Promise.reject(new Error(t`features_user_utils_validate_5101257`))
                      }
                      const validateTipsList = PasswordValidate(value)
                      const isTrue = validateTipsList.find(v => !v.pattern) as Record<'text', string>
                      if (isTrue) {
                        return Promise.reject(new Error(isTrue?.text))
                      }

                      return Promise.resolve(true)
                    },
                  },
                ]}
                label={t`user.validate_form_06`}
                validateTrigger="onFinish"
              >
                <Field
                  formatter={FormValuesTrim}
                  maxLength={16}
                  type={passwordShow.newPasswordShow ? 'text' : 'password'}
                  rightIcon={
                    <>
                      {loginPassword && (
                        <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword('loginPassword')} />
                      )}

                      {passwordShow.newPasswordShow ? (
                        <Icon name="eyes_open" hasTheme />
                      ) : (
                        <Icon name="eyes_close" hasTheme />
                      )}
                    </>
                  }
                  onClickRightIcon={() =>
                    setPasswordShow({
                      ...passwordShow,
                      newPasswordShow: !passwordShow.newPasswordShow,
                    })
                  }
                  placeholder={t`user.validate_form_06`}
                />
              </FormItem>
            </>
          )}

          {/* <UserPasswordValidateTips password={FormValuesTrim(passwordValue)} validate={setPasswordValidate} /> */}

          <FormItem
            name="confirmPassword"
            rules={[rules.confirmPassword]}
            label={t`user.field.reuse_12`}
            validateTrigger="onFinish"
          >
            <Field
              formatter={FormValuesTrim}
              maxLength={16}
              type={passwordShow.confirmPasswordShow ? 'text' : 'password'}
              rightIcon={
                <>
                  {confirmPassword && (
                    <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword('confirmPassword')} />
                  )}

                  <Icon
                    name={passwordShow.confirmPasswordShow ? 'eyes_open' : 'eyes_close'}
                    hasTheme
                    onClick={() =>
                      setPasswordShow({
                        ...passwordShow,
                        confirmPasswordShow: !passwordShow.confirmPasswordShow,
                      })
                    }
                  />
                </>
              }
              placeholder={t`user.validate_form_06`}
            />
          </FormItem>
          <Form.Item
            name="verifyCode"
            layout="vertical"
            label={method === UserValidateMethodEnum.email ? t`user.field.reuse_20` : t`user.field.reuse_21`}
            rules={[
              {
                validator: (_, value) => {
                  switch (true) {
                    case !value:
                      return Promise.reject(
                        new Error(t`features_c2c_c2c_merchant_c2c_merchant_form_index_2222225101389`)
                      )
                    case value.length < 6:
                      return Promise.reject(
                        new Error(
                          `${t`helper_c2c_merchant_form_validators_qv2vxfisdip_vtcsdcca5`} 6 ${t`helper_c2c_merchant_form_validators_ips_pdkty3xphsivdq5rx`}`
                        )
                      )

                    case !isSend:
                      return Promise.reject(new Error(t`features_user_log_off_index_jvpojenlop`))
                    default:
                      return Promise.resolve()
                  }
                },
              },
            ]}
          >
            <Field
              // readOnly={!checkValidEmailInput(email)}
              className="form-email-code"
              type="number"
              onChange={async v => {
                if (v.length >= 6) {
                  setemailValidated(true)
                }
              }}
              maxLength={6}
              placeholder={method === UserValidateMethodEnum.email ? t`user.field.reuse_20` : t`user.field.reuse_21`}
              // token valid for 5 mins
              suffix={
                <UserCountDown
                  triggerStop={emailValidated}
                  buttonText={t`user.field.reuse_31`}
                  onSendValidateCode={handleSendEmailValidateCode}
                />
              }
            />
          </Form.Item>
          <div className="invitation-code">
            <FormItem
              name="reason"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(new Error(t`features_user_log_off_index_gaognigj66`))
                    }
                    return Promise.resolve(true)
                  },
                },
              ]}
              label={t`features_user_log_off_index_vqjgmmabi2`}
              style={{ marginTop: 0 }}
            >
              <Input.TextArea placeholder={t`features_user_log_off_index_g3utd9t5rz`} className="p-3" />
            </FormItem>
          </div>

          <FormItem>
            <Button
              loading={loading}
              type="primary"
              size="large"
              nativeType="submit"
              // onClick={() => onFinish()}
              // disabled={disabled || !isAccount || !loginPassword || !confirmPassword}
            >{t`features_user_log_off_index_qw105xcaaw`}</Button>
          </FormItem>
        </Form>
      </div>

      <UserSearchArea
        visible={selectArea}
        checkedValue={area?.codeVal}
        type={UserSelectAreaTypeEnum.phone}
        placeholderText={t`user.field.reuse_25`}
        selectArea={handleSelectArea}
        onClose={() => setSelectArea(false)}
      />
    </section>
  )
}
