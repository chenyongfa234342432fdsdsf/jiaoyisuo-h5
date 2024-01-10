import { postV1AgentInviteDetailsApiRequest } from '@/apis/agent/invite'
import { InviteFilterInviteTypeEnum, InviteFilterKycEnum } from '@/constants/agent/invite'
import { ApiStatusEnum } from '@/constants/market/market-list'
import { agentGetUserId, showAgentSearchMsg } from '@/helper/agent/invite'
import { isFalsyExcludeZero } from '@/helper/common'
import useReqeustMarketHelper from '@/hooks/features/market/common/use-request-market'
import { agentInviteHelper, baseAgentInviteStore, useAgentInviteStore } from '@/store/agent/agent-invite'
import {
  YapiPostV1AgentInviteDetailsApiRequestReal,
  YapiPostV1AgentInviteDetailsApiResponseReal,
  YapiPostV1AgentRebateLogsApiRequestReal,
  YapiPostV1AgentRebateLogsListReal,
  YapiPostV2AgentInviteHistoryApiRequestReal,
} from '@/typings/api/agent/invite'
import { YapiPostV1AgentInviteDetailsAnalysisData } from '@/typings/yapi/AgentInviteDetailsAnalysisV1PostApi'
import { YapiPostV1AgentInviteDetailsApiResponse } from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import {
  YapiPostV2AgentInviteHistoryData,
  YapiPostV2AgentInviteHistoryListData,
} from '@/typings/yapi/AgentInviteHistoryV2PostApi'
import { YapiPostV1AgentRebateLogsApiResponse } from '@/typings/yapi/AgentRebateLogsV1PostApi'
import { useMount, useUpdateEffect } from 'ahooks'
import { isEmpty, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { GetDetailListResponse } from '@/typings/api/agent/invite-v3'
import { ApplayModelEnum } from '@/constants/agent'

export const getInviteDefaultPageConfig = () => {
  return {
    // 是否加载完全部
    finished: false,
    pageNum: 1,
    pageSize: 20,
  }
}

export function useAgentInviteInfoOverviewInit() {
  const store = useAgentInviteStore()
  const [page, setPage] = useState(getInviteDefaultPageConfig())

  const { apiStatus, refreshCallback, runAsync } = useReqeustMarketHelper({
    apiRequest: (resolve, reject) => {
      postV1AgentInviteDetailsApiRequest({
        page: page.pageNum,
        pageSize: page.pageSize,
      }).then(res => {
        if (res.isOk) {
          return resolve(res.data)
        }

        reject()
      })
    },
    setApiData: (data: YapiPostV1AgentInviteDetailsApiResponseReal) => {
      store.cache.setOverviewInit(data)
    },
    deps: [],
  })

  return { apiStatus, overviewData: store.cache.overviewInit, refreshCallback }
}

export function useAgentInviteInfoList() {
  const store = useAgentInviteStore()
  const [page, setPage] = useState(getInviteDefaultPageConfig())
  const [dataList, setDataList] = useState<YapiPostV1AgentInviteDetailsApiResponse['members']>([])
  const apiParams = store.filterSetting

  useUpdateEffect(() => {
    setPage(getInviteDefaultPageConfig())
    setDataList([])
  }, [store.filterSetting])

  const { apiStatus, refreshCallback, runAsync } = useReqeustMarketHelper({
    apiRequest: (resolve, reject) => {
      let requestData: YapiPostV1AgentInviteDetailsApiRequestReal = omitBy(
        {
          ...(apiParams as any),
          kycStatus: apiParams.kycStatus || InviteFilterKycEnum.total,
          page: page.pageNum,
          pageSize: page.pageSize,
          ...(apiParams.isAgt === InviteFilterInviteTypeEnum.normalInvite
            ? agentInviteHelper.getFilterRatiosDefault()
            : {}),
          startDate: '',
          endDate: '',
          forceUpdate: '',
        },
        x => !x
      )

      if (requestData.uid) {
        requestData = {
          uid: requestData.uid,
          page: 1,
          pageSize: page.pageSize,
        }
      }

      postV1AgentInviteDetailsApiRequest(requestData as any).then(res => {
        if (res.isOk) {
          return resolve(res.data)
        }

        reject()
      })
    },
    setApiData: (data: YapiPostV1AgentInviteDetailsApiResponseReal) => {
      const total = data?.members?.total || 0

      setDataList(prevList => {
        let resolvedList: any[] = []
        const newData = [...(data?.members?.list || [])]
        resolvedList = [...prevList, ...newData]

        setPage(prev => {
          return {
            ...prev,
            finished: resolvedList.length >= total,
          }
        })

        return resolvedList
      })
    },
    deps: [
      apiParams.isAgt,
      apiParams.uid,
      apiParams.kycStatus,
      apiParams.minChildNum,
      apiParams.maxChildNum,
      // apiParams.minSpot,
      // apiParams.maxSpot,
      // apiParams.minContract,
      // apiParams.maxContract,
      // apiParams.minBorrow,
      // apiParams.maxBorrow,
      apiParams.registerStartTime,
      apiParams.registerEndTime,
      apiParams.registerSort,
      apiParams.childNumSort,
      page.pageNum,
      apiParams.forceUpdate,
    ],
  })

  return { apiStatus, data: dataList, refreshCallback, runAsync, setPage, page }
}

export function useAgentInviteSearching() {}

export function useAgentInviteAnalysis() {
  const store = useAgentInviteStore()
  const [apiData, setApiData] = useState<YapiPostV1AgentInviteDetailsAnalysisData>()

  const apiRequest = (resolve, reject) => {
    store.apis
      .inviteDetailsAnalysisApi({
        ...(store.chartFilterSetting as any),
      })
      .then(res => {
        if (res.isOk) {
          const data = res.data
          return resolve(data)
        }
        return reject()
      })
  }

  const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
    apiRequest,
    setApiData,
    deps: [store.chartFilterSetting.startDate, store.chartFilterSetting.endDate],
  })

  return { apiData, setApiData, refresh, apiStatus }
}

