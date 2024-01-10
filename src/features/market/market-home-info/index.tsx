import { useMarketListStore } from '@/store/market/market-list'
import { createContext, useCallback, useContext, useEffect } from 'react'
import { getHomeModuleTabApi, HomeModuleTabsEnum } from '@/constants/market/market-list/home-module'
import TabSwitch from '@/components/tab-switch'
import { onTradePairClickRedirectCommon } from '@/helper/market'
import Table from '@/components/table'
import { IHomeModuleTabsCommonResp } from '@/typings/api/market/market-list/home-module'
import { mergeTradePairWithSymbolInfo, sortByHelper } from '@/helper/market/market-list'
import { useWsSpotMarketTradePairSlow } from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair'
import { quoteVolumneTableSorter } from '@/constants/market/market-list'
import {
  useWsMarketFuturesUserFavListFullAmount,
  useWsMarketSpotUserFavListFullAmount,
} from '@/hooks/features/market/market-list/use-ws-market-spot-user-favourite-list'
import { FavTabs } from '@/constants/market/market-list/favorite-module'
import { link } from '@/helper/link'
import { getMarketFuturesFavPage, getMarketSpotFavPage } from '@/helper/route'
import { t } from '@lingui/macro'
import { getAuthMarketsModuleStatus } from '@/helper/modal-dynamic'
import useReqeustMarketHelper from '@/hooks/features/market/common/use-request-market'
import commonStyles from '@/features/market/market-quatation/index.module.css'
import useApiAllCoinSymbolInfo from '@/hooks/features/market/common/use-api-all-coin-symbol-info'
import {
  getMarketHomeFavTableColumns,
  getMarketHomeTableColumns,
  getMarketHomeVolumnTableColumns,
  HomeTableFavHeader,
} from '../market-quatation/common/table-columns'
import styles from './index.module.css'
import { MarketFuturesFavoritesDefault, MarketSpotFavoritesDefault } from '../market-quatation/common/market-favorites'

export default function CommmonMarketHomeInfo({ favouriteDefault, redirectOnEmptyLink, favData }) {
  const { getTabsConfig, selectedTab, homeFavType, setTableData, ...store } = useMarketListStore().homeModuleState
  const resolvedData = useWsSpotMarketTradePairSlow({ apiData: store.tableData as IHomeModuleTabsCommonResp[] })
  const symbolInfo = useApiAllCoinSymbolInfo()

  const getTableDataByTab = (tab: HomeModuleTabsEnum) => {
    if (tab !== HomeModuleTabsEnum.fav) return resolvedData

    // limit to 10 favourite items
    return favData?.slice(0, 10) || []
  }

  useEffect(() => {
    if (!selectedTab) return

    if (selectedTab === HomeModuleTabsEnum.topVolume) {
      store.setTableColumn(getMarketHomeVolumnTableColumns())
    } else if (selectedTab === HomeModuleTabsEnum.fav) {
      store.setTableColumn(getMarketHomeFavTableColumns())
    } else {
      store.setTableColumn(getMarketHomeTableColumns())
    }
  }, [selectedTab])

  const apiRequest = (resolve, reject) => {
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
    setApiData: setTableData,
    deps: [selectedTab, symbolInfo.length],
  })

  const tableData = getTableDataByTab(selectedTab)

  if (!getAuthMarketsModuleStatus()) return null

  return (
    <div className={styles.scoped}>
      <div className="market-home-info-wrapper">
        <TabSwitch
          tabList={getTabsConfig() as any}
          defaultId={selectedTab}
          onTabChangeCallback={id => {
            store.setSelectedTab(id)
          }}
        />

        <div className={`${commonStyles['market-table-common']} market-table-home`}>
          {selectedTab === HomeModuleTabsEnum.fav && tableData.length === 0 ? (
            <>
              <HomeTableFavHeader />
              {favouriteDefault}
            </>
          ) : (
            <>
              <Table
                apiStatus={apiStatus}
                onPullRefresh={refresh}
                showTableHeaderWhenEmpty
                sortable={false}
                data={tableData}
                columns={store.tableColumn}
                onRowClick={item => {
                  onTradePairClickRedirectCommon(item, 'kline')
                }}
              />
              {selectedTab === HomeModuleTabsEnum.fav && tableData.length >= 10 && (
                <div
                  onClick={
                    redirectOnEmptyLink()
                    //   () => {
                    //   homeFavType === FavTabs.Spot ? link(getMarketSpotFavPage()) : link(getMarketFuturesFavPage())
                    // }
                  }
                  className="fav-table-more"
                >{t`features_help_center_support_component_support_article_index_5101082`}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SpotMarketHomeInfo() {
  const { resolvedData: spotFavData } = useWsMarketSpotUserFavListFullAmount({ apiParams: {} })
  return (
    <CommmonMarketHomeInfo
      favouriteDefault={<MarketSpotFavoritesDefault />}
      redirectOnEmptyLink={() => link(getMarketSpotFavPage())}
      favData={spotFavData || []}
    />
  )
}

function FuturesMarketHomeInfo() {
  const { resolvedData: futuresFavData } = useWsMarketFuturesUserFavListFullAmount({ apiParams: {} })
  return (
    <CommmonMarketHomeInfo
      favouriteDefault={<MarketFuturesFavoritesDefault />}
      redirectOnEmptyLink={() => link(getMarketFuturesFavPage())}
      favData={futuresFavData || []}
    />
  )
}

export function MarketHomeInfo() {
  const { homeFavType } = useMarketListStore().homeModuleState

  if (homeFavType === FavTabs.Spot) return <SpotMarketHomeInfo />
  if (homeFavType === FavTabs.Futures) return <FuturesMarketHomeInfo />

  return <></>
}
