export type exchangeListItem = {
    // 卡券模板 ID
    id: number,
    // 卡劵类型 code ,字典值
    couponCode: string
    // 卡劵类型使用业务场景，字典值
    businessScene: string
    // 是否有使用门槛 是 enable 否 disable
    useRuleStatus: string
    // 当有使用门槛时，不为空，大于 0
    useThreshold: number
    // 是否支持和会员叠加使用 是 enable 否 disable
    useOverlayVipStatus: string
    // 抵扣方式，direct 直接抵扣 rate 比例折扣
    useDiscountRule: string
    // 是否指定币种 是 enable 否 disable
    coinStatus: string
    // 有效结束时间 有效期类型为 time_period 时必填
    validDateTo: string
    // 有效开始时间 有效期类型为 time_period 时必填	
    validDateFrom: string
    // 卡劵有效时间 天数 大于 0，有效期类型为 after_receive 时必填
    validDay: string
    // 有效期类型 after_receive 领取后 N 天有效，time_period 时间段 
    validityType: string
    // 比例折扣时，必填。60 表示 60%
    useDiscountRuleRate: number
    // 优惠券面值
    couponValue: number,
    // 币种 	
    coinSymbol: string
    // 用户可领次数上限，默认 1 次
    couponAcquireLimit: number
    // 状态 启用 enable 禁用 disable
    status: string
    // 是否过期 1 未过期 2 过期
    expired: number
    // 是否领完 1 未领完 2  领完
    finished: number
    // 用户是否已达到最大领取数量
    isMaxReceived: boolean
    // 活动名称
    activityName: string
}
// 卡劵兑换中心
export type GetExchangeListResponseType ={
    activityId: number
    activityName: string
    list: exchangeListItem[]
} 

export interface GetExchangeListRequest {}
// 各类卡劵数量统计
export type couponType = {
    // 卡券分类 CODE
    couponType: string
    // 分类可用数量
    validNum: number
    // 分类不可用总数 (3 个月内)
    invalidNum: number
    // 是否有新领取券
    hasNew: boolean
}
export interface GetCouponCountResponse {
    // 兑换中心券模板数量
    activityCouponNum: number
    // 兑换中心是否有新未领取
    activityCouponNew: boolean
    // 优惠券有效总数
    validNum: number
    // 不可用卡券总数 (3 个月内)
    invalidNum: number
    // 是否有新领取券
    couponNew: boolean 
    couponTypes: couponType[] 
}
export interface GetCouponCountRequest {

}

/**
 * 获取用户可用券及 VIP 费率
 */
export interface VipCouponListReq {
    /** 使用场景枚举字典值 */
    businessScene: string;
}

export interface VipCouponListResp {
    /** 是否是 VIP */
    isVipUser: boolean;
    /** vip 折扣费率（实际值） */
    vipFeeRate: string;
    /** 券列表 */
    coupons: IVipCoupon[];
}
  
export interface IVipCoupon {
    /** 卡券 ID */
    id: string;
    /** 卡劵类型使用业务场景，字典值 */
    businessScene: string;
    /** 优惠券面值选 */
    couponValue: number;
    /** 领取时间戳 */
    assignByTime: number;
    /** 是否指定币种 是 enable 否 disable */
    coinStatus: string;
    /** 抵扣方式，direct 直接抵扣 rate 比例折扣 */
    useDiscountRule: string;
    /** 是否支持和会员叠加使用 是 enable 否 disable */
    useOverlayVipStatus: string;
    /** 当有使用门槛时，不为空，大于 0 */
    useThreshold: number;
    /** 是否有使用门槛 是 enable 否 disable */
    useRuleStatus: string;
    /** 卡劵类型 code ,字典值 */
    couponCode: string;
    /** 失效时间戳 */
    invalidByTime: number;
    /** 指定币种 id */
    coinId: string;
    /** 指定币种 symbol */
    coinSymbol: string;
    /** 比例折扣时，必填。60 表示 60% */
    useDiscountRuleRate: string;
    /** 卡劵分类类型 code ,字典值 */
    couponType: string;
    /** 卡券模板 ID */
    couponTemplateId: string;
    /** 活动名称 */
    activityName: string;
    welfareType?: string;
    missionType?: string;
}

export interface GetCouponListRequest {}

export interface GetCouponListResponse  extends exchangeListItem{
    // 订单关联 id
    srcId: number
    // 卡劵分类 code
    couponType: string
    // 使用时间
    usedByTime: string
    // 累计核销金额
    cumulativeAmount: number
    // 累计核销前金额
    amount: number
}
