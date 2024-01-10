import { useEffect, useRef, useState } from 'react'

import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { Button, Flex, Form, Input, Popup, Toast, Image, ActionSheet, Field } from '@nbit/vant'
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { agent_v3_oss_svg_image_domain_address, AgentStatus } from '@/constants/agent'

import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { MemberMemberAreaType } from '@/typings/user'
import UserSearchArea from '@/features/user/common/search-area'
import { UserSelectAreaTypeEnum } from '@/constants/user'
import { useCommonStore } from '@/store/common'
import { I18nsEnum } from '@/constants/i18n'
import { setCacheAgentBindUser } from '@/helper/agent/agent'
import { getAgtContractInfoApiRequest, postAgtApplyApiRequest } from '@/apis/agent/join'
import { GetAgtContractInfoResponse } from '@/typings/api/agent/join'
import { useUpdateEffect } from 'ahooks'
import { getMemberAreaIp } from '@/apis/user'
import LazyImage from '@/components/lazy-image'
import Styles from './index.module.css'
import AgentCommonButton from '../common/agent-common-button'

enum ContactType {
  Phone = '1',
  Email = '2',
  Media = '3',
}

const AgentCache = {
  agentEnterNum: 'agentEnterNum',
}

function AgentJoin() {
  const [userInfo, setUserInfo] = useState<GetAgtContractInfoResponse>()
  const [applyLoading, setApplyLoading] = useState<boolean>(false)
  const [buttonDisabeld, setButtonDisabeld] = useState<boolean>(true)
  const [socialMediaList, setSocialMediaList] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])
  const [conActionSheetVisibel, setConActionSheetVisibel] = useState<boolean>(false)
  const [mediaActionSheetVisibel, setMediaActionSheetVisibel] = useState<boolean>(false)
  const [appTitle, setAppTitle] = useState<string>(t`features_agent_agent_apply_index_2pb5ufrn8s`)
  const [selectSocialMedia, setSelectSocialMedia] = useState({
    codeKey: '',
    codeVal: '',
    remark: '',
  })
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: '',
    codeKey: '',
    remark: '',
  })
  const [selectArea, setSelectArea] = useState<boolean>(false)
  const formDataRef = useRef({
    contact: '',
    contactInformation: '',
    invitationNum: '',
    comment: '',
    spot: 0,
    contract: 0,
    borrowCoin: 0,
    socialMedia: '',
  })

  const commonState = useCommonStore()
  const [form] = Form.useForm()
  const setMobileData = () => {
    form.setFieldValue('contact', t`user.safety_items_02`)
    form.setFieldValue('contactInformation', userInfo?.mobile || '')
    setArea({
      codeVal: userInfo?.mobileCountryCd as string,
      codeKey: '',
      remark: userInfo?.remark as string,
    })
    setTimeout(() => {
      form.validateFields(['contactInformation', 'socialMedia'])
    }, 200)
  }
  const setDefaultInfo = async () => {
    const contractInfoResponse = await getAgtContractInfoApiRequest({})
    if (contractInfoResponse?.data) {
      let contractInfoData = contractInfoResponse.data
      // 如果没有国家区号 根据 ip 获取
      if (!contractInfoData.mobileCountryCd) {
        const ipData = await getMemberAreaIp({})
        contractInfoData.mobileCountryCd = ipData.data.enCode
        contractInfoData.remark = ipData.data.shortName
      }
      setUserInfo(contractInfoData)
    }
  }
  useEffect(() => {
    setDefaultInfo()
    getCodeDetailList({ codeVal: 'appSocialize' }).then(res => {
      if (res.isOk) {
        setSocialMediaList(res.data as YapiGetV1OpenapiComCodeGetCodeDetailListData[])
      }
    })
  }, [])
  /** 进入页面进行手机号默认值设置 */
  useUpdateEffect(() => {
    setMobileData()
  }, [userInfo])

  const [confirmVisible, setConfirmVisible] = useState<boolean>(false)
  const onFinish = values => {
    if (values) {
      setConfirmVisible(true)
      formDataRef.current = values
    }
  }

  const onConfirmClose = () => {
    setConfirmVisible(false)
  }

  /** 提交申请 */
  const onConfirm = () => {
    setConfirmVisible(false)
    setApplyLoading(true)
    const contact =
      formDataRef.current?.contact === t`user.safety_items_02`
        ? ContactType.Phone
        : formDataRef.current?.contact === t`user.safety_items_04`
        ? ContactType.Email
        : ContactType.Media
    const param: any = {
      contact,
      contactInformation: formDataRef.current?.contactInformation,
      content: formDataRef.current?.comment,
    }
    if (contact === ContactType.Phone) {
      param.mobileCountryCd = area.codeVal
    }

    param.socialMedia = selectSocialMedia?.codeKey
    param.socialMediaInfo = formDataRef.current?.socialMedia
    postAgtApplyApiRequest(param).then(res => {
      if (res.isOk) {
        Toast({ message: t`features_kyc_success_index_5101140`, position: 'top' })
        setCacheAgentBindUser(AgentCache.agentEnterNum, AgentStatus.In)
        link('/agent/result/1')
      }
      setApplyLoading(false)
    })
  }

  const onValuesChange = (v, item) => {
    if (item?.contact && item?.contactInformation && item?.socialMedia && Boolean(selectSocialMedia.codeKey)) {
      setButtonDisabeld(false)
    } else {
      setButtonDisabeld(true)
    }
  }

  useEffect(() => {
    if (!selectSocialMedia?.codeKey) {
      return
    }
    onValuesChange('', form.getFieldsValue())
  }, [selectSocialMedia.codeKey])

  const handleSelectArea = (v: MemberMemberAreaType) => {
    form.setFieldValue('contactInformation', '')
    setArea(v)
    setSelectArea(false)
    if (appTitle[appTitle?.length - 1] === ' ') {
      setAppTitle(appTitle?.trim())
    } else {
      setAppTitle(`${appTitle} `)
    }
  }
  const actions = [
    {
      name: t`user.safety_items_02`,
      color: form.getFieldValue('contact') === t`user.safety_items_02` ? '#F1AE3D' : '',
      callback: () => {
        form.resetFields(['contactInformation'])
        setMobileData()
        onValuesChange('', form.getFieldsValue())
        setConActionSheetVisibel(false)
      },
    },
    {
      name: t`user.safety_items_04`,
      color: form.getFieldValue('contact') === t`user.safety_items_04` ? '#F1AE3D' : '',
      callback: () => {
        form.resetFields(['contactInformation'])
        form.setFieldValue('contact', t`user.safety_items_04`)
        form.setFieldValue('contactInformation', userInfo?.email || '')
        onValuesChange('', form.getFieldsValue())
        setConActionSheetVisibel(false)
      },
    },
  ]

  const onCancel = () => {
    setConActionSheetVisibel(false)
  }
  const actionMediaList = socialMediaList?.map(item => {
    return {
      name: item.codeKey,
      ...item,
      callback: () => {
        setSelectSocialMedia(item as any)
        form.validateFields(['socialMedia'])
        form.setFieldValue('socialMedia', '')
        setMediaActionSheetVisibel(false)
      },
    }
  })

  /** 输入框 */
  const inputChange = (v, isFromForm?) => {
    const reg =
      /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
    let value = ''
    if (v.match(reg)) {
      value = v.replace(reg, '')
    } else {
      value = v
    }

    if (isFromForm) {
      form.setFieldsValue({
        comment: value,
      })
    }
  }

  return (
    <div className={Styles.scoped}>
      <NavBar title={appTitle} />
      <div className="bg-form-wrap">
        <div className="bg-wrap">
          <div className="bg-box">
            <LazyImage hasTheme src={`${agent_v3_oss_svg_image_domain_address}/bg_agent_pyramid_apply.png`} />
          </div>
          <div className="banner-text-position">
            <div className="title">{t`features_agent_agent_apply_index_2pb5ufrn8s`}</div>
            <div className="content">{t`features_agent_agent_join_index_cdcxsiyxcf`}</div>
          </div>
        </div>
        <div className="form-wrap">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            footer={
              <div className="footer-wrap">
                <AgentCommonButton nativeType="submit" block disabled={buttonDisabeld} />
              </div>
            }
          >
            <ActionSheet
              className={Styles.contact}
              visible={conActionSheetVisibel}
              onCancel={onCancel}
              actions={actions}
              cancelText={t`assets.financial-record.cancel`}
            />
            <Form.Item
              name="contact"
              label={t`features_agent_agent_join_index_5101564`}
              className="contact-wrap"
              rules={[{ required: true, message: t`features_agent_agent_join_index_5101622` }]}
              onClick={(_, action) => {
                setConActionSheetVisibel(true)
              }}
            >
              <span>{form.getFieldValue('contact') || t`features_agent_agent_join_index_5101575`}</span>

              <Icon hasTheme name="regsiter_icon_drop" className="text-xs w-2 h-2" />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(p, n) => p.contact !== n.contact}>
              {({ getFieldValue, setFieldValue }) => {
                const type = getFieldValue('contact') || []
                let content
                if (type === t`user.safety_items_02`) {
                  content = (
                    <>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: t`features_agent_agent_join_index_5101616`,
                            validator: (_, val) => {
                              if (!val) return Promise.reject(new Error(t`features_agent_agent_join_index_5101616`))
                              return Promise.resolve()
                            },
                          },
                        ]}
                        key="contactInformation"
                        name="contactInformation"
                        className="phone-form-field"
                      >
                        <Field
                          type="number"
                          prefix={
                            <div className="mobile-left">
                              <Flex align="center" onClick={() => setSelectArea(true)}>
                                {area?.codeVal ? (
                                  <>
                                    <Image lazyload src={`${oss_area_code_image_domain_address}${area?.remark}.png`} />{' '}
                                    <span className="text-sm text-text_color_01">+{area?.codeVal} </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-text_color_04">
                                    {t`features_agent_agent_join_index_90yx0vjqldzenuiopb4am`}{' '}
                                  </span>
                                )}
                                <Icon className="down-area ml-1" name="regsiter_icon_drop" hasTheme />
                              </Flex>

                              <div className="mobile-line" />
                            </div>
                          }
                          placeholder={t`user.field.reuse_11`}
                        />
                      </Form.Item>
                    </>
                  )
                }
                if (type === t`user.safety_items_04`) {
                  content = (
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: t`user.validate_form_02`,
                          validator: (_, val) => {
                            if (!val) return Promise.reject(new Error(t`user.validate_form_02`))
                            return Promise.resolve()
                          },
                        },
                      ]}
                      name="contactInformation"
                      key="contactInformation"
                    >
                      <Input placeholder={t`user.validate_form_02`} />
                    </Form.Item>
                  )
                }

                return content
              }}
            </Form.Item>

            <ActionSheet
              visible={mediaActionSheetVisibel}
              onCancel={() => {
                setMediaActionSheetVisibel(false)
              }}
              cancelText={t`assets.financial-record.cancel`}
              className={Styles.contact}
            >
              {actionMediaList?.map(item => {
                return (
                  <div
                    onClick={() => {
                      item.callback()
                    }}
                    style={{ height: '50px', border: 'none' }}
                    className="flex items-center justify-center bg-card_bg_color_03"
                    key={item.name}
                  >
                    {item?.codeVal && <Image className="!w-4 !h-4 mr-2" lazyload src={item?.codeVal} />}
                    {item?.name}
                  </div>
                )
              })}
            </ActionSheet>
            <Form.Item
              rules={[
                {
                  validator: (_, value) => {
                    if (!selectSocialMedia?.codeVal) {
                      return Promise.reject(new Error(t`features_agent_agent_join_index_6txfple4fed0-yovsptif`))
                    }
                    if (!value) {
                      return Promise.reject(new Error(t`features_agent_agent_join_index_dbgp8rats6qzieo-8ehzs`))
                    }

                    return Promise.resolve(true)
                  },
                },
              ]}
              key="socialMedia"
              name="socialMedia"
              className="phone-form-field"
              label={t`features_agent_agent_join_index_rycihfuthhoyqgtxsaqug`}
            >
              <Field
                prefix={
                  <div
                    className="mobile-left"
                    onClick={() => {
                      setMediaActionSheetVisibel(true)
                    }}
                  >
                    <div className="flex items-center">
                      {selectSocialMedia?.codeKey ? (
                        <>
                          <Image className="w-4 h-4 mr-1" lazyload src={selectSocialMedia?.codeVal} />
                          <span className="text-sm text-text_color_01">{selectSocialMedia?.codeKey}</span>
                          <Icon name="regsiter_icon_drop" className="down-area ml-1" hasTheme />
                        </>
                      ) : (
                        <>
                          <div className="text-sm text-text_color_04">
                            {t`features_agent_agent_join_index_6txfple4fed0-yovsptif`}{' '}
                          </div>
                          <Icon name="regsiter_icon_drop" className="down-area ml-1" hasTheme />
                        </>
                      )}

                      <div className="mobile-line" />
                    </div>
                  </div>
                }
                placeholder={
                  selectSocialMedia.codeKey
                    ? t({
                        id: 'features_agent_agent_join_index_ffujcwl3hzjoaol_dsqne',
                        values: { 0: selectSocialMedia.codeKey },
                      })
                    : t`features_agent_agent_join_index_dbgp8rats6qzieo-8ehzs`
                }
              />
            </Form.Item>

            <Form.Item name="comment" label={t`features_agent_agent_join_index_5101574`}>
              <Input.TextArea
                rows={4}
                // autoSize={{ maxHeight: 382 }}
                onChange={v => inputChange(v, true)}
                maxLength={500}
                showWordLimit
                className="text-area"
              />
            </Form.Item>
          </Form>

          <Popup visible={confirmVisible} className={Styles.notice} style={{ width: '298px' }} onClose={onConfirmClose}>
            <div className="title">{t`features_agent_agent_join_index_5101576`}</div>
            <div className="content">{t`features_agent_agent_join_index_hbfgzcysgy`}</div>
            <div className="button-wrap">
              <Button onClick={onConfirmClose} className="cancel-button">
                {t`assets.financial-record.cancel`}
              </Button>
              <Button onClick={onConfirm} loading={applyLoading} className="confirm-button">
                {t`user.field.reuse_17`}
              </Button>
            </div>
          </Popup>
        </div>
        <UserSearchArea
          visible={selectArea}
          checkedValue={area?.codeVal}
          type={UserSelectAreaTypeEnum.phone}
          placeholderText={t`user.field.reuse_25`}
          selectArea={handleSelectArea}
          onClose={() => setSelectArea(false)}
        />
      </div>
    </div>
  )
}

export default AgentJoin
