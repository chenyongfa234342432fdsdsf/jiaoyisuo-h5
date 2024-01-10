/**
 * 代理中心
 */

export interface AgentCenterInviteCellProps {
    /** 页面类型 */
    pageType?: string
    className?: string
    /** 是否需要隐藏展示金额 */
    isEncrypt?: boolean
    /** 列表数据 */
    data: IAgentInviteeList | IAgentInviteDto
    /** 代理模式 */
    model: string
    overwriteLastHistoryEntry?: boolean
    /** 是否需要调整返佣比例 */
    isEditRebateRatio?: boolean
    /** 是否需要展示自己的返佣比例（金字塔） */
    selfRebateRatioVisible?: boolean
    /** 查询邀请详情 */
    onLoadDetail?: () => void
}

/**
 * 代理中心 - 法币列表
 */
export interface IAgentCurrencyList {
    /** 结算币种/法币 */
    currencyEnName: string;
    /** 法币精度 */
    offset: number;
    appLogo: string;
}

/** 获取用户所有代理 */
export interface AgentCenterAgentListReq {}

/**
 * 获取区域代理等级列表
 */
export interface AreaAgentLevelListReq {}

/**
 * 代理中心 - 数据总览
 */
export interface AgentCenterOverviewReq {
    /** 模式 */
    model: string;
    /** 开始时间 */
    startTime: number;
    /** 结束时间 */
    endTime: number;
}

export interface AgentCenterOverviewResp {
    /** 代理商结算币种 */
    currencySymbol: string;
    /** 结算币种精度 */
    currencyOffset: number;
    /** 区域代理返佣 */
    areaAgentRebateDto?: IAgentRebateOverview;
    /** 金字塔代理返佣 */
    pyramidAgentRebateDto?: IAgentRebateOverview;
    /** 三级代理返佣 */
    thirdLevelAgentRebateDto?: IAgentRebateOverview;
    appLogo: string;
    webLogo: string;
}

export interface IAgentRebateOverview {
    /** 团队人数 */
    teamNum?: number;
    /** 邀请人数 - 时间段内新增 */
    inviteNewAdd: number;
    /** 团队手续费 */
    teamFee?: number;
    /** 返佣等级 */
    rebateLevel?: number;
    /** 邀请人数 */
    inviteNum: number;
    /** 返佣比例 */
    rebateRatio: number;
    /** 团队人数 - 时间段内新增 */
    teamNewAdd: number;
    /** 返佣金额 */
    rebateAmount: number;
    /** 一级手续费 */
    firstLevelFee?: number;
    /** 二级手续费 */
    secondLevelFee?: number;
    /** 三级手续费 */
    thirdLevelFee?: number;
    /** 一级返佣比例 */
    firstRebateRatio?: string;
    /** 二级返佣比例 */
    secondRebateRatio?: string;
    /** 三级返佣比例 */
    thirdRebateRatio?: string;
}

/**
 * 代理中心 - 是否黑名单用户
 */
export interface AgentCenterUserIsBlackReq {}

export interface AgentCenterUserIsBlackResp {
    /** 拉黑原因 */
    reason: string;
    /** 是否在黑名单中，true=黑名单中，false=未在黑名单中 */
    inBlacklist: boolean;
}

/**
 * 代理中心 - 邀请详情
 */
export interface AgentCenterInviteDetailReq {
    /** 被邀请的用户 uid(模糊查询) */
    uid?: number;
    /** 模式 */
    model?: string;
    /** 注册时间排序，默认倒序，1.正，2.倒 */
    registerDateSort?: number;
    /** 代理等级 (区域代理字段) */
    rebateLevel?: number | string;
    /** 实名状态，0.全部，1.是，2.否 */
    isRealName?: string;
    /** 团队人数 (低) */
    teamNumMin?: string;
    /** 团队人数 (高) */
    teamNumMax?: string;
    /** 注册时间 (起) */
    startTime?: number;
    /** 注册时间 (止) */
    endTime?: number;
    /** 当前页 */
    pageNum?: number;
    /** 每页条数 */
    pageSize?: number;
    sort?: number
}

/**
 * 代理中心 - 邀请详情
 */
export interface AgentCenterInviteDetailResp {
    /** 金字塔邀请详情列表 */
    pyramidAgentInviteeList: IAgentInviteeList[];
    /** 区域代理邀请详情列表 */
    areaAgentInviteeList: IAgentInviteeList[];
    /** 三级代理邀请详情列表 */
    threeLevelAgentInviteeList: IAgentInviteeList[];
    pageNum: number;
    pageSize: number;
    total: number;
    pageTotal: number;
}

export interface IAgentInviteeList {
  /** TA 的邀请人数 */
  inviteNum: number;
  /** 注册时间 */
  registerDate: number;
  /** 是否调整过比例 1 是，2 否 */
  isTrimRatio?: number;
  /** 是否已实名，1.是，2.否 */
  isRealName: number;
  uid: number;
  /** 金字塔产品返佣 */
  productRebateList?: IProductRebateList[];
  /** TA 的团队人数 */
  teamNum?: number;
  /** 昵称：昵称＞邮箱＞手机号 */
  nickName: string;
  /** 区域等级标签 */
  rebateLevel?: number;
  /** TA 的区域返佣比例 */
  rebateRatio?: number;
}

