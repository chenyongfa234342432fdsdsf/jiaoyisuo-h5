import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import RowCell from '../row-cell'

export default function ScaleCell({ leftSlot, myRate, myFriendRate, openEditRatePop }) {
  return (
    <RowCell
      leftSlot={leftSlot}
      rightSlot={
        <>
          {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`} {myRate}% /{' '}
          {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`} {myFriendRate}%
        </>
      }
      IconSlot={<Icon onClick={openEditRatePop} hasTheme className="back ml-2" name="rebate_edit" />}
    />
  )
}
