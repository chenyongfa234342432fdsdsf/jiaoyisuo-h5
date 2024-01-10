import { queryCurrentFundingRate, queryFundingRateHistory } from '@/apis/future/funding-history'
import Icon from '@/components/icon'
import Link from '@/components/link'
import RadioButtonGroup from '@/components/radio-button-group'
import { FundingHistoryTabIdEnum } from '@/constants/future/funding-history'
import { fillZero, getPeriodDayTime, getFutureFundingRateNextDate, formatDate } from '@/helper/date'
import { envIsServer } from '@/helper/env'
import { useCommonStore } from '@/store/common'
import { IFuture } from '@/typings/api/future/common'
import { ICurrentFundingRate, IFundingRateHistoryReq } from '@/typings/api/future/funding-history'
import { t } from '@lingui/macro'
import { useCountDown, useCreation, useMount, useRequest, useUpdateEffect } from 'ahooks'
import dayjs from 'dayjs'
import { FC, lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Dialog, Pagination } from '@nbit/vant'
import { usePageContext } from '@/hooks/use-page-context'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import CommonListEmpty from '@/components/common-list/list-empty'
import { formatNumberDecimalWhenExceed, getPercentDisplay } from '@/helper/decimal'
import { FutureHelpCenterEnum } from '@/constants/future/future-const'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import { requestWithLoading } from '@/helper/order'
import { sortMarketChartData } from '@/helper/market'
import { useScaleDom } from '@/hooks/use-scale-dom'
import ClientOnly from '@/components/client-only'
import FutureSelector from '../future-selector'
import styles from './index.module.css'
import commonStyles from '../common.module.css'

function getRateDisplay(rate?: number | string) {
  return `${formatNumberDecimalWhenExceed(Number(rate || 0) * 100, 4)}%`
}

function useRateList(params: IFundingRateHistoryReq) {
  const defaultData = { data: [], total: 0, current: {} as ICurrentFundingRate }
  const {
    data: rateList = defaultData,
    loading,
    run,
  } = useRequest(
    async () => {
      const [historyRes, currentRes] = await requestWithLoading(
        Promise.all([
          queryFundingRateHistory(params),
          queryCurrentFundingRate({
            id: params.tradePairId as any,
          }),
        ])
      )
      if (!historyRes.data || !currentRes.data) {
        return defaultData
      }

      return {
        data: historyRes.data.list,
        total: historyRes.data.total,
        current: currentRes.data,
      }
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    if (!params.tradePairId) {
      return
    }
    run()
  }, [params])

  return {
    rateList,
    loading: !params.tradePairId || loading,
  }
}

