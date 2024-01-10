import CommonList from '@/components/common-list/list'
import NoDataImage from '@/components/no-data-image'
import { ApiStatusEnum } from '@/constants/market/market-list'
import AgentInviteContentListFilter from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter'
import { AgentInviteContentListFilterFormPopover } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/list-filter-form'
import AgentInviteContentListItem from '@/features/agent/agent-invite/invite-info/invite-info-content/list-item'
import AgentInviteContentListSearch from '@/features/agent/agent-invite/invite-info/invite-info-content/list-search'
import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { useMount, useUnmount } from 'ahooks'
import { AgentInviteContentListFilterFormInviteSelector } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/list-filter-form/selectors'
import { AgentInviteContentListRebateRatioEditFormPopover } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/referral-ratio-editor'
import styles from './index.module.css'

function AgentInviteContent() {
  const store = useAgentInviteStore()
  const helper = agentInviteHelper
  useMount(() => {
    store.fetchProductLines()
    store.fetchUserStatus()
    store.fetchProductLinesWithFee()
  })
  const isAgent = !!store.cache.userStatus.agtInvitationCode

  return (
    <div className={styles.scoped}>
      {isAgent && (
        <div className="px-4 pb-4">
          <AgentInviteContentListFilterFormInviteSelector
            options={helper.getInviteTypeOptions(isAgent)}
            onChange={val => {
              store.setFilterSetting('isAgt', val[0])
            }}
            value={[store.filterSetting.isAgt]}
          />
        </div>
      )}

      <AgentInviteContentListSearch />
      <AgentInviteContentListFilter />
      <AgentInviteContentListContent />
      <AgentInviteContentListFilterFormPopover />
      <AgentInviteContentListRebateRatioEditFormPopover />
    </div>
  )
}

export function AgentInviteContentListContent() {
  const store = useAgentInviteStore()
  const { data, apiStatus, refreshCallback, runAsync, page, setPage } = store.hooks.useAgentInviteInfoList()

  useUnmount(() => {
    store.resetFilterSetting(agentInviteHelper.getFilterSettingDefault())
  })

  if (ApiStatusEnum.failed === apiStatus || (ApiStatusEnum.succeed === apiStatus && data.length === 0)) {
    return <NoDataImage />
  }

  const list = (
    <div className="list">
      {data.map((item, index) => {
        return <AgentInviteContentListItem item={item} key={index} />
      })}
    </div>
  )

  return (
    <CommonList
      finished={page.finished}
      listChildren={list}
      onLoadMore={async () => {
        if (apiStatus === ApiStatusEnum.succeed) {
          setPage(prev => {
            return {
              ...prev,
              pageNum: prev.pageNum + 1,
            }
          })
        }
      }}
    />
  )
}

export default AgentInviteContent
