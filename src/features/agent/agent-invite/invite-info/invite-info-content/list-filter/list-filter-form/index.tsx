import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { Popup, Toast, Button, Form } from '@nbit/vant'

import CommonDatePicker from '@/components/common-date-picker'
import { AgentInviteContentListFilterFormInviteSelector } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/list-filter-form/selectors'
import { dateFormatEnum } from '@/constants/dateFomat'
import { InviteFilterInviteTypeEnum, InviteFilterKycEnum } from '@/constants/agent/invite'
import { FormItemGroup } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/form-item-group'
import { isEmpty, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { useAgentProductLine } from '@/hooks/features/agent/invite'
import styles from './index.module.css'

function AgentInviteContentListFilterForm() {
  const store = useAgentInviteStore()
  const isAgent = !!store.cache.userStatus.agtInvitationCode
  // const { hasBorrow, hasSpot, hasContract, hasOption, hasRecreation } = useAgentProductLine()
  const [form] = Form.useForm()

  const isAgtFormVal = Form.useWatch('isAgt', form)
  const isAgt = isAgent ? isAgtFormVal : false
  const defaultDataRange = { registerStartTime: null, registerEndTime: null }
  const [dateRange, setDateRange] = useState(defaultDataRange)

  useEffect(() => {
    form.resetFields()
  }, [store.filterSetting.uid])

  const onFinish = () => {
    const values = form.getFieldsValue()

    form
      .validateFields()
      .then(() => {
        let formData = {}
        Object.keys(values).forEach(key => {
          const value = values[key]
          formData = {
            ...formData,
            ...(Array.isArray(value) ? { [key]: value[0] } : value),
          }
        })

        formData = omitBy(
          {
            ...formData,
            ...dateRange,
          },
          x => !x
        )

        if (isEmpty(formData)) {
          store.resetFilterSetting()
        } else {
          store.setFilterSettingFromEditing(formData)
        }
        store.toggleFilterForm()
      })
      .catch(error => {
        Toast.info({ message: error })
      })
  }

  const commonRules = (key1, key2) => [
    {
      validator: agentInviteHelper.commonPairFormValidator(key1, key2),
    },
  ]

  return (
    <Form
      form={form}
      className={styles.scoped}
      footer={
        <div className={styles['form-btn-footer']}>
          <Button
            onClick={() => {
              form.resetFields()
              setDateRange(defaultDataRange)
              store.resetFilterSetting(agentInviteHelper.getFilterSettingDefault())
            }}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button nativeType="submit" type="primary" onClick={onFinish}>
            {t`assets.financial-record.complete`}
          </Button>
        </div>
      }
    >
      {isAgent && (
        <Form.Item
          name={'isAgt'}
          initialValue={[InviteFilterInviteTypeEnum.total]}
          layout="vertical"
          label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101423`}
        >
          <AgentInviteContentListFilterFormInviteSelector options={agentInviteHelper.getInviteTypeOptions(isAgent)} />
        </Form.Item>
      )}
      <Form.Item
        name={'kycStatus'}
        initialValue={[InviteFilterKycEnum.total]}
        layout="vertical"
        label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101424`}
      >
        <AgentInviteContentListFilterFormInviteSelector options={agentInviteHelper.getKycStatusOptions()} />
      </Form.Item>

      <Form.Item
        layout="vertical"
        label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_index_5101418`}
        name={'childNumPair'}
        initialValue={{
          minChildNum: '',
          maxChildNum: '',
        }}
        rules={commonRules('minChildNum', 'maxChildNum')}
      >
        <FormItemGroup
          key1={'minChildNum'}
          key2={'maxChildNum'}
          placeholder1={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101425`}
          placeholder2={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101426`}
        />
      </Form.Item>

      {/* {(isAgt || [])[0] !== InviteFilterInviteTypeEnum.normalInvite && (
        <>
          {hasSpot && (
            <Form.Item
              layout="vertical"
              label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101427`}
              name="spotPair"
              rules={commonRules('minSpot', 'maxSpot')}
              initialValue={{
                minSpot: '',
                maxSpot: '',
              }}
            >
              <FormItemGroup
                suffix={'%'}
                key1="minSpot"
                key2="maxSpot"
                placeholder1={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101428`}
                placeholder2={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101429`}
              />
            </Form.Item>
          )}

          {hasContract && (
            <Form.Item
              layout="vertical"
              label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101430`}
              name={'contractPair'}
              rules={commonRules('minContract', 'maxContract')}
              initialValue={{
                minContract: '',
                maxContract: '',
              }}
            >
              <FormItemGroup
                suffix={'%'}
                key1="minContract"
                key2="maxContract"
                placeholder1={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101428`}
                placeholder2={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101429`}
              />
            </Form.Item>
          )}

          {hasBorrow && (
            <Form.Item
              layout="vertical"
              label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101431`}
              name={'borrowPair'}
              rules={commonRules('minBorrow', 'maxBorrow')}
              initialValue={{
                minBorrow: '',
                maxBorrow: '',
              }}
            >
              <FormItemGroup
                suffix={'%'}
                key1="minBorrow"
                key2="maxBorrow"
                placeholder1={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101428`}
                placeholder2={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101429`}
              />
            </Form.Item>
          )}
        </>
      )} */}

      <Form.Item
        layout="vertical"
        label={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_list_filter_form_index_5101432`}
        // name={'datePair'}
      >
        <CommonDatePicker
          startDate={dateRange.registerStartTime as any}
          endDate={dateRange.registerEndTime as any}
          showTitle={false}
          onChange={val => {
            setDateRange({
              registerStartTime: val.startDate,
              registerEndTime: val.endDate,
            })
          }}
          dateTemplate={dateFormatEnum.date}
          max={730}
        />
      </Form.Item>
    </Form>
  )
}

export function AgentInviteContentListFilterFormPopover() {
  const store = useAgentInviteStore()
  return (
    <div>
      <Popup
        className={styles['filter-form-popup']}
        visible={store.isFilterFormOpen}
        title={t`features/assets/financial-record/record-screen-modal/index-0`}
        closeable
        position="bottom"
        round
        onClose={store.toggleFilterForm}
      >
        <AgentInviteContentListFilterForm />
      </Popup>
    </div>
  )
}
