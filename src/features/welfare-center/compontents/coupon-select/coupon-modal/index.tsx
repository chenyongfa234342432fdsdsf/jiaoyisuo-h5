/**
 * 卡券选择 - 我的卡券列表弹窗
 */

import { Button, Popup, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { IVipCoupon } from '@/typings/api/welfare-center/all-voucher'
import { useState } from 'react'
import NavBar from '@/components/navbar'
import styles from '../index.module.css'
import { CouponCell } from '../coupon-cell'

interface ICouponModalProps {
  visible: boolean
  availableList: IVipCoupon[]
  unavailableList: IVipCoupon[]
  selectList: IVipCoupon[]
  onClose: () => void
  onChange: (e: IVipCoupon[]) => void
}

function CouponModal({
  visible,
  availableList,
  unavailableList,
  selectList: selected,
  onClose,
  onChange,
}: ICouponModalProps) {
  const [selectList, setSelectList] = useState<IVipCoupon[]>(selected || [])

  const onSelectCoupon = (e: IVipCoupon) => {
    const isContained = selectList.some(item => item.id === e?.id)
    // 是否包含同类型的卡券
    const isSameType = selectList.some(item => item.couponType === e?.couponType)
    if (!isContained && isSameType) {
      Toast.info(t`features_welfare_center_compontents_coupon_select_index_h_54cizedl`)
      return
    }

    const newSelectList = isContained ? selectList.filter(item => item.id !== e?.id) : [...selectList, e]
    setSelectList(newSelectList)
  }

  return (
    <Popup
      visible={visible}
      className={styles['coupon-select-modal']}
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
    >
      <NavBar title={t`features_welfare_center_compontents_coupon_select_index_u3rzlmkaqa`} onClickLeft={onClose} />

      <div className="coupon-content">
        {availableList?.length > 0 && (
          <>
            <div className="coupon-area-title">
              {t({
                id: 'features_welfare_center_compontents_coupon_select_index_u5bvemjdk8',
                values: { 0: availableList?.length },
              })}
            </div>
            {availableList?.map((availableCoupon, i: number) => {
              const isSelect = selectList.some(item => item?.id === availableCoupon?.id)
              return <CouponCell key={i} data={availableCoupon} isSelect={isSelect} onSelect={onSelectCoupon} />
            })}
          </>
        )}

        {unavailableList?.length > 0 && (
          <>
            <div className="coupon-area-title">
              {t({
                id: 'features_welfare_center_compontents_coupon_select_index_mgrinjmrfk',
                values: { 0: unavailableList?.length },
              })}
            </div>
            {unavailableList?.map((unavailableCoupon, i: number) => {
              return <CouponCell key={i} data={unavailableCoupon} isAvailable={false} />
            })}
          </>
        )}
      </div>

      <div className="modal-bottom">
        <Button
          type="primary"
          className="commit-btn"
          onClick={() => {
            onClose()
            onChange(selectList)
          }}
        >
          {t`user.field.reuse_17`}
        </Button>
      </div>
    </Popup>
  )
}

export { CouponModal }
