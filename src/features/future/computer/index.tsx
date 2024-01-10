import NavBar from '@/components/navbar'
import { Tabs } from '@nbit/vant'
import { useMount, useRequest, useUpdateEffect } from 'ahooks'
import { useEffect, useState } from 'react'
import { getPerpetualTradePairDetail, getPerpetualTradePairList } from '@/apis/future/common'
import { requestWithLoading } from '@/helper/order'
import { t } from '@lingui/macro'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import SelectFutureTradePair, { IFuturePair } from './select-pair'
import { futureComputerContext, useFutureComputerContextInTop } from './common/context'
import { Profit } from './profit'
import styles from './index.module.css'
import { ClosePrice } from './close-price'
import { LiquidationPrice } from './liquidation-price'

function ContextWrapper({ children, selectedFuture }) {
  const contextValue = useFutureComputerContextInTop()
  useEffect(() => {
    contextValue.onSelectedFutureChange(selectedFuture)
  }, [selectedFuture])

  return contextValue.tradeInfo.selectedFuture ? (
    <futureComputerContext.Provider value={contextValue}>{children}</futureComputerContext.Provider>
  ) : (
    <></>
  )
}

function FutureComputer() {
  const tabs = [
    {
      title: t`features/assets/financial-record/record-detail/record-details-info/index-12`,
      id: 1,
      component: Profit,
    },
    {
      title: t`features_future_computer_index_9q3e3ep2oexxprflu2u0p`,
      component: ClosePrice,
      id: 2,
    },
    {
      component: LiquidationPrice,
      title: t`features_future_computer_index_7umxmqpwefqektdsnv52f`,
      id: 3,
    },
  ]
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const currentTradeFutureCoin = useTradeCurrentFutureCoin()
  const [selectedFuture, setSelectedFuture] = useState<IFuturePair>(
    currentTradeFutureCoin.symbolName ? (currentTradeFutureCoin as any) : undefined
  )
  const getTradePairDetail = async symbol => {
    if (!symbol) {
      return
    }
    const { isOk, data } = await requestWithLoading(getPerpetualTradePairDetail({ symbol }))
    if (isOk && data) {
      setSelectedFuture(data)
    }
  }
  const { run, data: pairList = [] } = useRequest(
    async () => {
      const fn = async () => {
        const res = await getPerpetualTradePairList({})
        if (res.isOk && res.data?.list) {
          if (!selectedFuture) {
            await getTradePairDetail(res.data?.list?.[0]?.symbolName)
          }
          return res.data.list
        }
        return []
      }
      return await requestWithLoading(fn())
    },
    {
      manual: true,
    }
  )
  useMount(run)

  return (
    <div className="text-sm pb-24 text-leading-1-5">
      <NavBar title={t`store_home_config_index_510114`} />
      <Tabs active={activeTab} onChange={(name: any) => setActiveTab(name)} align="start">
        {tabs.map(tab => {
          return <Tabs.TabPane key={tab.id} name={tab.id} title={tab.title} />
        })}
      </Tabs>
      <div className="p-4">
        <SelectFutureTradePair
          list={pairList}
          value={selectedFuture as any}
          onChange={value => {
            getTradePairDetail(value.symbolName!)
          }}
        />
      </div>
      {selectedFuture && (
        <Tabs
          className={styles['hide-tab-nav']}
          active={activeTab}
          onChange={(name: any) => setActiveTab(name)}
          align="start"
        >
          {tabs.map(tab => {
            return (
              <Tabs.TabPane key={tab.id} name={tab.id} title={tab.title}>
                <ContextWrapper selectedFuture={selectedFuture}>
                  <tab.component />
                </ContextWrapper>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}

export default FutureComputer
