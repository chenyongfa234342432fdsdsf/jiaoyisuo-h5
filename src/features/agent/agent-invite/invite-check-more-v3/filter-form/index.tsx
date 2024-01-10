import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { Popup, Toast, Button, Form } from '@nbit/vant'
import CommonSelector from '@/components/common-selector'

import { FormItemGroup } from '@/features/agent/common/form-number-range'
import { isEmpty } from 'lodash'
import { dateFormatEnum } from '@/constants/dateFomat'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { SelectorOption, SelectorValue } from '@nbit/vant/es/selector/PropsType'
import { getAreaAgentLevel, postProductList } from '@/apis/agent/invite-v3'
import { requestWithLoading } from '@/helper/order'
import { AgentPopup } from '@/features/agent/common/agent-popup'
import { ApplayModelEnum } from '@/constants/agent'
import CommonDatePicker from './date-picker'
import styles from './index.module.css'

type optionsType = {
  value: string | number
  label: string
}
const defaultAll = '0'
const defaultControlledFormData = {
  // 产品线
  productCd: defaultAll,
  // 区域等级
  areaLevel: defaultAll,
  // 注册时间起止
  startTime: undefined,
  endTime: undefined,
  // 团队人数
  inviteNumMin: undefined,
  inviteNumMax: undefined,
}
type controlledFormDataType = {
  // 产品线 code
  productCd: string | number
  // 区域等级
  areaLevel: string | number
  // 注册开始时间
  startTime: number | undefined
  // 注册结束时间
  endTime: number | undefined
  // 团队人数低
  inviteNumMin: number | undefined | string
  // 团队人数高
  inviteNumMax: number | undefined | string
}

