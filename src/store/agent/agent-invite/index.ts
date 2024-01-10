import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import {
  useAgentInviteInfoList,
  useAgentInviteInfoOverviewInit,
  useAgentInviteRebateRecordsV2,
  useAgentInviteTableCheckMoreV2,
} from '@/hooks/features/agent/invite'
import {
  getV1AgentAbnormalApiRequest,
  postV1AgentInviteDetailsApiRequest,
  postV1AgentInviteHistoryApiRequest,
  postV1AgentRebateLogsApiRequest,
  postV2AgentInviteHistoryApiRequest,
} from '@/apis/agent/invite'
import {
  InviteFilterFormViewModel,
  YapiPostV1AgentInviteDetailsApiRequestReal,
  YapiPostV1AgentInviteDetailsApiResponseReal,
  YapiPostV1AgentInviteDetailsApiResponseUserInfoReal,
  YapiPostV1AgentRebateLogsApiRequestReal,
  YapiPostV2AgentInviteHistoryApiRequestReal,
} from '@/typings/api/agent/invite'
import { useInviteDetailsAnalysis } from '@/hooks/features/agent'
import {
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsListMembers,
} from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import {
  AgentProductTypeEnum,
  InviteDetailsUidTypeEnum,
  InviteFilterInviteTypeEnum,
  InviteFilterKycEnum,
  InviteFilterKycLevelEnum,
  InviteFilterSortEnum,
  YesOrNoEnum,
} from '@/constants/agent/invite'
import {
  getV1AgentInvitationCodeQueryMaxApiRequest,
  getV1AgentInvitationCodeQueryProductCdApiRequest,
  postInvitationCodeQuery,
  postV2AgentInviteDetailsAnalysisApiRequest,
} from '@/apis/agent'
import { YapiGetV1AgentInvitationCodeQueryMaxData } from '@/typings/yapi/AgentInvitationCodeQueryMaxV1GetApi'
import { YapiGetV1AgentInvitationCodeQueryProductCdData } from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import { YapiGetV1AgentInvitationCodeQueryData } from '@/typings/yapi/AgentInvitationCodeQueryV1GetApi'
import { YapiGetV1AgentAbnormalData } from '@/typings/yapi/AgentAbnormalV1GetApi'
import { SelectorOption, Toast } from '@nbit/vant'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'
import { SelectorValue } from '@nbit/vant/es/selector/PropsType'
import { omitBy } from 'lodash'
import { GetDetailList } from '@/apis/agent/invite-v3'
import { GetDetailListRequest } from '@/typings/api/agent/invite-v3'

