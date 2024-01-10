import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { YapiGetV1AgentInvitationCodeQueryProductCdData } from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'

type TStore = ReturnType<typeof getStore>
type TFilterSetting = {
  productCd: number
  rebateTypeCd: number
  startDate?: string | number
  endDate?: string | number
  minAmount?: string | number
  maxAmount?: string | number
  columnDetails: boolean
}

export function getDefaultFilterSetting(): TFilterSetting {
  return {
    productCd: 0,
    rebateTypeCd: 0,
    startDate: undefined,
    endDate: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    columnDetails: false,
  }
}

function getDefaultChartFilterSetting() {
  return {
    startDate: undefined,
    endDate: undefined,
  }
}

function getStore(set) {
  return {
    rebateCurrency: '-',
    setRebateCurrency: cur => {
      set(
        produce((draft: TStore) => {
          draft.rebateCurrency = cur
        })
      )
    },
    settlementCurrency: '-',
    setSettlementCurrency: cur => {
      set(
        produce((draft: TStore) => {
          draft.settlementCurrency = cur
        })
      )
    },
    productCodeMap: {},
    setProductCodeMap: codeMap =>
      set(
        produce((draft: TStore) => {
          draft.productCodeMap = codeMap
        })
      ),
    rebateCodeMap: {},
    setRebateCodeMap: codeMap =>
      set(
        produce((draft: TStore) => {
          draft.rebateCodeMap = codeMap
        })
      ),
    productTypesMap: {} as YapiGetV1AgentInvitationCodeQueryProductCdData,
    setProductTypesMap: codeMap =>
      set(
        produce((draft: TStore) => {
          draft.productTypesMap = codeMap
        })
      ),

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

    filterSetting: getDefaultFilterSetting(),
    setFilterSetting: setting =>
      set(
        produce((draft: TStore) => {
          draft.filterSetting = {
            ...draft.filterSetting,
            ...setting,
          }
        })
      ),

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

    isHideMyInfo: false,
    toggleIsHideMyInfo() {
      set(
        produce((draft: TStore) => {
          draft.isHideMyInfo = !draft.isHideMyInfo
        })
      )
    },
  }
}

const baseAgentStatsStore = create(devtools(getStore, { name: 'market-agent-stats-store' }))

const useAgentStatsStore = createTrackedSelector(baseAgentStatsStore)

export { useAgentStatsStore, baseAgentStatsStore }
