import NavBar from '@/components/navbar'
import { AgentInviteContentListContent } from '@/features/agent/agent-invite/invite-info/invite-info-content'
import AgentInviteContentListFilter from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter'
import { AgentInviteContentListFilterFormPopover } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/list-filter-form'
import AgentInviteContentListSearch from '@/features/agent/agent-invite/invite-info/invite-info-content/list-search'
import styles from './index.module.css'

export function AgentInviteContentSearchFocused() {
  return (
    <div className={styles.scoped}>
      <NavBar title={<AgentInviteContentListSearch />} />
      <AgentInviteContentListFilter />
      <AgentInviteContentListContent />
      <AgentInviteContentListFilterFormPopover />
    </div>
  )
}
