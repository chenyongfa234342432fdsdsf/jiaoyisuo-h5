/**
 * 提币 - 收款人 UID
 */
import { useAssetsStore } from '@/store/assets/spot'
import { t } from '@lingui/macro'
import { Input } from '@nbit/vant'
import { useState } from 'react'

interface IWithdrawPayUidProps {
  onChangeUid: (value: string) => void
}
function WithdrawPayUid(props: IWithdrawPayUidProps) {
  const { formData } = useAssetsStore().withdrawModule || {}
  const { onChangeUid } = props || {}
  // 是否聚焦
  const [isFocus, setIsFocus] = useState(false)

  return (
    <div className="form-cell">
      <div className="form-label">{t`features/assets/withdraw/withdraw-form-0`}</div>
      <Input
        className={isFocus ? 'form-input-focus' : 'form-input'}
        onChange={onChangeUid}
        value={formData.uid}
        type="number"
        placeholder={t`features/assets/withdraw/withdraw-form-1`}
        maxLength={10}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </div>
  )
}

export { WithdrawPayUid }
