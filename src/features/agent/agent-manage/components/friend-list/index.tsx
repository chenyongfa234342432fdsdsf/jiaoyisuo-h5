import { AgentPopup } from '@/features/agent/common/agent-popup'
import { useEffect, useState } from 'react'
import { getInvitedPeopleList } from '@/apis/agent/manage'
import { formatDate } from '@/helper/date'
import { InvitedPeopleListItem } from '@/typings/api/agent/manage'
import CommonListEmpty from '@/components/common-list/list-empty'
import { t } from '@lingui/macro'
import DynamicLottie from '@/components/dynamic-lottie'
import { useCommonStore } from '@/store/common'
import Styles from './index.module.css'

export function FriendList({ friendsVisible, invitationCode, onFriendsClose }) {
  const [friendList, setFriendList] = useState<InvitedPeopleListItem[]>()
  const [loading, setIsLoading] = useState(true)
  const { isFusionMode } = useCommonStore()
  const PullRefreshData = 'refresh_loading'
  const FusionApiRefreshLoadingData = 'tt_refresh_fusion'
  const getPeopleList = async invitationCode => {
    const res = await getInvitedPeopleList({ invitationCode })
    const data = res.data
    setFriendList(data?.list || [])
    setIsLoading(false)
  }
  useEffect(() => {
    getPeopleList(invitationCode)
  }, [invitationCode])
  return (
    <AgentPopup
      title={t`features_agent_agent_manage_index_5101551`}
      visible={friendsVisible}
      className={Styles.friend}
      style={{ height: '50vh' }}
      closeable
      position="bottom"
      onClose={onFriendsClose}
    >
      <div className="flex flex-col ">
        <div className="flex justify-between items-center px-3 mb-2 text-xs text-text_color_03">
          <span>{t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`} ID</span>
          <span>{t`future.funding-history.funding-rate.column.time`}</span>
        </div>
        {/* loading 显示 */}
        {loading && (
          <div className="loading-box">
            <DynamicLottie
              loop
              style={{ width: '30px', height: '30px' }}
              hasTheme={isFusionMode}
              animationData={isFusionMode ? FusionApiRefreshLoadingData : PullRefreshData}
            />
          </div>
        )}
        {/* 列表显示 */}
        {!loading &&
          (friendList?.length ? (
            friendList?.map((item, index) => {
              return (
                <div key={index} className="friend-info">
                  <span>{item.invitedUid}</span>
                  <span>{formatDate(item.createdByTime)}</span>
                </div>
              )
            })
          ) : (
            <CommonListEmpty />
          ))}
      </div>
    </AgentPopup>
  )
}
