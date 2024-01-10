/**
 * 合约 - 选择合约组弹窗组件
 */
import { postPerpetualGroupMerge } from '@/apis/assets/futures/overview'
import { SelectGroup } from '@/features/trade/future/select-group'
import { requestWithLoading } from '@/helper/order'
import { t } from '@lingui/macro'
import { Button, Popup, Toast } from '@nbit/vant'
import { useState } from 'react'
import styles from './index.module.css'

interface FuturesSelectModalProps {
  groupId: string
  onCommit: (e: boolean) => void
  onClose: () => void
}

function FuturesSelectModal(props: FuturesSelectModalProps) {
  const { groupId, onCommit, onClose } = props
  const [visible, setVisible] = useState(true)
  const [selectVisible, setSelectVisible] = useState(false)

  /**
   * 选择合约组回调
   */
  const onSelect = async (id: string) => {
    const res = await postPerpetualGroupMerge({
      fromGroupId: groupId,
      toGroupId: id,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    Toast.info(
      data?.isSuccess
        ? t`features_assets_futures_futures_select_modal_index_nng7drxmyvdoli142zrjp`
        : t`features_assets_futures_futures_select_modal_index_rcxw7mdyqfszem_pu-vit`
    )

    setSelectVisible(false)
    onCommit(data?.isSuccess || true)
  }

  return (
    <>
      {visible && (
        <Popup
          visible={visible}
          className={styles['futures-select-modal-root']}
          closeOnPopstate
          round
          destroyOnClose
          onClose={onClose}
        >
          <div className="futures-select-modal-content">
            <span className="popup-content">
              {t`features_assets_futures_futures_select_modal_index_j8ik6qbnaenceg_5av7qq`}
            </span>

            <div className="popup-bottom">
              <Button
                plain
                className="popup-btn popup-cancel-btn"
                onClick={() => {
                  setVisible(false)
                  onClose()
                }}
              >
                {t`assets.financial-record.cancel`}
              </Button>
              <Button
                type="primary"
                className="popup-btn"
                onClick={() => {
                  setVisible(false)
                  setSelectVisible(true)
                }}
              >{t`features_trade_future_select_group_index_rwkx7oq_k5`}</Button>
            </div>
          </div>
        </Popup>
      )}

      {selectVisible && (
        <SelectGroup
          visible={selectVisible}
          onVisibleChange={() => {
            onCommit(false)
            setSelectVisible(false)
          }}
          onSelectOne={e => requestWithLoading(onSelect(e), 0)}
          excludeContractGroupId={groupId}
          showCreateNewGroup={false}
        />
      )}
    </>
  )
}

export { FuturesSelectModal }
