/**
 * 代理中心 - 详情列表 tab
 */
import { AgentCenterDetailsTabEnum, getAgentCenterDetailsTabName } from '@/constants/agent/agent-center/center'
import classNames from 'classnames'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import styles from './index.module.css'

function DetailsTab() {
  const { currentDetailsTab, updateCurrentDetailsTab } = useAgentCenterStore() || {}
  const tabs = Object.entries(AgentCenterDetailsTabEnum).map(([key, value]) => ({ key, value }))

  return (
    <div className={styles['details-tab-root']}>
      {tabs?.map(tab => {
        return (
          <div key={tab.key} className="tab-wrap">
            <div className="tab-cell" id={tab.key} onClick={() => updateCurrentDetailsTab(tab.key)}>
              {getAgentCenterDetailsTabName(tab.key)}
            </div>

            {currentDetailsTab === tab.key && (
              <div
                className={classNames('tab-active', {
                  invite:
                    currentDetailsTab === AgentCenterDetailsTabEnum.invite &&
                    tab.key === AgentCenterDetailsTabEnum.invite,
                  rebate:
                    currentDetailsTab === AgentCenterDetailsTabEnum.rebate &&
                    tab.key === AgentCenterDetailsTabEnum.rebate,
                })}
              >
                <div className="active-text">{getAgentCenterDetailsTabName(tab.key)}</div>
                <div className="tab-rounder"></div>
                <div className="tab-rounder-filling"></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { DetailsTab }
