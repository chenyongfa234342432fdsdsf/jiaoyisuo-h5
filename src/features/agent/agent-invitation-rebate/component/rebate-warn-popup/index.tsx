import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { isToday } from '@/helper/date'
import { isUndefined } from 'lodash'
import { useState, useEffect, useLayoutEffect } from 'react'
import { Popup, Button, Checkbox } from '@nbit/vant'
import { getUserCheckBlacklistApiRequest } from '@/apis/agent/invite'
import { useAgentStore } from '@/store/agent/agent-invitation-rebate'
import styles from './index.module.css'

export default function RebateWarnPopup({
  visible,
  reason,
  onClose,
}: {
  visible?: boolean
  reason?: string
  onClose?: () => void
}) {
  const [checked, setChecked] = useState<boolean>(false)
  const [applyVisible, setApplyVisible] = useState<boolean>(false)
  const [reasonText, setReasonText] = useState<string>('')

  const { agentInvitationRebateData, setAgentData } = useAgentStore()

  /** 是否拉黑 */
  const getUserBlackInfo = async () => {
    const { data, isOk } = await getUserCheckBlacklistApiRequest({})
    if (isOk && data?.inBlacklist) {
      /** 进行本地判断 */
      const time = agentInvitationRebateData.time
      const isShow = agentInvitationRebateData.isShow
      if (!time || isShow) {
        setReasonText(data?.reason)
        setApplyVisible(data?.inBlacklist)
      }
    }
  }

  const onWarnChange = () => {
    checked &&
      setAgentData({
        isShow: false,
        time: dayjs().valueOf(),
      })
    isUndefined(visible) ? setApplyVisible(false) : onClose?.()
  }

  const handleVisible = () => {
    const time = agentInvitationRebateData?.time
    const isShow = agentInvitationRebateData?.isShow
    if (visible && (!time || isShow)) {
      return setApplyVisible(true)
    }
    return setApplyVisible(false)
  }

  const onCloseChange = () => {
    isUndefined(visible) ? setApplyVisible(false) : onClose?.()
  }

  useEffect(() => {
    isUndefined(visible) ? getUserBlackInfo() : handleVisible()
  }, [visible])

  useLayoutEffect(() => {
    const time = agentInvitationRebateData.time
    if ((time && !isToday(time)) || !time) {
      setAgentData({
        isShow: true,
        time: dayjs().valueOf(),
      })
    }
  }, [])

  return (
    <Popup onClose={onCloseChange} className={styles['rebate-warn-popup-wrap']} visible={applyVisible}>
      <p>{t`features_agent_agent_invitation_rebate_component_rebate_warn_popup_index_nj3n7jn91f`}</p>
      <label>{t`features_agent_invite_operation_index_dja-jgl1z4brh3r5y8t5_`}</label>
      <span>{t`features_agent_invite_operation_index_qzy5jhzyx1rwycyjppmq8`}</span>
      <label>{t`features_agent_invite_operation_index_eu-cizew0z1ynwb_8zwom`}</label>
      <span className="text-sell_down_color">{isUndefined(visible) ? reasonText : reason}</span>
      <span>{t`features_agent_invite_operation_index_fwwyt3avqndf7ucojxq4a`}</span>
      <Checkbox
        checked={checked}
        onChange={setChecked}
        iconRender={({ checked: isActive }) => (
          <Icon
            className="checkbox-login-icon"
            name={isActive ? 'login_agreement_selected' : 'login_agreement_unselected'}
          />
        )}
      >
        {t`features_agent_agent_invitation_rebate_component_rebate_warn_popup_index_sniemw90zj`}
      </Checkbox>
      <Button type="primary" onClick={() => onWarnChange()}>
        {t`features_trade_common_notification_index_5101066`}
      </Button>
    </Popup>
  )
}
