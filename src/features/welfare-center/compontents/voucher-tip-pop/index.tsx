import { Button, Popup } from '@nbit/vant'
import classNames from 'classnames'
import { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export default function VoucherTipPop({ tipVisible, closeClick, ...props }) {
  const [visible, setVisible] = useState(false)
  useUpdateEffect(() => {
    setVisible(tipVisible)
  }, [tipVisible])
  return (
    <Popup
      className={classNames([styles.tipPop])}
      round
      visible={visible}
      onClickOverlay={closeClick}
      title={t`features_welfare_center_compontents_voucher_tip_pop_index_o5v8debqst`}
      {...props}
    >
      <div className="tip-content">
        {t`features_welfare_center_compontents_voucher_tip_pop_index_yuyrjsycrp`}
        <br />
        {t`features_welfare_center_compontents_voucher_tip_pop_index_eeqguwaoxt`}
        <br />
        {t`features_welfare_center_compontents_voucher_tip_pop_index_dlof3wqcfu`}
        <br />
        {t`features_welfare_center_compontents_voucher_tip_pop_index_lz48zvpjqr`}
        <div className="my-2">
          {t`features_welfare_center_compontents_voucher_tip_pop_index__zq3gxff6d`}{' '}
          {t`features_welfare_center_compontents_voucher_tip_pop_index_b3bay_v0dj`}
        </div>
        {t`features_welfare_center_compontents_voucher_tip_pop_index_8myqdl6tqh`}{' '}
        {t`features_welfare_center_compontents_voucher_tip_pop_index_hlpkffck1z`}
        <br />
        {t`features_welfare_center_compontents_voucher_tip_pop_index_zuyifu2wvd`}
        <br />
        {t`features_welfare_center_compontents_voucher_tip_pop_index_eigxaicpkp`}
      </div>
      <Button className="confirm-btn" type="primary" onClick={closeClick}>
        {t`features_trade_common_notification_index_5101066`}
      </Button>
    </Popup>
  )
}
