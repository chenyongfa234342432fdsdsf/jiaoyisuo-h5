import {
  DateOptionsTypes,
  agentInviteTotalListOptions,
  incomeAnalysisChartDefaultProperties,
  productCodeMapToRates,
  totalIncomeChartDefaultProperties,
} from '@/constants/agent'
import cacheUtils from 'store'

import { baseAgentStatsStore } from '@/store/agent/agent-gains'
import { YapiGetV1AgentInvitationCodeQueryProductCdData } from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import { YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse } from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsAnalysisV1PostApi'
import { YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes } from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsV1PostApi'
import dayjs from 'dayjs'
import { isNull, pick, sum, sumBy, uniqWith } from 'lodash'
import {
  YapiPostV2AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse,
  YapiPostV2AgtRebateInfoHistoryQueryDetailsAnalysisListData,
} from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsAnalysisV2PostApi'
import { YapiPostV2AgentInviteDetailsAnalysisApiResponse } from '@/typings/yapi/AgentInviteDetailsAnalysisV2PostApi'
import { totalInvitedChartCheckboxOptions } from '@/constants/agent/invite'

import { baseUserStore } from '@/store/user'
import { dateFormatEnum } from '@/constants/dateFomat'
import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimal } from '../decimal'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

const dateTemplate = 'YYYY-MM-DD hh:mm:ss'

function formatInfoBoxData(
  data: YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes[],
  productTypes: YapiGetV1AgentInvitationCodeQueryProductCdData
) {
  let processed = data.map(each => pick(each, ['total', 'dateType']))
  processed = processed.map((each, index) => {
    let result = each
    for (let key in productTypes) {
      if (data[index]?.[key]) result = { ...result, [key]: data[index][key] }
    }
    return result
  })

  return processed.reduce((prev, curr) => {
    prev[curr.dateType] = curr
    return prev
  }, {})
}

function formatDateOptions(type: DateOptionsTypes) {
  const now = dayjs()
  if (type === DateOptionsTypes.last7Days) {
    const start = now.subtract(7, 'days')
    return {
      startDate: start.format(dateTemplate),
      endDate: now.format(dateTemplate),
    }
  }
  const start = now.subtract(30, 'days')
  return {
    startDate: start.format(dateTemplate),
    endDate: now.format(dateTemplate),
  }
}

function dateOptionsToApiParams(DateOptions: DateOptionsTypes, chartFilterSetting: { startDate: any; endDate: any }) {
  let endTime = dayjs()
  let startTime = endTime

  switch (DateOptions) {
    case DateOptionsTypes.custom:
      startTime = dayjs(chartFilterSetting.startDate).startOf('day')
      endTime = dayjs(chartFilterSetting.endDate).endOf('day')
      break
    case DateOptionsTypes.last30Days:
      // inclusive of today
      startTime = endTime.subtract(29, 'day').startOf('day')
      break
    default:
      // inclusive of today
      startTime = endTime.subtract(6, 'day').startOf('day')
  }

  return {
    startDate: startTime.valueOf(),
    endDate: endTime.valueOf(),
  }
}

function fillMissingDataForChart(chartData, startDate, endDate) {
  let result = [] as any[]
  const formattedStartDate = dayjs(startDate)
  const formattedEndDate = dayjs(endDate)
  const chartDataMap =
    chartData?.reduce((prev, curr) => {
      prev[curr.x] = curr.y
      return prev
    }, {}) || {}
  for (let start = formattedStartDate; start.diff(formattedEndDate) <= 0; start = start.add(1, 'day')) {
    if (chartDataMap?.[start.format('YYYY-MM-DD')])
      result.push({ x: start.format('YYYY-MM-DD'), y: chartDataMap[start.format('YYYY-MM-DD')] })
    else result.push({ x: start.format('YYYY-MM-DD'), y: 0 })
  }

  return result
}

function mergeRebateDataByProductCd(data) {
  const result = data.reduce((aggre, curr, index) => {
    const duplicated = data
      .slice(index + 1)
      .filter(each => each.x === curr.x && each.rebateTypeCd === curr.rebateTypeCd)
    const mergeValue = [curr, ...duplicated].reduce((a, c) => {
      a = {
        ...c,
        y: a?.y ? SafeCalcUtil.add(a.y, c.y).toString() : c.y,
      }
      return a
    }, {})
    delete mergeValue.productCd
    aggre.push(mergeValue)
    return aggre
  }, [])
  return uniqWith(result, (a: any, b: any) => a.rebateTypeCd === b.rebateTypeCd && a.x === b.x)
}

