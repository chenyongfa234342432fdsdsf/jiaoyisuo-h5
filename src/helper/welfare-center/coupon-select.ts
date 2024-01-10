import { CouponTypeEnum, booleanStatusEnum, useDiscountRuleEnum } from '@/constants/welfare-center/common'
import { baseWelfareCenter } from '@/store/welfare-center'
import { IVipCoupon, VipCouponListResp } from '@/typings/api/welfare-center/all-voucher'
import { decimalUtils } from '@nbit/utils'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/** 优惠券类型相关信息 */
export interface ICouponTypeList {
  /** 卡券类型 */
  couponType: CouponTypeEnum
  /** 预估手续费/保证金/预计亏损  */
  amount: string | number
  /** 币种符号 */
  coinSymbol?: string
  /** 手续费 */
  fee?: string | number
}

/**
 * 校验优惠券是否可用
 * @param item
 * @param types
 * @returns
 */
const checkIsAvailable = (item: IVipCoupon, types: ICouponTypeList) => {
  return (
    item?.couponType === types?.couponType &&
    (item?.useRuleStatus !== booleanStatusEnum.true ||
      (item?.useRuleStatus === booleanStatusEnum.true && Number(item?.useThreshold) <= Number(types?.amount))) &&
    (item?.coinStatus !== booleanStatusEnum.true ||
      (item?.coinStatus === booleanStatusEnum.true && types?.coinSymbol && item?.coinSymbol === types?.coinSymbol))
  )
}

export const getCouponTypeList = ({ amount, loss, margin, symbol, fee }) => {
  let couponTypeList: ICouponTypeList[] = [] as ICouponTypeList[]

  if (amount && Number(amount) > 0) {
    couponTypeList = [...couponTypeList, { couponType: CouponTypeEnum.fee, amount, fee, coinSymbol: symbol }]
  }

  if (loss && Number(loss) < 0) {
    couponTypeList = [
      ...couponTypeList,
      { couponType: CouponTypeEnum.insurance, amount: Math.abs(loss), coinSymbol: symbol },
    ]
  }

  if (margin && Number(margin) > 0) {
    couponTypeList = [...couponTypeList, { couponType: CouponTypeEnum.voucher, amount: margin, coinSymbol: symbol }]
  }
  return couponTypeList
}

/**
 * 查询最优优惠券，可用和不可用
 * @param data 优惠券列表
 * @param couponTypeList 优惠券类型相关信息
 * @returns
 */
export function getBestCoupon(data: VipCouponListResp, couponTypeList: ICouponTypeList[]) {
  let defaultResult = { availableList: [], unavailableList: [], selectList: [] }

  if (!data || !couponTypeList?.length) return defaultResult
  const couponList = data?.coupons

  const categorizedData = couponList?.reduce((result: any, item) => {
    const couponTypeData = couponTypeList?.find(cType => cType.couponType === item.couponType)

    if (!couponTypeData) {
      return result
    }

    const isAvailable = checkIsAvailable(item, couponTypeData)

    if (isAvailable) {
      result.availableList.push(item)

      // 非手续费时直接选中第一张，记面额最大的
      if (item.couponType !== CouponTypeEnum.fee && !result?.selectList?.find(v => v.couponType === item.couponType)) {
        result.selectList.push(item)
      }

      // 手续费时对比折扣券和抵扣券，选取最优
      if (item.couponType === CouponTypeEnum.fee) {
        const selectFeeCoupon = result?.selectList?.find(v => v.couponType === CouponTypeEnum.fee)
        // 计算抵扣金额
        const directFee =
          item.useDiscountRule === useDiscountRuleEnum.direct
            ? item.couponValue
            : SafeCalcUtil.mul(couponTypeData.fee, SafeCalcUtil.div(item.useDiscountRuleRate, 100))

        // 第一次匹配到最优手续费券
        if (!selectFeeCoupon) {
          result.selectList.push({ ...item, directFee })
        } else {
          // 再次匹配最优优惠券
          if (Number(selectFeeCoupon?.directFee) < Number(directFee)) {
            const newSelectData = result.selectList?.filter(x => x.couponType !== CouponTypeEnum.fee)
            result.selectList = newSelectData
            result.selectList.push({ ...item, directFee })
          }
        }
      }
    } else {
      result.unavailableList.push(item)
    }

    return result
  }, defaultResult)

  return categorizedData
}

/**
 * 计算合约预估手续费
 * @param price 价格
 * @param amount 数量
 * @param feeRate 手续费率
 * 开仓：预估手续费 = 对手价 * 委托数量 * Taker 费率
 * 限价平仓：预估手续费 = 委托价格 * 减仓数量 * Taker 费率
 * 市价平仓：预估手续费 = 最新价格 * 减仓数量 * Taker 费率
 */
export function calculatorFeeAmount({ price, amount, feeRate }) {
  if (!price || !amount || !feeRate) return ''
  return `${SafeCalcUtil.mul(SafeCalcUtil.mul(price, amount), feeRate)}`
}

/** 通知刷新卡券选择列表接口 */
export function sendRefreshCouponSelectApiNotify() {
  const { isRefreshCouponSelectApi, updateIsRefreshCouponSelectApi } = baseWelfareCenter.getState()
  !isRefreshCouponSelectApi && updateIsRefreshCouponSelectApi(true)
}
