/**
 * 代理中心 - 邀请详情 - 搜索用户
 */
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import CommonList from '@/components/common-list/list'
import { IAgentInviteeList } from '@/typings/api/agent/agent-center/center'
import uuidGen from '@/helper/uuid'
import { useState } from 'react'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { postAgentCenterInviteDetail } from '@/apis/agent/center'
import { getAgentCenterInviteDetailKeyByModalType } from '@/constants/agent/agent-center/center'
import { requestWithLoading } from '@/helper/order'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { usePageContext } from '@/hooks/use-page-context'
import { InviteFilter } from '../center/common/invite-details/invite-filter'
import { InviteCell } from '../center/common/invite-details/invite-cell'
import styles from './index.module.css'
import { ScrollToTopButton } from '../center/common/scroll-top-button'

function SearchUserLayout() {
  const { inviteDetailForm, updateInviteDetailForm } = useAgentCenterStore() || {}
  const pageContext = usePageContext()
  const model = pageContext.urlParsed.search?.model
  const [finished, setFinished] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [list, setList] = useState<any>([])
  const debounceUid = useDebounce(inviteDetailForm?.uid)

  const onLoadList = async (isRefresh = false) => {
    const params = { ...inviteDetailForm, model, pageNum: isRefresh ? 1 : pageNum, uid: debounceUid }
    if (!params?.isRealName) delete params?.isRealName
    if (!params?.rebateLevel) delete params?.rebateLevel
    if (!params?.registerDateSort) delete params?.registerDateSort
    if (!params?.startTime) delete params?.startTime
    if (!params?.endTime) delete params?.endTime
    if (!params?.teamNumMin) delete params?.teamNumMin
    if (!params?.teamNumMax) delete params?.teamNumMax
    if (!params?.uid) delete params?.uid

    const res = await postAgentCenterInviteDetail(params)
    const { isOk, data } = res || {}

    if (!isOk || !data) {
      setFinished(true)
      return
    }
    const resp: IAgentInviteeList[] = data[getAgentCenterInviteDetailKeyByModalType(model)] || []
    const nList = isRefresh || (!isRefresh && pageNum === 1) ? resp : [...list, ...resp]
    setList(nList)
    setFinished(params?.pageNum >= data?.pageTotal)
    setPageNum(isRefresh ? 1 : pageNum + 1)
  }

  useUpdateEffect(() => {
    requestWithLoading(onLoadList(true), 0)
  }, [
    inviteDetailForm?.registerDateSort,
    inviteDetailForm?.rebateLevel,
    inviteDetailForm?.isRealName,
    inviteDetailForm?.startTime,
    inviteDetailForm?.endTime,
    inviteDetailForm?.teamNumMin,
    inviteDetailForm?.teamNumMax,
    debounceUid,
  ])

  return (
    <div className={styles['search-user-layout']}>
      <NavBar title={t`features_agent_agent_center_center_common_search_user_modal_index_cxdro0wei0`} />

      <div className="search-cell">
        <InviteFilter form={inviteDetailForm} onChange={updateInviteDetailForm} uidInputVisible uidVisible={false} />
      </div>

      <CommonList
        finished={finished}
        onLoadMore={() => requestWithLoading(onLoadList(), 0)}
        showEmpty={list?.length === 0}
        listChildren={list?.map((inviteData: IAgentInviteeList, i: number) => {
          return (
            <InviteCell
              key={uuidGen()}
              isEncrypt
              data={inviteData}
              model={model}
              overwriteLastHistoryEntry
              className={(i + 1 === list?.length && '!border-b-0') || ''}
            />
          )
        })}
        emptyText={t`features_agent_agent_center_center_common_search_user_modal_index_3gaukjfcar`}
      />

      <ScrollToTopButton />
    </div>
  )
}

export { SearchUserLayout }
