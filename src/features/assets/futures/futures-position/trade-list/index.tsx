/**
 * 历史仓位 - 合约交易对列表
 */

import { Cell, IndexBar, IndexBarInstance, Popup } from '@nbit/vant'
import { SearchInput } from '@/features/assets/common/search-input'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'ahooks'
import NavBar from '@/components/navbar'
import { requestWithLoading } from '@/helper/order'
import { getPerpetualTradePairList } from '@/apis/future/common'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import LazyImage from '@/components/lazy-image'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface IHistoryPositionTradeListProps {
  visible: boolean
  activeTrade: YapiGetV1PerpetualTradePairListData
  onBack: () => void
  onChange: (e: YapiGetV1PerpetualTradePairListData) => void
}
function HistoryPositionTradeList(props: IHistoryPositionTradeListProps) {
  const { visible, activeTrade, onBack, onChange } = props || {}
  const [symbolName, setSymbolName] = useState('')
  const indexBarRef = useRef<IndexBarInstance>(null)
  const indexRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState<string | number>('')
  const [tradeList, setTradeList] = useState<YapiGetV1PerpetualTradePairListData[]>([])

  const indexList = [] as any
  const charCodeOfA = 'A'.charCodeAt(0)
  for (let i = 0; i < 26; i += 1) {
    indexList.push(String.fromCharCode(charCodeOfA + i))
  }

  /**
   * 搜索合约
   */
  const debouncedSearchKey = useDebounce(symbolName)
  const searchList = tradeList.filter((item: YapiGetV1PerpetualTradePairListData) => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    const { symbolName: name = '', symbolWassName = '' } = item || {}
    return (
      name &&
      symbolWassName &&
      (name?.toUpperCase()?.includes(ignoreCaseKey) || symbolWassName?.toUpperCase()?.includes(ignoreCaseKey))
    )
  })

  const onRenderListItem = row => {
    return (
      <div key={row.id}>
        <Cell
          onClick={() => onChange(row)}
          title={
            <div className="currency-item">
              <div className={`name ${activeTrade?.id === row.id && 'active'}`}>{row.symbolName}</div>
            </div>
          }
          icon={<LazyImage src={row.appLogo} width={22} height={22} round />}
        />
      </div>
    )
  }

  /**
   * 查询所有合约交易对列表
   */
  const onLoadList = async () => {
    const res = await getPerpetualTradePairList({})

    const { isOk, data } = res || {}
    if (!isOk || !data) return
    setTradeList(data?.list || [])
  }

  useEffect(() => {
    requestWithLoading(onLoadList(), 0)
  }, [])

  return (
    <Popup
      visible={visible}
      className={styles['history-position-trade-list-root']}
      overlay={false}
      destroyOnClose
      closeOnPopstate
      safeAreaInsetBottom
    >
      <NavBar title={t`features_trade_contract_contract_trade_pair_index_5101507`} onClickLeft={onBack} />
      <div className="search-cell">
        <SearchInput
          placeholder={t`features_trade_contract_contract_trade_pair_index_5101506`}
          value={symbolName}
          onChange={setSymbolName}
        />
      </div>

      <div className={'content'}>
        <div
          className={`all ${!activeTrade?.id && 'active'}`}
          onClick={() => onChange({} as YapiGetV1PerpetualTradePairListData)}
        >
          {t`assets.withdraw.form.count.withdraw-all`}
        </div>

        <IndexBar
          ref={indexBarRef}
          stickyOffsetTop={80}
          sticky={false}
          indexList={symbolName ? [] : indexList}
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
              return listItem?.symbolName?.slice(0, 1).toUpperCase() === val
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
    </Popup>
  )
}

export { HistoryPositionTradeList }
