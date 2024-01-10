/**
 * 代理中心 - 返佣详情 - 筛选弹窗
 */
import { Button, Input, Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { useGetState, useUpdateEffect } from 'ahooks'
import { initRebateDetailForm, useAgentCenterStore } from '@/store/agent/agent-center/center'
import { FinancialRecordRebateTypeEnum } from '@/constants/assets'
import {
  AgentModalTypeEnum,
  ThreeLevelRebateLevelsList,
  getThreeLevelRebateLevelsTypeName,
} from '@/constants/agent/agent-center/center'
import { useState } from 'react'
import { AgentCenterRebateDetailReq } from '@/typings/api/agent/agent-center/center'
import { getTextFromStoreEnums } from '@/helper/store'
import { t } from '@lingui/macro'
import { onSetPositionOffset } from '@/helper/assets/futures'
import styles from './index.module.css'

interface IRebateFilterModalProps {
  visible: boolean
  onClose: () => void
}

function RebateFilterModal(props: IRebateFilterModalProps) {
  const { visible, onClose } = props || {}
  const { currentModalTab, rebateDetailForm, agentCenterEnums, agentCenterOverview, updateRebateDetailForm } =
    useAgentCenterStore() || {}
  const [formData, setFormData, getFormData] = useGetState<AgentCenterRebateDetailReq>(rebateDetailForm)
  const rebateTypeList = [FinancialRecordRebateTypeEnum.selfRebate, FinancialRecordRebateTypeEnum.teamRebate]
  const [errInfo, setErrInfo] = useState({
    amountErr: '',
  })

  const onCommit = () => {
    if (errInfo?.amountErr) return
    const { minAmount, maxAmount, rebateType, rebateLevel } = getFormData()
    updateRebateDetailForm({ minAmount, maxAmount, rebateType, rebateLevel })
    onClose()
  }

  useUpdateEffect(() => {
    if ((formData.minAmount && !formData.maxAmount) || (!formData.minAmount && formData.maxAmount)) {
      setErrInfo({
        amountErr: t`features_agent_agent_center_center_common_rebate_details_rebate_filter_modal_index_mqkfnie1rc`,
      })

      return
    }

    if (formData.minAmount && formData.maxAmount && +formData.minAmount > +formData.maxAmount) {
      setErrInfo({
        amountErr: t`features_agent_agent_center_center_common_rebate_details_rebate_filter_modal_index_0obtznvz9k`,
      })

      return
    }

    setErrInfo({
      amountErr: '',
    })
  }, [formData.minAmount, formData.maxAmount])

  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={onClose}
      className={styles['rebate-filter-modal-root']}
      closeOnPopstate
      safeAreaInsetBottom
      destroyOnClose
    >
      <div className="modal-header">
        <div className="header-title">{t`features/assets/financial-record/record-screen-modal/index-0`}</div>
        <Icon name="close" hasTheme className="close-icon" onClick={onClose} />
      </div>

      <div className="modal-content">
        <div className="filter-label">
          {currentModalTab === AgentModalTypeEnum.threeLevel
            ? t`features_agent_agent_center_center_common_rebate_details_rebate_filter_modal_index_yavuq_xeor`
            : t`features_assets_financial_record_record_list_record_list_screen_index_ytmqhrglog`}
        </div>
        <div className="type-wrap">
          {currentModalTab !== AgentModalTypeEnum.threeLevel && (
            <>
              <div
                className={classNames('type-cell', {
                  active: !formData?.rebateType,
                })}
                onClick={() => setFormData({ ...getFormData(), rebateType: '' })}
              >{t`constants_market_market_list_market_module_index_5101071`}</div>
              {rebateTypeList.map((type: string) => {
                return (
                  <div
                    className={classNames('type-cell', {
                      active: formData?.rebateType === type,
                    })}
                    key={type}
                    onClick={() => {
                      if (formData?.rebateType === type) return
                      setFormData({ ...getFormData(), rebateType: type })
                    }}
                  >
                    {getTextFromStoreEnums(type, agentCenterEnums.agentRebateTypeEnum.enums)}
                  </div>
                )
              })}
            </>
          )}

          {currentModalTab === AgentModalTypeEnum.threeLevel &&
            ThreeLevelRebateLevelsList.map((levels: number) => {
              return (
                <div
                  className={classNames('type-cell', {
                    active: formData?.rebateLevel === levels,
                  })}
                  key={levels}
                  onClick={() => {
                    if (formData?.rebateLevel === levels) return
                    setFormData({ ...getFormData(), rebateLevel: levels })
                  }}
                >
                  {getThreeLevelRebateLevelsTypeName(levels)}
                </div>
              )
            })}
        </div>

        <div className="flex flex-col pb-6 relative">
          <div className="filter-label">
            {t({
              id: `features_agent_agent_center_center_common_rebate_details_rebate_filter_modal_index_xiz0v5_t45`,
              values: { 0: agentCenterOverview?.currencySymbol || '--' },
            })}
          </div>
          <div className="amount-range-wrap !mb-0">
            <Input
              value={formData?.minAmount}
              type="number"
              onChange={val => setFormData({ ...getFormData(), minAmount: onSetPositionOffset(val, 2) })}
              placeholder={t`features_agent_agent_gains_stats_table_stats_table_filter_form_filter_form_index_5101391`}
              className="amount-cell"
              align="center"
            />

            <div className="amount-interval">-</div>

            <Input
              value={formData?.maxAmount}
              type="number"
              onChange={val => setFormData({ ...getFormData(), maxAmount: onSetPositionOffset(val, 2) })}
              placeholder={t`components_chart_indicator_pop_index_510187`}
              className="amount-cell"
              align="center"
            />
          </div>
          {errInfo?.amountErr && <div className="err-text">{errInfo?.amountErr}</div>}
        </div>
      </div>

      <div className="modal-bottom">
        <Button
          className="modal-btn mr-4 bg-card_bg_color_02 border-card_bg_color_02"
          onClick={() => setFormData(initRebateDetailForm)}
        >
          {t`features/assets/financial-record/record-screen-modal/index-1`}
        </Button>
        <Button className="modal-btn" type="primary" onClick={onCommit}>
          {t`assets.financial-record.complete`}
        </Button>
      </div>
    </Popup>
  )
}

export { RebateFilterModal }
