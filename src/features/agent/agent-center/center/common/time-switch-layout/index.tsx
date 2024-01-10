/**
 * 代理中心 - 总览时间切换组件
 */
import {
  AgentCenterDetailsTabEnum,
  AgentCenterTimeTypeEnum,
  getAgentCenterTimeTypeName,
  getAgentCenterTimeTypeNumber,
} from '@/constants/agent/agent-center/center'
import classNames from 'classnames'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { useState } from 'react'
import { formatDate, getPeriodDayTime } from '@/helper/date'
import { Sticky } from '@nbit/vant'
import dayjs from 'dayjs'
import { isApp } from '@/helper/is-app'
import styles from './index.module.css'
import { OverviewDatePicker } from '../overview-date-picker'

function TimeSwitchLayout() {
  const { overviewTimeTab, rebateDetailForm, currentDetailsTab, updateOverviewTimeTab, updateRebateDetailForm } =
    useAgentCenterStore() || {}
  const timeSwitchList = Object.entries(AgentCenterTimeTypeEnum).map(([key, value]) => ({ key, value }))
  const [dateVisible, setDateVisible] = useState(false)

  const onRenderLayout = () => {
    return (
      <div className={styles['time-switch-layout']} id="agentCenterTimeSwitch">
        <div className="time-switch-wrap">
          {timeSwitchList?.map(({ key, value }) => {
            return (
              <div
                key={key}
                className={classNames('time-switch-cell', {
                  active: overviewTimeTab === value,
                })}
                onClick={() => {
                  value === AgentCenterTimeTypeEnum.custom && setDateVisible(true)
                  if (overviewTimeTab === value) return

                  updateOverviewTimeTab(value)
                  value !== AgentCenterTimeTypeEnum.custom &&
                    updateRebateDetailForm({
                      startTime:
                        value === AgentCenterTimeTypeEnum.today
                          ? new Date(new Date(new Date().getTime()).setHours(0, 0, 0, 0)).getTime()
                          : getPeriodDayTime(getAgentCenterTimeTypeNumber(value)).start,
                      endTime:
                        value === AgentCenterTimeTypeEnum.yesterday
                          ? dayjs().subtract(1, 'day').endOf('day').valueOf()
                          : getPeriodDayTime(getAgentCenterTimeTypeNumber(value)).end,
                    })
                }}
              >
                {getAgentCenterTimeTypeName(value)}
              </div>
            )
          })}
        </div>

        <div className="time-text">
          {formatDate(rebateDetailForm?.startTime || '') || '--'} ~{' '}
          {formatDate(rebateDetailForm?.endTime || '') || '--'}
        </div>
      </div>
    )
  }

  return (
    <>
      {currentDetailsTab === AgentCenterDetailsTabEnum.invite && onRenderLayout()}
      {currentDetailsTab === AgentCenterDetailsTabEnum.rebate && (
        <Sticky offsetTop={isApp() ? 0 : 46}>{onRenderLayout()}</Sticky>
      )}

      {dateVisible && (
        <OverviewDatePicker
          visible={dateVisible}
          onClose={() => setDateVisible(false)}
          onChange={e => updateRebateDetailForm(e)}
          startTime={rebateDetailForm?.startTime}
          endTime={rebateDetailForm?.endTime}
        />
      )}
    </>
  )
}

export { TimeSwitchLayout }