export function useAgentInviteTableCheckMoreV2({ onLoadMore }) {
  const userId = agentGetUserId()
  const store = useAgentInviteStore()
  const state = store.filterSettingCheckMoreV2
  const [page, setPage] = useState(getInviteDefaultPageConfig())
  const [dataList, setDataList] = useState<YapiPostV2AgentInviteHistoryListData[]>([])
  let [currencySymbol, setCurrencySymbol] = useState('')
  useUpdateEffect(() => {
    setPage(getInviteDefaultPageConfig())
    setDataList([])
  }, [store.filterSettingCheckMoreV2])

  useUpdateEffect(() => {
    if (onLoadMore && !page.finished && apiStatus === ApiStatusEnum.succeed) {
      setPage(prev => {
        return {
          ...prev,
          pageNum: prev.pageNum + 1,
        }
      })
    }
  }, [onLoadMore])

  const requestData = omitBy(
    {
      ...state,
      ...page,

      pageSize: page.pageSize,
      forceUpdate: '',
    } as YapiPostV2AgentInviteHistoryApiRequestReal,
    x => !x
  )

  const apiRequest = (resolve, reject) => {
    if (requestData.targetUid && String(requestData.targetUid) === String(userId)) {
      showAgentSearchMsg()
      return reject()
    }
    const defaultSelectAll = '0'
    /** 当产品线和区域等级为全部时去除请求中该参数 */
    if (requestData.areaLevel === defaultSelectAll) {
      delete requestData.areaLevel
    }
    if (requestData.productCd === defaultSelectAll) {
      delete requestData.productCd
    }
    /** 没有模式时不进行请求 */
    if (!requestData.model) return
    store.apis.inviteDetailsCheckMoreTableApiV2(requestData).then(res => {
      if (res.isOk && res.data) {
        const data = res.data
        return resolve(data)
      }
      return reject()
    })
  }

  const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
    apiRequest,
    setApiData: (data: GetDetailListResponse) => {
      /** 保存币种 */
      setCurrencySymbol(data.currencySymbol)
      setDataList(prevList => {
        let resolvedList: any[] = []
        let newData = []
        // 获取当前具体模式取出具体模式的数据
        const model = store.filterSettingCheckMoreV2.model
        switch (model) {
          // 金字塔代理
          case ApplayModelEnum.pyramid:
            newData = [...(data?.pyramidAgentUserDetailList || [])]
            break
          case ApplayModelEnum.threeLevel:
            newData = [...(data?.threeLevelUserDetailList || [])]
            break
          case ApplayModelEnum.area:
            newData = [...(data?.areaAgentUserDetailList || [])]
            break
          default:
            newData = []
        }
        resolvedList = [...prevList, ...newData]
        const total = data?.total || 0

        setPage(prev => {
          return {
            ...prev,
            finished: resolvedList.length >= total,
          }
        })

        return resolvedList
      })
    },
    deps: [
      state.uid,
      state.areaLevel,
      state.inviteNumMin,
      state.inviteNumMax,
      state.startTime,
      state.endTime,
      state.model,
      state.productCd,
      state.queryUidType,
      page.pageNum,
    ],
    apiPreValidation() {
      if (isEmpty(requestData)) return false
      // if (!requestData.targetUid && !requestData.levelLimit) return false
      return true
    },
  })

  return { apiData: dataList, setApiData: setDataList, refresh, apiStatus, page, currencySymbol }
}

