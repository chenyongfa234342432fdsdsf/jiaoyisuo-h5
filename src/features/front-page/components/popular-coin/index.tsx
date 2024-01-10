import Table from '@/components/table'
import { quoteVolumneTableSorter } from '@/constants/market/market-list'
import { HomeModuleTabsEnum, getHomeModuleTabApi } from '@/constants/market/market-list/home-module'
import FrontPageContainer from '@/features/front-page/common/container'
import { getHomePopularTableColumns } from '@/features/market/market-quatation/common/table-columns'
import { onTradePairClickRedirectCommon } from '@/helper/market'
import { mergeTradePairWithSymbolInfo, sortByHelper } from '@/helper/market/market-list'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import useReqeustMarketHelper from '@/hooks/features/market/common/use-request-market'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { Swiper } from '@nbit/vant'
import { isEmpty } from 'lodash'
import { AuthModuleEnum, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import { useWsSpotMarketTradePairSlow } from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair'
import { IHomeModuleTabsCommonResp } from '@/typings/api/market/market-list/home-module'
import styles from './index.module.css'

function FrontPagePopularCoin() {
  const [tableData, settableData] = useState([])
  const resolvedData = useWsSpotMarketTradePairSlow({ apiData: tableData as IHomeModuleTabsCommonResp[] })
  const symbolInfo = useApiAllCoinSymbolInfo()
  const apiRequest = (resolve, reject) => {
    const selectedTab = HomeModuleTabsEnum.topVolume
    getHomeModuleTabApi(selectedTab)({}).then(res => {
      if (res.isOk) {
        let data = res.data.list || []
        if (selectedTab === HomeModuleTabsEnum.topVolume) {
          return resolve(mergeTradePairWithSymbolInfo(sortByHelper(data, quoteVolumneTableSorter), symbolInfo))
        }

        return resolve(mergeTradePairWithSymbolInfo(data, symbolInfo))
      }

      return reject()
    })
  }

  // add apiStatus to handle tab change
  const { refreshCallback: refresh, apiStatus } = useReqeustMarketHelper({
    apiRequest,
    setApiData: settableData,
    deps: [symbolInfo.length],
  })

  const formattedTableData = [[...resolvedData.slice(0, 5)], [...resolvedData.slice(5)]]

  if (!getAuthModuleStatusByKey(AuthModuleEnum.spot)) return null

  return (
    <FrontPageContainer
      className={styles.scoped}
      title={<span className="capitalize">{t`features_front_page_components_popular_coin_index_ycxx3ltwan`}</span>}
    >
      {!isEmpty(formattedTableData) && (
        <Swiper>
          {formattedTableData?.map((each, idx) => (
            <Swiper.Item key={idx}>
              <Table
                apiStatus={apiStatus}
                onPullRefresh={refresh}
                showTableHeaderWhenEmpty
                sortable={false}
                data={each}
                columns={getHomePopularTableColumns()}
                onRowClick={item => {
                  onTradePairClickRedirectCommon(item, 'kline')
                }}
              />
            </Swiper.Item>
          ))}
        </Swiper>
      )}
    </FrontPageContainer>
  )
}

export default FrontPagePopularCoin
