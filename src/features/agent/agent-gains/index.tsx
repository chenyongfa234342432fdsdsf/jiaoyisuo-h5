import useScrollTrackerYAxis from '@/hooks/use-scroll-tracker'
import { useQueryRebateInfoDetails } from '@/hooks/features/agent'
import { useUnmount } from 'ahooks'
import { getDefaultFilterSetting, useAgentStatsStore } from '@/store/agent/agent-gains'
import { useEffect, useState } from 'react'
import { getV2AgtRebateInfoHistoryOverviewApiRequest } from '@/apis/agent'
import {
  YapiGetV2AgtRebateInfoHistoryOverviewApiRequest,
  YapiGetV2AgtRebateInfoHistoryOverviewData,
} from '@/typings/yapi/AgtRebateInfoHistoryOverviewV2GetApi'
import StatsLayout from '../common/stats-layout'
import StatsTable from './stats-table'
import AgentHeader from '../common/agent-header'

function AgentGains() {
  const { scroller, isBottomSub } = useScrollTrackerYAxis()
  const { listData, setApiData, refresh, apiStatus, hasNextPage } = useQueryRebateInfoDetails({
    getNextPage: isBottomSub,
  })
  const [headerData, setheaderData] = useState<YapiGetV2AgtRebateInfoHistoryOverviewData>()
  const { filterSetting, setFilterSetting, productTypesMap } = useAgentStatsStore()

  useEffect(() => {
    const apiParams: YapiGetV2AgtRebateInfoHistoryOverviewApiRequest = {
      startDate: filterSetting.startDate as string,
      endDate: filterSetting.endDate as string,
    }
    getV2AgtRebateInfoHistoryOverviewApiRequest(apiParams).then(res => setheaderData(res.data))
  }, [filterSetting.startDate, filterSetting.endDate])

  useUnmount(() => setFilterSetting(getDefaultFilterSetting()))

  return (
    <StatsLayout
      reference={scroller}
      header={<AgentHeader data={headerData} />}
      content={
        <StatsTable
          data={listData}
          setData={setApiData}
          refresh={refresh}
          apiStatus={apiStatus}
          finished={!hasNextPage}
        />
      }
    />
  )
}

export default AgentGains