export function useAgentInviteRebateRecordsV2({ onLoadMore }) {
  const userId = agentGetUserId()
  const store = useAgentInviteStore()
  const state = store.filterRebateRecordsV2
  const [page, setPage] = useState(getInviteDefaultPageConfig())
  const [dataList, setDataList] = useState<YapiPostV1AgentRebateLogsListReal[]>([])

  useUpdateEffect(() => {
    setPage(getInviteDefaultPageConfig())
    setDataList([])
  }, [store.filterRebateRecordsV2])

  useUpdateEffect(() => {
    if (onLoadMore && !page.finished && apiStatus === ApiStatusEnum.succeed) {
      setPage(prev => {
        return {
          ...prev,
          pageNum: prev.pageNum + 1,
        }
      })
    }
  }, [onLoadMore])
  const requestData = omitBy(
    {
      ...state,
      page: page.pageNum,
      pageSize: page.pageSize,
      forceUpdate: '',
      // targetUid: state.levelLimit ? '' : state.targetUid ? state.targetUid : store.selectedInvited.uid,
    } as YapiPostV1AgentRebateLogsApiRequestReal,
    x => !x
  )
  const apiRequest = (resolve, reject) => {
    if (requestData.targetUid && String(requestData.targetUid) === String(userId)) {
      showAgentSearchMsg()
      return reject()
    }
    store.apis.inviteDetailsRebateRecordsApiV2(requestData).then(res => {
      if (res.isOk && res.data) {
        const data = res.data
        return resolve(data)
      }
      return reject()
    })
  }

  const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
    apiRequest,
    setApiData: (data: YapiPostV1AgentRebateLogsApiResponse) => {
      const total = data.list.length || 0

      setDataList(prevList => {
        let resolvedList: any[] = []
        const newData = [...(data?.list || [])]
        resolvedList = [...prevList, ...newData]

        setPage(prev => {
          return {
            ...prev,
            finished: resolvedList.length >= total,
          }
        })

        return resolvedList
      })
    },
    deps: [
      state.targetUid,
      state.levelLimit,
      state.productCd,
      state.isGrant,

      state.startDate,
      state.endDate,

      state.forceUpdate,
      page.pageNum,
    ],
    apiPreValidation() {
      if (isEmpty(requestData)) return false
      if (!requestData.targetUid && !requestData.levelLimit) return false

      return true
    },
  })

  return { apiData: dataList, setApiData: setDataList, refresh, apiStatus, page }
}

export function useAgentProductLine() {
  const store = useAgentInviteStore()
  useMount(() => {
    if (isEmpty(store.cache.productLineEnabledState)) {
      store.fetchProductLines()
    }
  })
  const productLine = store.cache.productLineEnabledState
  const hasSpot = !isFalsyExcludeZero(productLine.spot)
  const hasContract = !isFalsyExcludeZero(productLine.contract)
  const hasBorrow = !isFalsyExcludeZero(productLine.borrowCoin)
  const hasOption = !isFalsyExcludeZero(productLine.option)
  const hasRecreation = !isFalsyExcludeZero(productLine.recreation)

  return { hasSpot, hasBorrow, hasContract, hasOption, hasRecreation }
}

export function useAgentProductLineWithFee() {
  const store = useAgentInviteStore()
  useMount(() => {
    if (isEmpty(store.cache.productLineEnabledStateWithFee)) {
      store.fetchProductLinesWithFee()
    }
  })
  const productLine = store.cache.productLineEnabledStateWithFee
  const hasSpot = !isFalsyExcludeZero(productLine.spot)
  const hasContract = !isFalsyExcludeZero(productLine.contract)
  const hasBorrow = !isFalsyExcludeZero(productLine.borrowCoin)

  return { hasSpot, hasBorrow, hasContract }
}
