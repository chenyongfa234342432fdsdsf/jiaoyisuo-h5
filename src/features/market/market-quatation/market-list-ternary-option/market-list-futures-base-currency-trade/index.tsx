import { SpotMarketBaseCurrenyEnum, futuresTradeSearchCategoryTab } from '@/constants/market/market-list/market-module'
import { useMarketListStore } from '@/store/market/market-list'
import { Tabs } from '@nbit/vant'

export function TernaryOptionTradeBaseCurrencyTabs() {
  const store = useMarketListStore().ternaryOptionMarketsTradeModule
  const tabList = futuresTradeSearchCategoryTab()

  return (
    <Tabs
      align="start"
      className="tabs-spot-base-currency"
      active={store.selectedBaseCurrencyFilter || SpotMarketBaseCurrenyEnum.favorites}
      onChange={id => {
        store.setSelectedBaseCurrencyFilter(id)
      }}
    >
      {tabList.map(({ title, id }) => (
        <Tabs.TabPane title={title} name={id} key={id} />
      ))}
    </Tabs>
  )
}
