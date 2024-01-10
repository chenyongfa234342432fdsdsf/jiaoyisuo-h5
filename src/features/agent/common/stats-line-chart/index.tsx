import { t } from '@lingui/macro'
import NoDataImage from '@/components/no-data-image'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { fillMissingDataForChart, formatTotalIncomesChartData, mergeRebateDataByRebateType } from '@/helper/agent/agent'
import ResponsiveLineChart from './line-chart'
import styles from './index.module.css'

function StatsChartTabs({ onchange }) {
  const { rebateCodeMap } = useAgentStatsStore()
  const options = [
    {
      codeKey: t`common.all`,
      codeVal: undefined,
    },
    ...Object.keys(rebateCodeMap).map(key => {
      return {
        codeKey: rebateCodeMap[key],
        codeVal: key,
      }
    }),
  ]
  const [selected, setselected] = useState<string | undefined>()

  useEffect(() => {
    onchange && onchange(selected)
  }, [selected])

  return (
    <div className={styles['stats-chart-tabs']}>
      {options.map(option => (
        <span
          key={option.codeVal}
          className={classNames({ '!text-text_color_01 !bg-bg_sr_color': selected === option.codeVal })}
          onClick={() => setselected(option.codeVal)}
        >
          {option.codeKey}
        </span>
      ))}
    </div>
  )
}

function StatsLineChart({
  data,
  legend,
  title,
  chartKey,
  hasRebateTab,
}: {
  title: string | React.ReactNode
  legend: JSX.Element
  data: ReturnType<typeof formatTotalIncomesChartData>
  chartKey: string
  hasRebateTab?: boolean
}) {
  const [chartData, setchartData] = useState<ReturnType<typeof formatTotalIncomesChartData>>([])
  const [selectedRebateTab, setselectedRebateTab] = useState()

  useEffect(() => {
    if (!hasRebateTab) {
      setchartData(data)
      return
    }
    const selectedData = data.map(each => {
      return {
        ...each,
        data:
          selectedRebateTab !== undefined
            ? fillMissingDataForChart(
                each.data?.filter(eachData => eachData.rebateTypeCd === selectedRebateTab),
                each.startDate,
                each.endDate
              )
            : fillMissingDataForChart(mergeRebateDataByRebateType(each.data), each.startDate, each.endDate),
        // default: {
        //   date: each.data[each.data.length - 1]?.x || 0,
        //   value: each.data[each.data.length - 1]?.y || 0,
        // },
      }
    })
    setchartData(selectedData)
  }, [selectedRebateTab, data])

  return (
    <div className={styles.scoped}>
      <div className="chart-title">
        <div className="flex flex-row text-center items-center">
          <div className="chart-title-icon" />
          {title || t`features_agent_common_stats_line_chart_index_5101393`}
        </div>
        {hasRebateTab && <StatsChartTabs onchange={setselectedRebateTab} />}
      </div>
      {legend}
      <div className="h-40 w-full px-4">
        {chartData.length > 0 ? <ResponsiveLineChart chartKey={chartKey} data={chartData} /> : <NoDataImage />}
      </div>
    </div>
  )
}

export default StatsLineChart
