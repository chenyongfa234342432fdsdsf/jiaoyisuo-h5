import CommonDatePicker from '@/components/common-date-picker'
import { getDefaultFilterSetting, useAgentStatsStore } from '@/store/agent/agent-gains'
import { t } from '@lingui/macro'
import { decimalUtils } from '@nbit/utils'
import { Button, Form, Toast } from '@nbit/vant'
import { useEffect, useState } from 'react'
import { FormItemGroup } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/form-item-group'
import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { ProductDataFilterSelector, RebateDataFilterSelector } from '../data-filter-selector'
import styles from './index.module.css'

function FilterForm() {
  const { filterSetting, setFilterSetting, toggleFilterForm } = useAgentStatsStore()
  const store = useAgentInviteStore()
  const [formData, setformData] = useState(filterSetting)

  const [form] = Form.useForm()

  useEffect(() => {
    setformData(filterSetting)
  }, [filterSetting])

  const commonRules = (key1, key2) => [
    {
      validator: agentInviteHelper.commonPairFormValidator(key1, key2),
    },
  ]
  // limit input to 2 decimal places
  const inputValidation = input => {
    const numDecimal = input.split('.')[1]?.length || 0
    if (numDecimal > 2) return false
    return true
  }

  return (
    <Form
      form={form}
      className={styles.scoped}
      footer={
        <div className={styles['form-btn-footer']}>
          <Button
            className="reset-btn"
            onClick={() => {
              form.resetFields()
              setFilterSetting(getDefaultFilterSetting())
            }}
          >{t`features/assets/financial-record/record-screen-modal/index-1`}</Button>
          <Button nativeType="submit" type="primary">
            {t`assets.financial-record.complete`}
          </Button>
        </div>
      }
      onFinish={() => {
        form.validateFields().then(() => {
          const values = form.getFieldsValue()
          const { borrowCoinMin: minAmount, borrowCoinMax: maxAmount } = values?.borrowPair || {}
          setFilterSetting({ ...formData, minAmount, maxAmount })
          toggleFilterForm()
        })
      }}
    >
      {/* <Form.Item
        layout="vertical"
        label={t`features_assets_financial_record_record_list_record_list_screen_index_gzrjucuusr`}
      >
        <ProductDataFilterSelector
          value={[formData.productCd]}
          onChange={arr =>
            setformData(prev => {
              return {
                ...prev,
                productCd: arr[0],
              }
            })
          }
        />
      </Form.Item> */}
      <Form.Item
        layout="vertical"
        label={t`features_agent_agent_gains_stats_table_stats_table_filter_form_filter_form_index_5101390`}
      >
        <RebateDataFilterSelector
          value={[formData.rebateTypeCd]}
          onChange={arr =>
            setformData(prev => {
              return {
                ...prev,
                rebateTypeCd: arr[0],
              }
            })
          }
        />
      </Form.Item>
      <Form.Item
        layout="vertical"
        name="dateTime"
        label={t`features_agent_agent_gains_stats_table_stats_table_filter_form_filter_form_index_5101618`}
      >
        <CommonDatePicker
          startDate={(formData.startDate || null) as any}
          endDate={(formData.endDate || null) as any}
          showTitle={false}
          onChange={val =>
            setformData(prev => {
              return {
                ...prev,
                startDate: val.startDate,
                endDate: val.endDate,
              }
            })
          }
          dateTemplate={'YYYY-MM-DD'}
          max={730}
        />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label={t`features_agent_agent_gains_stats_table_stats_table_filter_form_filter_form_index_5101619`}
        name="borrowPair"
        rules={commonRules('borrowCoinMin', 'borrowCoinMax')}
        initialValue={{
          borrowCoinMin: '',
          borrowCoinMax: '',
        }}
      >
        <FormItemGroup
          key1="borrowCoinMin"
          key2="borrowCoinMax"
          placeholder1={t`features_agent_agent_gains_stats_table_stats_table_filter_form_filter_form_index_5101391`}
          placeholder2={t`components_chart_indicator_pop_index_510187`}
          inputValidation={inputValidation}
        />
      </Form.Item>
    </Form>
  )
}

export default FilterForm
