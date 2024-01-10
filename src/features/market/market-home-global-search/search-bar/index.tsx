import DebounceSearchBar from '@/components/debounce-search-bar'
import { useMarketListStore } from '@/store/market/market-list'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { t } from '@lingui/macro'

export default function MarketSearchingBarSpotTrade({ showAction }) {
  const store = useMarketListStore().spotMarketsTradeModule

  return (
    <DebounceSearchBar
      placeholder={t`future.funding-history.search-future`}
      onChange={value => {
        store.setSearchInput(value)
      }}
      toggleFocus={value => {
        store.setIsSearchInputFocused(value)
      }}
      forcedShowAction={showAction}
    />
  )
}

export function MarketSearchingBarGlobal() {
  const store = useMarketListStore()

  return (
    <DebounceSearchBar
      placeholder={
        getAuthModuleStatusByKey(AuthModuleEnum.contract)
          ? t`features_market_market_home_global_search_new_search_bar_index_510296`
          : t`features_market_market_home_global_search_search_bar_index_gbqe8ksys9`
      }
      onChange={value => {
        store.setSearchInput(value)
      }}
      toggleFocus={value => {
        store.setIsSearchInputFocused(value)
      }}
      showAction={false}
    />
  )
}

export function MarketSearchingBarFuturesTrade({ showAction }) {
  const store = useMarketListStore().futuresMarketsTradeModule
  return (
    <DebounceSearchBar
      placeholder={t`future.funding-history.search-future`}
      onChange={value => {
        store.setSearchInput(value)
      }}
      toggleFocus={value => {
        store.setIsSearchInputFocused(value)
      }}
      forcedShowAction={showAction}
    />
  )
}

export function MarketTradeSearchingBar({ showAction, store }) {
  return (
    <DebounceSearchBar
      placeholder={t`future.funding-history.search-future`}
      onChange={value => {
        store.setSearchInput(value)
      }}
      toggleFocus={value => {
        store.setIsSearchInputFocused(value)
      }}
      forcedShowAction={showAction}
    />
  )
}