export interface IProductRebateList {
    /** 我的返佣比例 */
    selfRatio: number;
    /** 现货、合约、娱乐区、三元期权等 */
    productCd: string;
    /** 好友返佣比例 */
    childRatio: number;
}

/**
 * 代理中心 - 返佣详情
 */
export interface AgentCenterRebateDetailReq {
    /** 模式 ("threeLevel", "三级代理"), PYRAMID("pyramid", "金字塔代理"), AREA("area", "区域代理") */
    model?: string;
    /** 产品线 */
    productCd?: string;
    /** 收益计算开始时间 */
    startTime?: number;
    /** 收益计算结束时间 */
    endTime?: number;
    /** 返佣类型 */
    rebateType?: string;
    /** 金额大小范围 (USD) 最低价 */
    minAmount?: string;
    /** 金额大小范围 (USD) 最高价 */
    maxAmount?: string;
    /** 返佣层级 */
    rebateLevel?: number;
    pageNum: number;
    pageSize: number;
}

export interface AgentCenterRebateDetailResp {
    /** 金字塔代理收益详情列表 */
    pyramidAgentRebateList: IAgentRebateList[];
    /** 区域代理收益详情列表 */
    areaAgentRebateList: IAgentRebateList[];
    /** 三级代理收益详情列表 */
    threeLevelAgentRebateList: IAgentRebateList[];
    pageNum: number;
    pageSize: number;
    total: number;
    pageTotal: number;
}

export interface IAgentRebateList {
    /** 返佣时间 */
    rebateDate: number;
    /** TA 的区域等级 */
    rebateLevel?: string;
    /** 返佣币种数量 */
    amount: number;
    /** 团队手续费（USDT） */
    teamFee?: number;
    /** 返佣的币种代码 */
    symbol: string;
    /** 下级 UID */
    childUid: number;
    /** 返佣类型 */
    rebateType?: string;
    /** 比例 */
    rebateRatio?: string;
    /** 法币精度 */
    currencyOffset: number;
    id: number;
    /** 产品线 */
    productCd?: string;
    /** TA 的手续费 (USDT) */
    fee?: number;
    /** 我的返佣比例 */
    selfRatio?: number;
    /** 好友的 */
    childRatio?: number;
    /** 真实返佣比例 */
    ratioActual?: number;
}

/**
 * 邀请详情-TA 的邀请数据总览
 */
export interface AgentCenterChildInviteOverviewReq {
    uid: string;
    model: string;
}

export interface AgentCenterChildInviteOverviewResp {
    /** 区域代理 */
    areaAgentInviteDto: IAgentInviteDto;
    /** 金字塔代理 */
    pyramidAgentInviteDto: IAgentInviteDto;
    /** 三级代理 */
    threeLevelAgentInviteDto: IAgentInviteDto;
}

export interface IAgentInviteDto {
    /** 昵称：昵称＞邮箱＞手机号 */
    nickName: string;
    /** 代理层级 */
    agentLevel: number;
    /** TA 的团队人数 */
    teamNum?: number;
    /** 金字塔返佣 */
    productRebateList?: IProductRebateList[];
    uid: number;
    id: number;
    /** 上级 uid */
    parentUid: number;
    /** 注册时间 */
    registerDate: number;
    /** 是否已实名，1.是，2.否 */
    isRealName: string;
    /** TA 的邀请人数 */
    inviteNum: number;
    /** 代理等级 */
    rebateLevel?: number;
    /** TA 的区域返佣比例 */
    rebateRatio?: number;
}

interface IProductRebateList {
    /** 现货、合约、娱乐区、三元期权等 */
    productCd: string;
    /** 好友返佣比例 */
    childRatio: number;
    /** 我的返佣比例 */
    selfRatio: number;
}
/**
 * TA 的邀请 - 邀请人列表
 */
export interface AgentCenterChildInviteListReq {
    /** 被邀请的用户 uid */
    uid?: number;
    /** 模式 */
    model?: string;
    /** 注册时间排序，默认倒序，1.正，2.倒 */
    registerDateSort?: number;
    /** 实名状态，1.是，2.否 */
    isRealName?: string;
    /** 团队人数 (低) */
    teamNumMin?: string;
    /** 团队人数 (高) */
    teamNumMax?: string;
    /** 注册时间 (起) */
    startTime?: number;
    /** 注册时间 (止) */
    endTime?: number;
    /** 当前页 */
    pageNum: number;
    /** 每页条数 */
    pageSize: number;
    /** 区域代理等级 */
    rebateLevel?: string;
    /** 筛选条件 uid */
    searchUid?: string;
    sort?: number;
}
export interface AgentCenterChildInviteListResp {
    /** 金字塔代理被邀请人列表 */
    pyramidAgentInviteeList: IAgentInviteeList[];
    /** 区域代理被邀请人列表 */
    areaAgentInviteeList: IAgentInviteeList[];
    /** 三级代理被邀请人列表 */
    threeLevelAgentInviteeList: IAgentInviteeList[];
    pageNum: number;
    pageSize: number;
    total: number;
    pageTotal: number;
}

/**
 * 代理中心 - 调整返佣比例
 */
export interface AgentCenterSetRebateRatioReq {
    uid: number;
    rebateRatio: IRebateRatio;
}

export interface IRebateRatio {
    /** 我的比例 */
    selfRatio: number;
    /** 好友比例 */
    childRatio: number;
    /** 产品线 */
    productCd: string;
}

export interface AgentCenterSetRebateRatioResp {
    isSuccess: boolean
}
