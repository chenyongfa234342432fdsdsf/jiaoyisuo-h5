/**
 * 资产划转 - 选择币种
 */
import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import { useState } from 'react'
import { useDebounce } from 'ahooks'
import NavBar from '@/components/navbar'
import CommonList from '@/components/common-list/list'
import LazyImage from '@/components/lazy-image'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { SearchInput } from '../../../common/search-input'
import styles from './index.module.css'

interface ICoinSelectorProps {
  /** 是否展示 */
  visible: boolean
  /** 币种 ID */
  coinId: string
  /** 关闭 */
  onClose: () => void
  /** 选择币种 */
  onSelect: (e) => void
}

function CoinSelector(props: ICoinSelectorProps) {
  const { visible, coinId, onClose, onSelect } = props || {}
  const { coinList = [] } = useAssetsFuturesStore().assetsTransfer || {}
  const [searchText, setSearchText] = useState('')
  const debounceKey = useDebounce(searchText)

  const filterList = [...coinList].filter(coinItem => {
    const ignoreCaseKey = debounceKey.toUpperCase()
    const { coinName = '' } = coinItem || {}
    return coinName && coinName.toUpperCase().includes(ignoreCaseKey)
  })

  return (
    <Popup
      lockScroll
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
      visible={visible}
      className={styles['coin-selector-root']}
    >
      <NavBar title={t`features_trade_future_settings_margin_records_index_678`} onClickLeft={onClose} />
      <div className="mt-2">
        <SearchInput
          value={searchText}
          placeholder={t`future.funding-history.search-future`}
          onChange={e => setSearchText(e)}
        />
      </div>

      <CommonList
        finished
        showEmpty={filterList.length === 0}
        finishedText={''}
        listChildren={filterList.map(item => {
          return (
            <div className="list-cell" key={item.coinId} onClick={() => onSelect(item)}>
              <LazyImage src={item.appLogo} width={22} height={22} />
              <span className={`name ${coinId === item.coinId && 'name-active'}`}>{item.coinName}</span>
            </div>
          )
        })}
      />
    </Popup>
  )
}

export { CoinSelector }
