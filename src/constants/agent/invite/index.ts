import { getDefaultLast30DaysStartAndEnd } from '@/store/agent/agent-invite'
import {
  InviteFilterFormViewModel,
  YapiPostV1AgentInviteDetailsApiRequestReal,
  YapiPostV2AgentInviteHistoryApiRequestReal,
} from '@/typings/api/agent/invite'
import { YapiPostV1AgentActivationData } from '@/typings/yapi/AgentActivationV1PostApi'
import { YapiPostV1AgentInviteDetailsApiRequest } from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import { t } from '@lingui/macro'
import { SelectorOption } from '@nbit/vant'
import { SelectorValue } from '@nbit/vant/es/selector/PropsType'
import { omitBy } from 'lodash'

/** 邀请类型 1 为代理 2 非代理	 */
export enum InviteFilterInviteTypeEnum {
  total = '',
  agentInvite = '1',
  normalInvite = '2',
}

export const isAgtCheck = val => {
  if (val === InviteFilterInviteTypeEnum.agentInvite) {
    return true
  }

  return false
}

export const getAgtTitle = val => {
  return isAgtCheck(val)
    ? t`features_agent_agent_invite_invite_check_more_v2_rebate_records_v2_display_table_table_schema_dvkompervc`
    : t`features_agent_agent_invite_invite_check_more_v2_rebate_records_v2_display_table_table_schema_eve7xk4n7s`
}

export enum InviteDetailsUidTypeEnum {
  myUid = 1,
  upperLevelUid = 2,
}

/**
 * https://yapi.nbttfc365.com/project/44/interface/api/4159
 * 实名状态 1 为未认证，2 为已认证，传 3 查所有
 */
export enum InviteFilterKycEnum {
  total = '',
  verified = '2',
  notVerified = '1',
}

// 1=未认证，2，标准认证，3，高级认证，4，企业认证
export enum InviteFilterKycLevelEnum {
  standard = '2',
  advanced = '3',
  enterprise = '4',
  notVerified = '1',
}

const InviteKycLevelEnumMap = (isShowNotVerified?: boolean) => {
  let shared = {
    [InviteFilterKycLevelEnum.standard]: t`features_user_personal_center_index_5101255`,
    [InviteFilterKycLevelEnum.advanced]: t`features_user_personal_center_index_5101256`,
    [InviteFilterKycLevelEnum.enterprise]: t`features_kyc_index_5101112`,
    [InviteFilterKycLevelEnum.notVerified]: t`features_kyc_index_5101113`,
  }

  if (isShowNotVerified) {
    shared[InviteFilterKycLevelEnum.notVerified] = t`user.personal_center_03`
  }

  return shared
}

export const isAgentKycVerified = level => {
  return [
    InviteFilterKycLevelEnum.standard,
    InviteFilterKycLevelEnum.advanced,
    InviteFilterKycLevelEnum.enterprise,
  ].includes(level)
}

export const getInviteKycLevelEnumTitle = (mode: string, isShowNotVerified?: boolean) => {
  const map = InviteKycLevelEnumMap(isShowNotVerified)
  const title = map[mode]
  return title || map[InviteFilterKycLevelEnum.notVerified]
}

// 排序约定 1 正序 2 倒序
export enum InviteFilterSortEnum {
  default = '',
  asc = '1',
  desc = '2',
}

export enum IsContractOpen {
  yes = '1',
}

export enum DateOptionsTypesInvite {
  now,
  last7Days,
  last30Days,
}

export const dateOptionsTypesInviteApiKeyMap = {
  [DateOptionsTypesInvite.now]: 'today',
  [DateOptionsTypesInvite.last7Days]: 'sevenDays',
  [DateOptionsTypesInvite.last30Days]: 'thirtyDays',
}

export const dateOptionsInvite = () => [
  {
    label: t`constants_agent_invite_index_5101402`,
    value: DateOptionsTypesInvite.now,
  },
  {
    label: t`constants_agent_5101365`,
    value: DateOptionsTypesInvite.last7Days,
  },
  {
    label: t`constants_agent_5101366`,
    value: DateOptionsTypesInvite.last30Days,
  },
]

export const infoHeaderTypesInvite = () => {
  return {
    [DateOptionsTypesInvite.now]: {
      title: t`constants_agent_invite_index_5101402`,
      content: t`constants_agent_invite_index_5101403`,
    },
    [DateOptionsTypesInvite.last7Days]: {
      title: t`constants_agent_invite_index_5101404`,
      content: t`constants_agent_invite_index_5101405`,
    },
    [DateOptionsTypesInvite.last30Days]: {
      title: t`constants_agent_invite_index_5101406`,
      content: t`constants_agent_invite_index_5101407`,
    },
  }
}

