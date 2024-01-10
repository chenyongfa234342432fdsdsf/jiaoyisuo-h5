/**
 * 提币 - 提币提醒
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { AssetsWithdrawTypeEnum, WithdrawUsdLimitEnum } from '@/constants/assets'
import { useAssetsStore } from '@/store/assets/spot'
import { formatCurrency } from '@/helper/decimal'

function WithdrawHint() {
  const { amountInfo, formData } = useAssetsStore().withdrawModule || {}
  const quota =
    amountInfo?.remainingWithdrawalAmount && amountInfo?.remainingWithdrawalAmount === WithdrawUsdLimitEnum.unlimited
      ? '--'
      : `${formatCurrency(amountInfo?.remainingWithdrawalAmount, 2, false) || '--'}/${
          formatCurrency(amountInfo?.dayMaxWithdrawAmount, 2, false) || '--'
        }`

  const list = [
    {
      text: t({
        id: 'features_assets_withdraw_hint_index_te_l5yoaxb',
        values: { 0: quota },
      }),
    },
    {
      text: t({
        id: 'features_assets_withdraw_hint_index_h1suasdgi4',
        values: { 0: amountInfo?.minAmount || '--', 1: formData.coin?.symbol },
      }),
      isHide: !formData.type || (formData.type === AssetsWithdrawTypeEnum.blockchain && !formData.network?.id),
    },
    {
      text: t`features_assets_withdraw_hint_index_gtohicmmzn`,
      isHide: !formData.type || (formData.type === AssetsWithdrawTypeEnum.blockchain && !formData.network?.id),
    },
    {
      text: t`assets.withdraw.note-3`,
      isHide: !formData.type || (formData.type === AssetsWithdrawTypeEnum.blockchain && !formData.network?.id),
    },
  ]

  return (
    <div className="hint-wrap">
      {list.map((item, i: number) => {
        if (item.isHide) return
        return (
          <div key={i} className="hint-cell">
            <Icon name="prompt-symbol" className={'hint-icon'} />
            <div className="hint-text">{item.text}</div>
          </div>
        )
      })}
    </div>
  )
}

export { WithdrawHint }
