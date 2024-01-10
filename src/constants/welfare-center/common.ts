import { oss_svg_image_domain_address } from '@/constants/oss'

export const oss_svg_image_domain_address_welfare_center = `${oss_svg_image_domain_address}welfare-center/`
/**
 * 福利中心 - 数据字典
 */
export enum DictionaryTypeEnum {
  /** 卡劵中心 - 卡券类型 */
  voucherType = 'coupon_code',
  /** 卡劵中心 - 卡券使用场景 */
  voucherScene = 'business_scene',
  /** 卡劵中心 - 卡券名称 */
  voucherName = 'coupon_name_cd',
  /** 卡劵中心 - 卡劵分类 */
  voucherTypeClassification = 'coupon_type_cd',
  /** 交易场景二级场景 */
  voucherBusinessLine = 'businessLine',
  /** 交易类型 */
  voucherBusinessType = 'businessType',
}
/**
 * 福利中心 - 卡劵类型对应图片映射
 */
export const DictionaryTypeMap = {
  // 合约保险金
  contract_insurance_coupon: 'contract',
  // 空投币
  airdrop_coins_coupon: 'airdrop',
  // 现货手续费抵扣券
  spot_fee_deduction_coupon: 'spot',
  // 现货手续费折扣券
  spot_fee_discount_coupon: 'spot',
  // 合约手续费抵扣券
  contract_fee_deduction_coupon: 'contract',
  // 合约手续费折扣券
  contract_fee_discount_coupon: 'contract',
  // 代金券
  voucher_coupon: 'voucher',
  // 杠杆免息券
  leveraged_interest_free_coupon: 'free',
  // vip 升级券
  vip_upgrade_coupon: 'vip',
  // 理财产品
  financial_product_coupon: 'financial',
  // 三元期权
  option_voucher_coupon: 'options',
}
/**
 * 福利中心 - 卡劵对应的使用场景
 */
export const ScenesBeUsedEnum = {
  /** 现货 */
  spot: 'spot',
  /** 合约 */
  perpetual: 'perpetual',
  /** 三元期权 */
  option: 'option',
}
/**
 * 福利中心 - 卡劵抵扣方式
 */
export const enum useDiscountRuleEnum {
  // 比例劵
  rate = 'rate',
  // 抵扣劵
  direct = 'direct',
}

/**
 * 福利中心 - 卡劵状态
 */
export const enum couponStatusEnum {
  /** 无效（出可用外其他） */
  invalid = 0,
  /** 可用 */
  canUsed = 1,
  /** 已使用 */
  hasUsed = 2,
  /** 已失效 */
  expired = 3,
}
/**
 * 福利中心 - 后端返回是否判断状态
 */
export const enum booleanStatusEnum {
  // 是
  true = 'enable',
  // 否
  false = 'disable',
}

/**
 * 福利中心 - 卡劵类型
 */
export const enum CouponTypeEnum {
  /** 保险金 */
  insurance = 'insurance',
  /** 手续费抵扣券 */
  fee = 'fee',
  /** 体验金券 */
  voucher = 'voucher',
}

export enum WelfareType {
  award = 'award',
  task = 'task',
  activity = 'activity',
}

export enum ApiWelfareType {
  mission = 'mission',
  activity = 'activity',
  // 手动发放类
  manual = 'manual',
}

export enum CardActiveEnum {
  // 全部卡劵
  allVoucher = 1,
  // 兑换活动
  exchange = 2,
}

export const ruleHomeColumnCd = {
  activity_center: 'activity_center',
  mission_center: 'mission_center',
}

export enum TaskType {
  // 挑战任务
  challenge = 1,
  // 成就任务
  achievement = 2,
}

export enum TaskTypeCode {
  // 挑战任务
  challenge = 'challenge',
  // 成就任务
  achievements = 'achievements',
}

export enum TaskRecordTypeCode {
  // 已完成
  finished = 'finished',
  // 未完成
  undone = 'undone',
}

export enum CompleteSchedule {
  undone = 'undone',
  completed = 'completed',
}

export enum welfare_common_condition_scene_options {
  spot_fee = 'spot_fee',
  contract_fee = 'contract_fee',
  contract_transfer = 'contract_transfer',
  spot_goods = 'spot_goods',
  transfer_input = 'transfer_input',
}

export enum CompareCondition {
  ge = '≥',
  lt = '<',
  eq = '=',
  gt = '>',
  le = '≤',
}

export enum welfare_achievments_mission_condition_options {
  mobile_bind = 'mobile_bind',
  account_security_authorized = 'account_security_authorized',
  mobile_notification_on = 'mobile_notification_on',
  kyc_authorized = 'kyc_authorized',
}

export enum ActivityType {
  // 进行中
  inProgress = 1,
  // 已结束
  finished = 2,
}

export enum ActivityCode {
  // 进行中
  processing = 'processing',
  // 已结束
  ends = 'ends',
}

export enum ActivityStatusCode {
  // 进行中
  processing = 'processing',
  // 已结束
  ends = 'ends',
  // 尚未开始
  not_started = 'not_started',
  // 即将开始
  coming_soon = 'coming_soon',
}
