/**
 * 代理中心 - 返佣详情列表
 */
import { CommonDigital, DigitalModuleTypeEnum } from '@/components/common-digital'
import Icon from '@/components/icon'
import { AgentModalTypeEnum, getRebateRatioDesc } from '@/constants/agent/agent-center/center'
import { formatDate } from '@/helper/date'
import { formatCurrency } from '@/helper/decimal'
import { getTextFromStoreEnums } from '@/helper/store'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { IAgentRebateList } from '@/typings/api/agent/agent-center/center'
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import { useState } from 'react'
import { FinancialRecordRebateTypeEnum } from '@/constants/assets'
import styles from '../layout/index.module.css'

function RebateCell({ data }: { data: IAgentRebateList }) {
  const { agentCenterEnums, currentModalTab } = useAgentCenterStore() || {}
  const [isOpen, setIsOpen] = useState(false)
  const [ratioVisible, setRatioVisible] = useState(false)

  const rebateInfo = [
    {
      label: t({
        id: `features_agent_agent_center_center_common_rebate_details_rebate_cell_index_5yrfddyl2c`,
        values: {
          0: data?.symbol || '--',
        },
      }),
      value: formatCurrency(data?.teamFee, data?.currencyOffset, false),
      isEncrypt: true,
      isHide: currentModalTab === AgentModalTypeEnum.threeLevel,
    },
    {
      label: t({
        id: `features_agent_agent_center_center_common_rebate_details_rebate_cell_index_6cupcmu2ln`,
        values: {
          0: data?.symbol || '--',
        },
      }),
      value: formatCurrency(data?.fee, data?.currencyOffset, false),
      isEncrypt: true,
      isHide: currentModalTab !== AgentModalTypeEnum.threeLevel,
    },
    {
      label: t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_tfibas2evs`,
      value: data?.rebateType === FinancialRecordRebateTypeEnum.selfRebate ? '--' : data?.childUid,
      isEncrypt: true,
    },
    {
      label: t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_xqvf99m0wh`,
      value:
        data?.rebateType === FinancialRecordRebateTypeEnum.selfRebate
          ? '--'
          : `v${data?.rebateLevel || '--'} / ${data?.rebateRatio}%`,
      isEncrypt: true,
      isHide: currentModalTab !== AgentModalTypeEnum.area,
    },
    {
      label: t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_ssktryuf3c`,
      value: t({
        id: 'features_agent_agent_center_center_common_rebate_details_rebate_cell_index_cg59_h6zxf',
        values: { 0: data?.rebateLevel },
      }),
      isEncrypt: true,
      isHide: currentModalTab !== AgentModalTypeEnum.threeLevel,
    },
    {
      label: t`features_assets_financial_record_record_list_record_list_screen_index_gzrjucuusr`,
      value: getTextFromStoreEnums(data?.productCd || '', agentCenterEnums.agentProductCdRatioEnum.enums),
    },
    {
      label: t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_ya4hfq0lwm`,
      value: `${data?.ratioActual}%`,
      isEncrypt: true,
      isHint: true,
    },
    {
      label: t`features_assets_financial_record_record_list_record_list_screen_index_ytmqhrglog`,
      value: getTextFromStoreEnums(data?.rebateType || '', agentCenterEnums.agentRebateTypeEnum.enums),
      isHide: currentModalTab === AgentModalTypeEnum.threeLevel,
    },
    {
      label: t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_ihb5hvpwqv`,
      value: formatDate(data?.rebateDate),
    },
  ]

  return (
    <>
      <div className="rebate-cell-wrap">
        <div className="rebate-header">
          <div className="rebate-coin">{data?.symbol}</div>

          <div className="rebate-amount-wrap">
            <CommonDigital
              content={formatCurrency(data?.amount, data?.currencyOffset, false)}
              isEncrypt
              moduleType={DigitalModuleTypeEnum.agent}
              className="rebate-coin rebate-amount"
            />
            <Icon
              name={isOpen ? 'icon_agent_away' : 'icon_agent_drop'}
              hasTheme
              className="rebate-expand"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>

        {!isOpen && (
          <div className="rebate-info">
            <div>{formatDate(data?.rebateDate)}</div>
            <div>
              {getTextFromStoreEnums(data?.productCd || '', agentCenterEnums.agentProductCdRatioEnum.enums)}{' '}
              {currentModalTab !== AgentModalTypeEnum.threeLevel &&
                getTextFromStoreEnums(data?.rebateType || '', agentCenterEnums.agentRebateTypeEnum.enums)}
            </div>
          </div>
        )}

        {isOpen &&
          rebateInfo?.map((info, i: number) => {
            if (info?.isHide) return null

            return (
              <div className="rebate-info" key={i}>
                <div className="flex items-center">
                  <span>{info?.label}</span>
                  {info?.isHint && (
                    <Icon name="msg" className="msg-icon" hasTheme onClick={() => setRatioVisible(true)} />
                  )}
                </div>
                <CommonDigital
                  content={info?.value}
                  isEncrypt={info?.isEncrypt}
                  moduleType={DigitalModuleTypeEnum.agent}
                  className="w-1/2 text-right"
                />
              </div>
            )
          })}
      </div>
      <Popup visible={ratioVisible} onClose={() => setRatioVisible(false)} className={styles['rebate-ratio-desc-root']}>
        <div className="modal-title">{t`features_agent_agent_center_center_common_rebate_details_rebate_cell_index_ya4hfq0lwm`}</div>
        {getRebateRatioDesc(currentModalTab)?.map((desc, i: number) => {
          return (
            <div key={i} className="modal-content">
              {desc}
            </div>
          )
        })}
        <Button type="primary" className="modal-btn" onClick={() => setRatioVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </>
  )
}

export { RebateCell }
