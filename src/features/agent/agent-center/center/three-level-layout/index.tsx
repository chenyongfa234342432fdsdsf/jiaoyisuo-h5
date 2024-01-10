/**
 * 三级代理
 */
import PullRefreshAnimation from '@/components/pull-refresh-animation'
import { PullRefresh } from '@nbit/vant'
import { AgentCenterDetailsTabEnum } from '@/constants/agent/agent-center/center'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { onRefreshAgentCenter } from '@/helper/agent/center'
import { t } from '@lingui/macro'
import { TimeSwitchLayout } from '../common/time-switch-layout'
import { RebatesOverview } from '../common/rebates-overview'
import { TeamInfo } from '../common/team-info'
import { InviteDetailsLayout } from '../common/invite-details/layout'
import { DetailsTab } from '../common/details-tab'
import { RebateDetailsLayout } from '../common/rebate-details/layout'

function ThreeLevelLayout() {
  const { currentDetailsTab } = useAgentCenterStore() || {}

  const onRenderRefreshAnimation = () => {
    return <PullRefreshAnimation className="!items-baseline" />
  }

  return (
    <PullRefresh
      onRefresh={onRefreshAgentCenter}
      pullingText={({ distance }) => onRenderRefreshAnimation()}
      loosingText={() => onRenderRefreshAnimation()}
      loadingText={() => onRenderRefreshAnimation()}
    >
      <div className="center-content">
        <TimeSwitchLayout />
        <RebatesOverview
          rebatesAmountTitle={t`features_agent_agent_center_center_three_level_layout_index_qxxctvqgfj`}
          rebatesLadderTitle={t`features_agent_agent_center_center_three_level_layout_index_w3lhma10a_`}
        />
        <TeamInfo />

        <div className="details-wrap">
          <DetailsTab />
          {currentDetailsTab === AgentCenterDetailsTabEnum.invite && <InviteDetailsLayout />}
          {currentDetailsTab === AgentCenterDetailsTabEnum.rebate && <RebateDetailsLayout />}
        </div>
      </div>
    </PullRefresh>
  )
}

export { ThreeLevelLayout }
