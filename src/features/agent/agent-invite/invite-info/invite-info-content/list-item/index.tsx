import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { agentModuleRoutes } from '@/constants/agent'
import { OssImgFolderNameEnums, oss_svg_image_domain_address } from '@/constants/oss'
import { formatDate } from '@/helper/date'
import { link } from '@/helper/link'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { agentInviteHelper, useAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteDetailsListMembers } from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import { t } from '@lingui/macro'
import { Toast } from '@nbit/vant'
import { useCopyToClipboard } from 'react-use'
import { isEmpty } from 'lodash'
import styles from './index.module.css'

function AgentInviteContentListItem({ item }: { item: YapiPostV1AgentInviteDetailsListMembers }) {
  const { productCodeMap } = useAgentStatsStore()
  const [copyState, copyToClipboard] = useCopyToClipboard()
  const store = useAgentInviteStore()

  const handleCopy = (uid: any) => {
    copyToClipboard(uid)
    copyState.error
      ? Toast({ message: t`user.secret_key_02`, position: 'top' })
      : Toast({ message: t`user.secret_key_01`, position: 'top' })
  }

  return (
    <div className={styles.scoped}>
      <div className="item-wrapper">
        <div className="header flex items-center">
          <div className="name">{item.nickName}</div>
          {agentInviteHelper.isKycVerified(item.kycStatus) && (
            <LazyImage
              width={22}
              height={16}
              className="ml-2 icon_img"
              src={`${oss_svg_image_domain_address}${OssImgFolderNameEnums.agent}/agent_name_verified.png`}
            />
          )}

          {agentInviteHelper.isAgent(item.isAgt) && (
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
        <div className="item-content">
          <div className="row uid">
            <div className="title">UID</div>
            <div className="value">
              {item.uid}
              <div className="copy-icon">
                <Icon name="copy" hasTheme onClick={() => handleCopy(item.uid)} />
              </div>
            </div>
          </div>
          <div className="row under-number">
            <div className="title">{t`constants_agent_invite_index_vg3ikq_9fg`}</div>
            <div className="value">{item.inviteCount}</div>
          </div>
          <div className="wrapper flex">
            <div className="scales-wrapper">
              {item.scales?.map(_item => {
                const codeKey = productCodeMap[_item.productCd]
                if (!codeKey) return null
                return (
                  <div className="row scale-row" key={_item.productCd}>
                    <div className="title">
                      {codeKey}
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101410`}
                    </div>

                    <div className="value flex items-center">
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                      {_item.selfScale || 0}% /{' '}
                      {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                      {_item.childScale || 0}%
                      <span className="rebate-edit-icon">
                        <Icon
                          name={'rebate_edit'}
                          className="icon ml-2"
                          hasTheme
                          onClick={() => {
                            store.toggleRebateRatioFormOpen()
                            store.setSelectedUserInfo(item)
                          }}
                        />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="row time-slot">
          <div className="title">{formatDate(item.createdTime)}</div>

          <div className="flex wrapper">
            <div
              className="ta-activity check-more cursor-pointer ta-activity-button"
              onClick={() => {
                store.setSelectedUserInfo(item)
                link(`${agentModuleRoutes.inviteTaActivity}/${item.uid}`)
              }}
            >
              <span className="px-2 py-1">
                TA{t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_gczzq2ovcc`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="item-divider"></div>
    </div>
  )
}

export default AgentInviteContentListItem
