/**
 * 代理商中心
 */
import produce from 'immer'
import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import { subscribeWithSelector } from 'zustand/middleware'
import { IStoreEnum } from '@/typings/store/common'
import { getCodeDetailListBatch } from '@/apis/common'
import {
  AgentCenterDetailsTabEnum,
  AgentCenterTimeTypeEnum,
  AgentInviteListSortTypeEnum,
  InviteDetailRegisterSortTypeEnum,
} from '@/constants/agent/agent-center/center'
import {
  getAgentCenterCurrentCurrencyCache,
  getAgentCenterEncryptionCache,
  setAgentCenterCurrentCurrencyCache,
  setAgentCenterEncryptionCache,
} from '@/helper/cache/agent'
import {
  AgentCenterInviteDetailReq,
  AgentCenterOverviewResp,
  AgentCenterRebateDetailReq,
  AgentCenterUserIsBlackResp,
  IAgentCurrencyList,
  IAgentInviteeList,
  IAgentRebateList,
} from '@/typings/api/agent/agent-center/center'
import { AgentDictionaryTypeEnum } from '@/constants/agent/common'
import { YapiGetV1MemberCurrencyListCurrencyListData } from '@/typings/yapi/MemberCurrencyListV1GetApi'

type IStore = ReturnType<typeof getStore>

type SubsType = any[] | string | Record<string, any>

export const initInviteDetailForm = {
  registerDateSort: InviteDetailRegisterSortTypeEnum.default,
  rebateLevel: '',
  isRealName: '',
  teamNumMin: '',
  teamNumMax: '',
  startTime: 0,
  endTime: 0,
  pageNum: 1,
  pageSize: 10,
  uid: 0,
  sort: AgentInviteListSortTypeEnum.registerDate,
}

export const initRebateDetailForm = {
  productCd: '',
  startTime: new Date(new Date(new Date().getTime()).setHours(0, 0, 0, 0)).getTime(),
  endTime: new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 59)).getTime(),
  rebateType: '',
  minAmount: '',
  maxAmount: '',
  rebateLevel: 0,
  pageNum: 1,
  pageSize: 10,
}

