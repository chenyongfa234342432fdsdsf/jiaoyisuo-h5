/**
 * 逐仓详情 - 编辑仓位名称
 */
import { t } from '@lingui/macro'
import { Button, Input, Popup, Toast } from '@nbit/vant'
import { useState } from 'react'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { postPerpetualGroupModifyName } from '@/apis/assets/futures/common'
import { requestWithLoading } from '@/helper/order'
import { onCheckPositionName } from '@/helper/reg'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface IEditPositionNameModalProps {
  visible: boolean
  onClose: () => void
  onCommit: () => void
}

function EditPositionNameModal(props: IEditPositionNameModalProps) {
  const { visible, onClose, onCommit } = props || {}
  const { futuresDetails } = useAssetsFuturesStore()
  const { groupName, groupId } = futuresDetails.details || {}
  const [name, setName] = useState(groupName)
  const accountList = [
    t`features_trade_future_account_name_index_raujgynirc`,
    t`features_trade_future_account_name_index_wtqywc8o54`,
    t`features_trade_future_account_name_index_cspu5glfml`,
    t`features_trade_future_account_name_index_ks6nwnznr2`,
    t`features_trade_future_account_name_index_egpedktwmk`,
    t`features_trade_future_account_name_index_xjuxsbbith`,
  ]

  const onEdit = async () => {
    if (!name) {
      Toast.info(t`features_assets_futures_futures_details_edit_position_name_modal_index_rznpp0wjgodp29wt9rn-a`)
      return
    }

    const res = await postPerpetualGroupModifyName({ groupId, name })
    const { isOk, data } = res || {}

    if (!isOk || !data) return
    if (data?.isSuccess) {
      Toast.info(t`features_home_more_toolbar_header_toolbar_index_5101331`)
      onCommit()
    }
  }

  return (
    <Popup
      visible={visible}
      round
      closeOnPopstate
      destroyOnClose
      className={styles['edit-position-name-modal-root']}
      lockScroll
      onClose={onClose}
      position="bottom"
    >
      <div className="modal-wrapper">
        <div className="header-wrap">
          <div className="title">{t`features_assets_futures_futures_details_edit_position_name_modal_index_jzkpxzxyvc`}</div>
          <Icon name="close" hasTheme className="close-icon" onClick={onClose} />
        </div>

        <div className="content">
          <div className="input-header">
            <div className="header-title">{t`features_trade_future_account_name_index_wmqxfqhzzg`}</div>
            <div className="header-hint">
              {t`features_trade_future_account_name_index_0kgtqzlfnn`} 20{' '}
              {t`features_trade_future_account_name_index_vlg_k04nap`}
            </div>
          </div>

          <Input.TextArea
            rows={1}
            placeholder={t`features_assets_futures_futures_details_edit_position_name_modal_index_evon_ovou0pqz8hsvn9a0`}
            maxLength={20}
            showWordLimit
            className="edit-input"
            value={name}
            onChange={(val: string) => setName(val.replace(/[^\w\s\u4e00-\u9fa5]/g, ''))}
          />

          <div className="account-list">
            {accountList.map((accountInfo, i) => {
              return (
                <div
                  key={i}
                  className={`account-cell ${(i + 1) % 3 === 0 && '!mr-0'}`}
                  onClick={() => setName(accountInfo)}
                >
                  {accountInfo}
                </div>
              )
            })}
          </div>

          <div className="modal-bottom">
            <Button plain className="modal-btn close-btn" onClick={onClose}>
              {t`common.modal.close`}
            </Button>
            <Button className="modal-btn" type="primary" onClick={() => requestWithLoading(onEdit(), 0)}>
              {t`user.field.reuse_17`}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export { EditPositionNameModal }
