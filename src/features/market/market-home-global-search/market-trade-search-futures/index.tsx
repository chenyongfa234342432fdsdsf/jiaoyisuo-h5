import Icon from '@/components/icon'
import { MarketTradePopoverContentFutures } from '@/features/market/market-home-global-search'
import { Popup } from '@nbit/vant'
import { useMarketListStore } from '@/store/market/market-list'
import styles from '@/features/market/market-home-global-search/index.module.css'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'

export const MarketSearchFeatureFuturesTrade = (props: { from?: 'kline' | 'trade' }) => {
  const store = useMarketListStore().futuresMarketsTradeModule

  return (
    <>
      <Icon
        className="common-icon"
        name="contract_switch"
        hasTheme
        onClick={() => {
          store.setIsSearchPopoverVisible(true)
        }}
        id={GUIDE_ELEMENT_IDS_ENUM.futureCoinMenu}
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
        <MarketTradePopoverContentFutures from={props.from} />
      </Popup>
    </>
  )
}
