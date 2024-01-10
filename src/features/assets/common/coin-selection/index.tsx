/**
 * 资产 - 充提币 - 币种选择列表组件
 */
import { t } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'
import NavBar from '@/components/navbar'
import { Cell, IndexBar, IndexBarInstance, Popup } from '@nbit/vant'
import { getQueryCoinPageList } from '@/apis/assets/common'
import { AssetsQueryCoinPageListCoinListResp } from '@/typings/api/assets/assets'
import {
  AssetsCoinRemindSettingTypeEnum,
  AssetsWithdrawTypeEnum,
  MainTypeDepositTypeEnum,
  MainTypeWithdrawTypeEnum,
} from '@/constants/assets'
import LazyImage from '@/components/lazy-image'
import { useDebounce } from 'ahooks'
import { onSortArray } from '@/helper/assets/spot'
import { checkIndexBar } from '@/helper/reg'
import { requestWithLoading } from '@/helper/order'
import { getAssetsDepositType } from '@/constants/assets/common'
import { useAssetsStore } from '@/store/assets/spot'
import Icon from '@/components/icon'
import { SearchInput } from '../search-input'
import { WithdrawTypeModal } from '../../withdraw/type-modal'
import styles from './index.module.css'

interface CoinSelectionProps {
  title?: string
  /** 币种选择来源（提现/充值） */
  pageType: number
  /** 加载完毕后是否设置第一个币种为被选项 */
  setFirstWhenLoaded?: boolean
  activeCoin?: string
  /** 提币类型 */
  withdrawType?: number
  /** 回退 */
  onBack?: () => void
  onCoinChange: (coin: ICoin, type?: number) => void
}
export type ICoin = AssetsQueryCoinPageListCoinListResp

