/**
 * 提币 - 提币数量
 */
import { t } from '@lingui/macro'
import { CommonDigital } from '@/components/common-digital'
import { useAssetsStore } from '@/store/assets/spot'
import { Input } from '@nbit/vant'
import { useState } from 'react'
import { formatCurrency } from '@/helper/decimal'

function WithdrawAmount({ onChangeAmount: onChange }: { onChangeAmount: (e: string) => void }) {
  const { formData, amountInfo } = useAssetsStore().withdrawModule || {}
  // 是否聚焦
  const [isFocus, setIsFocus] = useState(false)

  const onChangeAmount = (e: string) => {
    let newVal = e

    /** 控制提币数量精度 */
    const { withdrawPrecision = 0 } = amountInfo
    const valArr = newVal.split('.')
    if (valArr.length > 1 && valArr[1].length > withdrawPrecision) {
      newVal = `${valArr[0]}.${valArr[1].slice(0, withdrawPrecision)}`
    }

    onChange(newVal)
  }

  return (
    <div className="form-cell !mb-4">
      <div className="form-label">{t`assets.withdraw.form.count.label`}</div>
      <div className={isFocus ? 'form-input-focus' : 'form-input'}>
        <Input
          className="flex-1"
          onChange={onChangeAmount}
          value={formData.amount}
          type="number"
          placeholder={`${t`features_assets_withdraw_withdraw_form_510114`}${amountInfo.minAmount || '0.00'}`}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />

        <div className="form-amount-operate" onClick={() => onChangeAmount(amountInfo?.availableAmount || '0')}>
          <span>{formData.coin?.coinName || '--'}</span>
          <span className="operate-line">丨</span>
          <span className="operate-btn">{t`assets.withdraw.form.count.withdraw-all`}</span>
        </div>
      </div>
      <div className="form-available-amount">
        <span>{t`assets.withdraw.form.count.label-2`}</span>
        <CommonDigital
          content={`${formatCurrency(amountInfo?.availableAmount) || '0'} ${formData.coin?.symbol || '--'}`}
          className="flex-1 text-text_color_01"
        />
      </div>
    </div>
  )
}

export { WithdrawAmount }
