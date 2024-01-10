import DebounceSearchBar from '@/components/debounce-search-bar'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { useEffect } from 'react'
import styles from './index.module.css'

function AgentInviteContentListSearch() {
  const store = useAgentInviteStore()
  useEffect(() => {
    if (store.filterSetting.uid) {
      store.resetFilterSetting({ uid: store.filterSetting.uid })
    }
  }, [store.filterSetting.uid])

  return (
    <div className={styles.scoped}>
      <DebounceSearchBar
        placeholder={t`features_agent_agent_invite_invite_info_invite_info_content_list_search_index_5101399`}
        toggleFocus={val => {
          store.setOnSearchFocus(val)
        }}
        onChange={val => {
          store.setFilterSetting('uid', String(val))
        }}
        type="number"
      />
    </div>
  )
}

export default AgentInviteContentListSearch
