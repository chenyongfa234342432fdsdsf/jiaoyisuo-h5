import {
  dateOptionsTypesInviteApiKeyMap,
  infoHeaderTypesInvite as InfoHeaderTypesInviteFn,
  DateOptionsTypesInvite,
} from '@/constants/agent/invite'
import InfoColumn from '@/features/agent/common/stats-info-box/info-column'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteDetailsApiResponseReal } from '@/typings/api/agent/invite'

function StatsInfoBarInvite({ data }: { data: YapiPostV1AgentInviteDetailsApiResponseReal }) {
  const store = useAgentInviteStore()
  const infoHeaderTypes = InfoHeaderTypesInviteFn()
  const isHide = store.isHideMyInfo

  return (
    <>
      <div className="flex flex-row justify-between px-4 text-text_color_02">
        <InfoColumn
          title={infoHeaderTypes[DateOptionsTypesInvite.now].title}
          popupContent={infoHeaderTypes[DateOptionsTypesInvite.now].content}
          value={data[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.now]]}
          hasIcon
          isFinanceValue={false}
          isHide={isHide}
        />
        <InfoColumn
          title={infoHeaderTypes[DateOptionsTypesInvite.last7Days].title}
          popupContent={infoHeaderTypes[DateOptionsTypesInvite.last7Days].content}
          value={data[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.last7Days]]}
          hasIcon
          isFinanceValue={false}
          isHide={isHide}
        />
        <InfoColumn
          title={infoHeaderTypes[DateOptionsTypesInvite.last30Days].title}
          popupContent={infoHeaderTypes[DateOptionsTypesInvite.last30Days].content}
          value={data[dateOptionsTypesInviteApiKeyMap[DateOptionsTypesInvite.last30Days]]}
          hasIcon
          isFinanceValue={false}
          isHide={isHide}
        />
      </div>
    </>
  )
}

export default StatsInfoBarInvite
