import { Tabs } from '@nbit/vant'
import NavBar from '@/components/navbar'
import {
  AgentContentTypeEnum,
  agentModuleRoutes,
  getAgentContentTypeEnumTab,
  getRouteUrlByAgentType,
} from '@/constants/agent'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import AgentInviteInfo from '@/features/agent/agent-invite/invite-info'
import { useGetAgentProductCode } from '@/hooks/features/agent'
import AgentGains from '../../agent-gains'
import styles from './index.module.css'

function AgentLayout({ module, children }: { module: AgentContentTypeEnum; children: React.ReactNode }) {
  useGetAgentProductCode()
  const title = t`modules_agent_invite_index_page_server_5101373`

  const tabList = getAgentContentTypeEnumTab()

  return (
    <div className={styles.scoped}>
      <NavBar
        title={title}
        right={<span className="text-brand_color">{t`features_agent_common_agent_layout_index_8s0ijmnjld`}</span>}
        onClickRight={() => {
          link(`${agentModuleRoutes.inviteCheckMore}`)
        }}
        appRightConfig={{
          text: t`features_agent_common_agent_layout_index_8s0ijmnjld`,
          textColor: 'brand_color',
          onClickRight: () => {
            link(`${agentModuleRoutes.inviteCheckMore}`)
          },
        }}
      />
      <Tabs
        align="start"
        className="agent-tabs"
        active={module}
        onChange={id => {
          link(getRouteUrlByAgentType(id as AgentContentTypeEnum))
        }}
      >
        {tabList.map(item => {
          return (
            <Tabs.TabPane title={item.title} key={item.id} name={String(item.id)}>
              {children}
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </div>
  )
}

export const AgentLayoutContent = (item: { id: AgentContentTypeEnum }) => {
  switch (item.id) {
    case AgentContentTypeEnum.invite:
      return <AgentInviteInfo />
    default:
      return <AgentGains />
  }
}

export default AgentLayout