export const totalInvitedChartCheckboxOptions = () => {
  return {
    num: t`constants_market_market_list_market_module_index_5101071`,
    agentNum: t`constants_agent_invite_index_tyexyr7gly`,
  }
}

export const taAgentUserDetailTitleMap = () => {
  return {
    mobileNumber: t`user.safety_items_02`,
    email: t`user.safety_items_04`,
    registerTime: t`features_trade_future_c2c_25101571`,
  }
}

export const TaAgentActivitiesTitleMap = () => {
  return {
    totalRebate: t`constants_agent_invite_index_s10ulaq0kp`,
    totalDeposit: t`constants_agent_invite_index_ywarmegc85`,
    totalWithdraw: t`constants_agent_invite_index_m4lphvtccg`,
    invitedNum: t`constants_agent_invite_index_9hftgfqry8`,
    teamNum: t`constants_agent_invite_index_vg3ikq_9fg`,
  } as { [k in keyof YapiPostV1AgentActivationData]: string }
}

export enum taAgentActivitiesDetailEnum {
  totalRebate = 'totalRebate',
  totalDeposit = 'totalDeposit',
  totalWithdraw = 'totalWithdraw',
  invitedNum = 'invitedNum',
  teamNum = 'teamNum',
}

export enum InviteDetailsPageTypeEnum {
  userDetails = 'userDetails',
  rebateDetails = 'rebateDetails',
}

export const getInviteDetailsPageTitleMap = () => {
  return {
    [InviteDetailsPageTypeEnum.userDetails]: t`constants_agent_invite_index_ddc5x7j_fo`,
    [InviteDetailsPageTypeEnum.rebateDetails]: t`constants_agent_invite_index_16lnleobur`,
  }
}

export const getInviteDetailsPageTitle = (type: InviteDetailsPageTypeEnum) => {
  const options = getInviteDetailsPageTitleMap()
  return options[type]
}

export const getInviteDetailsTypeEnumMap = () => {
  return {
    [InviteDetailsUidTypeEnum.myUid]: t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101438`,
    [InviteDetailsUidTypeEnum.upperLevelUid]: t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101439`,
  }
}

export const getInviteDetailsTypeEnumTitle = mode => {
  const map = getInviteDetailsTypeEnumMap()
  return mode ? map[mode] : map[InviteDetailsUidTypeEnum.myUid]
}

export const getInviteDetailsUidTypes = () => {
  const map = getInviteDetailsTypeEnumMap()
  return [
    {
      text: map[InviteDetailsUidTypeEnum.myUid],
      value: String(InviteDetailsUidTypeEnum.myUid),
    },
    {
      text: map[InviteDetailsUidTypeEnum.upperLevelUid],
      value: String(InviteDetailsUidTypeEnum.upperLevelUid),
    },
  ]
}

// 总返佣', '现货手续费返佣', '合约手续费返佣
export enum InviteDetailsRebateEnum {
  totalRebate,
  spotRebate,
  contractRebate,
}

export const getInviteDetailsRebateEnumMap = () => {
  return {
    [InviteDetailsRebateEnum.totalRebate]: t`constants_agent_invite_index__xol_zzknb`,
    [InviteDetailsRebateEnum.spotRebate]: t`features_agent_invite_operation_index_5101459`,
    [InviteDetailsRebateEnum.contractRebate]: t`features_agent_invite_operation_index_5101460`,
  }
}

export const getInviteDetailsRebateEnumTypes = ({ hasBorrow, hasSpot, hasContract, hasOption, hasRecreation }) => {
  const map = getInviteDetailsRebateEnumMap()

  return [
    {
      label: map[AgentProductTypeEnum.total],
      value: AgentProductTypeEnum.total,
      isShow: true,
    },
    {
      label: map[AgentProductTypeEnum.spot],
      value: AgentProductTypeEnum.spot,
      isShow: hasSpot,
    },
    {
      label: map[AgentProductTypeEnum.futures],
      value: AgentProductTypeEnum.futures,
      isShow: hasContract,
    },
    {
      label: map[AgentProductTypeEnum.borrow],
      value: AgentProductTypeEnum.borrow,
      isShow: hasBorrow,
    },
    {
      label: map[AgentProductTypeEnum.ternary],
      value: AgentProductTypeEnum.ternary,
      isShow: hasOption,
    },
    {
      label: map[AgentProductTypeEnum.recreation],
      value: AgentProductTypeEnum.recreation,
      isShow: hasRecreation,
    },
  ].filter(x => x.isShow)
}

export enum YesOrNoEnum {
  yes = '1',
  no = '2',
  all = 0,
}

