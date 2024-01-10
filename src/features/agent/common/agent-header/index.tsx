import Icon from '@/components/icon'
import { DateOptionsTypes, agentRebateHeaderTitleMap, infoHeaderTypes } from '@/constants/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { YapiGetV2AgtRebateInfoHistoryOverviewData } from '@/typings/yapi/AgtRebateInfoHistoryOverviewV2GetApi'
import { t } from '@lingui/macro'
import { Divider } from '@nbit/vant'
import { IncreaseTag } from '@nbit/react'
import { YapiGetV1AgentRebateAnalysisOverviewData } from '@/typings/yapi/AgentRebateAnalysisOverviewV1GetApi'
import { link } from '@/helper/link'
import { FinanceValue } from '@/features/agent/agent-invite/invite-check-more-v3/display-table/table-schema'
import { useAgentStore } from '@/store/agent'
import { useMount } from 'ahooks'
import styles from './index.module.css'
import HideContent from '../hide-content'
import InfoColumn from '../stats-info-box/info-column'

function AgentHeader({ data }: { data: YapiGetV2AgtRebateInfoHistoryOverviewData | undefined }) {
  const { fetchAgentCurrencyInfo, agentCurrencyInfo } = useAgentStore()
  useMount(() => {
    fetchAgentCurrencyInfo()
  })
  const { rebateCurrency, isHideMyInfo, toggleIsHideMyInfo } = useAgentStatsStore()
  return (
    <div className={styles.scoped}>
      <div className="flex flex-row justify-between">
        <span>
          <span className="mr-1 text-text_color_02 text-xs">
            {t`constants_agent_index_8nhiia3zsm`} ({agentCurrencyInfo.currencySymbol || '-'})
          </span>
          <Icon
            name={isHideMyInfo ? 'eyes_close' : 'eyes_open'}
            hasTheme
            className="m-0 hide-icon"
            onClick={() => toggleIsHideMyInfo()}
          />
          <div className="flex flex-row items-center">
            <HideContent className="info-encrypt" isHide={isHideMyInfo}>
              <FinanceValue val={data?.totalRebate} precision={agentCurrencyInfo.offset} />
            </HideContent>
            <span onClick={() => link('/agent/gains/detail')} className="text-brand_color text-xs ml-1 mt-auto mb-1">
              {t`features_agent_common_stats_info_box_index_5101374`}
            </span>
          </div>
        </span>
        <div className="text-right">
          <span className="text-text_color_02 text-xs">{t`features_agent_common_stats_info_box_index_5101376`}</span>
          <div className="mt-1 text-sm font-medium">{data?.currencySettlement || '-'}</div>
        </div>
      </div>
      <div className="header-grid">
        {Object.keys(agentRebateHeaderTitleMap()).map((key, index) => (
          <div key={index}>
            <div>
              {agentRebateHeaderTitleMap()[key]} ({data?.legalCur})
            </div>
            <FinanceValue val={data?.[key]} precision={agentCurrencyInfo.offset} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgentAnalyticsHeader({ data }: { data: YapiGetV1AgentRebateAnalysisOverviewData | undefined }) {
  const { fetchAgentCurrencyInfo, agentCurrencyInfo } = useAgentStore()
  useMount(() => {
    fetchAgentCurrencyInfo()
  })
  const { rebateCurrency, isHideMyInfo, toggleIsHideMyInfo } = useAgentStatsStore()
  return (
    <div className={styles['agent-analytics-header']}>
      {data && (
        <>
          <div className="px-4">
            <span className="mr-1 text-text_color_02 text-xs">
              {t`features_agent_common_stats_info_box_index_5101375`} ({agentCurrencyInfo.currencySymbol || '-'})
            </span>
            <Icon
              name={isHideMyInfo ? 'eyes_close' : 'eyes_open'}
              hasTheme
              className="m-0"
              onClick={() => toggleIsHideMyInfo()}
            />
            <HideContent className="info-encrypt" isHide={isHideMyInfo}>
              <FinanceValue val={data?.totalRebate} precision={agentCurrencyInfo.offset} />
            </HideContent>
          </div>
          <Divider />
          <div className="info-bar">
            <InfoColumn
              title={infoHeaderTypes()[DateOptionsTypes.now]?.title}
              popupContent={infoHeaderTypes()[DateOptionsTypes.now]?.content}
              value={data.todayRebate}
              hasIcon
              isHide={isHideMyInfo}
              isFinanceValue
              precision={agentCurrencyInfo.offset}
            />
            <InfoColumn
              title={infoHeaderTypes()[DateOptionsTypes.last7Days]?.title}
              popupContent={infoHeaderTypes()[DateOptionsTypes.last7Days]?.content}
              value={data.sevenDaysRebate}
              hasIcon
              isHide={isHideMyInfo}
              isFinanceValue
              precision={agentCurrencyInfo.offset}
            />
            <InfoColumn
              title={infoHeaderTypes()[DateOptionsTypes.last30Days]?.title}
              popupContent={infoHeaderTypes()[DateOptionsTypes.last30Days]?.content}
              value={data.thirtyDaysRebate}
              hasIcon
              isHide={isHideMyInfo}
              isFinanceValue
              precision={agentCurrencyInfo.offset}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AgentHeader
