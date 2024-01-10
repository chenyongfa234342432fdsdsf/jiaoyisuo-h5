/**
 * 代理中心
 */
import { t } from '@lingui/macro'

/** 总览时间类型 */
export enum AgentCenterTimeTypeEnum {
  /** 今日 */
  today = 'today',
  /** 昨日 */
  yesterday = 'yesterday',
  /** 7 日 */
  sevenDay = 'sevenDay',
  /** 30 日 */
  thirtyDay = 'thirtyDay',
  /** 自定义 */
  custom = 'custom',
}

/**
 * 获取总览时间类型名称
 */
export function getAgentCenterTimeTypeName(type: string) {
  return {
    [AgentCenterTimeTypeEnum.today]: t`features_agent_invite_describe_index_5101493`,
    [AgentCenterTimeTypeEnum.yesterday]: t`features_agent_common_agent_datetime_tabs_index_rxfd1dbfwk`,
    [AgentCenterTimeTypeEnum.sevenDay]: t`constants_agent_agent_center_center_2id4g1anxu`,
    [AgentCenterTimeTypeEnum.thirtyDay]: t`constants_agent_agent_center_center_otmsefxsuk`,
    [AgentCenterTimeTypeEnum.custom]: t`features_agent_invite_describe_index_5101496`,
  }[type]
}

/**
 * 转换总览时间类型
 */
export function getAgentCenterTimeTypeNumber(type: string) {
  return (
    {
      [AgentCenterTimeTypeEnum.today]: 1,
      [AgentCenterTimeTypeEnum.yesterday]: 2,
      [AgentCenterTimeTypeEnum.sevenDay]: 7,
      [AgentCenterTimeTypeEnum.thirtyDay]: 30,
    }[type] || 1
  )
}

/**
 * 代理模式类型
 */
export enum AgentModalTypeEnum {
  /** 区域代理 */
  area = 'area',
  /** 三级代理 */
  threeLevel = 'threeLevel',
  /** 金字塔 */
  pyramid = 'pyramid',
}

/**
 * 获取代理模式名称
 */
export function getAgentCenterModalTypeName(type: string) {
  return {
    [AgentModalTypeEnum.area]: t`constants_agent_agent_center_center_viei91ljlw`,
    [AgentModalTypeEnum.threeLevel]: t`constants_agent_agent_center_center_kv0vjbkgf5`,
    [AgentModalTypeEnum.pyramid]: t`constants_agent_agent_center_center_wb1yol9n_6`,
  }[type]
}

/**
 * 获取对应代理模式下总览数据 key
 */
export function getAgentCenterOverviewKeyByModalType(type: string) {
  return (
    {
      [AgentModalTypeEnum.area]: 'areaAgentRebateDto',
      [AgentModalTypeEnum.threeLevel]: 'threeLevelAgentRebateDto',
      [AgentModalTypeEnum.pyramid]: 'pyramidAgentRebateDto',
    }[type] || ''
  )
}

/**
 * 获取对应代理模式下邀请详情数据 key
 */
export function getAgentCenterInviteDetailKeyByModalType(type: string) {
  return (
    {
      [AgentModalTypeEnum.area]: 'areaAgentInviteeList',
      [AgentModalTypeEnum.threeLevel]: 'threeLevelAgentInviteeList',
      [AgentModalTypeEnum.pyramid]: 'pyramidAgentInviteeList',
    }[type] || ''
  )
}

/**
 * 获取对应代理模式下返佣详情数据 key
 */
export function getAgentCenterRebateDetailKeyByModalType(type: string) {
  return (
    {
      [AgentModalTypeEnum.area]: 'areaAgentRebateList',
      [AgentModalTypeEnum.threeLevel]: 'threeLevelAgentRebateList',
      [AgentModalTypeEnum.pyramid]: 'pyramidAgentRebateList',
    }[type] || ''
  )
}

/**
 * TA 的邀请 - 获取对应代理模式下邀请详情数据 key
 */
export function getChildInviteDetailKeyByModalType(type: string) {
  return (
    {
      [AgentModalTypeEnum.area]: 'areaAgentInviteDto',
      [AgentModalTypeEnum.threeLevel]: 'threeLevelAgentInviteDto',
      [AgentModalTypeEnum.pyramid]: 'pyramidAgentInviteDto',
    }[type] || ''
  )
}

/**
 * 代理等级
 */
export enum AgentLevelTypeEnum {
  default = 0,
  one = 1,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
}

/**
 * 获取代理等级对应图标
 */
export function getAgentLevelIconName(type: number) {
  return {
    [AgentLevelTypeEnum.one]: 'icon_agent_grade_one',
    [AgentLevelTypeEnum.two]: 'icon_agent_grade_two',
    [AgentLevelTypeEnum.three]: 'icon_agent_grade_three',
    [AgentLevelTypeEnum.four]: 'icon_agent_grade_four',
    [AgentLevelTypeEnum.five]: 'icon_agent_grade_five',
    [AgentLevelTypeEnum.six]: 'icon_agent_grade_six',
    [AgentLevelTypeEnum.seven]: 'icon_agent_grade_seven',
    [AgentLevelTypeEnum.eight]: 'icon_agent_grade_eight',
    [AgentLevelTypeEnum.nine]: 'icon_agent_grade_nine',
    [AgentLevelTypeEnum.ten]: 'icon_agent_grade_ten',
  }[type]
}

/**
 * 详情列表 tab 类型
 */
