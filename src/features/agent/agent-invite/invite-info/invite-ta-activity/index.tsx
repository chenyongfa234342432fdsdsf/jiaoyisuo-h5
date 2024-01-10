import Icon from '@/components/icon'
import { agentModuleRoutes } from '@/constants/agent'
import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { t } from '@lingui/macro'
import { Toast } from '@nbit/vant'
import { useEffect, useState } from 'react'
import NavBar from '@/components/navbar'
import { link } from '@/helper/link'
import { AgentInviteContentListRebateRatioEditFormPopover } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/referral-ratio-editor'
import {
  TaAgentActivitiesTitleMap,
  getInviteKycLevelEnumTitle,
  isAgentKycVerified,
  taAgentActivitiesDetailEnum,
  taAgentUserDetailTitleMap,
} from '@/constants/agent/invite'
import AgentDatetimeTabs, { formatAgentDateTimeTabValue } from '@/features/agent/common/agent-datetime-tabs'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { YapiPostV1AgentActivationUserInfoData } from '@/typings/yapi/AgentActivationUserInfoV1PostApi'
import {
  YapiPostV1AgentActivationApiRequest,
  YapiPostV1AgentActivationData,
} from '@/typings/yapi/AgentActivationV1PostApi'
import { IncreaseTag } from '@nbit/react'
import { postV1AgentActivationUserInfoApiRequest, postV1AgentActivationApiRequest } from '@/apis/agent/invite'
import { useCopyToClipboard } from 'react-use'
import { oss_svg_image_domain_address, OssImgFolderNameEnums } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import { usePageContext } from '@/hooks/use-page-context'
import { formatDate } from '@/helper/date'
import { useGetAgentProductCode } from '@/hooks/features/agent'
import styles from './index.module.css'

