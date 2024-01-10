import NavBar from '@/components/navbar'
import {
  FundingHistoryTabIdEnum,
  FundingHistoryTypeEnum,
  getFundingHistoryTabIdEnumName,
} from '@/constants/future/funding-history'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { useUpdateEffect } from 'ahooks'
import { FC, useState } from 'react'
import { Selector, Tabs } from '@nbit/vant'
import CommonListEmpty from '@/components/common-list/list-empty'
import { IFuture } from '@/typings/api/future/common'
import { getFutureFundingRatePagePath } from '@/helper/route'
import classNames from 'classnames'
import { useFutureCurrencySettings } from '@/hooks/features/trade'
import FundingRate from './funding-rate'
import FundingIndex from './index'
import InsuranceFund from './insurance-fund'
import styles from './common.module.css'

function getTabAndTypes() {
  const tabs = [FundingHistoryTabIdEnum.usdt, FundingHistoryTabIdEnum.coin].map(id => {
    return {
      id,
      title: getFundingHistoryTabIdEnumName(id),
    }
  })
  const types = [
    {
      value: FundingHistoryTypeEnum.fundingRate,
      label: t`future.funding-history.types.funding-rate`,
      component: FundingRate,
    },
    {
      value: FundingHistoryTypeEnum.index,
      label: t`future.funding-history.types.index`,
      component: FundingIndex,
    },
    {
      value: FundingHistoryTypeEnum.insuranceFund,
      label: t`features_future_funding_history_layout_z9fyut1tbw`,
      component: InsuranceFund,
    },
  ]
  return {
    tabs,
    types,
  }
}

export function FundingHistoryLayout() {
  const { tabs, types } = getTabAndTypes()
  const pageContext = usePageContext()
  const [selectedTabId, setSelectedTabId] = useState<any>(
    !pageContext.urlPathname.includes('quarterly') ? FundingHistoryTabIdEnum.usdt : FundingHistoryTabIdEnum.coin
  )
  const isEmpty = selectedTabId === FundingHistoryTabIdEnum.coin
  const selectedTypeId = [pageContext.routeParams.type] as any[]
  const selectedType = types.find(item => item.value === selectedTypeId[0])!
  const onChangeTypes = (value: any[]) => {
    // 不允许取消选择
    if (value.length === 0) {
      return
    }
    link(
      getFutureFundingRatePagePath({
        type: value[0],
      }),
      {
        overwriteLastHistoryEntry: true,
      }
    )
  }
  useUpdateEffect(() => {
    link(
      getFutureFundingRatePagePath({
        tab: selectedTabId,
      }),
      {
        overwriteLastHistoryEntry: true,
      }
    )
  }, [selectedTabId])
  const [selectedFuture, setSelectedFuture] = useState<IFuture>(null as any)
  useFutureCurrencySettings()

  return (
    <div className="text-sm pb-4">
      <NavBar title={t`future.funding-history.title`} />
      <div className="hidden">
        <Tabs active={selectedTabId} onChange={setSelectedTabId}>
          {tabs.map(tab => {
            return <Tabs.TabPane name={tab.id} key={tab.id} title={tab.title} />
          })}
        </Tabs>
      </div>
      {isEmpty && (
        <div className="py-20">
          <CommonListEmpty />
        </div>
      )}
      {!isEmpty && (
        <>
          <div className={classNames(styles['selector-wrapper'], 'p-4 pb-2')}>
            <Selector value={selectedTypeId} onChange={onChangeTypes} showCheckMark={false} options={types} />
          </div>
          {selectedType && (
            <selectedType.component
              key={selectedType.value}
              selectedFuture={selectedFuture}
              onChange={setSelectedFuture}
              type={selectedTabId}
            />
          )}
        </>
      )}
    </div>
  )
}