export const getIsGrantYesNoEnumMap = () => {
  return {
    [YesOrNoEnum.all]: t`constants_market_market_list_market_module_index_5101071`,
    [YesOrNoEnum.yes]: t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101443`,
    [YesOrNoEnum.no]: t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101444`,
  }
}

export const getIsGrantYesNoEnumOptions = () => {
  const map = getIsGrantYesNoEnumMap()
  return [
    {
      label: map[YesOrNoEnum.all],
      value: YesOrNoEnum.all,
    },
    {
      label: map[YesOrNoEnum.yes],
      value: YesOrNoEnum.yes,
    },
    {
      label: map[YesOrNoEnum.no],
      value: YesOrNoEnum.no,
    },
  ]
}

export const getIsGrantYesNoEnumTitle = mode => {
  return getIsGrantYesNoEnumMap()[mode]
}

export enum RebateTypeCdEnum {
  selfRebate = 'selfRebate',
  teamRebate = 'teamRebate',
}

export const RebateTypeCdEnumMap = () => {
  return {
    [RebateTypeCdEnum.selfRebate]: t`constants_agent_index_azsysb6ady`,
    [RebateTypeCdEnum.teamRebate]: t`constants_agent_index_z9dbocs2vk`,
  }
}

export const getRebateTypeCdEnumTitle = mode => {
  return RebateTypeCdEnumMap()[mode]
}

export enum AgentProductTypeEnum {
  spot = '1',
  futures = '2',
  borrow = '3',
  ternary = '4',
  recreation = '5',
  total = '',
}

export const AgentProductTypeEnumMap = () => {
  return {
    [AgentProductTypeEnum.spot]: t`constants_order_742`,
    [AgentProductTypeEnum.futures]: t`assets.layout.tabs.contract`,
    [AgentProductTypeEnum.borrow]: t`constants_agent_invite_index_lmijvgqtkz`,
    [AgentProductTypeEnum.ternary]: t`constants_agent_invite_index_g7ktqtfqup`,
    [AgentProductTypeEnum.recreation]: t`constants_agent_invite_index_ze9g2bgx0i`,
  }
}

export const getAgentProductTypeEnumTitle = type => {
  return AgentProductTypeEnumMap()[type]
}

export function getRebateRatioToDisplay(ratios: any[]) {
  return ratios.reduce((acc, cur, index) => {
    return `${acc}${getAgentProductTypeEnumTitle(cur.productCd)}: ${cur?.selfRatio || 0}% ${
      index === ratios.length - 1 ? '' : ' / '
    }`
  }, '')
}

/** 返佣等级，用于 icon 展示 */
export function LevelIconType(type: number) {
  return {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
  }[type]
}

export enum AgentApplyStatus {
  none = '-1',
  pending = '0',
  pass = '1',
  noPass = '2',
}

export enum AgentModeStatusEnum {
  area = 'area',
  pyramid = 'pyramid',
  threeLevel = 'threeLevel',
}

/** 审核状态跳转路由类型传参 */
export enum ApprovalStatusIndPassTypeEnum {
  pending = 1,
  noPass,
}

/** 审核状态 */
export enum ApprovalStatusTypeEnum {
  pending = 'pending',
  noPass = 'noPass',
}

/**
 * 代理商等级规则指标单位
 */
export enum AgentGradeUnitEnum {
  /** 成功邀請人數 */
  teamSize = 'teamSize',
  /** 直推業績量 */
  volumeOfBusiness = 'volumeOfBusiness',
  /** 自身業績 */
  meBusinessVolume = 'meBusinessVolume',
}

/**
 * 代理商 - 数据字典
 */
export enum AgentDictionaryTypeEnum {
  /** 返佣类型 */
  rebateTypeCd = 'rebate_type_cd',
  /** 产品线 */
  // agentProductCd = 'agent_product_cd',
  /** 产品线 - 显示返佣/手续费描述 */
  agentProductCdRatio = 'agent_product_cd_ratio',
  /** 产品线 - 仅展示产品名 */
  agentProductCdShowRatio = 'agent_product_cd_show_ratio',
  /** 代理模式/代理类型 */
  agentTypeCode = 'agent_type_code',
  /** 代理商审核状态 */
  approvalStatusInd = 'approvalStatusInd',
  /** 代理商等级规则 */
  // agentGradeRules = 'agt_grade_rules_cd',
  /** 三级代理等级规则 */
  agentThreeGradeRules = 'agt_grade_three_level_rules_cd',
  /** 区域代理等级规则 */
  agentAreaGradeRules = 'agt_grade_area_rules_cd',
  /** 代理商等级 */
  agentGrade = 'agt_grade',
}