function CoinSelection({
  title = t`assets.withdraw.form.coin.label`,
  pageType,
  onCoinChange,
  setFirstWhenLoaded,
  onBack,
  activeCoin = '',
  withdrawType = AssetsWithdrawTypeEnum.platform,
}: CoinSelectionProps) {
  const { coinSearchHistory, updateCoinSearchHistory } = { ...useAssetsStore().withdrawModule } || {}
  const [searchKey, setSearchKey] = useState('')
  const [hotList, setHotList] = useState<ICoin[]>([])
  const [coinList, setCoinList] = useState<ICoin[]>([])
  const [activeIndex, setActiveIndex] = useState<string | number>('')
  const indexBarRef = useRef<IndexBarInstance>(null)
  const indexRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false) // 是否显示提币类型弹窗
  // 当前币种
  const [currentCoin, setCurrentCoin] = useState<ICoin>({} as ICoin)
  const historyList = coinSearchHistory[getAssetsDepositType(pageType)] || [] // 搜索历史

  /**
   * 搜索币种
   */
  const debouncedSearchKey = useDebounce(searchKey)
  const searchList = coinList.filter((item: AssetsQueryCoinPageListCoinListResp) => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    const { coinName = '', coinFullName = '' } = item || {}
    return (
      coinName &&
      coinFullName &&
      (coinName?.toUpperCase().includes(ignoreCaseKey) || coinFullName?.toUpperCase().includes(ignoreCaseKey))
    )
  })

  const otherList = coinList.filter((item: AssetsQueryCoinPageListCoinListResp) => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    return !checkIndexBar(item.coinName?.slice(0, 1)) && item.coinName?.toUpperCase().includes(ignoreCaseKey)
  })

  /**
   * 获取全部主币列表
   */
  const onLoadCoinList = async () => {
    const res = await getQueryCoinPageList({ name: searchKey, type: pageType })
    const { isOk, data } = res || {}
    const { coinList: rList = [] } = data || {}

    if (!isOk || !data) return
    if (pageType && rList.length > 0) {
      const hList = rList.filter((listItem: any) => {
        return listItem.isPopular === 1
      })

      setHotList(hList)
    }

    const newCoinList = rList.sort(onSortArray)
    setCoinList(newCoinList)
  }

  // 设置选中的币种信息
  const selectCoin = (coin: ICoin) => {
    const newHistoryList = [...historyList]
    const isExist = historyList.some(item => item.id === coin.id)
    if (!isExist) {
      if (newHistoryList.length === 8) newHistoryList.pop()
      updateCoinSearchHistory(getAssetsDepositType(pageType), [coin, ...newHistoryList])
    }

    if (pageType === AssetsCoinRemindSettingTypeEnum.withdraw) {
      if (!withdrawType) {
        setTypeVisible(true)
        setCurrentCoin(coin)
      } else {
        onCoinChange(coin)
      }

      return
    }

    onCoinChange(coin)
  }

  // 充值暂停状态样式
  const getRechargeStateCss = availableState => (availableState ? '' : 'available-stop')

  const indexList = [] as any
  const charCodeOfA = 'A'.charCodeAt(0)
  for (let i = 0; i < 26; i += 1) {
    indexList.push(String.fromCharCode(charCodeOfA + i))
  }

  useEffect(() => {
    setVisible(true)
    requestWithLoading(onLoadCoinList(), 0)

    if (setFirstWhenLoaded) {
      selectCoin(coinList[0])
    }
  }, [])

  const onRenderListItem = row => {
    let isAvailable = true
    if (pageType) {
      isAvailable =
        pageType === AssetsCoinRemindSettingTypeEnum.withdraw
          ? row.isWithdraw === MainTypeWithdrawTypeEnum.yes
          : row.isDeposit === MainTypeDepositTypeEnum.yes
    }
    return (
      <div key={row.id}>
        <Cell
          className={getRechargeStateCss(isAvailable)}
          onClick={() => selectCoin(row)}
          title={
            <div className="currency-item">
              <div className={`name ${activeCoin === row.id && 'active'}`}>{row.coinName}</div>
              <div className={`desc ${activeCoin === row.id && 'active'}`}>{row.coinFullName}</div>
              {!isAvailable && <div className="state">{t`assets.common.coin-list.paused`}</div>}
            </div>
          }
          icon={<LazyImage src={row.appLogo} width={22} height={22} round />}
        />
      </div>
    )
  }

  return (
    <Popup
      visible={visible}
      className={styles['coin-select-list-root']}
      overlay={false}
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
    >
      <>
        <div className={'coin-select-list-content'}>
          <NavBar title={title} onClickLeft={() => (activeCoin ? onBack && onBack() : history.back())} />
          <div className="search-cell">
            <SearchInput
              placeholder={t`features/assets/common/coin-list/index-0`}
              value={searchKey}
              onChange={setSearchKey}
            />
          </div>

          {historyList.length > 0 && (
            <div className="history">
              <div className="history-header">
                <span className="history-header-title">{t`features_market_market_home_global_search_new_coin_selected_history_index_510294`}</span>
                <Icon
                  name="delete"
                  hasTheme
                  className="text-lg"
                  onClick={() => updateCoinSearchHistory(getAssetsDepositType(pageType), [])}
                />
              </div>

              <div className="hot-list">
                {historyList.map(hotItem => {
                  return (
                    <div className="hot-list-item" key={hotItem.id} onClick={() => selectCoin(hotItem)}>
                      {hotItem.coinName}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {hotList.length > 0 && (
            <div className="hot-currency">
              <span className="hot-title">{t`features/assets/common/coin-list/index-1`}</span>
              <div className="hot-list">
                {hotList.map(hotItem => {
                  return (
                    <div className="hot-list-item" key={hotItem.id} onClick={() => selectCoin(hotItem)}>
                      {hotItem.coinName}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {otherList &&
            otherList.map(otherItem => {
              return onRenderListItem(otherItem)
            })}

          <IndexBar
            ref={indexBarRef}
            stickyOffsetTop={80}
            sticky={false}
            indexList={searchKey ? [] : indexList}
            itemRender={item => {
              return (
                <div
                  onClick={() => {
                    indexRef.current = item
                    setActiveIndex(item)
                    indexBarRef.current?.scrollTo(item)
                  }}
                  className={`index-bar ${activeIndex === item && 'index-active'}`}
                >
                  {item}
                </div>
              )
            }}
            onChange={(index: number | string) => {
              setActiveIndex(indexRef.current || index || indexList[0])
              indexRef.current = null
            }}
          >
            {indexList.map((val: string) => {
              // 过滤对应索引的数据
              const filterList = searchList.filter((listItem: any) => {
                return listItem.coinName.slice(0, 1).toUpperCase() === val
              })

              return (
                <div key={val}>
                  <IndexBar.Anchor index={val} />
                  {filterList.map(item => {
                    return onRenderListItem(item)
                  })}
                </div>
              )
            })}
          </IndexBar>
        </div>

        <WithdrawTypeModal
          visible={typeVisible}
          type={withdrawType || AssetsWithdrawTypeEnum.platform}
          onClose={() => setTypeVisible(false)}
          onConfirm={(e: number) => onCoinChange(currentCoin, e)}
        />
      </>
    </Popup>
  )
}

export default CoinSelection