export enum AgentCenterDetailsTabEnum {
  /** 邀请详情 */
  invite = 'invite',
  /** 返佣详情 */
  rebate = 'rebate',
}

/**
 * 获取详情列表 tab 类型名称
 */
export function getAgentCenterDetailsTabName(type: string) {
  return {
    [AgentCenterDetailsTabEnum.invite]: t`constants_agent_agent_center_center_degl6gd3jc`,
    [AgentCenterDetailsTabEnum.rebate]: t`constants_agent_agent_center_center_t98ghxnz2p`,
  }[type]
}

/**
 * 邀请详情 - 注册时间排序类型
 */
export enum InviteDetailRegisterSortTypeEnum {
  /** 默认 */
  default = 0,
  /** 正序 */
  just,
  /** 倒序 */
  inverted,
}

/**
 * 邀请详情 - 获取注册时间排序对应图标
 */
export function getInviteDetailRegisterSortIcon(type: number) {
  return {
    [InviteDetailRegisterSortTypeEnum.default]: 'icon_screen_default',
    [InviteDetailRegisterSortTypeEnum.just]: 'icon_screen_min',
    [InviteDetailRegisterSortTypeEnum.inverted]: 'icon_screen_max',
  }[type]
}

/**
 * 邀请详情 - 修改注册时间排序
 */
export function setInviteDetailRegisterSort(type: number) {
  return {
    [InviteDetailRegisterSortTypeEnum.default]: InviteDetailRegisterSortTypeEnum.inverted,
    [InviteDetailRegisterSortTypeEnum.inverted]: InviteDetailRegisterSortTypeEnum.just,
    [InviteDetailRegisterSortTypeEnum.just]: InviteDetailRegisterSortTypeEnum.default,
  }[type]
}

/**
 * 邀请详情 - 邀请列表组件页面类型
 */
export enum InvitePageTypeEnum {
  /** 代理中心 */
  center = 'center',
  /** TA 的邀请 */
  subordinate = 'subordinate',
}

/**
 * 邀请详情 - 实名状态类型
 */
export enum InviteCertificationStatusTypeEnum {
  /** 全部 */
  all = '',
  /** 已实名 */
  verified = '1',
  /** 未实名 */
  notCertified = '2',
}

/**
 * 邀请详情 - 实名状态列表
 */
export const InviteCertificationList = [
  InviteCertificationStatusTypeEnum.all,
  InviteCertificationStatusTypeEnum.verified,
  InviteCertificationStatusTypeEnum.notCertified,
]

/**
 * 邀请详情 - 获取实名状态类型名称
 */
export function getInviteCertificationStatusTypeName(type: string) {
  return {
    [InviteCertificationStatusTypeEnum.all]: t`constants_market_market_list_market_module_index_5101071`,
    [InviteCertificationStatusTypeEnum.verified]: t`helper_agent_invite_index_5101421`,
    [InviteCertificationStatusTypeEnum.notCertified]: t`helper_agent_invite_index_5101422`,
  }[type]
}

/**
 * 返佣详情 - 三级代理返佣层级
 */
export enum ThreeLevelRebateLevelsTypeEnum {
  /** 全部 */
  all = 0,
  /** 一级 */
  one,
  /** 二级 */
  two,
  /** 三级 */
  three,
}

export const ThreeLevelRebateLevelsList = [
  ThreeLevelRebateLevelsTypeEnum.all,
  ThreeLevelRebateLevelsTypeEnum.one,
  ThreeLevelRebateLevelsTypeEnum.two,
  ThreeLevelRebateLevelsTypeEnum.three,
]

/**
 * 返佣详情 - 获取三级代理返佣层级名称
 */
export function getThreeLevelRebateLevelsTypeName(type: number) {
  return {
    [ThreeLevelRebateLevelsTypeEnum.all]: t`constants_market_market_list_market_module_index_5101071`,
    [ThreeLevelRebateLevelsTypeEnum.one]: t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_cp1bvostcw`,
    [ThreeLevelRebateLevelsTypeEnum.two]: t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_qfs66hjav0`,
    [ThreeLevelRebateLevelsTypeEnum.three]: t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_vzvtihuacz`,
  }[type]
}

/**
 * 邀请详情 - 是否已实名
 */
export enum AgentUserIsRealNameTypeEnum {
  /** 是 */
  yes = 1,
  /** 否 */
  no,
}

/**
 * 邀请详情 - 是否调整过比例
 */
export enum AgentUserIsTrimRatioTypeEnum {
  /** 是 */
  yes = 1,
  /** 否 */
  no,
}

/**
 * 邀请详情列表 - 排序类型
 */
export enum AgentInviteListSortTypeEnum {
  /** 时间 */
  registerDate = 1,
  /** 邀请人数 */
  inviteNum,
  /** 团队人数 */
  teamNum,
}

/**
 * 获取返佣比例说明文案
 */
export function getRebateRatioDesc(type: string) {
  return (
    {
      [AgentModalTypeEnum.area]: [
        t`constants_agent_agent_center_center_lzyray2phv`,
        t`constants_agent_agent_center_center_5nuxawkg0o`,
      ],
      [AgentModalTypeEnum.threeLevel]: [
        t`constants_agent_agent_center_center_8oa0yjk1cm`,
        t`constants_agent_agent_center_center_y7qvjh5vze`,
      ],
      [AgentModalTypeEnum.pyramid]: [
        t`constants_agent_agent_center_center_qreg150ptm`,
        t`constants_agent_agent_center_center_sp9aiu_ryz`,
      ],
    }[type] || []
  )
}
