/**
 * 代理中心 - 邀请详情
 */
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import CommonList from '@/components/common-list/list'
import { IAgentInviteeList } from '@/typings/api/agent/agent-center/center'
import { onGetAgentCenterInviteDetail } from '@/helper/agent/center'
import uuidGen from '@/helper/uuid'
import { link } from '@/helper/link'
import { getAgentCenterSearchUserPageRoutePath } from '@/helper/route/agent'
import { InviteFilter } from '../invite-filter'
import { InviteCell } from '../invite-cell'
import styles from './index.module.css'

function InviteDetailsLayout() {
  const { currentModalTab, inviteDetailForm, inviteList, inviteFinished, updateInviteDetailForm } =
    useAgentCenterStore() || {}

  return (
    <div className={styles['invite-details-layout']}>
      <InviteFilter
        form={inviteDetailForm}
        onChange={e => updateInviteDetailForm(e)}
        onSearchUid={() => link(getAgentCenterSearchUserPageRoutePath(currentModalTab))}
      />

      <CommonList
        finished={inviteFinished}
        onLoadMore={onGetAgentCenterInviteDetail}
        listChildren={inviteList?.map((inviteData: IAgentInviteeList, i: number) => {
          return (
            <InviteCell
              key={uuidGen()}
              isEncrypt
              data={inviteData}
              model={currentModalTab}
              className={(i + 1 === inviteList?.length && '!border-b-0') || ''}
            />
          )
        })}
        showEmpty={inviteList?.length === 0}
        emptyClassName="!py-10"
      />
    </div>
  )
}

export { InviteDetailsLayout }
