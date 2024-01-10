// export const agentTitleContentNav = () => `统计详情`
// export const agentTitleGainsAnalyticsNav = () => `收益明细分析`
// export const agentTitleInviteAnalyticsNav = () => `邀请明细分析`
// export const agentTitleInviteDetailsTable = () => `邀请用户详情`
import { YapiPostV2AgentInviteDetailsAnalysisListTotalListData } from '@/typings/yapi/AgentInviteDetailsAnalysisV2PostApi'
import { YapiGetV2AgtRebateInfoHistoryOverviewData } from '@/typings/yapi/AgtRebateInfoHistoryOverviewV2GetApi'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '../oss'

/**
  邀请返佣 ~/agent
  管理邀请码 ~/agent/manage
  成为顶级代理商 ~/agent/apply
  成为顶级代理商表单提交页面 ~/agent/join
  收益明细分析 ~/agent/gains
  邀请用户详情 ~/agent/invitation
  邀请明细分析 ~/agent/invite-analytics
  周返佣排行榜 ~/agent/rank
  代理商申请结果 ~/agent/result

  @doc https://doc.nbttfc365.com/docs/front-end/fe-feature/agent/%E4%BB%A3%E7%90%86%E5%95%86%E6%96%87%E6%A1%A3
*/
export const agentModuleRoutes = {
  default: '/agent',
  gains: '/agent/gains',
  // gains 图表分析页
  gainsAnalytics: 'agent/gains/detail',

  invite: '/agent/invite-analytics',
  inviteTaActivity: '/agent/invite-ta-activity',
  // invite 图表分析页
  inviteAnalytics: '/agent/invite-analytics/detail',
  // invite 聚焦搜索页
  inviteSearching: '/agent/invite-analytics/search',
  // invite 用户详情列表页
  inviteCheckMore: '/agent/invitation',
}

export enum AgentContentTypeEnum {
  gains = 'gains',
  invite = 'invite',
}

export function getAgentContentTypeEnumTab() {
  return [
    {
      title: t`constants_agent_5101362`,
      id: AgentContentTypeEnum.gains,
    },
    {
      title: t`constants_agent_5101363`,
      id: AgentContentTypeEnum.invite,
    },
  ]
}

export function getRouteUrlByAgentType(type: AgentContentTypeEnum) {
  return {
    [AgentContentTypeEnum.gains]: agentModuleRoutes.gains,
    [AgentContentTypeEnum.invite]: agentModuleRoutes.invite,
  }[type]
}

export function getTitleNameByAgentType(type: AgentContentTypeEnum) {
  return {
    [AgentContentTypeEnum.gains]: t`constants_agent_5101362`,
    [AgentContentTypeEnum.invite]: t`constants_agent_5101363`,
  }[type]
}

enum DateOptionsTypes {
  custom,
  now,
  last7Days,
  last30Days,
}

const dateOptions = () => [
  {
    label: t`constants_agent_5101364`,
    value: DateOptionsTypes.last7Days,
  },
  {
    label: t`constants_agent_5101365`,
    value: DateOptionsTypes.last30Days,
  },
  {
    label: t`constants_agent_5101366`,
    value: DateOptionsTypes.custom,
  },
]

const infoHeaderTypes = () => {
  return {
    [DateOptionsTypes.now]: {
      title: t`constants_agent_index_ww5dothwh1`,
      content: t`constants_agent_5101368`,
    },
    [DateOptionsTypes.last7Days]: {
      title: t`constants_agent_index_nmulzoge85`,
      content: t`constants_agent_5101370`,
    },
    [DateOptionsTypes.last30Days]: {
      title: t`constants_agent_index_serbno9kkj`,
      content: t`constants_agent_5101372`,
    },
  }
}

const productCodeMapToRates = {
  1: 'spotRate',
  2: 'contractRate',
  3: 'borrowCoinRate',
}

const totalIncomeChartDefaultProperties = {
  color: '#F1AE3D',
}

const incomeAnalysisChartDefaultProperties = [
  { color: '#6195F6' },
  { color: '#61DEF6' },
  { color: '#61C1F6' },
  { color: '#008080' },
  { color: '#5D3FD3' },
]

enum AgentChartKeyEnum {
  TotalIncomes = 'totalIcomes',
  IncomeAnalysis = 'incomeAnalysis',
  InvitedList = 'invitedList',
  TotalInvitedList = 'totalInvitedList',
}

export const agentInviteTotalListOptions = {
  totalNum: 'num',
  agentNum: 'agentNum',
}

export const agentRebateTitleMap = () => {
  return {
    totalRebate: t`constants_agent_index_8nhiia3zsm`,
    invitedNum: t`features_agent_invite_describe_index_5101500`,
    invitedTeamNum: t`constants_agent_index_jszioqtxqu`,
    teamDeposit: t`constants_agent_index_kowwsm9hfl`,
    teamTurnover: t`constants_agent_index_faukzf1p46`,
    selfRebate: t`constants_agent_index_azsysb6ady`,
    teamRebate: t`constants_agent_index_z9dbocs2vk`,
    directFee: t`constants_agent_index_262hcvl3cm`,
    directContributeRebate: t`constants_agent_index_7cwaguznif`,
    agentTeamFee: t`constants_agent_index_x6pgitnxuz`,
    agentTeamContributeRebate: t`constants_agent_index_3kt0mhqjen`,
    legalCur: t`constants_agent_index_49x6esjld0`,
  } as { [key in keyof YapiGetV2AgtRebateInfoHistoryOverviewData]: string }
}

export const agentRebateHeaderTitleMap = () => {
  return {
    selfRebate: agentRebateTitleMap().selfRebate,
    teamRebate: agentRebateTitleMap().teamRebate,
    directFee: agentRebateTitleMap().directFee,
    directContributeRebate: agentRebateTitleMap().directContributeRebate,
    agentTeamFee: agentRebateTitleMap().agentTeamFee,
    agentTeamContributeRebate: agentRebateTitleMap().agentTeamContributeRebate,
  }
}

export enum agentDateTimeTabEnum {
  all = -1,
  today = 0,
  yesterday = 5,
  week = 2,
  month = 3,
  custom = 4,
}

export {
  DateOptionsTypes,
  AgentChartKeyEnum,
  dateOptions,
  infoHeaderTypes,
  totalIncomeChartDefaultProperties,
  productCodeMapToRates,
  incomeAnalysisChartDefaultProperties,
}

export const AgentStatus = {
  In: 1,
  Out: 2,
}

export const ShowBanner = 1

export const ApprovalStatrus = {
  unApply: 0,
  approval: 1,
  refuse: 2,
}

/** h5 OSS agent v3 地址 */
export const agent_v3_oss_svg_image_domain_address = `${oss_svg_image_domain_address}agent/v3`

/** 申请结果状态 */
export enum ApplyResultStateEnum {
  /** 申请中 */
  applyProgress = 1,
  /** 申请未通过 */
  applyNoPass = 2,
}
/** 代理模式 */
export enum ApplayModelEnum {
  /** 金字塔代理 */
  pyramid = 'pyramid',
  /** 三级代理 */
  threeLevel = 'threeLevel',
  /** 区域代理 */
  area = 'area',
}
