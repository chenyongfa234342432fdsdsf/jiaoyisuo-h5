import {
  queryInsuranceFundCurrent,
  queryInsuranceFundLogs,
  queryInsuranceFundTrend,
} from '@/apis/future/funding-history'
import Icon from '@/components/icon'
import RadioButtonGroup from '@/components/radio-button-group'
import { FundingHistoryTabIdEnum } from '@/constants/future/funding-history'
import { formatDate } from '@/helper/date'
import { IFuture } from '@/typings/api/future/common'
import { IFutureInsuranceFundLog, IQueryInsuranceFundTrendReq } from '@/typings/api/future/funding-history'
import { t } from '@lingui/macro'
import { useRequest } from 'ahooks'
import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Pagination } from '@nbit/vant'
import CommonListEmpty from '@/components/common-list/list-empty'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { requestWithLoading } from '@/helper/order'
import ClientOnly from '@/components/client-only'
import { IncreaseTag } from '@nbit/react'
import { useFutureCurrencySettings } from '@/hooks/features/trade'
import styles from './index.module.css'
import commonStyles from '../common.module.css'

const LineChart = lazy(() => import('./line-chart'))

function useFundList(params: IQueryInsuranceFundTrendReq) {
  const defaultData = { data: [] as IFutureInsuranceFundLog[], current: '' }
  const { data: rateList = defaultData, run } = useRequest(
    async () => {
      const [historyRes, currentRes] = await requestWithLoading(
        Promise.all([queryInsuranceFundTrend(params), queryInsuranceFundCurrent({})])
      )
      if (!historyRes.data || !currentRes.data) {
        return defaultData
      }

      return {
        data: historyRes.data.list,
        current: currentRes.data.totalAsset,
      }
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    run()
  }, [params])

  return rateList
}

function FundChart() {
  const [range, setRange] = useState(7)
  const rangeList = [
    {
      label: t`future.funding-history.funding-rate.range.7d`,
      value: 7,
    },
    {
      label: t`future.funding-history.funding-rate.range.30d`,
      value: 30,
    },
  ]
  const params: IQueryInsuranceFundTrendReq = useMemo(() => {
    return {
      day: range as any,
    }
  }, [range])
  const rateList = useFundList(params)
  const lineChartData =
    rateList.data.reverse().map(item => {
      return {
        x: item.settleTime,
        y: Number(item.totalAsset),
      }
    }) || []
  const futureCurrencySettings = useFutureCurrencySettings()
  const symbol = futureCurrencySettings.currencySymbol || 'USD'
  const text = t({
    id: 'features_future_funding_history_insurance_fund_index_1jsv0vazsr',
    values: { 0: symbol },
  })

  return (
    <div>
      <div className="px-4 mb-2">
        <div className="mb-3 font-semibold">
          <span className="mr-1 ">{text}</span>
          <span>{formatCurrency(formatNumberDecimalWhenExceed(rateList.current, futureCurrencySettings.offset))}</span>
        </div>
        <div className="flex">
          <RadioButtonGroup value={range} onChange={setRange as any} options={rangeList} />
        </div>
      </div>
      <div className="h-40 px-4 pb-4">
        <ClientOnly fallback={<div></div>}>
          {lineChartData.length === 0 ? (
            <CommonListEmpty className="pt-4" />
          ) : (
            <Suspense fallback={null}>
              <LineChart symbol={symbol} data={lineChartData} digit={futureCurrencySettings.offset} />
            </Suspense>
          )}
        </ClientOnly>
      </div>
    </div>
  )
}
function FundHistory() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<IFutureInsuranceFundLog[]>([])
  const [total, setTotal] = useState(0)
  const { run } = useRequest(
    async () => {
      const res = await requestWithLoading(
        queryInsuranceFundLogs({
          pageNum: page.toString(),
          pageSize: '20',
        })
      )
      if (res.isOk && res.data) {
        setData(res.data.list)
        setTotal(Number(res.data.total))
      }
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    run()
    document.documentElement.scrollTop = 0
  }, [page])

  return (
    <div className={commonStyles['table-wrapper']}>
      <div className="text-xs">
        {data.map(item => {
          return (
            <div key={item.settleTime} className="rv-hairline--bottom px-4 py-3">
              <div className="mb-2 text-text_color_02">{formatDate(item.settleTime)}</div>
              <div className="mb-2 flex justify-between">
                <span className="text-text_color_02">{t`features_future_funding_history_insurance_fund_index_hhvo8ufhlv`}</span>
                <span>
                  <IncreaseTag kSign hasColor={false} value={item.changeAsset} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text_color_02">{t`features_future_funding_history_insurance_fund_index_jyrqbobekx`}</span>
                <span>
                  <IncreaseTag hasPrefix={false} kSign hasColor={false} value={item.totalAsset} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {data.length === 0 && <CommonListEmpty className="py-8" />}
      {total > 20 && (
        <div className="flex justify-center mt-4">
          <Pagination
            value={page}
            onChange={setPage}
            totalItems={total}
            showPageSize={5}
            itemsPerPage={20}
            prevText={<Icon className="rotate-180 text-xs" name="next_arrow" hasTheme />}
            nextText={<Icon name="next_arrow" className="text-xs" hasTheme />}
          />
        </div>
      )}
    </div>
  )
}

type IFundingRateProps = {
  type: FundingHistoryTabIdEnum
  selectedFuture: IFuture
  onChange: (future: IFuture) => any
}
function InsuranceFund({ selectedFuture }: IFundingRateProps) {
  return (
    <div className={styles['funding-rate-wrapper']}>
      <FundChart />
      <div className="h-1 bg-line_color_02"></div>
      <FundHistory />
    </div>
  )
}

export default InsuranceFund
