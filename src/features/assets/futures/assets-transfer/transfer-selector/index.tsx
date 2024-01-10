/**
 * 资产划转 - 划转选择
 */
import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import NavBar from '@/components/navbar'
import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import { AssetsTransferTypeEnum } from '@/constants/assets/common'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useEffect, useState } from 'react'
import { useCommonStore } from '@/store/common'
import styles from './index.module.css'
import { ITransferAccountTypeEnum } from '../transfer-layout'

interface ITransferSelectorProps {
  /** 是否展示 */
  visible: boolean
  /** 划转类型 */
  type: string
  /** 选中账户 */
  groupId: string
  /** 对比账户 */
  contrastGroupId: string
  /** 关闭回调 */
  onClose: () => void
  /** 选择账户 */
  onSelect: (e) => void
}

function TransferSelector(props: ITransferSelectorProps) {
  const { visible, type, groupId, contrastGroupId, onClose, onSelect } = props || {}
  const { accountList = [] } = useAssetsFuturesStore().assetsTransfer || {}
  const { isFusionMode } = useCommonStore()
  const [newAccountList, setNewAccountList] = useState(accountList)

  useEffect(() => {
    if (type === AssetsTransferTypeEnum.from) {
      setNewAccountList(accountList.filter(item => !item.groupId || (item.groupId && +item.totalAmount > 0)))
    }
  }, [])

  return (
    <Popup
      lockScroll
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
      visible={visible}
      className={styles['transfer-selector-root']}
    >
      <NavBar
        title={t`features_assets_assets_transfer_transfer_selector_index_o9stbl4p74sn2-ygdcmsw`}
        onClickLeft={onClose}
      />

      {type === AssetsTransferTypeEnum.to && (
        <div
          className="new-cell"
          onClick={() =>
            onSelect({
              groupName: t`features/assets/financial-record/record-detail/record-details-info/index-0`,
              type: ITransferAccountTypeEnum.new,
            })
          }
        >
          <span className="new-text">
            {isFusionMode ? t`constants_order_746` : t`features_trade_future_select_group_index_622`}
          </span>
          <Icon name="next_arrow" className="text-base" />
        </div>
      )}

      <CommonList
        finished
        showEmpty={newAccountList.length === 0}
        listChildren={newAccountList.map((item, index) => {
          if (item.groupId === contrastGroupId) return null
          return (
            <div
              key={item.groupId}
              className={`list-cell ${index + 1 === newAccountList.length && '!border-b-0'}`}
              onClick={() => onSelect(item)}
            >
              <div className="transfer-info">
                <span className="info-account">{item.groupName || t`features_trade_future_c2c_22225101593`}</span>
                <span className="info-amount">
                  {t`features_assets_assets_transfer_transfer_selector_index_09zidaaibqwuhrri0doj9`} {item.amount}{' '}
                  {item.coinName}
                </span>
              </div>

              {groupId === item.groupId && <Icon name="choose-language_selected" className="text-base" />}
            </div>
          )
        })}
      />
    </Popup>
  )
}

export { TransferSelector }
