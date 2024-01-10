import {
  getV1AgentInvitationCodeQueryProductCdApiRequest,
  getV1AgentRebateAnalysisOverviewApiRequest,
  postV2AgtRebateInfoHistoryQueryDetailsAnalysisApiRequest,
  postV2AgtRebateInfoHistoryQueryDetailsApiRequest,
} from '@/apis/agent'
import { getRebateInfoHistory } from '@/apis/agent/gains'
import { getCodeDetailListBatch } from '@/apis/common'
import { DateOptionsTypes } from '@/constants/agent'
import {
  calRebatesRatios,
  dateOptionsToApiParams,
  formatAgentInviteChartData,
  formatAgentTotalInviteChartData,
  formatIncomeAnalysisChartData,
  formatIncomesPieChartData,
  formatInfoBoxData,
  formatQueryRebateToApi,
  formatTotalIncomesChartData,
} from '@/helper/agent/agent'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiGetV1AgtRebateInfoHistoryOverviewData } from '@/typings/yapi/AgtRebateInfoHistoryOverviewV1GetApi'
import { t } from '@lingui/macro'
import { useSafeState, useUpdateEffect } from 'ahooks'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import {
  YapiPostV2AgtRebateInfoHistoryQueryDetailsApiResponse,
  YapiPostV2AgtRebateInfoHistoryQueryDetailsListData,
} from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsV2PostApi'
import { YapiGetV1AgentRebateAnalysisOverviewData } from '@/typings/yapi/AgentRebateAnalysisOverviewV1GetApi'
import useReqeustMarketHelper from '../market/common/use-request-market'

function useRebateInfoDetails(DateOptions: DateOptionsTypes) {
  const [totalIncomes, settotalIncomes] = useState<ReturnType<typeof formatTotalIncomesChartData>>([])
  const [incomesAnalysis, setincomesAnalysis] = useState<ReturnType<typeof formatIncomeAnalysisChartData>>([])
  const [incomeRates, setincomeRates] = useState<ReturnType<typeof formatIncomesPieChartData>>([])
  const [overview, setoverview] = useState<YapiGetV1AgentRebateAnalysisOverviewData>()
  const { chartFilterSetting, productTypesMap, productCodeMap } = useAgentStatsStore()

  useEffect(() => {
    const params = dateOptionsToApiParams(DateOptions, chartFilterSetting)

    Promise.all([
      postV2AgtRebateInfoHistoryQueryDetailsAnalysisApiRequest(params),
      getV1AgentInvitationCodeQueryProductCdApiRequest({}),
      getV1AgentRebateAnalysisOverviewApiRequest({}),
    ]).then(res => {
      const rebateRes = res[0]
      const productResMap = (res[1].data?.scaleList as any).map(scale => scale.productCd)
      const overviewRes = res[2].data

      const totalIncomesChart = rebateRes.data?.list
        ? formatTotalIncomesChartData(rebateRes.data.list, params.startDate, params.endDate)
        : []
      const incomesAnalysisChart = rebateRes.data?.list
        ? formatIncomeAnalysisChartData(rebateRes.data.list, params.startDate, params.endDate)
        : []
      const calculatedRatio = rebateRes.data?.list ? calRebatesRatios(rebateRes.data.list) : {}
      !isEmpty(calculatedRatio) &&
        setincomeRates(
          formatIncomesPieChartData(calculatedRatio).filter(each => productResMap.includes(each.productCd))
        )

      settotalIncomes(totalIncomesChart)
      setincomesAnalysis(incomesAnalysisChart.filter(each => productResMap.includes(each.productCd)))
      setoverview(overviewRes)
    })
  }, [chartFilterSetting, DateOptions])

  return { totalIncomes, incomesAnalysis, incomeRates, overview }
}

export function useInviteDetailsAnalysis(DateOptions: DateOptionsTypes) {
  const [invitedList, setInvitedList] = useState<ReturnType<typeof formatAgentInviteChartData>>([])
  const [totalList, setTotalList] = useState<ReturnType<typeof formatAgentTotalInviteChartData>>([])
  const { chartFilterSetting, ...store } = useAgentInviteStore()

  useEffect(() => {
    const params = dateOptionsToApiParams(DateOptions, chartFilterSetting)
    store.apis.inviteDetailsAnalysisApi(params).then(res => {
      const invited = res.data?.invitedList
        ? formatAgentInviteChartData((res.data?.invitedList || []) as any, params.startDate, params.endDate)
        : []
      const total = res.data?.totalList
        ? formatAgentTotalInviteChartData((res.data?.totalList || []) as any, params.startDate, params.endDate)
        : []
      setInvitedList(invited)
      setTotalList(total)
    })
  }, [chartFilterSetting, DateOptions])

  return { invitedList, totalList }
}

function defaultRebateInfoPagination() {
  return {
    page: 1,
    pageSize: 20,
  }
}

