/**
 * 手续费率 - 合约交易
 */
import { t } from '@lingui/macro'
import { Popover, Sticky, Toast } from '@nbit/vant'
import { useState } from 'react'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { getPerpetualTradePairList } from '@/apis/future/common'
import CommonList from '@/components/common-list/list'
import LazyImage from '@/components/lazy-image'
import { requestWithLoading } from '@/helper/order'
import { onCheckStr } from '@/helper/reg'
import { useAssetsStore } from '@/store/assets/spot'
import { YapiGetV1CoinQueryMainCoinListCoinListData } from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { getTextFromStoreEnums } from '@/helper/store'
import { decimalUtils } from '@nbit/utils'
import { SearchInput } from '@/features/assets/common/search-input'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function FuturesFee({
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
  const { assetsEnums } = useAssetsStore()

  /**
   * 查询合约列表
   */
  const onLoadList = async () => {
    const res = await requestWithLoading(getPerpetualTradePairList({}), 0)
    const { isOk, data, message = '' } = res || {}
    setFinished(true)
    if (!isOk) {
      Toast.info(message)
      return
    }
    setList(data?.list as YapiGetV1PerpetualTradePairListData[])
  }

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
    const { symbolName } = item || {}
    return symbolName && symbolName.toUpperCase().includes(ignoreCaseKey)
  })

  useUpdateEffect(() => {
    activeTab === HelpFeeTabTypeEnum.futures && onLoadList()
  }, [activeTab])

  return (
    <div className={styles['futures-fee-wrapper']}>
      <Sticky offsetTop={44}>
        <div className="page-top">
          <SearchInput
            value={searchKey}
            placeholder={t`features_trade_help_fee_futures_5101532`}
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
            <div>{t`features_market_activity_market_activity_layout_5101239`}</div>
            <Popover
              placement="top-end"
              theme="dark"
              reference={<div className="popover-btn">{t`features_trade_help_fee_futures_5101533`}</div>}
            >
              <div className="text-xs text-text_color_05 mb-2">{t`features_trade_help_fee_futures_5101534`}</div>
              <div className="text-xs text-text_color_05">{t`features_trade_help_fee_futures_5101535`}</div>
            </Popover>
          </div>
        </div>
      </Sticky>

      <CommonList
        finished={finished}
        onLoadMore={onLoadList}
        listChildren={displayList.map(item => {
          return (
            <div key={item.id} className="futures-info">
              <div className="info-coin">
                <LazyImage src={getLogo(item.baseSymbolName)} width={22} height={22} round />
                <span className="coin-name">{item.symbolName || '--'}</span>
                <div className="futures-type">
                  {getTextFromStoreEnums(item.typeInd || '', assetsEnums.financialRecordTypeSwapList.enums)}
                </div>
              </div>
              <div className="info-fee">
                <span>{`${SafeCalcUtil.mul(item.markerFeeRate, 100)}% / `}</span>
                <span>{`${SafeCalcUtil.mul(item.takerFeeRate, 100)}%`}</span>
              </div>
            </div>
          )
        })}
        showEmpty={displayList.length === 0}
      />
    </div>
  )
}

export { FuturesFee }
