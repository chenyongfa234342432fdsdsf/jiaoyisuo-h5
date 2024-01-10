/**
 * 交易 - 现货交易手续费列表组件
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { Popover, Toast, Sticky } from '@nbit/vant'
import { useRequest, useDebounce, useUpdateEffect } from 'ahooks'
import LazyImage from '@/components/lazy-image'
import CommonList from '@/components/common-list/list'
import { getSymbolLabelInfo } from '@/apis/market'
import { onSortArray } from '@/helper/assets/spot'
import { onCheckStr } from '@/helper/reg'
import { YapiGetV1CoinQueryMainCoinListCoinListData } from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { SearchInput } from '@/features/assets/common/search-input'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { requestWithLoading } from '@/helper/order'
import styles from './index.module.css'

export function SpotFee({
  symbolInfo,
  activeTab,
}: {
  symbolInfo: YapiGetV1CoinQueryMainCoinListCoinListData[]
  activeTab: HelpFeeTabTypeEnum
}) {
  const [list, setList] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState('')
  const debouncedSearchKey = useDebounce(searchKey)
  const [finished, setFinished] = useState(false)

  const { runAsync: queryPairList, loading } = useRequest(
    async () => {
      const res = await requestWithLoading(getSymbolLabelInfo({}), 0)
      const { isOk, data, message = '' } = res || {}
      if (!isOk || !data) {
        setFinished(true)
        Toast.info(message)

        return
      }

      if (data?.list && data.list.length > 0) {
        const newList: any = data.list.sort(onSortArray)
        setList(newList)
      }

      setFinished(true)
    },
    {
      manual: true,
      debounceWait: 300,
    }
  )

  /**
   * 根据币种 symbol 获取 appLogo
   */
  const getLogo = (symbol: string) => {
    if (!symbol || !symbolInfo) {
      return ''
    }

    const coin = symbolInfo.find((item: YapiGetV1CoinQueryMainCoinListCoinListData) => item.symbol === symbol)
    return coin?.appLogo || ''
  }

  /**
   * 过滤列表数据
   */
  const displayList = list.filter((item: any) => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    const { baseSymbolName = '', quoteSymbolName = '' } = item || {}
    return (
      baseSymbolName &&
      quoteSymbolName &&
      (baseSymbolName.toUpperCase().includes(ignoreCaseKey) || quoteSymbolName.toUpperCase().includes(ignoreCaseKey))
    )
  })

  useUpdateEffect(() => {
    activeTab === HelpFeeTabTypeEnum.spot && queryPairList()
  }, [activeTab])

  return (
    <div className={styles['spot-fee-wrapper']}>
      <Sticky offsetTop={44}>
        <div className="page-top">
          <SearchInput
            value={searchKey}
            placeholder={t`features_trade_help_fee_spot_510289`}
            onChange={(val: string) => {
              if (val && !onCheckStr(val)) {
                Toast.info(t`features_trade_help_fee_spot_5101237`)
                return
              }

              setSearchKey(val)
            }}
            maxLength={20}
          />

          <div className="header">
            <div>{t`future.funding-history.index-price.ingredient.column.pair`}</div>
            <Popover
              placement="top-end"
              theme="dark"
              reference={<div className="popover-btn">{t`features_trade_help_fee_spot_510290`}</div>}
            >
              <div className="text-xs text-text_color_05">{t`features_trade_help_fee_spot_5101236`}</div>
            </Popover>
          </div>
        </div>
      </Sticky>

      <CommonList
        finished={finished}
        onLoadMore={queryPairList as any}
        listChildren={displayList.map(item => (
          <div key={item.id} className="fee-item">
            <div className="item-left">
              <LazyImage src={getLogo(item.baseSymbolName)} className="mr-1" width={22} height={22} round />
              <span className="coin-name">
                {item.baseSymbolName || '--'}
                <span className="coin-full-name">{` /${item.quoteSymbolName || '--'}`}</span>
              </span>
            </div>
            <div>{`${item.sellFee * 100}%`}</div>
          </div>
        ))}
        showEmpty={displayList.length === 0}
      />
    </div>
  )
}
