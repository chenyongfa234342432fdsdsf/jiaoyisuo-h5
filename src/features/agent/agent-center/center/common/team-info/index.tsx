/**
 * 代理中心 - 团队信息（手续费、邀请人数）
 */
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { AgentModalTypeEnum, getAgentCenterOverviewKeyByModalType } from '@/constants/agent/agent-center/center'
import { Button, Popup } from '@nbit/vant'
import { t } from '@lingui/macro'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { IAgentRebateOverview } from '@/typings/api/agent/agent-center/center'
import { isNumber } from 'lodash'
import { formatCurrency } from '@/helper/decimal'
import { rateFilterAgent } from '@/helper/agent/center'
import styles from './index.module.css'

interface IInfoList {
  label: string
  value: number | string
  showNew?: boolean
  newAdd?: number | string
  showMsg?: boolean
}

function TeamInfo() {
  const { encryption, agentCenterOverview, currentModalTab, currentCurrency } = useAgentCenterStore() || {}
  const [infoList, setInfoList] = useState<IInfoList[]>([])
  const [msgVisible, setMsgVisible] = useState(false)
  const overviewData: IAgentRebateOverview = agentCenterOverview[getAgentCenterOverviewKeyByModalType(currentModalTab)]

  useEffect(() => {
    let newList = [
      {
        label: t`features_agent_invite_describe_index_5101500`,
        value: isNumber(overviewData?.inviteNum) ? `${formatCurrency(overviewData?.inviteNum)}` : '0',
        showNew: overviewData?.inviteNewAdd > 0,
        newAdd: overviewData?.inviteNewAdd || '0',
      },
      {
        label: t`constants_agent_index_jszioqtxqu`,
        value: isNumber(overviewData?.teamNum) ? `${formatCurrency(overviewData?.teamNum)}` : '0',
        showNew: overviewData?.teamNewAdd > 0,
        newAdd: overviewData?.teamNewAdd || '0',
        showMsg: currentModalTab === AgentModalTypeEnum.threeLevel,
      },
    ]

    let feeList: IInfoList[] = []
    if (currentModalTab === AgentModalTypeEnum.threeLevel) {
      feeList = [
        {
          label: t`features_agent_agent_center_center_common_team_info_index_jb4__czlfj`,
          value: rateFilterAgent(overviewData?.firstLevelFee),
        },
        {
          label: t`features_agent_agent_center_center_common_team_info_index_ujpltxjr01`,
          value: rateFilterAgent(overviewData?.secondLevelFee),
        },
        {
          label: t`features_agent_agent_center_center_common_team_info_index_qfmscwztei`,
          value: rateFilterAgent(overviewData?.thirdLevelFee),
        },
      ]
    } else {
      feeList = [
        {
          label: t`features_agent_invite_describe_index_-u9w-c6hgnl42q7ugdx8e`,
          value: rateFilterAgent(overviewData?.teamFee),
        },
      ]
    }

    setInfoList([...feeList, ...newList])
  }, [currentModalTab, overviewData, currentCurrency?.currencyEnName])

  return (
    <>
      <div className={styles['team-info-root']}>
        {infoList?.map((info, i: number) => {
          return (
            <div className="team-info-cell" key={i}>
              <div className="info-wrap">
                <div className="info-cell-row">
                  <div className="info-label">{info?.label}</div>
                  {info?.showMsg && (
                    <Icon name="msg" hasTheme className="info-msg" onClick={() => setMsgVisible(true)} />
                  )}
                </div>

                <div className="info-cell-row">
                  {encryption ? (
                    <div className="info-amount">******</div>
                  ) : (
                    <>
                      <div className="info-amount">{info?.value}</div>
                      {info?.showNew && <div className="info-new">(+{info?.newAdd})</div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Popup className={styles['msg-popup-wrapper']} visible={msgVisible} onClose={() => setMsgVisible(false)}>
        <div className="popup-title">{t`constants_agent_index_jszioqtxqu`}</div>
        <div className="popup-content">{t`features_agent_agent_center_center_common_team_info_index_tcuxjgs8je`}</div>
        <Button type="primary" className="popup-btn" onClick={() => setMsgVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </>
  )
}
export { TeamInfo }
