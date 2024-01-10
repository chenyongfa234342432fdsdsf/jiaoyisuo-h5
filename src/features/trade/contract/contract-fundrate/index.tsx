import { memo } from 'react'
import CommonList from '@/components/common-list/list'
import { replaceEmpty } from '@/helper/filters'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { t } from '@lingui/macro'
import { useUpdateEffect } from 'ahooks'
import { getFundingRateList } from '@/apis/future/common'
import { link } from '@/helper/link'
import { formatDate } from '@/helper/date'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { useLoadMore } from '@/hooks/use-load-more'
import Icon from '@/components/icon'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getSpotFiltersModalDefaultParams } from '../contract-history/spot-filters-modal'
import { useContractElements } from '../contract-elements/useContractElements'
import styles from './index.module.css'
import { CapitalSelectParams } from '../contract'

type Props = {
  capitalSelectParams: CapitalSelectParams
}

function ContractFundrate(props: Props) {
  const { capitalSelectParams } = props

  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()

  const { typeInd } = useTradeCurrentFutureCoin()

  const { getTypeIndName } = useContractElements()

  const goToFundrateDetail = fundrate => {
    link(
      `/future/future-fundrecord-detail?fundingRateId=${fundrate.id}&positionId=${fundrate.positionId}&endTime=${fundrate.finishedByTimeLong}&createTime=${fundrate.createdByTimeLong}&symbol=${fundrate.symbol}&symbolType=${fundrate.contractType}`
    )
  }

  const {
    list,
    loadMore,
    finished,
    refresh: refreshList,
  } = useLoadMore({
    async fetchData(page) {
      const res = await getFundingRateList({
        ...capitalSelectParams,
        pageNum: String(page),
      })
      if (!res.isOk || !res.data || !res.data.list) {
        return
      }
      return res.data.list
    },
  })

  const refresh = async () => {
    return refreshList()
  }

  useUpdateEffect(() => {
    refresh()
  }, [capitalSelectParams])

  return (
    <div className={styles.scope}>
      <CommonList
        refreshing
        emptyClassName="pt-8 pb-20"
        onRefreshing={refresh}
        onLoadMore={loadMore}
        finished={finished}
        listChildren={undefined}
        showEmpty={list.length === 0}
        emptyText={t`features_trade_contract_contract_order_detail_index_dseufgo9kp6zfkapuca5a`}
      >
        {list?.map(item => {
          return (
            <div className="contract-fundrate-list" key={item.id} onClick={() => goToFundrateDetail(item)}>
              <div className="px-4">
                <div className="contract-fundrate-label">
                  <span>{t`future.funding-history.funding-rate.column.time`}</span>
                  <span>{formatDate(item?.createdByTimeLong as number)}</span>
                </div>
                <div className="contract-fundrate-label">
                  <span>{t`assets.layout.tabs.contract`}</span>
                  <span>
                    {replaceEmpty(item?.symbol)} {typeInd && getTypeIndName[typeInd]} <Icon name="next_arrow_white" />
                  </span>
                </div>
                <div className="contract-fundrate-label">
                  <span>{t`features_trade_contract_contract_fundrate_index_ekr_nqnl4uotjydjdazgb`}</span>
                  <span>
                    {formatNumberDecimal(item?.amount || '', offset)} {item?.quoteSymbolName}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CommonList>
    </div>
  )
}

export default memo(ContractFundrate)