function getStore(set, get) {
  return {
    /** 用户代理模式列表（tab） */
    userAgentList: [] as string[],
    updateUserAgentList: (newUserAgentList: string[]) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.userAgentList = newUserAgentList
        })
      })
    },
    /** 当前选中代理模式 tab */
    currentModalTab: '',
    updateCurrentModalTab: (newCurrentModalTab: string) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.currentModalTab = newCurrentModalTab
        })
      })
    },
    /** 当前选中列表 tab(邀请详情、返佣详情) */
    currentDetailsTab: AgentCenterDetailsTabEnum.invite as string,
    updateCurrentDetailsTab: (newDetailsTab: string) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.currentDetailsTab = newDetailsTab
        })
      })
    },
    /** 总览时间选中 tab */
    overviewTimeTab: AgentCenterTimeTypeEnum.today as string,
    updateOverviewTimeTab: (newOverviewTimeTab: string) => {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.overviewTimeTab = newOverviewTimeTab
        })
      })
    },
    /** 是否隐藏代理中心金额 */
    encryption: getAgentCenterEncryptionCache() || false,
    updateEncryption: (newEncryption: boolean) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.encryption = newEncryption
          setAgentCenterEncryptionCache(newEncryption)
        })
      }),
    /** 用户法币列表 */
    memberCurrencyList: [] as YapiGetV1MemberCurrencyListCurrencyListData[],
    updateMemberCurrencyList: (newMemberCurrencyList: YapiGetV1MemberCurrencyListCurrencyListData[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.memberCurrencyList = newMemberCurrencyList
        })
      }),
    /** 代理商法币列表 */
    agentCurrencyList: [] as IAgentCurrencyList[],
    updateAgentCurrencyList: (newAgentCurrencyList: IAgentCurrencyList[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.agentCurrencyList = newAgentCurrencyList
        })
      }),
    /** 当前法币 */
    currentCurrency: (getAgentCenterCurrentCurrencyCache() as IAgentCurrencyList) || ({} as IAgentCurrencyList),
    updateCurrentCurrency: (newCurrentCurrency: IAgentCurrencyList) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.currentCurrency = newCurrentCurrency
          setAgentCenterCurrentCurrencyCache(newCurrentCurrency)
        })
      }),
    /** 代理中心 - 总览数据 */
    agentCenterOverview: {} as AgentCenterOverviewResp,
    updateAgentCenterOverview: (newAgentCenterOverview: AgentCenterOverviewResp) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.agentCenterOverview = newAgentCenterOverview
        })
      }),
    /** 代理中心 - 当前用户是否黑名单 */
    agentUserBlackInfo: {} as AgentCenterUserIsBlackResp,
    updateAgentUserBlackInfo: (newAgentUserBlackInfo: AgentCenterUserIsBlackResp) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.agentUserBlackInfo = newAgentUserBlackInfo
        })
      }),
    /** 邀请详情 - 区域代理等级列表 */
    areaAgentLevelList: [] as number[],
    updateAreaAgentLevelList: (newAreaAgentLevelList: number[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.areaAgentLevelList = newAreaAgentLevelList
        })
      }),
    /** 邀请详情筛选表单 */
    inviteDetailForm: initInviteDetailForm as AgentCenterInviteDetailReq,
    updateInviteDetailForm: (newInviteDetailForm: AgentCenterInviteDetailReq) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.inviteDetailForm = { ..._store.inviteDetailForm, ...newInviteDetailForm }
        })
      }),
    inviteFinished: false,
    updateInviteFinished: (newInviteFinished: boolean) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.inviteFinished = newInviteFinished
        })
      }),
    /** 邀请详情列表 */
    inviteList: [] as IAgentInviteeList[],
    updateInviteList: (newInviteList: IAgentInviteeList[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.inviteList = newInviteList
        })
      }),
    /** 返佣详情筛选表单 */
    rebateDetailForm: initRebateDetailForm as AgentCenterRebateDetailReq,
    updateRebateDetailForm: newRebateDetailForm =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.rebateDetailForm = { ..._store.rebateDetailForm, ...newRebateDetailForm }
        })
      }),
    rebateFinished: false,
    updateRebateFinished: (newRebateFinished: boolean) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.rebateFinished = newRebateFinished
        })
      }),
    /** 返佣详情列表 */
    rebateList: [] as IAgentRebateList[],
    updateRebateList: (newRebateList: IAgentRebateList[]) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.rebateList = newRebateList
        })
      }),
    /** 返佣详情产品线列表 */
    rebateProductList: [],
    updateRebateProductList: newRebateProductList =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.rebateProductList = newRebateProductList
        })
      }),
    /** 数据字典 */
    agentCenterEnums: {
      /** 产品线 */
      agentProductCdRatioEnum: {
        codeKey: AgentDictionaryTypeEnum.agentProductCdRatio,
        enums: [],
      } as IStoreEnum,
      /** 产品线 */
      agentProductCdShowRatioEnum: {
        codeKey: AgentDictionaryTypeEnum.agentProductCdShowRatio,
        enums: [],
      } as IStoreEnum,
      /** 代理模式/代理类型 */
      agentTypeCodeEnum: {
        codeKey: AgentDictionaryTypeEnum.agentTypeCode,
        enums: [],
      } as IStoreEnum,
      /** 代理商返佣类型 */
      agentRebateTypeEnum: {
        codeKey: AgentDictionaryTypeEnum.agentRebateType,
        enums: [],
      } as IStoreEnum,
    },
    /** 获取数据字典 */
    async fetchAgentCenterEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(Object.values(state.agentCenterEnums)?.map(item => item.codeKey))
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.agentCenterEnums)
          items?.forEach((item, index) => {
            item.enums = data[index].map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
  }
}

const baseAgentCenterStore = create(subscribeWithSelector(getStore))

const useAgentCenterStore = createTrackedSelector(baseAgentCenterStore)

export { useAgentCenterStore, baseAgentCenterStore }
