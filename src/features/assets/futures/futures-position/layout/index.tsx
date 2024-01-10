/**
 * 合约-当前仓位/历史仓位
 */
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { FuturesPositionLayoutTabEnum } from '@/constants/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { useGetWsPositionChange } from '@/hooks/features/assets/futures'
import { FuturesPositionHistory } from '../history-list'
import { HistoryPositionFilter } from '../history-filter'
import styles from './index.module.css'
import { FuturesPositionList } from '../../common/futures-position-list'

function FuturesPositionLayout() {
  const { positionListFutures, futuresPosition, updateFuturesPosition, fetchFuturesEnums } =
    useAssetsFuturesStore() || {}
  const { activeTab, historyForm } = futuresPosition || {}
  const [filterVisible, setFilterVisible] = useState(false)
  useGetWsPositionChange()

  const tabs = [
    {
      label: t({
        id: 'features_assets_futures_futures_position_layout_index_8tyll5lnnn',
        values: { 0: positionListFutures.length },
      }),
      id: FuturesPositionLayoutTabEnum.current,
    },
    {
      label: t`modules_assets_futures_futures_position_index_page_tr4wznwa_d`,
      id: FuturesPositionLayoutTabEnum.history,
    },
  ]

  useEffect(() => {
    fetchFuturesEnums()
  }, [])

  return (
    <div className={styles['futures-position-root']}>
      <NavBar
        title={
          <div className="header">
            {tabs.map(tabsItem => {
              return (
                <div
                  key={tabsItem.id}
                  className="header-cell"
                  onClick={() => updateFuturesPosition({ activeTab: tabsItem.id })}
                >
                  <span className={`header-cell-title ${activeTab === tabsItem.id && 'header-cell-title-active'}`}>
                    {tabsItem.label}
                  </span>
                  <div className={`header-cell-line ${activeTab !== tabsItem.id && 'invisible'}`} />
                </div>
              )
            })}
          </div>
        }
        right={
          activeTab === FuturesPositionLayoutTabEnum.history ? (
            <Icon name="asset_record_filter" hasTheme className="text-xl" onClick={() => setFilterVisible(true)} />
          ) : null
        }
      />

      {activeTab === FuturesPositionLayoutTabEnum.current && <FuturesPositionList />}
      {activeTab === FuturesPositionLayoutTabEnum.history && <FuturesPositionHistory />}

      {filterVisible && (
        <HistoryPositionFilter
          visible={filterVisible}
          historyForm={historyForm}
          onClose={() => setFilterVisible(false)}
          onChange={val => updateFuturesPosition({ historyForm: val })}
        />
      )}
    </div>
  )
}

export { FuturesPositionLayout }