export const agentInviteHelper = {
  toApiApiRequest(viewModel: InviteFilterFormViewModel) {
    let res = {} as Partial<YapiPostV1AgentInviteDetailsApiRequest>
    Object.keys(viewModel).forEach(key => {
      const model = viewModel[key]
      if (!model) return
      // if (!model.validate) return
      res[key] = model.toApiValue ? model.toApiValue(model.value) : model.value
    })

    res = omitBy(res, x => !x)
    return res
  },
  getInviteTypeOptions(isAgent: boolean) {
    const res = [
      {
        label: t`constants_market_market_list_market_module_index_5101071`,
        value: InviteFilterInviteTypeEnum.total,
      },
      isAgent && {
        label: t`helper_agent_invite_index_5101419`,
        value: InviteFilterInviteTypeEnum.agentInvite,
      },
      {
        label: t`helper_agent_invite_index_kfotnul_8l`,
        value: InviteFilterInviteTypeEnum.normalInvite,
      },
    ] as SelectorOption<SelectorValue>[]
    return res.filter(x => !!x)
  },
  getKycStatusOptions() {
    return [
      {
        label: t`constants_market_market_list_market_module_index_5101071`,
        value: InviteFilterKycEnum.total,
      },
      {
        label: t`helper_agent_invite_index_5101421`,
        value: InviteFilterKycEnum.verified,
      },
      {
        label: t`helper_agent_invite_index_5101422`,
        value: InviteFilterKycEnum.notVerified,
      },
    ] as SelectorOption<SelectorValue>[]
  },
  getFilterSettingDefault: () => {
    return {
      isAgt: InviteFilterInviteTypeEnum.total,
      kycStatus: InviteFilterKycEnum.total,
      minChildNum: '',
      maxChildNum: '',
      registerStartTime: '',
      registerEndTime: '',
      childNumSort: InviteFilterSortEnum.default,
      registerSort: InviteFilterSortEnum.default,
      ...agentInviteHelper.getFilterRatiosDefault(),
    } as any as YapiPostV1AgentInviteDetailsApiRequestReal
  },
  getFilterRatiosDefault: () => {
    const ratios = {
      minSpot: '',
      maxSpot: '',
      minContract: '',
      maxContract: '',
      minBorrow: '',
      maxBorrow: '',
    }
    return ratios
  },
  /** 设置默认筛选条件 */
  getFilterSettingCheckMoreDefault: () => {
    const defaultTime = getDefaultLast30DaysStartAndEnd()

    return {
      productCd: AgentProductTypeEnum.total,
      model: '',
      queryUidType: InviteDetailsUidTypeEnum.upperLevelUid,
      pageNum: 1,
      uid: '',
      parentUid: '',
    } as GetDetailListRequest
  },
  /* api 返回结果，kycStatus 不是 1 则为已认证 */
  isKycVerified(kycStatus: string) {
    if (String(kycStatus) === InviteFilterKycEnum.verified) return true
    return false
  },
  isKycVerifiedByType(level?: string | number) {
    if (
      [
        InviteFilterKycLevelEnum.standard,
        InviteFilterKycLevelEnum.advanced,
        InviteFilterKycLevelEnum.enterprise,
      ].includes(String(level || '') as InviteFilterKycLevelEnum)
    ) {
      return true
    }

    return false
  },

  isAgent(agentStatus?: string) {
    if (String(agentStatus) === InviteFilterInviteTypeEnum.agentInvite) return true
    return false
  },
  commonPairFormValidator: (key1, key2) => async (_, _v) => {
    const value = _v || {}
    let minValue = value[key1]
    let maxValue = value[key2]

    if ((minValue && !maxValue) || (maxValue && !minValue)) {
      return Promise.reject(new Error(t`helper_agent_invite_index_5101623`))
    }

    minValue = Number(minValue)
    maxValue = Number(maxValue)

    if (minValue > maxValue) {
      return Promise.reject(new Error(t`helper_agent_invite_index_5101624`))
    }

    return Promise.resolve(true)
  },
}

export type IAgentInviteStore = ReturnType<typeof getStore>
type TStore = IAgentInviteStore

function getDefaultChartFilterSetting() {
  return {
    startDate: undefined,
    endDate: undefined,
  }
}

function defaultPageConfig() {
  return {
    finished: false,
    page: 1,
    pageSize: 20,
  }
}

// default last 3 months data
export function getDefaultLast30DaysStartAndEnd() {
  return {
    startDate: dayjs().subtract(3, 'month').valueOf(),
    endDate: dayjs().valueOf(),
  }
}

export function getDefaultRebateRecordsSetting() {
  const defaultTime = getDefaultLast30DaysStartAndEnd()
  return {
    startDate: defaultTime.startDate,
    endDate: defaultTime.endDate,

    isGrant: YesOrNoEnum.all as any,
    productCd: 0,
  } as YapiPostV1AgentRebateLogsApiRequestReal
}

