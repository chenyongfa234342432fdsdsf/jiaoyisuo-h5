import { quoteVolumneTableSorter } from '@/constants/market/market-list'
import { getTernaryOptionTabs } from '@/constants/market/market-list/futures-module'
import {
  FuturesMarketBaseCurrenyEnum,
  MarketLisModulesEnum,
  SpotMarketSectorCategoryEnum,
} from '@/constants/market/market-list/market-module'
import { MarketTradeSearchTernaryOption } from '@/features/market/market-home-global-search/market-trade-search-ternary-option'
import { getMarketTradeSearchCache, setMarketTradeSearchCache } from '@/helper/cache'
import { getStateByModulePath, setStateByModulePath } from '@/helper/store'
import { ColumnSort } from '@tanstack/react-table'
import { uniqBy } from 'lodash'

export default function (set, get) {
  const boundSet = setStateByModulePath.bind(null, set, [MarketLisModulesEnum.ternaryOptionMarketsTrade])
  const boundGet = getStateByModulePath.bind(null, get, [MarketLisModulesEnum.ternaryOptionMarketsTrade])

  return {
    selectedCategroyFilter: SpotMarketSectorCategoryEnum.total,
    setSelectedCategroyFilter(tab) {
      boundSet('selectedCategroyFilter', tab)
    },
    // 自选 全部
    getBaseCurrencyTab: getTernaryOptionTabs,
    selectedBaseCurrencyFilter: FuturesMarketBaseCurrenyEnum.total,
    setSelectedBaseCurrencyFilter(tab) {
      boundSet('selectedBaseCurrencyFilter', tab)
    },

    searchInput: '',
    setSearchInput(val: string) {
      boundSet('searchInput', String(val).trim())
    },
    isSearchPopoverVisible: false,
    setIsSearchPopoverVisible(val: boolean) {
      boundSet('isSearchPopoverVisible', val)
    },
    isSearchInputFocused: false,
    setIsSearchInputFocused(value: boolean) {
      boundSet('isSearchInputFocused', value)
    },
    resetSearchState() {
      boundSet('searchInput', '')
      boundSet('isSearchInputFocused', false)
      boundSet('isSearchPopoverVisible', false)
    },
    defaultSorter: quoteVolumneTableSorter,
    currentSorter: quoteVolumneTableSorter,
    setTableSorter(sorter: ColumnSort) {
      boundSet('currentSorter', sorter)
    },

    searchHistory: getMarketTradeSearchCache(MarketLisModulesEnum.ternaryOptionMarketsTrade) || [],
    setsearchHistory(val) {
      const cur = boundGet('searchHistory')
      const newHistory = uniqBy([val, ...cur].slice(0, 6), x => x.id)
      boundSet('searchHistory', newHistory)
      setMarketTradeSearchCache(newHistory, MarketLisModulesEnum.ternaryOptionMarketsTrade)
    },
    cleanSearchHistory() {
      boundSet('searchHistory', [])
      setMarketTradeSearchCache([], MarketLisModulesEnum.ternaryOptionMarketsTrade)
    },

    TradeSearchComponent: MarketTradeSearchTernaryOption,
  }
}
