import CommonSelector from '@/components/common-selector'
import { agentDateTimeTabEnum } from '@/constants/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import dayjs from 'dayjs'
import { DateFormatTemplate, formatDate } from '@/helper/date'
import { useState } from 'react'
import DatePickerModal from '@/components/common-date-picker/date-picker-modal'
import { t } from '@lingui/macro'
import { getWeek } from '@/helper/agent/agent'
import styles from './index.module.css'

export const AgentDateTimeTabOptions = () => [
  {
    label: t`constants_market_market_list_market_module_index_5101071`,
    value: agentDateTimeTabEnum.all,
  },
  {
    label: t`features_agent_invite_describe_index_5101493`,
    value: agentDateTimeTabEnum.today,
  },
  {
    label: t`features_agent_common_agent_datetime_tabs_index_rxfd1dbfwk`,
    value: agentDateTimeTabEnum.yesterday,
  },
  {
    label: t`features_agent_invite_describe_index_5101494`,
    value: agentDateTimeTabEnum.week,
  },
  {
    label: t`features_agent_invite_describe_index_5101495`,
    value: agentDateTimeTabEnum.month,
  },
  {
    label: t`constants_agent_5101366`,
    value: agentDateTimeTabEnum.custom,
  },
]

export function formatAgentDateTimeTabValue(tabValue?: agentDateTimeTabEnum) {
  switch (tabValue) {
    case agentDateTimeTabEnum.today:
      return {
        startDate: dayjs().startOf('day').valueOf(),
        endDate: dayjs().endOf('day').valueOf(),
      }
    case agentDateTimeTabEnum.yesterday:
      return {
        startDate: dayjs().subtract(1, 'day').startOf('day').valueOf(),
        endDate: dayjs().subtract(1, 'day').endOf('day').valueOf(),
      }
    case agentDateTimeTabEnum.week:
      return {
        startDate: getWeek().startWeek,
        endDate: getWeek().endWeek,
      }
    case agentDateTimeTabEnum.month:
      return {
        startDate: dayjs().startOf('month').valueOf(),
        endDate: dayjs().endOf('month').valueOf(),
      }
    default:
      return {
        startDate: undefined,
        endDate: undefined,
      }
  }
}

function AgentDatetimeTabs({ filterSetting, setFilterSetting }) {
  const [visible, setvisible] = useState(false)
  const [selectedTab, setSelectedTab] = useState(agentDateTimeTabEnum.all)

  return (
    <>
      <CommonSelector
        className={styles.scoped}
        options={AgentDateTimeTabOptions()}
        value={[selectedTab]}
        onChange={([v]) => {
          setSelectedTab(v)
          if (v === agentDateTimeTabEnum.custom) {
            setvisible(true)
            return
          }

          const formattedDateTime = formatAgentDateTimeTabValue(v)
          setFilterSetting({
            ...filterSetting,
            ...formattedDateTime,
          })
        }}
      />
      {visible && (
        <DatePickerModal
          visible={visible}
          dateTemplate={DateFormatTemplate.default}
          // startDate={filterSetting.startDate}
          // endDate={filterSetting.endDate}
          onClose={() => {
            const formattedDateTime = formatAgentDateTimeTabValue(agentDateTimeTabEnum.all)
            setFilterSetting({
              ...filterSetting,
              ...formattedDateTime,
            })
            setSelectedTab(agentDateTimeTabEnum.all)
            setvisible(false)
          }}
          max={730}
          onCommit={params => {
            setvisible(false)
            setFilterSetting({ startDate: params.startDate, endDate: params.endDate })
          }}
        />
      )}
      <div className="text-xs text-text_color_03 mx-4 mt-2 mb-3">
        {filterSetting?.startDate && filterSetting?.endDate ? (
          <>
            <span>{formatDate(filterSetting.startDate)}</span>
            <span> ~ </span>
            <span>{formatDate(filterSetting.endDate)}</span>
          </>
        ) : (
          <span>
            {t`features_agent_invite_describe_index_o9vjaidpzgmygzk0ylibs`} {formatDate(dayjs().endOf('day').valueOf())}
          </span>
        )}
      </div>
    </>
  )
}

export default AgentDatetimeTabs
