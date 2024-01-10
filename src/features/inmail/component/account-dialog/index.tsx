import { t } from '@lingui/macro'
import { Dialog } from '@nbit/vant'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/user'
import styles from './index.module.css'

const AccountDialog = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { userInfo } = useUserStore()

  useEffect(() => {
    const reasonText = userInfo?.rejectReason
    reasonText ? setVisible(true) : setVisible(false)
  }, [userInfo?.rejectReason])

  return (
    <div>
      <Dialog
        closeable
        visible={visible}
        title={t`features_inmail_component_account_dialog_index_fhuczdwsey`}
        onClose={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
        confirmButtonText={t`features_trade_common_notification_index_5101066`}
        className={classNames(styles['message-modal-wrapper'], 'dialog-confirm-wrapper', 'confirm-black')}
      >
        <div className="modal-wrapper-content">
          <Icon name="tips_icon" className="message-modal-icon" />
          <div className="modal-header" dangerouslySetInnerHTML={{ __html: userInfo?.rejectReason }} />
        </div>
      </Dialog>
    </div>
  )
}
export default AccountDialog
