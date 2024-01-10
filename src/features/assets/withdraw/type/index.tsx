/**
 * 提币 - 提币类型
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { AssetsWithdrawTypeEnum } from '@/constants/assets'
import { getWithdrawTypes } from '../type-modal'

interface IWithdrawTypeProps {
  type: AssetsWithdrawTypeEnum | null
  onClick: () => void
}

function WithdrawType(props: IWithdrawTypeProps) {
  const { type, onClick } = props || {}
  const withdrawTypes = getWithdrawTypes()
  const withdraw = withdrawTypes.find(item => item.value === type)

  return (
    <div className="form-type" onClick={onClick}>
      {type ? (
        <>
          <Icon name={withdraw?.icon || ''} className="type-icon" />

          <div className="type-info">
            <div className="info-title">{withdraw?.name}</div>
            <div className="info-desc">{withdraw?.desc}</div>
          </div>
        </>
      ) : (
        <div className="text-sm text-text_color_04">{t`features_assets_withdraw_type_index_bo0xbr813z`}</div>
      )}

      <Icon name="regsiter_icon_drop" hasTheme className="type-drop" />
    </div>
  )
}

export { WithdrawType }
