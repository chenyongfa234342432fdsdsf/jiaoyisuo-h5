/**
 * 交易 - 提现手续费列表组件
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { Popover, Sticky, Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import CommonList from '@/components/common-list/list'
import LazyImage from '@/components/lazy-image'
import { getWithdrawsFeeList } from '@/apis/trade'
import { FuturesAssetsSortEnum } from '@/constants/assets/futures'
import { WithdrawsFeeListResp } from '@/typings/api/trade'
import { HelpFeeTabTypeEnum } from '@/constants/trade'
import { onSortArray } from '@/helper/assets/spot'
import { onCheckStr } from '@/helper/reg'

import { SearchInput } from '@/features/assets/common/search-input'
import { requestWithLoading } from '@/helper/order'
import styles from './index.module.css'

export function WithdrawFee({ activeTab }: { activeTab: number }) {
  const [finished, setFinished] = useState(false)
  const [list, setList] = useState<any>([])
  const [sort, setSort] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const debouncedSearchKey = useDebounce(searchKey)

  /**
   * 过滤列表数据
   */
  const displayList = list.filter((item: any) => {
    const ignoreCaseKey = debouncedSearchKey.toUpperCase()
    const { coinName = '' } = item || {}
    return coinName && coinName.toUpperCase().includes(ignoreCaseKey)
  })

  /**
   * 查询提现手续费列表
   */
  const onLoadList = async () => {
    const res = await requestWithLoading(getWithdrawsFeeList({ param: '' }), 0)

    const { isOk, data, message = '' } = res || {}
    if (!isOk || !data) {
      Toast.info(message)
      setFinished(true)
      return
    }

    setList(data)
    setFinished(true)
  }

  /**
   * 排序
   */
  const onSort = async (params: string) => {
    let newSortList: any = []

    if (!params) {
      onLoadList()
      return
    }

    if (params === FuturesAssetsSortEnum.up) {
      newSortList = list.sort(onSortArray)
    }

    if (params === FuturesAssetsSortEnum.down) {
      newSortList = list.sort().reverse(onSortArray)
    }

    setList(newSortList)
  }

  useUpdateEffect(() => {
    activeTab === HelpFeeTabTypeEnum.withdraw && onLoadList()
  }, [activeTab])

  return (
    <div className={styles['withdraw-fee-wrapper']}>
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

          <div className="row heder-text">
            <div className="row-left">
              <span>{t`assets.layout.tabs.coins`}</span>
              <div
                className="sort"
                onClick={() => {
                  let newSort: string = FuturesAssetsSortEnum.up
                  if (sort === FuturesAssetsSortEnum.up) newSort = FuturesAssetsSortEnum.down
                  if (sort === FuturesAssetsSortEnum.down) newSort = ''
                  onSort(newSort)
                  setSort(newSort)
                }}
              >
                {sort === FuturesAssetsSortEnum.up ? (
                  <Icon name="regsiter_icon_away_white_hover" className="sort-icon" />
                ) : (
                  <Icon name="regsiter_icon_away" hasTheme className="sort-icon" />
                )}
                {sort === FuturesAssetsSortEnum.down ? (
                  <Icon name="regsiter_icon_drop_white_hover" className="sort-icon" />
                ) : (
                  <Icon name="regsiter_icon_drop" hasTheme className="sort-icon" />
                )}
              </div>
            </div>

            <div className="row-middle">{t`features_trade_help_fee_withdraw_5101233`}</div>
            <div className="row-right">
              <Popover
                theme="dark"
                placement="top-end"
                reference={<span className="popover-btn">{t`features_trade_help_fee_withdraw_5101234`}</span>}
              >
                <div className="text-xs text-text_color_05">{t`features_trade_help_fee_withdraw_5101235`}</div>
              </Popover>
            </div>
          </div>
        </div>
      </Sticky>

      <CommonList
        finished={finished}
        onLoadMore={onLoadList}
        listChildren={displayList.map((item: WithdrawsFeeListResp, i: number) => {
          const publicChainsList = item.publicChains?.split(',') || []
          const feeList = item.withdrawFees?.split(',') || []

          return (
            <div className="row list-coin" key={i}>
              <div className="row-left">
                <LazyImage src={item.appLogo} width={22} height={22} round />
                <span className="coin-name">{item.coinName || '--'}</span>
              </div>

              <div className="row-middle">
                {publicChainsList.length > 0 &&
                  publicChainsList.map((publicItem: string, index: number) => {
                    return <span key={index}>{publicItem || '--'}</span>
                  })}
              </div>

              <div className="row-right">
                {feeList.length > 0 &&
                  feeList.map((feeItem: any, index: number) => {
                    const fees = feeItem.split(':') || []
                    return (
                      <span key={index}>
                        {fees[0]} {fees[1]}
                      </span>
                    )
                  })}
              </div>
            </div>
          )
        })}
        showEmpty={displayList.length === 0}
      />
    </div>
  )
}
