import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import { QRCodeCanvas } from 'qrcode.react'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import { usePageContext } from '@/hooks/use-page-context'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { AgentInviteCodeDefaultDataType } from '@/typings/api/agent/invite'
import styles from './index.module.css'

type RebateQrCodePopupProps = {
  visible: boolean
  setVisible: (v: boolean) => void
  data: AgentInviteCodeDefaultDataType
}

export default function RebateQrCodePopup(props: RebateQrCodePopupProps) {
  const { data, visible, setVisible } = props
  const { layoutProps } = useLayoutStore()
  const pageContext = usePageContext()

  const generateInviteUrl = (invitationCode?: string) => {
    return `https://${location.host}/${pageContext.locale}/register?invitationCode=${invitationCode}`
  }

  return (
    <Popup visible={visible} onClose={() => setVisible(false)} className={styles['rebate-qr-code-wrap']}>
      <div className="qr-code-wrap">
        <div className="popup-wrap">
          <LazyImage className="qr-code-wrap-img" src={`${oss_svg_image_domain_address}agent/v3/bg_agent_qr.png`} />
          <div className="popup-content">
            <div className="title">
              <Icon className="back mr-2" name="user_head_hover" />
              <span>{layoutProps?.businessName}</span>
            </div>
            <div className="content">{t`features_agent_invite_operation_index_5101441`}</div>
            <div className="qr-wrap">
              <QRCodeCanvas size={248} value={generateInviteUrl(data?.invitationCode)} />
              <div className="button-wrap">
                <span className="label">{t`features_agent_invite_operation_index_5101456`}</span>
                <span className="value">{data?.invitationCode}</span>
              </div>
            </div>
          </div>
        </div>
        <Icon name="agent_popup_close" className="wrap-icon" onClick={() => setVisible(false)} />
      </div>
    </Popup>
  )
}