function getStore(set, get) {
  return {
    isInfoPopUnderOpen: [],
    setInfoPopUnderState: callback =>
      set(
        produce((draft: TStore) => {
          draft.isInfoPopUnderOpen = callback(draft.isInfoPopUnderOpen)
        })
      ),
    isFilterFormOpen: false,
    toggleFilterForm: () =>
      set(
        produce((draft: TStore) => {
          draft.isFilterFormOpen = !draft.isFilterFormOpen
        })
      ),

    isRebateRatioFormOpen: false,
    toggleRebateRatioFormOpen: () => {
      const store = get() as IAgentInviteStore

      if (store.isRebateRatioFormOpen) {
        set(
          produce((draft: TStore) => {
            draft.isRebateRatioFormOpen = !draft.isRebateRatioFormOpen
          })
        )
      } else {
        getV1AgentAbnormalApiRequest({}).then(res => {
          if (res.isOk && res.data && res.data.onTheBlacklist !== true) {
            set(
              produce((draft: TStore) => {
                draft.cache.userInBlacklist = res.data || {}
                draft.isRebateRatioFormOpen = !draft.isRebateRatioFormOpen
              })
            )
          } else {
            Toast.fail(
              t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_ba_4ue7uns`
            )
            set(
              produce((draft: TStore) => {
                draft.isRebateRatioFormOpen = false
              })
            )
          }
        })
      }
    },

    selectedUserInfo: {} as YapiPostV1AgentInviteDetailsApiResponseUserInfoReal,
    setSelectedUserInfo: (val: YapiPostV1AgentInviteDetailsApiResponseUserInfoReal) =>
      set(
        produce((draft: TStore) => {
          draft.selectedUserInfo = val
        })
      ),

    isFilterFormOpenCheckMore: false,
    toggleFilterFormCheckMore: () =>
      set(
        produce((draft: TStore) => {
          draft.isFilterFormOpenCheckMore = !draft.isFilterFormOpenCheckMore
        })
      ),

    page: defaultPageConfig(),

    setPage: setting =>
      set(
        produce((draft: TStore) => {
          draft.page = {
            ...draft.page,
            ...setting,
          }
        })
      ),

    // 点击确认触发 api 的表单 state
    filterSetting: agentInviteHelper.getFilterSettingDefault(),
    setFilterDateRange(input: { startDate: string; endDate: string }) {
      const { startDate, endDate } = input
      set(
        produce((draft: TStore) => {
          draft.filterSetting.registerStartTime = startDate
          draft.filterSetting.registerEndTime = endDate
          draft.filterSetting.startDate = startDate
          draft.filterSetting.endDate = endDate
        })
      )
    },

    setFilterSetting: (key: keyof YapiPostV1AgentInviteDetailsApiRequestReal, value: any) => {
      set(
        produce((draft: TStore) => {
          const states = draft.filterSetting as any
          states[key] = value

          // only one sorter at one time
          if (key === 'childNumSort' && value !== InviteFilterSortEnum.default) {
            states.registerSort = ''
          }

          if (key === 'registerSort' && value !== InviteFilterSortEnum.default) {
            states.childNumSort = ''
          }
        })
      )
    },
    resetFilterSetting(data: any = {}) {
      set(
        produce((draft: TStore) => {
          draft.filterSetting = {
            ...agentInviteHelper.getFilterSettingDefault(),
            uid: draft.filterSetting.uid,
            childNumSort: draft.filterSetting.childNumSort,
            registerSort: draft.filterSetting.registerSort,
            ...data,
          }
        })
      )
    },
    setFilterSettingFromEditing: (model: any) => {
      set(
        produce((draft: TStore) => {
          const newState = { ...draft.filterSetting, ...model }
          draft.filterSetting = newState
        })
      )
    },

    filterSettingCheckMoreSelectedUids: [] as string[],
    setfilterSettingCheckMoreSelectedUids(newId: string) {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = [...draft.filterSettingCheckMoreSelectedUids, newId]
        })
      )
    },
    setfilterSettingCheckMoreSelectedUidsPop() {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = [
            ...draft.filterSettingCheckMoreSelectedUids.slice(0, draft.filterSettingCheckMoreSelectedUids.length - 1),
          ]
        })
      )
    },
    resetfilterSettingCheckMoreSelectedUids() {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreSelectedUids = []
        })
      )
    },
    filterSettingCheckMoreActiveUid: '',
    setFilterSettingCheckMoreActiveUid(id: any) {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreActiveUid = id
        })
      )
    },

    filterSettingCheckMoreV2: agentInviteHelper.getFilterSettingCheckMoreDefault(),
    resetFilterSettingCheckMoreV2(obj = {}) {
      set(
        produce((draft: TStore) => {
          draft.filterSettingCheckMoreV2 = {
            ...agentInviteHelper.getFilterSettingCheckMoreDefault(),
            ...obj,
          }
        })
      )
    },
    setFilterSettingCheckMoreV2: (setting: Partial<GetDetailListRequest>, isAllReplace?: boolean) => {
      set(
        produce((draft: TStore) => {
          const merged = {
            ...draft.filterSettingCheckMoreV2,
            ...setting,
          }
          draft.filterSettingCheckMoreV2 = isAllReplace ? (setting as GetDetailListRequest) : merged
        })
      )
    },
    /** 获取当前最新的筛选数据 */
    getFilterSettingCheckMoreV2: () => {
      const filterData = get().filterSettingCheckMoreV2
      return filterData
    },

    filterRebateRecordsV2: getDefaultRebateRecordsSetting(),
    resetFilterRebateRecordsV2() {
      set(
        produce((draft: TStore) => {
          draft.filterRebateRecordsV2 = getDefaultRebateRecordsSetting()
        })
      )
    },
    setFilterRebateRecordsV2: (setting: YapiPostV1AgentRebateLogsApiRequestReal) => {
      set(
        produce((draft: TStore) => {
          const merged = {
            ...draft.filterRebateRecordsV2,
            ...setting,
          }
          draft.filterRebateRecordsV2 = merged
        })
      )
    },

    isSearchFocused: false,
    setOnSearchFocus(val: boolean) {
      set(
        produce((draft: TStore) => {
          draft.isSearchFocused = val
        })
      )
    },

    searchInput: '',
    setSearchInput(val: string) {
      set(
        produce((draft: TStore) => {
          draft.searchInput = val
        })
      )
    },

    chartFilterSetting: getDefaultChartFilterSetting(),
    setChartFilterSetting: setting =>
      set(
        produce((draft: TStore) => {
          draft.chartFilterSetting = {
            ...draft.chartFilterSetting,
            ...setting,
          }
        })
      ),
    resetChartFilterSetting() {
      set(
        produce((draft: TStore) => {
          draft.chartFilterSetting = getDefaultChartFilterSetting()
        })
      )
    },

    selectedInvited: {} as Partial<YapiPostV1AgentInviteDetailsListMembers>,
    setSelectedInvited: (data: Partial<YapiPostV1AgentInviteDetailsListMembers>) =>
      set(
        produce((draft: TStore) => {
          draft.selectedInvited = data
        })
      ),

    checkMoreTableUpUidHide: false,
    toggleCheckMoreUpUidHide() {
      set(
        produce((draft: TStore) => {
          draft.checkMoreTableUpUidHide = !draft.checkMoreTableUpUidHide
        })
      )
    },

    isHideMyInfo: false,
    toggleIsHideMyInfo() {
      set(
        produce((draft: TStore) => {
          draft.isHideMyInfo = !draft.isHideMyInfo
        })
      )
    },

    async fetchProductLines() {
      getV1AgentInvitationCodeQueryMaxApiRequest({}).then(res => {
        if (res.isOk) {
          set(
            produce((draft: TStore) => {
              draft.cache.productLineEnabledState = res.data || {}
            })
          )
        }
      })
    },

    // 叠加代理商开通的产品
    async fetchProductLinesWithFee() {
      getV1AgentInvitationCodeQueryProductCdApiRequest({}).then(res => {
        if (res.isOk) {
          set(
            produce((draft: TStore) => {
              draft.cache.productLineEnabledStateWithFee = res.data || {}
            })
          )
        }
      })
    },

    fetchUserStatus() {
      postInvitationCodeQuery({}).then(res => {
        if (res.isOk) {
          set(
            produce((draft: TStore) => {
              draft.cache.userStatus = res.data || {}
            })
          )
        }
      })
    },

    apis: {
      // overviewInitApi: useAgentInviteInfoOverviewInit,
      inviteDetailsApi: postV1AgentInviteDetailsApiRequest,
      inviteDetailsAnalysisApi: postV2AgentInviteDetailsAnalysisApiRequest,
      inviteDetailsCheckMoreTableApi: postV1AgentInviteHistoryApiRequest,

      inviteDetailsCheckMoreTableApiV2: GetDetailList,
      inviteDetailsRebateRecordsApiV2: postV1AgentRebateLogsApiRequest,
    },
    cache: {
      userStatus: {} as Partial<YapiGetV1AgentInvitationCodeQueryData>,
      productLineEnabledState: {} as Partial<YapiGetV1AgentInvitationCodeQueryMaxData>,
      productLineEnabledStateWithFee: {} as Partial<YapiGetV1AgentInvitationCodeQueryProductCdData>,
      userInBlacklist: {} as Partial<YapiGetV1AgentAbnormalData>,

      overviewInit: {} as YapiPostV1AgentInviteDetailsApiResponseReal,
      setOverviewInit(data?: YapiPostV1AgentInviteDetailsApiResponseReal) {
        set(
          produce((draft: TStore) => {
            draft.cache.overviewInit = data || {}
          })
        )
      },
    },
    hooks: {
      useAgentInviteInfoOverviewInit,
      useAgentInviteInfoList,
      useInviteDetailsAnalysis,
      useAgentInviteTableCheckMoreV2,
      useAgentInviteRebateRecordsV2,
    },
  }
}

const baseAgentInviteStore = create(devtools(getStore, { name: 'market-agent-invite-store' }))

const useAgentInviteStore = createTrackedSelector(baseAgentInviteStore)

export { useAgentInviteStore, baseAgentInviteStore }
