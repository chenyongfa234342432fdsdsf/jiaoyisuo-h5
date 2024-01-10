import Icon from '@/components/icon'
import { Optional } from '@/features/market/market-home-global-search'
import { Popup } from '@nbit/vant'
import { useMarketListStore } from '@/store/market/market-list'
import styles from '@/features/market/market-home-global-search/index.module.css'
import { FuturesMarketBaseCurrenyEnum } from '@/constants/market/market-list/market-module'
import { MarketTradeSearchingBar } from '@/features/market/market-home-global-search/search-bar'
import {
  MarketListTradeTernaryOptionTableContent,
  MarketTradeSearchTernaryOptionTradeTable,
} from '@/features/market/market-quatation/common/market-list/market-list-table-content-trade'
import { MarketTernaryOptionListTableFavourites } from '@/features/market/market-quatation/common/market-list/market-list-table-favourites'
import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import { TernaryOptionTradeBaseCurrencyTabs } from '@/features/market/market-quatation/market-list-ternary-option/market-list-futures-base-currency-trade'
import { t } from '@lingui/macro'

/** 三元期权交易搜索模块 */
export function MarketTradePopoverContentTernaryOption({ from }: { from?: 'kline' | 'trade' }) {
  const titleName = t`features_market_market_home_global_search_market_trade_search_ternary_option_index_gg3hfqd6hi`
  const marketListStore = useMarketListStore()
  const currentStore = marketListStore.ternaryOptionMarketsTradeModule
  const { searchInput, isSearchInputFocused, ...store } = marketListStore.ternaryOptionMarketsTradeModule

  const isSearching = searchInput && searchInput.trim()
  const isJustFocused = isSearchInputFocused && !isSearching
  const isDefault = !isJustFocused && !isSearching
  const isFavTab = isDefault && store.selectedBaseCurrencyFilter === FuturesMarketBaseCurrenyEnum.favorites

  // 用于 just focused 状态时界面的判断点击事件，以免回到默认状态
  const justFocusedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isJustFocused) return

    justFocusedRef.current?.addEventListener('mousedown', e => {
      // mousedown event 优先级高于 onBlur，停止防止搜索 onBlur event 导致 state 变化
      e.preventDefault()
    })

    return () => {
      justFocusedRef.current?.removeEventListener('mousedown', () => {})
    }
  }, [justFocusedRef, isJustFocused])

  return (
    <div className={`${styles['market-search-common']} ${styles['trade-market-search-wrapper']}`}>
      <div className="title">{titleName}</div>

      <div className="search-bar-trade">
        <MarketTradeSearchingBar showAction={!!isJustFocused} store={currentStore} />
      </div>

      <Optional isRender={isDefault || isJustFocused}>
        <div className="on-default">
          <div className="base-currency-panel">
            <div className="base-currency-select">
              <TernaryOptionTradeBaseCurrencyTabs />
            </div>
            <div className="h-3"></div>
            <div className="deault-content-wrapper">
              <div className={classNames('fav-table', { hidden: !isFavTab })}>
                <MarketTernaryOptionListTableFavourites from="trade" />
              </div>
              <div className={classNames('market-list-trade-search-table-content', { hidden: isFavTab })}>
                <MarketListTradeTernaryOptionTableContent to={from} />
              </div>
            </div>
          </div>
        </div>
      </Optional>
      {/* <Optional isRender={!!isJustFocused}>
        <div className="on-focus" ref={justFocusedRef}>
          <div className="selected-coin-history-panel">
            <MarketFuturesTradeSearchHistory from={'trade'} />
          </div>
          <div className="spot-hot-table">
            <div className="spot-hot-table-content">
              <FuturesHotSearching from={from === 'trade' ? 'trade' : 'kline'} />
            </div>
          </div>
        </div>
      </Optional> */}
      <Optional isRender={!!isSearching}>
        <div className="on-result">
          <div className="spot-trade-search-table">
            <MarketTradeSearchTernaryOptionTradeTable from={from === 'trade' ? 'trade' : 'kline'} />
          </div>
        </div>
      </Optional>
    </div>
  )
}

export const MarketTradeSearchTernaryOption = (props: { from?: 'kline' | 'trade' }) => {
  const store = useMarketListStore().ternaryOptionMarketsTradeModule

  return (
    <>
      <Icon
        className="scale-75 text-xs"
        name="regsiter_icon_drop"
        hasTheme
        hiddenMarginTop
        onClick={() => {
          store.setIsSearchPopoverVisible(true)
        }}
      />

      <Popup
        destroyOnClose
        visible={store.isSearchPopoverVisible}
        position="left"
        style={{ width: '80%', height: '100%' }}
        onClose={() => {
          store.resetSearchState()
        }}
        className={`${styles['market-trade-popover']}`}
        duration={0.15}
      >
        <MarketTradePopoverContentTernaryOption from={props.from} />
      </Popup>
    </>
  )
}