function IconRowDisplay({ userInfo }: { userInfo?: YapiPostV1AgentActivationUserInfoData }) {
  const arr = [
    {
      key: 'email',
      title: () => t`user.safety_items_04`,
      isValid() {
        return !!userInfo?.email
      },
    },
    {
      key: 'mobileNumber',
      title: () => t`features_agent_agent_invite_invite_info_invite_ta_activity_index_hxd6apbmzq`,
      isValid() {
        return !!userInfo?.mobileNumber
      },
    },
    {
      key: 'kycTypeInd',
      title: () => {
        return getInviteKycLevelEnumTitle(String(userInfo?.kycTypeInd))
      },
      isValid() {
        return isAgentKycVerified(String(userInfo?.kycTypeInd || ''))
      },
    },
  ]
  return (
    <div className="icon-row verified-checks pb-2">
      {arr.map((item, index) => {
        return (
          <span key={index} className="pr-4 ">
            {item.isValid() ? (
              <Icon name="login_password_satisfy" />
            ) : (
              <Icon name="rebate_no_authentication" hasTheme />
            )}

            <span className={`text-xs pl-1 ${item.isValid() ? 'text-buy_up_color' : 'text-text_color_03'}`}>
              {item.title()}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function TaActivitiesDetail({ activities }: { activities: YapiPostV1AgentActivationData | undefined }) {
  return (
    <div className="ta-activities rebate-info">
      {Object.keys(TaAgentActivitiesTitleMap()).map((key, index) => (
        <div key={index}>
          <span className="label">{TaAgentActivitiesTitleMap()[key]}</span>
          {key === taAgentActivitiesDetailEnum.invitedNum || key === taAgentActivitiesDetailEnum.teamNum ? (
            <span className="value">{activities?.[key] || 0}</span>
          ) : (
            <IncreaseTag
              right={<span> USD</span>}
              hasColor={false}
              value={activities?.[key] || undefined}
              defaultEmptyText={'0.00'}
              kSign
              delZero={false}
              digits={2}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function TaUserDetail({
  targetUid,
  user,
}: {
  targetUid: number
  user: YapiPostV1AgentActivationUserInfoData | undefined
}) {
  const { productCodeMap } = useAgentStatsStore()
  const store = useAgentInviteStore()

  return (
    <div className="ta-activities user-details">
      {agentInviteHelper.isAgent(user?.isAgt) &&
        user?.ratios?.map((ratio, index) => (
          <div key={index}>
            <span className="label">
              {productCodeMap?.[ratio.productCd]}{' '}
              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101410`}
            </span>
            <span className="value">
              <span className="text-text_color_02 text-xs">
                {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                {ratio?.parentRatio || 0}%{' '}
              </span>
              <span> / </span>
              <span className="text-text_color_02 text-xs">
                {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                {ratio?.selfRatio || 0}%
              </span>

              <Icon
                name={'rebate_edit'}
                className="icon pl-2"
                hasTheme
                onClick={() => {
                  store.toggleRebateRatioFormOpen()
                }}
              />
            </span>
          </div>
        ))}
      {Object.keys(taAgentUserDetailTitleMap()).map((key, index) => {
        return (
          <div key={index}>
            <span className="label">{taAgentUserDetailTitleMap()[key]}</span>
            {key === 'registerTime' ? (
              <span className="value">{user?.[key] ? formatDate(user?.[key]) : '--'}</span>
            ) : (
              <span className="value">{user?.[key] || '--'}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AgentInviteTaActivity() {
  useGetAgentProductCode()

  const title = ''
  const store = useAgentInviteStore()
  const targetUid = Number(usePageContext()?.routeParams?.id || 0)

  const [currentStartEndTime, setcurrentStartEndTime] = useState<ReturnType<typeof formatAgentDateTimeTabValue>>(
    formatAgentDateTimeTabValue()
  )
  const [userInfo, setuserInfo] = useState<YapiPostV1AgentActivationUserInfoData>()
  const item = userInfo

  const [details, setdetails] = useState<YapiPostV1AgentActivationData>()

  const [state, copyToClipboard] = useCopyToClipboard()
  const handleCopy = (key: number | undefined) => {
    if (!key) return
    copyToClipboard(key.toString())
    state.error ? Toast.fail(t`user.secret_key_02`) : Toast.success(t`user.secret_key_01`)
  }

  useEffect(() => {
    if (!userInfo)
      Promise.all([
        postV1AgentActivationUserInfoApiRequest({ targetUid }),
        postV1AgentActivationApiRequest({
          targetUid,
          ...currentStartEndTime,
        } as YapiPostV1AgentActivationApiRequest),
      ]).then(res => {
        const userInfoRes = res[0].data
        const detailsRes = res[1].data

        setuserInfo(userInfoRes)
        setdetails(detailsRes)
      })
    else {
      postV1AgentActivationApiRequest({
        targetUid,
        ...currentStartEndTime,
      } as YapiPostV1AgentActivationApiRequest).then(res => {
        if (res.isOk) {
          const detailsRes = res.data
          setdetails(detailsRes)
        }
      })
    }
  }, [targetUid, currentStartEndTime])

  function updateUserInfo() {
    postV1AgentActivationUserInfoApiRequest({ targetUid }).then(res => {
      if (res.isOk) {
        setuserInfo(res.data)
      }
    })
  }

  useEffect(() => {
    store.setSelectedUserInfo({ uid: targetUid })
  }, [targetUid])

  return (
    <div className={styles['ta-modal-activity']}>
      <NavBar title={title} />

      <div className="page-content">
        <div className={`user-info mx-4 pb-2`}>
          <div className="user-avatar">
            <div className="text">{String(item?.nickName || '').charAt(0)}</div>
          </div>
          <div className="user-basic-info">
            <div className="name-row">
              <div className="name">{item?.nickName}</div>
              {agentInviteHelper.isKycVerifiedByType(item?.kycTypeInd) && (
                <LazyImage
                  width={22}
                  height={16}
                  className="ml-2 icon_img"
                  src={`${oss_svg_image_domain_address}${OssImgFolderNameEnums.agent}/agent_name_verified.png`}
                />
              )}

              {agentInviteHelper.isAgent(item?.isAgt) && (
                <div className="ml-2 badage badage-isAgent">
                  <LazyImage
                    width={20}
                    height={20}
                    className="icon_img"
                    src={`${oss_svg_image_domain_address}${OssImgFolderNameEnums.agent}/agent_is_agent.png`}
                  />
                </div>
              )}
            </div>

            <div className="uid-row pb-2">
              <span className="uid">UID: {item?.uid}</span>
              <Icon name="copy" hasTheme onClick={() => handleCopy(item?.uid)} />
            </div>

            <IconRowDisplay userInfo={userInfo} />
          </div>
        </div>

        <div className="user-info-divider"></div>

        <AgentDatetimeTabs filterSetting={currentStartEndTime} setFilterSetting={setcurrentStartEndTime} />

        <TaActivitiesDetail activities={details} />

        <TaUserDetail targetUid={targetUid} user={userInfo} />

        <AgentInviteContentListRebateRatioEditFormPopover onSucceedCallback={() => updateUserInfo()} />
      </div>

      <div className="footer check-more-btn">
        <div
          className="check-more"
          onClick={() => {
            store.setSelectedInvited({ uid: targetUid })
            store.setFilterSettingCheckMoreV2({ uid: targetUid })
            link(`${agentModuleRoutes.inviteCheckMore}/${item?.uid || ''}`)
          }}
        >{t`features_agent_agent_invite_invite_info_invite_ta_activity_index_uf6aopvwwg`}</div>
      </div>
    </div>
  )
}

export default AgentInviteTaActivity
