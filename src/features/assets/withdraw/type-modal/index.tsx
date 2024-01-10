/**
 * 提币 - 提币类型选择弹窗
 */
import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import { AssetsWithdrawTypeEnum } from '@/constants/assets'
import { baseLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import UserPopUp from '@/features/user/components/popup'
import { useState } from 'react'
import UserPopupContent from '@/features/user/components/popup/content'
import { link } from '@/helper/link'
import { getWithdrawVerify } from '@/apis/assets/common'
import styles from './index.module.css'

interface IWithdrawTypeModalProps {
  type?: number | null
  visible: boolean
  onClose: () => void
  onConfirm: (type: number) => void
}

export const getWithdrawTypes = () => {
  const { headerData } = baseLayoutStore.getState()
  const withdrawTypes = [
    {
      name: t`features_assets_common_withdraw_action_index_5101286`,
      desc: t({
        id: 'features_assets_withdraw_type_modal_index_thtrcuwan8',
        values: { 0: headerData?.businessName },
      }),
      value: AssetsWithdrawTypeEnum.platform,
      icon: 'mongkey_pay',
    },
    {
      name: t`assets.common.withdraw-type.blockchain`,
      desc: t`features_assets_withdraw_type_modal_index_kjyy8joqss`,
      value: AssetsWithdrawTypeEnum.blockchain,
      icon: 'withdraw_coins',
    },
  ]
  return withdrawTypes
}

function WithdrawTypeModal(props: IWithdrawTypeModalProps) {
  const { type = AssetsWithdrawTypeEnum.platform, visible, onClose, onConfirm } = props || {}
  const withdrawTypes = getWithdrawTypes()
  const [verifyVisible, setVerifyVisible] = useState(false) // 是否显示安全验证弹窗

  /**
   * 提币方式校验
   */
  const onCheckWithdraw = async (e: number) => {
    const res = await getWithdrawVerify({})

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    onClose()
    if (!data?.isOpenSafeVerify) {
      setVerifyVisible(true)

      return
    }

    onConfirm(e)
  }

  return (
    <>
      <Popup
        visible={visible}
        className={styles['withdraw-type-root']}
        position="bottom"
        onClose={onClose}
        destroyOnClose
        closeOnPopstate
        safeAreaInsetBottom
      >
        <div className="withdraw-type-wrap">
          <div className="type-title">{t`assets.common.withdraw-select.title`}</div>

          {withdrawTypes.map(withdraw => {
            return (
              <div key={withdraw.value} className="type-cell" onClick={() => onCheckWithdraw(withdraw.value)}>
                <div className="type-info">
                  <Icon name={withdraw.icon} className="type-icon" />
                  <div className={`type-name ${type === withdraw.value && 'type-name-active'}`}>{withdraw.name}</div>
                </div>
                <div className="type-desc">{withdraw.desc}</div>
              </div>
            )
          })}

          <div className="cancel-cell" onClick={onClose}>
            {t`assets.financial-record.cancel`}
          </div>
        </div>
      </Popup>

      <UserPopUp
        visible={verifyVisible}
        onClose={() => setVerifyVisible(false)}
        slotContent={
          <UserPopupContent
            content={
              <>
                <p>{t`user.universal_security_verification_07`}</p>
                <p>{t`user.universal_security_verification_09`}</p>
                <p>{t`user.universal_security_verification_10`}</p>
                <p>{t`user.universal_security_verification_11`}</p>
              </>
            }
            rightButtonText={t`user.universal_security_verification_08`}
            onClose={() => setVerifyVisible(false)}
            onContinue={() => {
              setVerifyVisible(false)
              link('/personal-center/account-security')
            }}
          />
        }
      />
    </>
  )
}

export { WithdrawTypeModal }