function RateInfoChart({ selectedFuture }: { selectedFuture: IFuture }) {
  const [range, setRange] = useState(8)
  const commonState = useCommonStore()
  const rangeList = [
    {
      label: t`future.funding-history.funding-rate.range.7d`,
      value: 8,
    },
    {
      label: t`future.funding-history.funding-rate.range.14d`,
      value: 15,
    },
  ]
  const LineChart = useCreation(() => {
    // return lazy(() => import('@/components/chart/src'))
    return lazy(() => import('@nbit/chart-h5'))
  }, [])
  const params: IFundingRateHistoryReq = useMemo(() => {
    return {
      tradePairId: selectedFuture?.id,
      startTime: getPeriodDayTime(range).start,
      // 最多 15 * 24 条数据，这里取一点余量
      pageSize: 400,
    }
  }, [selectedFuture, range])
  const { rateList, loading } = useRateList(params)
  const currentFundingRate = rateList.current
  const showRateDialog = () => {
    Dialog.alert({
      className: 'dialog-confirm-wrapper confirm-black',
      message: t({
        id: 'future.funding-history.funding-rate.rate-info',
        values: {
          0: getPercentDisplay(selectedFuture?.plusFeeRate, 4),
          1: getPercentDisplay(selectedFuture?.minusFeeRate, 4),
        },
      }),
      confirmButtonText: t`features_trade_common_notification_index_5101066`,
    })
  }
  const [, { hours, seconds, minutes }] = useCountDown({
    targetDate: getFutureFundingRateNextDate(currentFundingRate.settleTimes || '', currentFundingRate.settleSpan!),
  })
  const lineChartData =
    rateList.data.map(item => {
      return {
        time: item.timeIndex,
        value: Number(formatNumberDecimalWhenExceed(Number(item.feeRate) * 100, 4)),
      }
    }) || []
  const useStore = useUserStore()
  const { personalCenterSettings } = useStore

  const colors = personalCenterSettings.colors || UserUpsAndDownsColorEnum.greenUpRedDown

  const { priceOffset = 2 as any, amountOffset = 2 as any } = selectedFuture || {}
  return (
    <div>
      <div className={styles['rate-info-chart-wrapper']}>
        <div className="header">
          <div className="flex items-center">
            <span className="text-sm font-semibold">
              {t`future.funding-history.funding-rate.funding-rate`}: {getRateDisplay(currentFundingRate?.feeRate)}
            </span>
            <div onClick={showRateDialog} className="ml-2 text-sm">
              <Icon name="msg" />
            </div>
          </div>
          <RadioButtonGroup value={range} onChange={setRange as any} options={rangeList} />
        </div>
        <div className="flex justify-between text-xs py-3">
          <div>
            {t`future.funding-history.funding-rate.countdown`}: {fillZero(hours)}:{fillZero(minutes)}:
            {fillZero(seconds)}
          </div>
          <div>
            {t`future.funding-history.funding-rate.immediate-rate`}: {getRateDisplay(currentFundingRate?.feeRate)}
          </div>
          <div>
            {t`future.funding-history.funding-rate.base-rate`}:{' '}
            {getRateDisplay(currentFundingRate?.interestRate as any)}
          </div>
        </div>
      </div>
      <div className="h-32">
        <ClientOnly fallback={<div></div>}>
          {lineChartData.length === 0 && !loading ? (
            <CommonListEmpty className="py-0" />
          ) : (
            <Suspense fallback={null}>
              <LineChart
                offset={{
                  amountOffset,
                  priceOffset,
                }}
                colors={colors}
                theme={commonState.theme}
                seriesData={sortMarketChartData(lineChartData as any) as any}
              />
            </Suspense>
          )}
        </ClientOnly>
      </div>
    </div>
  )
}
function RateListTable({ selectedFuture }: { selectedFuture: IFuture }) {
  const [page, setPage] = useState(1)
  const params: IFundingRateHistoryReq = useMemo(() => {
    return {
      tradePairId: selectedFuture?.id,
      pageNum: page,
      pageSize: 20,
    }
  }, [selectedFuture, page])
  const { rateList, loading } = useRateList(params)
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [page])
  return (
    <div className={commonStyles['table-wrapper']}>
      <div className="rate-list-table w-full">
        <div className="table-header">
          <div>{t`future.funding-history.funding-rate.column.time`}</div>
          <div>{t`future.funding-history.funding-rate.column.interval`}</div>
          <div>{t`future.funding-history.funding-rate.column.rate`}</div>
        </div>
        {rateList.data.map(item => {
          return (
            <div key={item.timeIndex} className="rv-hairline--bottom table-tr">
              <div>{formatDate(item.timeIndex)}</div>
              <div>
                {item.settleSpan} {t`features_future_funding_history_funding_rate_index_5101465`}
              </div>
              <div>{getRateDisplay(item.feeRate)}</div>
            </div>
          )
        })}
      </div>
      {rateList.data.length === 0 && !loading && <CommonListEmpty className="py-8" />}
      {rateList.total > 20 && (
        <div className="flex justify-center mt-4">
          <Pagination
            value={page}
            onChange={setPage}
            totalItems={rateList.total}
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
function FundingRate({ type, selectedFuture, onChange }: IFundingRateProps) {
  const pageContext = usePageContext()
  const fundingRateUrl = useHelpCenterUrl(FutureHelpCenterEnum.fundingRate)
  const scaleDomRef = useScaleDom(envIsServer ? 0 : window.innerWidth - 270, null)

  return (
    <div className={styles['funding-rate-wrapper']}>
      <div className="px-4 flex items-center justify-between">
        <FutureSelector
          defaultId={pageContext.urlParsed.search?.tradeId}
          value={selectedFuture}
          onChange={onChange}
          type={type}
        />
        <div ref={scaleDomRef}>
          <Link href={fundingRateUrl} className="text-sm text-brand_color whitespace-nowrap">
            {t`future.funding-history.funding-rate.detail`} &gt;
          </Link>
        </div>
      </div>
      <RateInfoChart selectedFuture={selectedFuture} />
      <RateListTable selectedFuture={selectedFuture} />
    </div>
  )
}

export default FundingRate
