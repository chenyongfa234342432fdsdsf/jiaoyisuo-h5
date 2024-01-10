// import { Button, Message, Modal, Slider } from '@nbit/arco'
import { ReactNode, useEffect, useState } from 'react'
import { YapiPostV1AgentActivationUserInfoListRatiosData } from '@/typings/yapi/AgentActivationUserInfoV1PostApi'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { find } from 'lodash'

import { t } from '@lingui/macro'
import {
  postV1AgentUpdateInvitedUserRebateRatioApiRequest,
  postV1AgentActivationUserInfoApiRequest,
} from '@/apis/agent/invite'
import { Button, Popup, Toast } from '@nbit/vant'
import { InviteInfoRatioSlider } from '@/features/agent/agent-invite/invite-info/invite-info-content/list-filter/referral-ratio-editor/ratio-slider'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteDetailsListScalesListMembers } from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import styles from './index.module.css'

export function ReferralRatioEditor({
  targetUid,
  children,
  ratios,
  submitSucceedCallback,
}: {
  targetUid: any
  children?: ReactNode
  ratios?: YapiPostV1AgentActivationUserInfoListRatiosData[] | YapiPostV1AgentInviteDetailsListScalesListMembers[]
  submitSucceedCallback: () => void
}) {
  const { productCodeMap } = useAgentStatsStore()
  const store = useAgentInviteStore()
  const [ratioValues, setratioValues] = useState<any[]>(ratios || [])
  const [defaultRatioValues, setdefaultRatioValues] = useState<any[]>(ratios || [])

  const onSubmit = () => {
    if (store.cache.userInBlacklist.onTheBlacklist) {
      Toast.fail(
        t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_ba_4ue7uns`
      )
      store.toggleRebateRatioFormOpen()
      return
    }
    postV1AgentUpdateInvitedUserRebateRatioApiRequest({
      invitedUid: targetUid,
      ratios: ratioValues,
    })
      .then(res => {
        if (res.isOk) {
          Toast.success(t`features_user_personal_center_account_security_google_verification_index_510233`)
          store.toggleRebateRatioFormOpen()
          submitSucceedCallback && submitSucceedCallback()
        } else {
          // reset ratio values
          setratioValues([...defaultRatioValues])
        }
      })
      .catch(e => {
        setratioValues([...defaultRatioValues])
      })
  }

  useEffect(() => {
    if (!ratios) return
    setratioValues(ratios)
    setdefaultRatioValues(ratios)
  }, [ratios])

  useEffect(() => {
    postV1AgentActivationUserInfoApiRequest({ targetUid }).then(res => {
      if (res.isOk && res.data) {
        setratioValues(res.data.ratios)
        setdefaultRatioValues(res.data.ratios)
      }
    })
  }, [])

  return (
    <div className="wrapper px-4">
      <span className="text-sm">{t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_5qgy30vwwv`}</span>
      {ratioValues?.map((ratio, index) => {
        // my ratio
        const originRatio = defaultRatioValues[index]
        const selfRatio = ratio?.parentRatio ? Number(ratio.parentRatio) : 0
        const selfRatioOrigin = originRatio?.parentRatio ? Number(originRatio?.parentRatio) : 0
        // friend ratio
        const childRatio = ratio?.selfRatio ? Number(ratio.selfRatio) : 0
        const totalRatio = selfRatio + childRatio
        const childRatioOrigin = totalRatio - selfRatioOrigin

        return (
          <div key={index} className="my-4">
            <span className="sub-title text-text_color_02 text-sm pb-2">
              {productCodeMap[ratio.productCd]}
              {t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_6st5wgnzqy`}
              <span className="text-brand_color">{totalRatio}%</span>
            </span>
            <InviteInfoRatioSlider
              value={childRatio}
              originValue={childRatioOrigin}
              max={totalRatio}
              onchange={(v: number) => {
                const parent = v.toString()
                const self = (totalRatio - v).toString()

                setratioValues(prev => {
                  if (find(prev, each => each?.productCd === ratio.productCd))
                    return prev.map(each =>
                      each?.productCd === ratio.productCd
                        ? {
                            productCd: each.productCd,
                            parentRatio: self,
                            selfRatio: parent,
                          }
                        : each
                    )
                  return [
                    ...prev,
                    {
                      productCd: ratio.productCd,
                      // childRatio: totalRatio - v,
                      parentRatio: self,
                      selfRatio: parent,
                    },
                  ]
                })
              }}
            />
          </div>
        )
      })}

      <div className="footer w-full flex mb-10 pt-4">
        <Button className="w-full" onClick={onSubmit} type="primary">
          {t`features_trade_future_c2c_225101584`}
        </Button>
      </div>
    </div>
  )
}

export function AgentInviteContentListRebateRatioEditFormPopover({
  onSucceedCallback,
}: {
  onSucceedCallback?: () => void
}) {
  const store = useAgentInviteStore()
  return (
    <div>
      <Popup
        className={styles['filter-form-popup']}
        visible={store.isRebateRatioFormOpen}
        title={t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_qblv3yyt8k`}
        closeable
        style={{ height: '60%' }}
        position="bottom"
        round
        onClose={store.toggleRebateRatioFormOpen}
        destroyOnClose
      >
        <ReferralRatioEditor
          targetUid={store.selectedUserInfo.uid}
          submitSucceedCallback={() => {
            store.setFilterSetting('forceUpdate', {})
            onSucceedCallback && onSucceedCallback()
          }}
        />
      </Popup>
    </div>
  )
}
