/**
 * 提币 - 区块链表单
 * 提币地址、主网选择、地址标签 (Memo)
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { Input, Popup } from '@nbit/vant'
import Icon from '@/components/icon'
import { SelectActionSheet } from '@/components/select-action-sheet'
import { onVerifyAddress } from '@/helper/assets/spot'
import { onCheckStr } from '@/helper/reg'
import { useAssetsStore } from '@/store/assets/spot'
import { useLayoutStore } from '@/store/layout'
import { WithdrawAddressListResp } from '@/typings/api/assets/assets'
import { MainTypeMemoTypeEnum } from '@/constants/assets'
import { EditAddress } from '../address/edit-address'
import styles from '../layout/index.module.css'
import { WithdrawNetwork } from '../network'

interface IWithdrawChainFormProps {
  onChangeAddress: (val: string, verify?: boolean) => void
  onChangeNetwork: () => void
  onLoadList: () => void
  onChangeMemo: (val: string) => void
}

function WithdrawChainForm(props: IWithdrawChainFormProps) {
  const { onChangeAddress, onChangeNetwork, onLoadList, onChangeMemo } = props || {}
  const { headerData } = useLayoutStore()
  const { formData, addressList } = useAssetsStore().withdrawModule || {}
  const [isFocus, setIsFocus] = useState(false)
  const [isMemoFocus, setIsMemoFocus] = useState(false)
  const [addVisible, setAddVisible] = useState(false)

  function AddressActions({ onChange: onSelectAddress }: { onChange: (address: string) => void }) {
    const actions = addressList.map((item: WithdrawAddressListResp) => {
      return {
        ...item,
        value: item.address,
        name: `${item.address.substring(0, 4)}...${item.address.substring(item.address.length - 4)}(${
          item.remark || '--'
        })`,
      }
    })

    return (
      <SelectActionSheet
        title={t`assets.withdraw.select-address.title`}
        desc={t({
          id: 'features_assets_common_withdraw_action_index_5101287',
          values: { 0: headerData?.businessName },
        })}
        value={formData?.address}
        triggerElement={<Icon hasTheme name="asset_drawing_attn" />}
        actionSheetElement={
          <div className={styles['withdraw-from-address-action']}>
            {addressList.length < 10 && (
              <div
                className="action-item border-t-0 active-text"
                onClick={() => {
                  setAddVisible(true)
                }}
              >
                <span>+</span>
                <span className="ml-1">{t`assets.withdraw-address.add`}</span>
              </div>
            )}

            {actions.map(actionsItem => {
              return (
                <div
                  key={actionsItem.id}
                  className={`action-item ${formData?.address === actionsItem.address && 'active-text'}`}
                  onClick={() => {
                    onSelectAddress(actionsItem.address)
                  }}
                >
                  {actionsItem.name}
                </div>
              )
            })}
          </div>
        }
      />
    )
  }

  return (
    <>
      <div className={`form-cell ${!formData.addressVerify && '!mb-2.5'}`}>
        <div className="form-label">{t`assets.withdraw.form.address.label`}</div>
        <div className={isFocus ? 'form-input-focus' : 'form-input'}>
          <Input
            className="flex-1 mr-3"
            onChange={onChangeAddress}
            value={formData.address}
            type="text"
            placeholder={t`assets.withdraw.form.address.placeholder`}
            maxLength={256}
            onFocus={() => setIsFocus(true)}
            onBlur={async () => {
              setIsFocus(false)
              if (!formData.address) onChangeAddress(formData.address, true)
              if (!onCheckStr(formData.address)) {
                return
              }
              onChangeAddress(formData.address, await onVerifyAddress(formData?.network.symbol, formData.address))
            }}
          />

          <AddressActions
            onChange={async (e: string) => onChangeAddress(e, await onVerifyAddress(formData?.network.symbol, e))}
          />
        </div>
        {!formData.addressVerify && (
          <div className="form-address-error">{t`features_assets_withdraw_withdraw_form_510113`}</div>
        )}
      </div>

      <WithdrawNetwork onChangeNetwork={onChangeNetwork} />

      {formData.network?.isUseMemo === MainTypeMemoTypeEnum.yes && (
        <div className="form-cell">
          <div className="form-label">{t`assets.withdraw.confirm.memo`} (Memo)</div>
          <Input
            className={isMemoFocus ? 'form-input-focus' : 'form-input'}
            onChange={onChangeMemo}
            value={formData.memo}
            type="text"
            placeholder={t`assets.withdraw.form.memo.placeholder`}
            onFocus={() => setIsMemoFocus(true)}
            onBlur={() => setIsMemoFocus(false)}
          />
        </div>
      )}

      {addVisible && (
        <Popup
          visible={addVisible}
          className={styles['add-address-root']}
          overlay={false}
          destroyOnClose
          closeOnPopstate
          safeAreaInsetBottom
        >
          <EditAddress
            onBack={() => setAddVisible(false)}
            onConfirm={async (address: string) => {
              onChangeAddress(address, await onVerifyAddress(formData?.network.symbol, address))
              setAddVisible(false)
              onLoadList()
            }}
          />
        </Popup>
      )}
    </>
  )
}

export { WithdrawChainForm }
