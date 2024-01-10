import { queryFundingPriceHistory, queryIndexIngredientList } from '@/apis/future/funding-history'
import Icon from '@/components/icon'
import Link from '@/components/link'
import {
  FundingHistoryIndexPriceTypeEnum,
  FundingHistoryTabIdEnum,
  getFundingHistoryIndexPriceTypeEnumName,
} from '@/constants/future/funding-history'
import { IFuture } from '@/typings/api/future/common'
import { IIndexIngredientReq, IIndexPriceHistoryReq } from '@/typings/api/future/funding-history'
import { t } from '@lingui/macro'
import { useRequest, useUpdateEffect } from 'ahooks'
import dayjs from 'dayjs'
import { FC, useEffect, useMemo, useState } from 'react'
import { Pagination, Selector } from '@nbit/vant'
import { usePageContext } from '@/hooks/use-page-context'
import { baseLayoutStore } from '@/store/layout'
import { FutureHelpCenterEnum } from '@/constants/future/future-const'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import { requestWithLoading } from '@/helper/order'
import { envIsServer } from '@/helper/env'
import { useScaleDom } from '@/hooks/use-scale-dom'
import FutureSelector from '../future-selector'
import styles from './index.module.css'
import commonStyles from '../common.module.css'

function usePriceList(params: IIndexPriceHistoryReq) {
  const defaultData = { data: [], total: 0 }
  const { data: priceList = defaultData, run } = useRequest(
    async () => {
      if (!params.tradePairId) {
        return defaultData
      }
      const res = await requestWithLoading(queryFundingPriceHistory(params))
      if (!res.isOk || !res.data) {
        return defaultData
      }

      return {
        data: res.data.list,
        total: res.data.total,
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
  }, [params, run])

  return priceList
}
function useIngredientList(params: IIndexIngredientReq) {
  const { data: ingredientList = [], run } = useRequest(
    async () => {
      if (!params.tradePairId) {
        return []
      }
      const res = await requestWithLoading(queryIndexIngredientList(params))

      return res.data || []
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    run()
  }, [params, run])

  return ingredientList
}

type IPriceListTableProps = {
  selectedFuture: IFuture
  type: FundingHistoryIndexPriceTypeEnum
}

function PriceListTable({ selectedFuture, type }: IPriceListTableProps) {
  const [page, setPage] = useState(1)
  const params: IIndexPriceHistoryReq = useMemo(() => {
    return {
      tradePairId: selectedFuture?.id,
      pageNum: page,
      type,
    }
  }, [selectedFuture, page, type])
  useUpdateEffect(() => {
    setPage(1)
  }, [selectedFuture, type])
  const priceList = usePriceList(params)
  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [page])
  return (
    <div className={commonStyles['table-wrapper']}>
      <div className="w-full">
        <div className="table-header">
          <div>{t`future.funding-history.index-price.column.time`}</div>
          <div>{getFundingHistoryIndexPriceTypeEnumName(type)}</div>
        </div>
        {priceList.data?.map(item => {
          return (
            <div key={item.timeIndex} className="rv-hairline--bottom table-tr">
              <div>{dayjs(item.timeIndex).format('YYYY-MM-DD HH:mm:ss')}</div>
              <div>
                {item[type]} {selectedFuture?.quoteSymbolName}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          value={page}
          onChange={setPage}
          itemsPerPage={20}
          totalItems={priceList.total}
          showPageSize={5}
          prevText={<Icon className="rotate-180 text-xs" name="next_arrow" hasTheme />}
          nextText={<Icon name="next_arrow" className="text-xs" hasTheme />}
        />
      </div>
    </div>
  )
}
function IngredientTable({ selectedFuture }: IPriceListTableProps) {
  const params: IIndexIngredientReq = useMemo(() => {
    return {
      tradePairId: selectedFuture?.id,
    }
  }, [selectedFuture])
  const ingredientList = useIngredientList(params)
  const { headerData } = baseLayoutStore.getState()
  const tips = [
    t`future.funding-history.index-ingredient.tips.1`,
    t({
      id: 'future.funding-history.index-ingredient.tips.2',
      values: {
        0: headerData?.businessName,
      },
    }),
  ]
  return (
    <div className={commonStyles['table-wrapper']}>
      <div className="w-full">
        <div className="table-header">
          <div>{t`future.funding-history.index-price.ingredient.column.exchange`}</div>
          <div>{t`future.funding-history.index-price.ingredient.column.pair`}</div>
        </div>
        {ingredientList.map(item => {
          return (
            <div key={item.webName} className="rv-hairline--bottom table-tr">
              <div>{item.webName}</div>
              <div>{item.symbol}</div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 px-4">
        {tips.map(tip => {
          return (
            <div key={tip} className="mb-2 text-xs text-text_color_03">
              <Icon name="prompt-symbol" className="mr-2" />
              <span>{tip}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
function usePriceLink(type: FundingHistoryIndexPriceTypeEnum) {
  const indexPriceUrl = useHelpCenterUrl(FutureHelpCenterEnum.indexPrice)
  const markPriceUrl = useHelpCenterUrl(FutureHelpCenterEnum.markPrice)

  return {
    [FundingHistoryIndexPriceTypeEnum.index]: {
      href: indexPriceUrl,
      text: t`future.funding-history.index.index-detail`,
    },
    [FundingHistoryIndexPriceTypeEnum.mark]: {
      href: markPriceUrl,
      text: t`future.funding-history.index.mark-detail`,
    },
  }[type]
}

type IFundingIndexProps = {
  type: FundingHistoryTabIdEnum
  selectedFuture: IFuture
  onChange: (future: IFuture) => any
}
function FundingIndex({ type, selectedFuture, onChange }: IFundingIndexProps) {
  const [selectedPriceType, setSelectedPriceType] = useState<FundingHistoryIndexPriceTypeEnum[]>([
    FundingHistoryIndexPriceTypeEnum.index,
  ])
  const priceTypes = [FundingHistoryIndexPriceTypeEnum.index, FundingHistoryIndexPriceTypeEnum.mark].map(id => {
    return {
      value: id,
      label: getFundingHistoryIndexPriceTypeEnumName(id),
    }
  })
  const onChangePriceTypes = (value: any[]) => {
    // 不允许取消选择
    if (value.length === 0) {
      return
    }
    setSelectedPriceType(value)
  }
  const isIndexPriceType = selectedPriceType[0] === FundingHistoryIndexPriceTypeEnum.index
  const priceLink = usePriceLink(selectedPriceType[0])
  const indexTableTypes = [
    {
      value: 0,
      label: t`future.funding-history.index.table-type.price`,
      component: PriceListTable,
    },
    {
      value: 1,
      label: t`future.funding-history.index.table-type.ingredient`,
      component: IngredientTable,
    },
  ]
  const [selectedTableType, setSelectedTableType] = useState([indexTableTypes[0].value])
  const SelectedTableComponent = isIndexPriceType
    ? indexTableTypes.find(item => item.value === selectedTableType[0])!.component
    : PriceListTable
  const onChangeTableTypes = (value: any[]) => {
    if (value.length === 0) {
      return
    }
    setSelectedTableType(value)
  }
  const pageContext = usePageContext()
  const scaleDomRef = useScaleDom(envIsServer ? 0 : window.innerWidth - 270, null)

  return (
    <div className={styles['index-price-wrapper']}>
      <div className="px-4 flex items-center justify-between">
        <FutureSelector
          defaultId={pageContext.urlParsed.search?.tradeId}
          value={selectedFuture}
          onChange={onChange}
          type={type}
        />
        <div ref={scaleDomRef}>
          <Link href={priceLink.href} className="text-sm text-brand_color whitespace-nowrap">
            {priceLink.text} &gt;
          </Link>
        </div>
      </div>
      <div className="p-4">
        <Selector value={selectedPriceType} onChange={onChangePriceTypes} showCheckMark={false} options={priceTypes} />
      </div>
      {isIndexPriceType && (
        <div className="p-4 pt-0">
          <Selector
            value={selectedTableType}
            onChange={onChangeTableTypes}
            showCheckMark={false}
            options={indexTableTypes}
          />
        </div>
      )}
      <SelectedTableComponent type={selectedPriceType[0]} selectedFuture={selectedFuture} />
    </div>
  )
}

export default FundingIndex