function useQueryRebateInfoDetails({ getNextPage }) {
  const { filterSetting, setSettlementCurrency, setRebateCurrency } = useAgentStatsStore()
  const [page, setpage] = useState(defaultRebateInfoPagination())
  const [hasNextPage, sethasNextPage] = useState<boolean>()

  const [apiData, setApiData] = useSafeState<YapiPostV2AgtRebateInfoHistoryQueryDetailsApiResponse['data']>()
  const [listData, setlistData] = useState<YapiPostV2AgtRebateInfoHistoryQueryDetailsListData[]>([])

  const apiRequest = (resolve, reject) => {
    const resolvedSettings = { ...filterSetting }
    // default last 3 months data
    resolvedSettings.startDate = filterSetting.startDate || dayjs().subtract(2, 'month').valueOf()
    resolvedSettings.endDate = filterSetting.endDate || dayjs().valueOf()

    postV2AgtRebateInfoHistoryQueryDetailsApiRequest(
      formatQueryRebateToApi({
        ...resolvedSettings,
        ...page,
      })
    ).then(res => {
      if (res.isOk) {
        const data = res.data
        const totalNum = res.data?.total || 0
        if (totalNum && page.page * page.pageSize < totalNum) sethasNextPage(true)
        else sethasNextPage(false)
        setRebateCurrency(data?.legalCur)
        // setSettlementCurrency(data)
        return resolve(data)
      }
      return reject()
    })
  }
  // update page setting to next page
  useEffect(() => {
    if (getNextPage && hasNextPage) {
      setpage(prev => {
        prev.page += 1
        return { ...prev }
      })
    }
  }, [getNextPage])

  // reset to default page setting if filter setting changes
  useUpdateEffect(() => {
    setpage(defaultRebateInfoPagination())
    setlistData([])
  }, [filterSetting])

  // merge current page list with new page list
  useUpdateEffect(() => {
    setlistData(prev => {
      if (apiData?.list) return [...prev, ...apiData.list]
      return prev
    })
  }, [apiData])

  const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
    apiRequest,
    setApiData,
    deps: [
      filterSetting.productCd,
      filterSetting.rebateTypeCd,
      filterSetting.columnDetails,
      filterSetting.endDate,
      filterSetting.startDate,
      filterSetting.minAmount,
      filterSetting.maxAmount,
      page.page,
    ],
  })

  return { listData, apiData, setApiData, refresh, apiStatus, hasNextPage }
}

function useGetAgentProductCode() {
  const { setProductCodeMap, setRebateCodeMap } = useAgentStatsStore()

  useEffect(() => {
    getCodeDetailListBatch(['agent_product_cd', 'rebate_type_cd']).then(res => {
      const codeMap = res[0]?.reduce((prev, curr) => {
        prev[curr.codeVal] = curr.codeKey
        return prev
      }, {})

      const rebateCodeMap = res[1]?.reduce((prev, curr) => {
        prev[curr.codeVal] = curr.codeKey
        return prev
      }, {})
      setProductCodeMap(codeMap)
      setRebateCodeMap(rebateCodeMap)
    })
  }, [])
}

function useGetAgentProductTypes() {
  const { setProductTypesMap } = useAgentStatsStore()

  useEffect(() => {
    getV1AgentInvitationCodeQueryProductCdApiRequest({}).then(res => {
      if (!res.isOk || !res.data) return
      setProductTypesMap(res.data)
    })
  }, [])
}

function useAgentProductTypes() {
  const [types, settypes] = useState<any[]>([])
  const { productCodeMap, productTypesMap } = useAgentStatsStore()
  useEffect(() => {
    if (!isEmpty(productCodeMap) && !isEmpty(productTypesMap)) {
      const filtered = (productTypesMap?.scaleList as any).reduce((prev, cur) => {
        prev[cur.productCd] = productCodeMap[cur.productCd]
        return prev
      }, {})
      const allTypes = Object.keys(filtered).reduce((prev: any, curr) => {
        const type = {
          label: productCodeMap[curr],
          value: curr,
        }
        prev.push(type)
        return prev
      }, [])
      allTypes?.unshift({ label: t`constants_market_market_list_market_module_index_5101071`, value: 0 })
      settypes(allTypes)
    }
  }, [productCodeMap, productTypesMap])

  return types
}

function useAgentRebateTypes() {
  const [types, settypes] = useState<any[]>([])
  const { rebateCodeMap } = useAgentStatsStore()
  useEffect(() => {
    if (!isEmpty(rebateCodeMap)) {
      const allTypes = Object.keys(rebateCodeMap).reduce((prev: any, curr) => {
        const type = {
          label: rebateCodeMap[curr],
          value: curr,
        }
        prev.push(type)
        return prev
      }, [])
      allTypes?.unshift({ label: t`constants_market_market_list_market_module_index_5101071`, value: 0 })
      settypes(allTypes)
    }
  }, [rebateCodeMap])

  return types
}

function useRebateInfoOverview() {
  const { setRebateCurrency } = useAgentStatsStore()

  const [rebateInfo, setrebateInfo] = useState<YapiGetV1AgtRebateInfoHistoryOverviewData>()
  useEffect(() => {
    getRebateInfoHistory({}).then(res => {
      if (!res.isOk || !res.data) return
      setrebateInfo(res.data)
      setRebateCurrency(res.data?.legalCur)
    })
  }, [])

  return rebateInfo
}

export {
  useAgentProductTypes,
  useRebateInfoDetails,
  useQueryRebateInfoDetails,
  useGetAgentProductCode,
  useRebateInfoOverview,
  useGetAgentProductTypes,
  useAgentRebateTypes,
}
