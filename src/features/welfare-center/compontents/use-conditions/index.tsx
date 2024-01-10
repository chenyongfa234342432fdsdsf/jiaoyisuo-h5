import { t } from '@lingui/macro'
import { CouponTypeEnum, ScenesBeUsedEnum } from '@/constants/welfare-center/common'

export default function UseConditions({ useThreshold, coinSymbol, businessScene, couponType }) {
  // 使用场景 合约 现货 三元期权
  // 合约保险金 手续费 体验金
  const getText = () => {
    // 手续费
    if (couponType === CouponTypeEnum.fee) {
      /** 合约 */
      return {
        [ScenesBeUsedEnum.perpetual]: t`features_welfare_center_compontents_use_conditions_index_c4z_lgevmb`,
        [ScenesBeUsedEnum.spot]: t`features_welfare_center_compontents_use_conditions_index_lnm_3ynvrk`,
      }[businessScene]
    }
    /** 合约体验金 */
    if (couponType === CouponTypeEnum.voucher && businessScene === ScenesBeUsedEnum.perpetual) {
      return t`features_welfare_center_compontents_use_conditions_index_8v2pbz3pzy`
    }
    /** 保险金 */
    if (couponType === CouponTypeEnum.insurance) {
      return t`features_welfare_center_compontents_use_conditions_index_w25qasziiy`
    }
    /** 三元期权 */
    if (businessScene === ScenesBeUsedEnum.option) {
      return t`features_welfare_center_compontents_use_conditions_index_3quxkz2phc`
    }
  }
  return (
    <div>
      {getText() || t`features_welfare_center_compontents_card_item_index_xjen0akgld`}≥ {useThreshold}
      {` ${coinSymbol}`}
    </div>
  )
}