function mergeRebateDataByRebateType(data) {
  const result = data.reduce((aggre, curr, index) => {
    const duplicated = data.slice(index + 1).filter(each => each.x === curr.x)
    const mergeValue = [curr, ...duplicated].reduce((a, c) => {
      a = {
        ...c,
        y: a?.y ? SafeCalcUtil.add(a.y, c.y).toString() : c.y,
      }
      return a
    }, {})
    delete mergeValue.productCd
    aggre.push(mergeValue)
    return aggre
  }, [])
  return uniqWith(result, (a: any, b: any) => a.x === b.x)
}

function formatTotalIncomesChartData(
  apiData: YapiPostV2AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse['data']['list'],
  startDate: number,
  endDate: number
) {
  const today = getTodayTooltipDate()
  let todayValue = 0

  let data = apiData.map(each => {
    const date = dayjs(each.rebateTime).format('YYYY-MM-DD')
    const value = Number(each.rebate)
    if (date === today) {
      todayValue = value
    }
    return {
      rebateTypeCd: each.rebateTypeCd,
      productCd: each.productCd,
      x: date,
      y: value,
    }
  })
  data = mergeRebateDataByProductCd([...data]) as any
  const id = JSON.stringify({
    ...data[data.length - 1],
    y: sumBy(data, each => Number(each.y)),
  })
  return [
    {
      id,
      data,
      ...totalIncomeChartDefaultProperties,
      startDate,
      endDate,
      default: {
        date: today,
        value: todayValue,
      },
    },
  ]
}

export function formatAgentInviteChartData(
  apiData: YapiPostV2AgentInviteDetailsAnalysisApiResponse['data']['invitedList'],
  startDate: number,
  endDate: number
) {
  const today = getTodayTooltipDate()
  let todayValue = 0
  let data = apiData.map(each => {
    const itemDate = dayjs(each.date).format('YYYY-MM-DD')
    if (itemDate === today) {
      todayValue = each.num
    }
    return { x: itemDate, y: each.num }
  })
  data = fillMissingDataForChart(data, startDate, endDate)
  const id = JSON.stringify({
    ...data[data.length - 1],
    y: sumBy(data, each => Number((each as any).y)),
  })
  return [
    {
      id,
      data,
      ...totalIncomeChartDefaultProperties,
      default: {
        date: today,
        value: todayValue,
      },
    },
  ]
}

export function formatAgentTotalInviteChartData(
  apiData: YapiPostV2AgentInviteDetailsAnalysisApiResponse['data']['totalList'],
  startDate: number,
  endDate: number
) {
  const today = getTodayTooltipDate()
  let defaultValue = 0

  let data = Object.keys(agentInviteTotalListOptions).map((key, index) => {
    const objKey = agentInviteTotalListOptions[key]
    let data = apiData?.map(each => {
      const inviteDate = dayjs(each.date).format('YYYY-MM-DD')
      const inviteValue = each[objKey]
      if (today === inviteDate) defaultValue = inviteValue
      return { x: inviteDate, y: inviteValue }
    })
    data = fillMissingDataForChart(data, startDate, endDate)
    const checkboxVal = {
      ...data[data.length - 1],
      y: sumBy(data, each => Number(each.y)),
    }
    const checkboxTitle = JSON.stringify(checkboxVal)

    return {
      id: totalInvitedChartCheckboxOptions()[objKey],
      data,
      checkboxTitle,
      ...totalIncomeChartDefaultProperties,
      default: {
        date: today,
        value: defaultValue,
      },
    }
  })

  return data
}

