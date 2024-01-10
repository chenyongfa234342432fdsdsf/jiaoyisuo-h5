import Icon from '@/components/icon'
import { agentModuleRoutes } from '@/constants/agent'
import { link } from '@/helper/link'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { Card, Divider } from '@nbit/vant'
import classNames from 'classnames'
import HideContent from '@/features/agent/common/hide-content'
import { getV2AgtRebateInfoHistoryOverviewApiRequest } from '@/apis/agent'
import {
  YapiGetV2AgtRebateInfoHistoryOverviewData,
  YapiGetV2AgtRebateInfoHistoryOverviewApiRequest,
} from '@/typings/yapi/AgtRebateInfoHistoryOverviewV2GetApi'
import { useState, useEffect, useMemo } from 'react'
import AgentDatetimeTabs from '@/features/agent/common/agent-datetime-tabs'
import InfoColumn from '@/features/agent/common/stats-info-box/info-column'
import { useMount } from 'ahooks'
import { getV1AgentInviteAnalysisOverviewApiRequest } from '@/apis/agent/invite'
import { YapiGetV1AgentInviteAnalysisOverviewData } from '@/typings/yapi/AgentInviteAnalysisOverviewV1GetApi'
import { DateOptionsTypesInvite, infoHeaderTypesInvite } from '@/constants/agent/invite'
import styles from './index.module.css'

function AgentInviteHeader({ showAnalysis }) {
  const { isHideMyInfo, ...store } = useAgentInviteStore()
  store.hooks.useAgentInviteInfoOverviewInit()

  const [headerData, setheaderData] = useState<YapiGetV2AgtRebateInfoHistoryOverviewData>()
  const [headerData2, setheaderData2] = useState<YapiGetV1AgentInviteAnalysisOverviewData>()
  const { filterSetting, setFilterSetting } = useAgentInviteStore()

  useEffect(() => {
    const apiParams: YapiGetV2AgtRebateInfoHistoryOverviewApiRequest = {
      startDate: filterSetting.registerStartTime as string,
      endDate: filterSetting.registerEndTime as string,
    }
    getV2AgtRebateInfoHistoryOverviewApiRequest(apiParams).then(res => setheaderData(res.data))
  }, [filterSetting.registerStartTime, filterSetting.registerEndTime])

  useMount(() => {
    getV1AgentInviteAnalysisOverviewApiRequest({}).then(res => {
      if (res.isOk) {
        setheaderData2(res.data)
      }
    })
  })

  const titleMap = useMemo(() => {
    return infoHeaderTypesInvite()
  }, [])

  return (
    <div className={styles.scoped}>
      {showAnalysis && (
        <AgentDatetimeTabs filterSetting={store.filterSetting} setFilterSetting={store.setFilterDateRange} />
      )}

      <div className={styles.card}>
        <div className={classNames(`flex flex-row ${showAnalysis ? 'px-3' : 'px-8'}`, { 'justify-between ': true })}>
          <span>
            <span className="mr-1 text-text_color_02 text-xs">{t`features_agent_agent_invite_invite_info_invite_info_header_index_bfe4ntaf7d`}</span>
            <Icon
              name={isHideMyInfo ? 'eyes_close' : 'eyes_open'}
              hasTheme
              className="total-icon"
              onClick={() => store.toggleIsHideMyInfo()}
            />
            <div className="flex flex-row items-center common-digit-wrapper">
              <HideContent
                className={`bold-text text-text_color_01 mt-1 ${showAnalysis ? 'show-analysis' : 'not-show-analysis'}`}
                isHide={isHideMyInfo}
              >
                <>{headerData?.invitedNum || 0}</>
              </HideContent>

              {showAnalysis && (
                <span
                  onClick={() => link(agentModuleRoutes.inviteAnalytics)}
                  className="text-brand_color text-xs ml-1 pb-1 text-wrapper"
                >
                  {t`features_agent_common_stats_info_box_index_5101374`}
                </span>
              )}
            </div>
          </span>
          <span>
            <span className="text-text_color_02 text-xs">{t`features_agent_agent_invite_invite_info_invite_info_header_index_m95oehucty`}</span>

            <HideContent
              className={`bold-text text-text_color_01 mt-1 ${showAnalysis ? 'show-analysis' : 'not-show-analysis'}`}
              isHide={isHideMyInfo}
            >
              <>{headerData?.invitedTeamNum || 0}</>
            </HideContent>
          </span>
        </div>

        {!showAnalysis && (
          <>
            <Divider />
            <div className="info-bar">
              <InfoColumn
                title={titleMap[DateOptionsTypesInvite.now]?.title}
                popupContent={titleMap[DateOptionsTypesInvite.now]?.content}
                value={headerData2?.today || 0}
                hasIcon
                isHide={isHideMyInfo}
                isFinanceValue={false}
              />
              <InfoColumn
                title={titleMap[DateOptionsTypesInvite.last7Days]?.title}
                popupContent={titleMap[DateOptionsTypesInvite.last7Days]?.content}
                value={headerData2?.sevenDays || 0}
                hasIcon
                isHide={isHideMyInfo}
                isFinanceValue={false}
              />
              <InfoColumn
                title={titleMap[DateOptionsTypesInvite.last30Days]?.title}
                popupContent={titleMap[DateOptionsTypesInvite.last30Days]?.content}
                value={headerData2?.thirtyDays || 0}
                hasIcon
                isHide={isHideMyInfo}
                isFinanceValue={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgentInviteHeader
