import Icon from '@/components/icon'
import { agentModuleRoutes } from '@/constants/agent'
import { InviteFilterSortEnum } from '@/constants/agent/invite'
import { link } from '@/helper/link'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import styles from './index.module.css'

const Sorter = ({
  sortState,
  onClickCallback,
  child,
}: {
  key: string
  sortState?: InviteFilterSortEnum
  onClickCallback: (nextState: InviteFilterSortEnum) => void
  child: React.ReactNode
}) => {
  const sortStates = [InviteFilterSortEnum.default, InviteFilterSortEnum.desc, InviteFilterSortEnum.asc]

  return (
    <span
      className="sorter-wrapper"
      onClick={() => {
        const curStateIndex = sortStates.findIndex(x => x === sortState)
        const nextStateIndex = curStateIndex === -1 ? 1 : (curStateIndex + 1) % 3
        onClickCallback(sortStates[nextStateIndex])
      }}
    >
      <div className="sorter-title">{child}</div>
      <div className="sorter-icons">
        <Icon
          name={sortState === InviteFilterSortEnum.asc ? 'regsiter_icon_away_white_hover' : 'regsiter_icon_away'}
          hasTheme={sortState !== InviteFilterSortEnum.asc}
        />
        <Icon
          name={sortState === InviteFilterSortEnum.desc ? 'regsiter_icon_drop_white_hover' : 'regsiter_icon_drop'}
          hasTheme={sortState !== InviteFilterSortEnum.desc}
        />
      </div>
    </span>
  )
}

function AgentInviteContentListFilter() {
  const store = useAgentInviteStore()
  return (
    <div className={styles.scoped}>
      <div className="sorters">
        <Sorter
          child={
            <>
              <div
                className="sorter"
                onClick={newSortState => {
                  store.setFilterSetting('registerSort', newSortState)
                }}
              >
                {t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_index_5101417`}
              </div>
            </>
          }
          sortState={store.filterSetting.registerSort as any}
          key="registerSort"
          onClickCallback={newSortState => {
            store.setFilterSetting('registerSort', newSortState)
          }}
        />

        <Sorter
          child={
            <>
              <div
                className="sorter"
                onClick={newSortState => {
                  store.setFilterSetting('childNumSort', newSortState)
                }}
              >
                {t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_index_5101418`}
              </div>
            </>
          }
          sortState={store.filterSetting.childNumSort as any}
          key="childNumSort"
          onClickCallback={newSortState => {
            store.setFilterSetting('childNumSort', newSortState)
          }}
        />
      </div>

      <div
        className="check-more-app-test"
        onClick={() => {
          link(agentModuleRoutes.inviteCheckMore)
        }}
      ></div>
      <div className="filter-button">
        <Icon name="asset_record_filter" hasTheme onClick={store.toggleFilterForm} />
      </div>
    </div>
  )
}

export default AgentInviteContentListFilter
