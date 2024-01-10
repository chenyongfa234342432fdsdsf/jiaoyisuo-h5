import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { useState, useEffect } from 'react'
import NavBar from '@/components/navbar'
import { Button, Field, Form } from '@nbit/vant'
import UserPopUp from '@/features/user/components/popup'
import { usePageContext } from '@/hooks/use-page-context'
import { FormValuesTrim, UserInformationDesensitization } from '@/features/user/utils/common'
import { useGeeTestBind } from '@/features/user/common/geetest'
import { RegisterFlowRules } from '@/features/user/utils/validate'
import { postPasswordChecRequest } from '@/apis/user'
import { UserVerifyTypeEnum, GeeTestOperationTypeEnum } from '@/constants/user'
import UserPopupContent from '@/features/user/components/popup/content'
import styles from './index.module.css'

const FormItem = Form.Item
export default function WelcomeBack() {
  const [form] = Form.useForm()
  const pageContext = usePageContext()
  const [account, setAccount] = useState<string>('')
  const [retrieve, setRetrieve] = useState<boolean>(false)
  const [passwordShow, setPasswordShow] = useState<boolean>(false)
  const [accountType, setAccountType] = useState<number>(UserVerifyTypeEnum.email)
  const [loading, setLoading] = useState<boolean>(false)

  const confirmPassword = Form.useWatch('password', form)
  const rules = RegisterFlowRules(confirmPassword)
  const geeTestInit = useGeeTestBind()

  const getRouterParams = () => {
    const routeParams = pageContext?.urlParsed
    const accountData = routeParams?.search?.account
    const type = routeParams?.search?.accountType
    type && setAccountType(Number(type))
    accountData && setAccount(accountData)
  }

  const geeTestOnSuccess = async values => {
    const params = {
      account,
      accountType,
      password: values.password,
    }
    const { data, isOk } = await postPasswordChecRequest(params)
    if (isOk && data) {
      const loginType = pageContext?.urlParsed?.hash
      link(`/safety-verification?bindType=${loginType}`)
    }
    setLoading(false)
  }

  const onFinish = async values => {
    // /** 极验验证 */
    const operateType = GeeTestOperationTypeEnum.login
    const accountData = account?.replace(/\s/g, '')
    setLoading(true)
    geeTestInit(
      accountData,
      operateType,
      () => geeTestOnSuccess(values),
      () => setLoading(false)
    )
  }

  const handleClearPassword = () => {
    form.setFieldValue('password', '')
  }

  useEffect(() => {
    getRouterParams()
  }, [])

  return (
    <section className={styles['welcome-back-wrap']}>
      <NavBar
        title=""
        onClickRight={() => window.history.back()}
        right={<Icon name="close" hasTheme className="welcome-back-icon" />}
      />
      <div className="welcome-back-content">
        <p>{t`features_user_login_welcome_back_index_i_kpwsbaqo`}</p>
        <label>{UserInformationDesensitization(account)}</label>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger="onFinish"
          className="form-input-large-size"
        >
          <FormItem name="password" rules={[rules.password]} validateTrigger="onFinish">
            <Field
              maxLength={16}
              formatter={FormValuesTrim}
              placeholder={t`user.validate_form_06`}
              type={passwordShow ? 'text' : 'password'}
              rightIcon={
                <>
                  {confirmPassword && <Icon name="del_input-box" hasTheme onClick={() => handleClearPassword()} />}

                  <Icon
                    name={passwordShow ? 'eyes_open' : 'eyes_close'}
                    hasTheme
                    onClick={() => setPasswordShow(!passwordShow)}
                  />
                </>
              }
            />
          </FormItem>
          <FormItem className="next-submit">
            <Button type="primary" nativeType="submit" loading={loading}>
              {t`user.field.reuse_23`}
            </Button>
          </FormItem>
        </Form>
        <span className="forget-password" onClick={() => setRetrieve(true)}>
          {t`features_user_login_welcome_back_index_sgxi_z3d9b`}
        </span>
      </div>

      <UserPopUp
        visible={retrieve}
        onClose={() => {
          setRetrieve(false)
        }}
        slotContent={
          <UserPopupContent
            content={
              <p>
                {t`user.field.reuse_26`}
                <label>{t`user.field.reuse_27`}</label>
                {t`user.field.reuse_28`}
              </p>
            }
            rightButtonText={t`user.login_04`}
            onClose={setRetrieve}
            onContinue={() => link('/retrieve')}
          />
        }
      />
    </section>
  )
}
