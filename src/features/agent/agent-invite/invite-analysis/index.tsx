import DatePickerModal, { DatePickerValueFormat } from '@/components/common-date-picker/date-picker-modal'
import CommonSelector from '@/components/common-selector'
import Icon from '@/components/icon'
import { DateOptionsTypes, dateOptions, AgentChartKeyEnum } from '@/constants/agent'
import AgentInviteHeader from '@/features/agent/agent-invite/invite-info/invite-info-header'
import StatsLayout from '@/features/agent/common/stats-layout'
import StatsLineChart from '@/features/agent/common/stats-line-chart'
import {
  StatsCheckboxLegend,
  StatsLegend,
  StatsSingleCheckboxLegend,
} from '@/features/agent/common/stats-line-chart/stats-legends'
import StatsPopup from '@/features/agent/common/stats-popup'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { Toast, Divider, Tabs } from '@nbit/vant'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useUnmount } from 'ahooks'
import NavBar from '@/components/navbar'
import { isEmpty } from 'lodash'
import styles from './index.module.css'

function AgentInviteAnalysis() {
  const title = t`features_agent_agent_invite_invite_analysis_index_5101414`
  const store = useAgentInviteStore()
  const [currentDateSelection, setDateSelection] = useState<number[]>([DateOptionsTypes.last7Days])
  const [dateFormPopup, setdateFormPopup] = useState<boolean>(false)
  const [datePickerVal, setdatePickerVal] = useState<ReturnType<typeof DatePickerValueFormat>>()
  const [modalVisible, setmodalVisible] = useState(false)
  const { invitedList, totalList } = store.hooks.useInviteDetailsAnalysis(currentDateSelection[0])

  const { chartFilterSetting, setChartFilterSetting, resetChartFilterSetting } = useAgentInviteStore()

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

  const [checkboxLineChartData, setcheckboxLineChartData] = useState(totalList)
  useEffect(() => {
    if (isEmpty(totalList)) return
    setcheckboxLineChartData([totalList[0]])
  }, [totalList])

  return (
    <>
      <NavBar title={title} />
      <StatsLayout
        style={{ height: `calc(var(--vh100) - 46px)` }}
        header={
          <>
            <AgentInviteHeader showAnalysis={false} />
          </>
        }
        content={
          <div className={styles.scoped}>
            <Tabs align="start" className="mb-4" onChange={dateSelection} active={dateOptions()[0].value}>
              {dateOptions().map(({ label, value }) => (
                <Tabs.TabPane title={label} name={value} key={label} />
              ))}
            </Tabs>
            <StatsLineChart
              data={invitedList as any}
              legend={<StatsLegend data={invitedList} chartKey={AgentChartKeyEnum.InvitedList} />}
              title={t`features_agent_agent_invite_invite_info_invite_info_header_index_5101400`}
              chartKey={AgentChartKeyEnum.InvitedList}
            />
            <Divider className="custom-divider" />
            <StatsLineChart
              title={
                <div className="flex flex-row w-full">
                  <span>{t`features_agent_agent_invite_invite_analysis_index_5101411`}</span>
                  <StatsSingleCheckboxLegend
                    data={totalList}
                    onchange={v => {
                      const res = (totalList || []).filter(each => v.includes(each.id))
                      setcheckboxLineChartData(res)
                    }}
                    hasDecimal
                    chartKey={AgentChartKeyEnum.TotalInvitedList}
                    checkFirstOnly
                  />
                </div>
              }
              data={checkboxLineChartData as any}
              legend={<StatsLegend data={checkboxLineChartData} chartKey={AgentChartKeyEnum.TotalInvitedList} />}
              chartKey={AgentChartKeyEnum.TotalInvitedList}
            />
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
                    <span className="text-text_color_01 text-xs ml-5 mr-1 mt-4">
                      {t`features_agent_agent_gains_detail_index_5101383`} 12{' '}
                      {t`features_agent_agent_gains_detail_index_5101384`}
                    </span>
                    <Icon className="w-3 h-3" name="msg" onClick={() => setmodalVisible(true)} />
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
    </>
  )
}

export default AgentInviteAnalysis