function formatIncomeAnalysisChartData(
  apiData: YapiPostV2AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse['data']['list'],
  startDate: number,
  endDate: number
) {
  const today = getTodayTooltipDate()

  const { productCodeMap } = baseAgentStatsStore.getState()

  const collection = {}

  const productMap = apiData.reduce((prev, curr) => {
    const rebateDate = dayjs(curr.rebateTime).format('YYYY-MM-DD')
    const rebateValue = Number(curr.rebate)
    if (rebateDate === today) {
      collection[curr.productCd] = rebateValue
    }

    if (!prev[curr.productCd])
      prev[curr.productCd] = [
        {
          ...curr,
          x: rebateDate,
          y: rebateValue,
        },
      ]
    else
      prev[curr.productCd].push({
        ...curr,
        x: rebateDate,
        y: rebateValue,
      })
    return prev
  }, {})

  const formattedChartData = Object.keys(productCodeMap).map((key, index) => {
    const data = productMap?.[key] || [] // fillMissingDataForChart(productMap[key], startDate, endDate)
    const checkboxVal = {
      ...data[data.length - 1],
      y: sumBy(data, (each: any) => Number(each.y)),
    }
    const checkboxTitle = JSON.stringify(checkboxVal)

    return {
      id: productCodeMap[key],
      data,
      ...incomeAnalysisChartDefaultProperties[index],
      checkboxTitle,
      productCd: key,
      startDate,
      endDate,
      default: {
        date: today,
        value: collection[key] || 0,
      },
    }
  })
  return formattedChartData
}

function extractRatesFromApiData(apiData: YapiPostV1AgtRebateInfoHistoryQueryDetailsAnalysisApiResponse) {
  const { productCodeMap } = baseAgentStatsStore.getState()

  return Object.keys(productCodeMap).reduce((prev, curr) => {
    prev[curr] = apiData[productCodeMapToRates[curr]]
    return prev
  }, {})
}

function formatIncomesPieChartData(apiData) {
  const data = apiData
  const { productCodeMap } = baseAgentStatsStore.getState()
  if (Object.values(data).every(isNull)) return []

  const formatted = Object.keys(productCodeMap).map((key, index) => {
    return {
      id: key,
      label: productCodeMap[key],
      value: data[key] || 0,
      productCd: key,
      ...incomeAnalysisChartDefaultProperties[index],
    }
  })

  return formatted
}

// filter and format to api request structure
function formatQueryRebateToApi(params) {
  delete params.columnDetails
  if (params.productCd === 0) {
    delete params.productCd
  }

  if (params.rebateTypeCd === 0) {
    delete params.rebateTypeCd
  }

  // api requires both min and maxAmount properties
  if (params.minAmount && !params.maxAmount) {
    params.maxAmount = Number.MAX_SAFE_INTEGER
  }
  if (params.maxAmount && !params.minAmount) {
    params.minAmount = 0
  }

  for (let key in params) {
    if (params[key] === '') delete params[key]
  }

  return params
}

function calRebatesRatios(rebates: YapiPostV2AgtRebateInfoHistoryQueryDetailsAnalysisListData[]) {
  const { productCodeMap } = baseAgentStatsStore.getState()
  const result = Object.keys(productCodeMap).map(key => {
    const rebateByProduct = rebates.filter(rebate => rebate.productCd === key)
    return sumBy(rebateByProduct, each => Number(each.rebate))
  })
  const total = sum(result)

  const ratios = result.map(each => formatNumberDecimal((each / total) * 100, 2, true))
  return Object.keys(productCodeMap).reduce((a, c, i) => {
    a[c] = ratios[i]
    return a
  }, {})
}

export {
  formatDateOptions,
  dateOptionsToApiParams,
  formatInfoBoxData,
  formatQueryRebateToApi,
  formatTotalIncomesChartData,
  formatIncomeAnalysisChartData,
  formatIncomesPieChartData,
  extractRatesFromApiData,
  calRebatesRatios,
  fillMissingDataForChart,
  mergeRebateDataByRebateType,
}

export function setCacheAgentBindUser(key, value) {
  const uid = baseUserStore.getState()?.userInfo?.uid
  cacheUtils.set(`${key}${uid}`, value)
}

export function getCacheAgentBindUser(key) {
  const uid = baseUserStore.getState()?.userInfo?.uid
  return cacheUtils.get(`${key}${uid}`)
}

const getWeek = () => {
  const dayjsWeek = dayjs().day()

  const we = dayjsWeek === 0 ? dayjsWeek - 1 : 0

  const startWeek = dayjs().add(we, 'week').startOf('week').add(1, 'day').valueOf()

  const endWeek = dayjs().add(we, 'week').endOf('week').add(1, 'day').valueOf()

  return {
    startWeek,
    endWeek,
  }
}

export { getWeek }

export const getTodayTooltipDate = () => {
  return dayjs().format(dateFormatEnum.date)
}
