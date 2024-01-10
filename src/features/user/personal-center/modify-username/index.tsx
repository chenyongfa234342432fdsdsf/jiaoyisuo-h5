import { Form, Field, Button, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { PersonalCenterModifyUsernameRules } from '@/features/user/utils/validate'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import { postV1MemberBaseExtendInfoApiRequest } from '@/apis/vip'
import { useUserStore } from '@/store/user'
import { useEffect, useState } from 'react'
import styles from './index.module.css'
import { TIMES_LIMIT } from '../info/common'
import FullScreenLoading from '../../components/full-screen-loading'

const FormItem = Form.Item

export default function UserPersonalCenterModifyUsername() {
  const useStore = useUserStore()
  const { userInfo, setUserInfo } = useStore

  const [form] = Form.useForm()
  const nickName = Form.useWatch('nickName', form)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form?.setFieldValue('nickName', userInfo?.nickName)
  }, [form, userInfo?.nickName])

  const rules = PersonalCenterModifyUsernameRules()

  const onFinish = async () => {
    setLoading(true)
    const res = await postV1MemberBaseExtendInfoApiRequest({ nickName })
    setLoading(false)
    if (res.isOk) {
      setUserInfo({ nickName, nickNameChangeTime: userInfo?.nickNameChangeTime + 1 })
      Toast.info(t`user.field.reuse_34`)
      window.history.back()
    }
  }

  return (
    <div className={`modify-username ${styles.scoped}`}>
      <FullScreenLoading isShow={loading} className="h-screen" mask />

      <NavBar title={t`user.pageContent.title_10`} />

      <div className="modify-username-wrap user-validate">
        <div className="modify-username-form">
          <div>
            <Form form={form} autoComplete="off" validateTrigger="onFinish">
              <FormItem name="nickName" rules={[rules.nickName]} validateTrigger="onFinish">
                <Field
                  maxLength={12}
                  placeholder={t`user.account_security.modify_username_02`}
                  clearable
                  clearTrigger="always"
                  clearIcon={
                    <Icon
                      onClick={() => form?.setFieldValue('nickName', '')}
                      name="icon_personage_del_input"
                      className="text-icon_color_02"
                    />
                  }
                />
              </FormItem>
            </Form>
            <div className="desc-list">
              <div className="desc">
                <Icon name="prompt-symbol" className="add-icon" />
                {t`features_user_personal_center_modify_username_index_an5kkbiivf`}
              </div>
              <div className="desc">
                <Icon name="prompt-symbol" className="add-icon" />
                {t`features_user_personal_center_modify_username_index_zgkhx33vuu`}
              </div>
              <div className="desc">
                <Icon name="prompt-symbol" className="add-icon" />
                {t({
                  id: 'features_user_personal_center_modify_username_index_k3u31p_vnt',
                  values: { 0: TIMES_LIMIT },
                })}
              </div>
            </div>
          </div>

          <div className="btn-wrap">
            <Button
              type="primary"
              nativeType="submit"
              disabled={nickName?.length < 2 || nickName === userInfo?.nickName}
              onClick={onFinish}
            >{t`user.field.reuse_17`}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