function RebateDataFilterSelector({ value, onChange, options }) {
  return (
    <CommonSelector
      value={value}
      className={styles.selector}
      options={options as SelectorOption<SelectorValue>[]}
      onChange={onChange}
    />
  )
}
type AgentInviteCheckMoreFilterFormPopoverPropsType = {
  /** 是否显示 */
  visible: boolean
  /** 弹窗关闭函数 */
  onCloseFunc: () => void
  /** 字典值集合 */
  dictionary: {
    agentProductCode: {
      codeKey: string
      codeVal: string | number
    }[]
  }
  /** 选择的代理模式 */
  proxyType: string
}
export const AgentInviteCheckMoreFilterFormPopover = React.forwardRef(
  ({ visible, onCloseFunc, dictionary, proxyType }: AgentInviteCheckMoreFilterFormPopoverPropsType, ref) => {
    const store = useAgentInviteStore()

    const [form] = Form.useForm()
    const [controlledFormData, setControlledFormData] = useState<controlledFormDataType>(defaultControlledFormData)
    /** 产品线 */
    const [productLineListOptions, setProductLineListOptions] = useState<optionsType[]>([])
    const [levelListOptions, setLevelListOptions] = useState<optionsType[]>([])
    // 日期校验是否通过
    const [dateValidate, setDateValidate] = useState(true)
    const onFinish = () => {
      form
        .validateFields()
        .then(() => {
          if (!dateValidate) return
          const values = form.getFieldsValue()
          let formData = {}
          Object.keys(values).forEach(key => {
            const value = values[key]

            formData = {
              ...formData,
              ...(value || {}),
            }
          })

          formData = {
            ...formData,
            ...controlledFormData,
          }
          if (isEmpty(formData)) {
            store.resetFilterSettingCheckMoreV2()
          } else {
            store.setFilterSettingCheckMoreV2(formData)
          }
          form.resetFields()
          onCloseFunc()
        })
        .catch(error => {
          Toast.info({ message: error })
        })
    }

    const resetFormState = () => {
      setControlledFormData(defaultControlledFormData)
      form.resetFields()
    }
    /** 让父元素可以进行表单重置 */
    useImperativeHandle(ref, () => ({
      resetFormState: () => {
        setControlledFormData(defaultControlledFormData)
        form.resetFields()
      },
    }))
    const request = async () => {
      const levelListData = (await getAreaAgentLevel({})).data || []
      const productListData = (await postProductList({})).data || []
      // 获取所有产品线
      const lineList =
        productListData?.map(i => {
          const findItem = dictionary?.agentProductCode?.find(item => item.codeVal === i)
          return {
            value: i,
            label: findItem?.codeKey || '',
          }
        }) || []
      lineList?.unshift({ label: t`constants_market_market_list_market_module_index_5101071`, value: defaultAll })
      setProductLineListOptions(lineList)
      /** 获取所有的区域等级 */
      const levelList = levelListData?.reduce((pre: optionsType[], curr) => {
        const type = {
          value: curr,
          label: `v${curr}`,
        }
        pre.push(type)
        return pre
      }, [])
      levelList?.unshift({ label: t`constants_market_market_list_market_module_index_5101071`, value: defaultAll })
      setLevelListOptions(levelList || [])
    }
    useEffect(() => {
      const { productCd, areaLevel, startTime, endTime, inviteNumMin, inviteNumMax } = store.filterSettingCheckMoreV2
      setControlledFormData({
        // 产品线
        productCd: productCd || defaultAll,
        // 区域等级
        areaLevel: areaLevel || defaultAll,
        // 注册时间起止
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        // 团队人数
        inviteNumMin,
        inviteNumMax,
      })
    }, [store.filterSettingCheckMoreV2])
    useEffect(() => {
      requestWithLoading(request(), 0)
    }, [dictionary.agentProductCode.length])
    return (
      <div>
        <AgentPopup
          className={`${styles['filter-form-popup']}`}
          visible={visible}
          title={<span className="title-name">{t`features/assets/financial-record/record-screen-modal/index-0`}</span>}
          closeable
          style={{ height: '524px' }}
          position="bottom"
          round
          onClose={onCloseFunc}
          // closeIcon={<Icon name="" />}
        >
          <Form
            className={styles.scoped}
            form={form}
            footer={
              <div className={styles['form-btn-footer']}>
                <Button
                  onClick={resetFormState}
                >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
                <Button nativeType="submit" type="primary" onClick={onFinish}>
                  {t`assets.financial-record.complete`}
                </Button>
              </div>
            }
          >
            <Form.Item
              layout="vertical"
              label={t`features_assets_financial_record_record_list_record_list_screen_index_gzrjucuusr`}
            >
              {RebateDataFilterSelector({
                options: productLineListOptions,
                value: [controlledFormData.productCd],
                onChange: val => {
                  setControlledFormData(prev => {
                    return {
                      ...prev,
                      productCd: val[0],
                    }
                  })
                },
              })}
            </Form.Item>
            {proxyType === 'area' && (
              <Form.Item
                layout="vertical"
                label={t`features_agent_agent_invite_invite_check_more_v3_filter_form_index_u8l8wdjqi_`}
              >
                {RebateDataFilterSelector({
                  options: levelListOptions,
                  value: [controlledFormData.areaLevel],
                  onChange: val => {
                    setControlledFormData(prev => {
                      return {
                        ...prev,
                        areaLevel: val[0],
                      }
                    })
                  },
                })}
              </Form.Item>
            )}
            <Form.Item
              layout="vertical"
              label={
                proxyType === ApplayModelEnum.threeLevel
                  ? t`features_agent_invite_describe_index_5101500`
                  : t`constants_agent_index_jszioqtxqu`
              }
              name="team"
              className="team-num"
              validateTrigger="onChange"
              rules={[
                {
                  validator: (_, values) => {
                    const { inviteNumMin, inviteNumMax } = values
                    if ((!inviteNumMin && inviteNumMax) || (inviteNumMin && !inviteNumMax)) {
                      return Promise.reject(
                        new Error(t`features_agent_agent_invite_invite_check_more_v3_filter_form_index_3i9_gluvmt`)
                      )
                    }
                    if (inviteNumMin > inviteNumMax) {
                      return Promise.reject(
                        new Error(t`features_agent_agent_invite_invite_check_more_v3_filter_form_index_uv82vzlimf`)
                      )
                    }
                    return Promise.resolve(true)
                  },
                },
              ]}
              initialValue={{
                inviteNumMin: '',
                inviteNumMax: '',
              }}
            >
              <FormItemGroup
                key1="inviteNumMin"
                centerSeparator="-"
                key2="inviteNumMax"
                placeholder1={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101425`}
                placeholder2={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101426`}
                numMin={controlledFormData?.inviteNumMin || ''}
                numMax={controlledFormData?.inviteNumMax || ''}
                value={{
                  inviteNumMin: controlledFormData.inviteNumMin,
                  inviteNumMax: controlledFormData.inviteNumMax,
                }}
                onChange={next => {
                  setControlledFormData(prev => {
                    return {
                      ...prev,
                      inviteNumMin: next.inviteNumMin,
                      inviteNumMax: next.inviteNumMax,
                    }
                  })
                }}
              />
            </Form.Item>
            <Form.Item
              layout="vertical"
              label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101432`}
            >
              {visible && (
                <CommonDatePicker
                  startDate={controlledFormData.startTime}
                  endDate={controlledFormData.endTime}
                  dateValidateResult={val => setDateValidate(val)}
                  onChange={next => {
                    setControlledFormData(prev => {
                      return {
                        ...prev,
                        startTime: next.startDate,
                        endTime: next.endDate,
                      }
                    })
                  }}
                  showTitle={false}
                  dateTemplate={dateFormatEnum.date}
                  max={730}
                />
              )}
            </Form.Item>
          </Form>
        </AgentPopup>
      </div>
    )
  }
)
