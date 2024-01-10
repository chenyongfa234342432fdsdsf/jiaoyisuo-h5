import { t } from '@lingui/macro'

/** 三元期权交易方向 */
export enum TernaryOptionTradeDirectionEnum {
  /** 买涨 */
  call = 'call',
  /** 买跌 */
  put = 'put',
  /** 涨超 */
  overCall = 'over_call',
  /** 跌超 */
  overPut = 'over_put',
}

export function getTernaryOptionTradeDirectionEnumNameInTag(direction: TernaryOptionTradeDirectionEnum) {
  return {
    [TernaryOptionTradeDirectionEnum.call]: t`constants_ternary_option_f5yppfeexs`,
    [TernaryOptionTradeDirectionEnum.put]: t`constants_ternary_option_dlr4mizpel`,
    [TernaryOptionTradeDirectionEnum.overCall]: t`constants_ternary_option_ogbkotcavp`,
    [TernaryOptionTradeDirectionEnum.overPut]: t`constants_ternary_option_yfcx3kgxwg`,
  }[direction]
}
export function getTernaryOptionTradeDirectionEnumNameInPageCenter(direction: TernaryOptionTradeDirectionEnum) {
  return {
    [TernaryOptionTradeDirectionEnum.call]: t`features_ternary_option_trade_exhange_actions_lefinobwtq`,
    [TernaryOptionTradeDirectionEnum.put]: t`features_ternary_option_trade_exhange_actions_9y_nhopgmq`,
    [TernaryOptionTradeDirectionEnum.overCall]: t`constants_ternary_option_ogbkotcavp`,
    [TernaryOptionTradeDirectionEnum.overPut]: t`constants_ternary_option_yfcx3kgxwg`,
  }[direction]
}

export function getTernaryOptionTradeDirectionEnumNameInAction(direction: TernaryOptionTradeDirectionEnum) {
  return {
    [TernaryOptionTradeDirectionEnum.call]: t`constants_ternary_option_z6gnitmfxa`,
    [TernaryOptionTradeDirectionEnum.put]: t`constants_ternary_option_0lyuv_bmzr`,
    [TernaryOptionTradeDirectionEnum.overCall]: t`constants_ternary_option_lwlgn_66dv`,
    [TernaryOptionTradeDirectionEnum.overPut]: t`constants_ternary_option_tyy6yn2ogg`,
  }[direction]
}

/**
 * 三元期权 - 数据字典
 */
export enum TernaryOptionDictionaryEnum {
  /** 三元期权 - 价格取值来源 */
  optionsPriceSource = 'options_price_source',
  /** 三元期权 - 结算周期 */
  productPeriodCd = 'product_period_cd',
  /** 三元期权 - 涨跌方向 */
  optionsSideInd = 'options_side_ind',
  /** 三元期权 - 数据来源 */
  optionsSource = 'options_source',
}

/** 三元期权 - 结算周期单位 */
export enum OptionProductPeriodUnitEnum {
  /** 秒 */
  seconds = 'SECONDS',
  /** 分钟 */
  minutes = 'MINUTES',
}

/**
 * 获取结算周期单位
 */
export function getOptionProductPeriodUnit(type: OptionProductPeriodUnitEnum | string) {
  return {
    [OptionProductPeriodUnitEnum.seconds]: t`features_ternary_option_option_order_ternary_order_item_index_h6owzk3zf6`,
    [OptionProductPeriodUnitEnum.minutes]: t`features_ternary_option_option_order_ternary_order_item_index_6mezldwdki`,
  }[type]
}

/** 三元期权 - 涨方向 */
export const OptionSideIndCallEnum: string[] = [
  TernaryOptionTradeDirectionEnum.call,
  TernaryOptionTradeDirectionEnum.overCall,
]

/** 三元期权 - 跌方向 */
export const OptionsSideIndPutEnum: string[] = [
  TernaryOptionTradeDirectionEnum.put,
  TernaryOptionTradeDirectionEnum.overPut,
]

/** 三元期权输入框枚举，用来校验和唤起键盘 */
export enum TernaryOptionTradeInputNameEnum {
  amount,
  maxAmount,
  maxTriggerTimes,
}
/** 期权价格来源，标记或者指数 */
export enum TernaryOptionPriceSourceEnum {
  index = 'index_price',
  mark = 'mark_price',
}

/** 期权交易 tab，二元和三元，即普通和涨超 */
export enum TernaryOptionTradeTabEnum {
  /** 二元 */
  normal = 'normal',
  /** 三元 */
  over = 'over',
}
