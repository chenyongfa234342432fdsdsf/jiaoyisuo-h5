import CommonSelector from '@/components/common-selector'
import { Divider, Tabs, Toast } from '@nbit/vant'
import { useEffect, useState } from 'react'
import DatePickerModal, { DatePickerValueFormat } from '@/components/common-date-picker/date-picker-modal'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import Icon from '@/components/icon'
import { AgentChartKeyEnum, dateOptions, DateOptionsTypes } from '@/constants/agent'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import { useRebateInfoDetails } from '@/hooks/features/agent'
import { useUnmount } from 'ahooks'
import StatsLineChart from '../common/stats-line-chart'
import styles from './index.module.css'
import StatsInfoBox from '../common/stats-info-box'
import StatsLayout from '../common/stats-layout'
import { StatsCheckboxLegend, StatsLegend } from '../common/stats-line-chart/stats-legends'
import { StatsPieChart } from '../common/stats-pie-chart'
import StatsPopup from '../common/stats-popup'
import { AgentAnalyticsHeader } from '../common/agent-header'

function AgentGainsDetail() {
  const [currentDateSelection, setDateSelection] = useState<number[]>([DateOptionsTypes.last7Days])
  const [dateFormPopup, setdateFormPopup] = useState<boolean>(false)
  const [datePickerVal, setdatePickerVal] = useState<ReturnType<typeof DatePickerValueFormat>>()
  const [modalVisible, setmodalVisible] = useState(false)

  const { totalIncomes, incomesAnalysis, incomeRates, overview } = useRebateInfoDetails(currentDateSelection[0])

  const [checkboxLineChartData, setcheckboxLineChartData] = useState(incomesAnalysis)

  useEffect(() => {
    setcheckboxLineChartData(incomesAnalysis)
  }, [incomesAnalysis])

  const { chartFilterSetting, setChartFilterSetting, resetChartFilterSetting } = useAgentStatsStore()

  useUnmount(() => {
    resetChartFilterSetting()
  })

  const dateSelection = types => {
    if (types === DateOptionsTypes.custom) setdateFormPopup(true)
    setDateSelection([types])
  }

  const validateDatesRange = range => {
    const startDate = dayjs(range.startDate)
    const endDate = dayjs(range.endDate)
    // check range is within 12 months
    if (endDate.diff(startDate, 'month') > 12) {
      Toast.info({ message: t`features_agent_agent_gains_detail_index_5101377` })
      return false
    }
    return true
  }

  return (
    <StatsLayout
      style={{ height: `calc(var(--vh100) - 46px)` }}
      header={<AgentAnalyticsHeader data={overview} />}
      content={
        <div className={styles.scoped}>
          <Tabs align="start" className="mb-4 gains-tabs" onChange={dateSelection} active={dateOptions()[0].value}>
            {dateOptions().map(({ label, value }) => (
              <Tabs.TabPane title={label} name={value} key={label} />
            ))}
          </Tabs>
          <StatsLineChart
            data={totalIncomes}
            legend={
              <StatsLegend data={totalIncomes} hasDecimal chartKey={AgentChartKeyEnum.TotalIncomes} precision={2} />
            }
            title={t`features_agent_agent_gains_detail_index_5101412`}
            chartKey={AgentChartKeyEnum.TotalIncomes}
            hasRebateTab
          />
          {/* <Divider />
           <StatsLineChart
            data={checkboxLineChartData || []}
            title={t`features_agent_agent_gains_detail_index_5101413`}
            legend={
              <StatsCheckboxLegend
                data={incomesAnalysis}
                onchange={v => setcheckboxLineChartData((incomesAnalysis || []).filter(each => v.includes(each.id)))}
                hasDecimal
                chartKey={AgentChartKeyEnum.IncomeAnalysis}
                precision={2}
              />
            }
            chartKey={AgentChartKeyEnum.IncomeAnalysis}
            hasRebateTab
          /> */}
          <Divider />
          <StatsPieChart data={incomeRates} />
          <div className="flex flex-row mx-4 mt-6 mb-10">
            <Icon className="w-2 h-2 mr-1" name="prompt-symbol" />
            <span className="text-xs text-text_color_03">
              {t`features_agent_agent_gains_detail_index_5101381`}
              {t`features_agent_agent_gains_detail_index_5101382`}
            </span>
          </div>
          <DatePickerModal
            className={styles['gains-detail-popup']}
            datePickerConfig={{
              title: t`features_agent_agent_gains_detail_index_5101378`,
              columnsTop: (
                <>
                  <div className="flex flex-row items-center">
                    <span className="text-text_color_01 text-xs ml-5 mr-1 my-auto">
                      {t`features_agent_agent_gains_detail_index_5101383`} 12{' '}
                      {t`features_agent_agent_gains_detail_index_5101384`}
                    </span>
                    <Icon className="text-xs mt-0" name="msg" onClick={() => setmodalVisible(true)} />
                  </div>
                  <StatsPopup
                    title={t`features_agent_agent_gains_detail_index_5101379`}
                    content={t`features_agent_agent_gains_detail_index_5101380`}
                    visible={modalVisible}
                    setVisible={setmodalVisible}
                  />
                </>
              ),
            }}
            visible={dateFormPopup}
            dateTemplate={'YYYY-MM-DD'}
            startDate={chartFilterSetting.startDate}
            endDate={chartFilterSetting.endDate}
            onClose={() => {
              setdateFormPopup(false)
              setDateSelection([DateOptionsTypes.last7Days])
            }}
            onChange={v => {
              setdatePickerVal(v)
            }}
            max={730}
            onCommit={params => {
              if (validateDatesRange(params)) {
                setChartFilterSetting(params)
                setdateFormPopup(false)
              }
            }}
          />
        </div>
      }
    />
  )
}

export default AgentGainsDetail
