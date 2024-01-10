/**
 * 卡券反选组件
 */
import { t } from '@lingui/macro'
import { Swiper } from '@nbit/vant'
import Icon from '@/components/icon'
import classNames from 'classnames'
import { memo, useState } from 'react'
import { IVipCoupon } from '@/typings/api/welfare-center/all-voucher'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { useMount, useUpdateEffect } from 'ahooks'
import { getTextFromStoreEnums } from '@/helper/store'
import { CouponTypeEnum, useDiscountRuleEnum } from '@/constants/welfare-center/common'
import { ICouponTypeList, getBestCoupon, getCouponTypeList } from '@/helper/welfare-center/coupon-select'
import { CommonDigital } from '@/components/common-digital'
import { CouponModal } from './coupon-modal'
import styles from './index.module.css'

export interface ICouponResult {
  /** 已选择卡券列表 */
  coupons: IVipCoupon[] | any
  /** 体验金 */
  voucherAmount?: number
  /** 是否手工选择 true:手工选择 false:自动匹配 */
  isManual?: boolean
}

interface ICouponSelectProps {
  className?: string
  /** 场景（ScenesBeUsedEnum:合约/现货/三元期权），默认合约 */
  businessScene?: string
  /** 是否需要格式化选中卡券列表数据，默认 true */
  isFormat?: boolean
  /** 预估手续费（现货、合约场景下必传） */
  fee?: string
  /** 下单金额（现货、合约场景下必传，用于匹配手续费） */
  amount?: string
  /** 预计亏损 (合约场景下平仓且预估收益为负数时必传) */
  loss?: string
  /** 仓位保证金（开仓必传，用于匹配体验金） */
  margin?: string
  /** 币种 symbol */
  symbol?: string
  /** 是否需要自动匹配最优券 (兼容市价下单情况下手工选择卡券后不需要自动匹配卡券场景) */
  isMatch?: boolean
  /** 选择卡券
   * @param coupons 已选择卡券列表
   * @param voucherAmount 体验金
   * @param isManual 是否手工选择 true:手工选择 false:自动匹配
   *  */
  onChange: (e: ICouponResult) => void
}

function CouponSelect(props: ICouponSelectProps) {
  const { className, isFormat = true, isMatch = true, amount, loss, margin, symbol, fee, onChange } = props || {}
  const { welfareCenterDictionaryEnum, couponData, fetchWelfareCenterDictionaryEnums } = useBaseWelfareCenter() || {}
  const [couponVisible, setCouponVisible] = useState(false) // 是否展示我的卡券选择弹窗
  const [couponFormatData, setCouponFormatData] = useState({
    availableList: [] as IVipCoupon[],
    unavailableList: [] as IVipCoupon[],
    selectList: [] as IVipCoupon[],
  })
  // 是否展示券选择入口
  const [isShowCouponSelect, setIsShowCouponSelect] = useState(false)

  /**
   * 转换卡券数据
   */
  const onFormatCoupons = (couponList: IVipCoupon[]) => {
    return isFormat
      ? couponList?.map(coupon => {
          return {
            couponId: coupon?.id,
            couponCode: coupon?.couponCode,
            couponType: coupon?.couponType,
          }
        })
      : couponList
  }

  /**
   * 选择卡券
   */
  const onChangeCoupons = (data: IVipCoupon[], isManual = false) => {
    const voucherAmount = data?.find(item => item?.couponType === CouponTypeEnum.voucher)?.couponValue || 0
    onChange({
      coupons: onFormatCoupons(data),
      voucherAmount,
      isManual,
    })
  }

  useMount(fetchWelfareCenterDictionaryEnums)

  useUpdateEffect(() => {
    if (!isMatch) return
    const couponTypeList: ICouponTypeList[] = getCouponTypeList({ symbol, amount, loss, margin, fee })
    const newCouponFormatData = getBestCoupon(couponData, couponTypeList)
    setCouponFormatData(newCouponFormatData)
    onChangeCoupons(newCouponFormatData?.selectList)
  }, [couponData, loss, amount, margin, symbol])

  useUpdateEffect(() => {
    setIsShowCouponSelect(couponFormatData?.availableList?.length > 0)
  }, [couponFormatData?.availableList])

  return (
    <>
      {isShowCouponSelect && (
        <div className={classNames(styles['coupon-select-root'], className)}>
          {couponFormatData?.selectList?.length === 0 ? (
            <div className="coupon-select-cell" onClick={() => setCouponVisible(true)}>
              <div className="coupon-info">{t`features_welfare_center_compontents_coupon_select_index_fvl_wtsgix`}</div>

              <div className="flex items-center">
                <span className="unselect-text">{t`features_welfare_center_compontents_coupon_select_index_ny9myxbbdf`}</span>
                <Icon name="icon_coupon_choose" hasTheme className="select-icon" />
              </div>
            </div>
          ) : (
            <Swiper vertical autoplay={couponFormatData?.selectList?.length > 1}>
              {couponFormatData?.selectList?.map((selectInfo, i: number) => {
                return (
                  <Swiper.Item key={i} className="coupon-select-cell" onClick={() => setCouponVisible(true)}>
                    <div
                      className={classNames('coupon-info', {
                        swiper: true,
                      })}
                    >
                      <span className="coupon-name">
                        {getTextFromStoreEnums(selectInfo?.couponCode, welfareCenterDictionaryEnum?.voucherName?.enums)}
                      </span>

                      <div className="text-warning_color">
                        {selectInfo?.useDiscountRule === useDiscountRuleEnum.direct
                          ? `-${selectInfo?.couponValue} ${selectInfo?.coinSymbol}`
                          : `${
                              selectInfo?.useDiscountRuleRate
                            }% ${t`features_vip_level_fundting_spot_index_nq3da7schz`}`}
                      </div>
                    </div>
                    <Icon name="icon_coupon_choose" hasTheme className="select-icon" />
                  </Swiper.Item>
                )
              })}
            </Swiper>
          )}
        </div>
      )}

      {couponVisible && (
        <CouponModal
          {...couponFormatData}
          visible={couponVisible}
          onClose={() => setCouponVisible(false)}
          onChange={e => {
            setCouponFormatData({ ...couponFormatData, selectList: e })
            onChangeCoupons(e, true)
          }}
        />
      )}
    </>
  )
}

export default memo(CouponSelect)
