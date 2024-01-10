import { InviteDetailsUidTypeEnum, InviteFilterInviteTypeEnum, InviteFilterKycEnum, InviteFilterSortEnum, YesOrNoEnum } from '@/constants/agent/invite'
import { YapiGetV1AgentAbnormalData } from '@/typings/yapi/AgentAbnormalV1GetApi'
import { YapiGetV1AgentCurrencyData } from '@/typings/yapi/AgentCurrencyV1GetApi'
import {
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsApiResponse,
  YapiPostV1AgentInviteDetailsListMembers,
} from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import {
  YapiPostV1AgentInviteHistoryApiRequest,
  YapiPostV1AgentInviteHistoryData,
  YapiPostV1AgentInviteHistoryListMembersData,
} from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import { YapiPostV2AgentInviteHistoryApiRequest, YapiPostV2AgentInviteHistoryListData } from '@/typings/yapi/AgentInviteHistoryV2PostApi'
import { YapiPostV1AgentRebateLogsApiRequest, YapiPostV1AgentRebateLogsList } from '@/typings/yapi/AgentRebateLogsV1PostApi'

export type InviteFormValidator = {
  alertMessage?: string
  isValid?: boolean
}
export type InviteFormObject<T> = {
  value: T
  // on validation failed alert message
  onValidateFailedMessage?: () => React.ReactDOM
  validator?: () => InviteFormValidator
  toApiValue?: (...any) => any
}

export type InviteFormObjectWrapper<Type> = {
  [Property in keyof Type]: InviteFormObject<Type[Property]>
}

export type InviteFilterFormViewModelHelper = {
  toApiApiRequest: (viewModel: InviteFilterFormViewModel) => Partial<YapiPostV1AgentInviteDetailsApiRequest>
  // fromApiRequest: (data: YapiPostV1AgentInviteDetailsApiResponse) => InviteFilterFormViewModel
  getDefaultViewModel: () => InviteFilterFormViewModel
}

type InviteFilterFormViewModelValueOnly = Partial<
  Omit<
    YapiPostV1AgentInviteDetailsApiRequest,
    'isAgt' | 'kycStatus' | 'registerSort' | 'childNumSort' | 'page' | 'pageSize'
  > & {
    isAgt: InviteFilterInviteTypeEnum
    kycStatus: InviteFilterKycEnum
    registerSort: InviteFilterSortEnum
    childNumSort: InviteFilterSortEnum
  }
>

export type InviteFilterFormViewModel = InviteFormObjectWrapper<InviteFilterFormViewModelValueOnly>

export type YapiPostV1AgentInviteDetailsApiResponseReal = Partial<
  Omit<YapiPostV1AgentInviteDetailsApiResponse, 'members'> & {
    members?: {
      list?: YapiPostV1AgentInviteDetailsListMembers[]
      total: number
      pageSize: number
      pages: number
    }
  }
>
export type YapiPostV1AgentInviteHistoryApiResponseReal = Partial<
  Omit<YapiPostV1AgentInviteHistoryData, 'members'> & {
    members: {
      list: YapiPostV1AgentInviteHistoryListMembersData[]
      total: number
      pageSize: number
      pages: number
    }
  }
>

export type YapiPostV1AgentInviteHistoryApiRequestReal = Partial<Omit<YapiPostV1AgentInviteHistoryApiRequest, 'levelLimit' | 'targetUid'>> & {
  levelLimit?: string | number,
  targetUid?: string | number,
  forceUpdate?: object
}

export type YapiPostV1AgentInviteDetailsApiResponseUserInfoReal = Partial<Omit<YapiPostV1AgentInviteDetailsListMembers, 'uid'>> & {
  uid?: string | number
}

export type YapiPostV2AgentInviteHistoryApiRequestReal =Partial<Omit<YapiPostV2AgentInviteHistoryApiRequest, 'targetUid' |'levelLimit' |'parentUid'> & {
  targetUid: string | number
  parentUid: string | number
  levelLimit: string | number
  // page: number
  // pageSize: number
  forceUpdate: any,
  queryType: InviteDetailsUidTypeEnum
}
> 

export type YapiPostV2AgentInviteHistoryListDataReal = Partial<YapiPostV2AgentInviteHistoryListData & {
  registerTime: string
}>
export type YapiPostV1AgentRebateLogsApiRequestReal = Partial<Omit<YapiPostV1AgentRebateLogsApiRequest, 'targetUid' | 'levelLimit' | 'productCd'> & {
  targetUid: string | number
  levelLimit: string | number
  isGrant: YesOrNoEnum | string
  productCd: string | number,
  // page: number
  // pageSize: number
  forceUpdate: any,
}
> 
export type YapiPostV1AgentRebateLogsListReal = Partial<YapiPostV1AgentRebateLogsList>


export type YapiPostV1AgentInviteDetailsApiRequestReal = Partial<YapiPostV1AgentInviteDetailsApiRequest & {
  startDate: string, 
  endDate: string
  forceUpdate: any
}>

export type YapiGetV1AgentAbnormalDataReal = Partial<YapiGetV1AgentAbnormalData>

export type YapiGetV1AgentCurrencyDataReal = Partial<YapiGetV1AgentCurrencyData>

export type AgentInviteCodeDefaultDataType = {
  id: number
  invitationCode: string
  slogan: string
  area: {
    ratio: number
    grade: number
  }
  threeLevel: {
    grade: number
    firstLevelRatio: number
    secondLevelRatio: number
    thirdLevelRatio: number
  }
  pyramid: {
    name: string
    showPyramidSetting: boolean
    products: {
      selfRatio: number
      childRatio: number
      productCd: string
    }[]
  }
  agentLine: string[]
}

export type AgentPyramidApplyInfoType = {
  showBanner: boolean // 是否显示申请金字塔代理商模式的 banner
  applyStatus: number // 申请状态
  rejectReason: string // 拒绝原因
}

export type AgentScaleDataTypeProp = {
  productCd: string
  selfRatio: number
  childRatio: number
}

type AgentPyramidInvitationCodeItemType = {
  id: string
  name: string
  invitationCode: string
  isDefault: number
  invitedNum: number
  createdByTime: number
  products: Array<AgentScaleDataTypeProp>
}

export type AgentPyramidInvitationCodeType = {
  slogan: string
  pageNum: number
  pageSize: number
  total: number
  list: Array<AgentPyramidInvitationCodeItemType>
}

export type AgentRebateBodySelectTypeProps = {
  text: string
  value: number
}

export type AgentRebateLadderListProps = {
  text: string
  grade: number
  live: string
  rebateRatio?: number
  isCurrentGrade: boolean
  oneRebateRatio?: number
  twoRebateRatio?: number
  threeRebateRatio?: number
  isCurrentText?:string
  maxLive: number
}