/**
 * 代理中心 - 返佣详情
 */
import { Sticky } from '@nbit/vant'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import CommonList from '@/components/common-list/list'
import { formatDate } from '@/helper/date'
import { TypeSelectModal } from '@/features/assets/common/type-select-modal'
import { getTextFromStoreEnums } from '@/helper/store'
import { IAgentRebateList } from '@/typings/api/agent/agent-center/center'
import { onGetAgentCenterRebateDetail } from '@/helper/agent/center'
import { t } from '@lingui/macro'
import uuidGen from '@/helper/uuid'
import { isApp } from '@/helper/is-app'
import { RebateFilterModal } from '../rebate-filter-modal'
import styles from './index.module.css'
import { RebateCell } from '../rebate-cell'

function RebateDetailsLayout() {
  const { rebateDetailForm, rebateList, rebateFinished, agentCenterEnums, rebateProductList, updateRebateDetailForm } =
    useAgentCenterStore()
  const [filterVisible, setFilterVisible] = useState(false)
  const [productVisible, setProductVisible] = useState(false)
  const [offsetTop, setOffsetTop] = useState(0)

  useEffect(() => {
    const timeDiv = document.getElementById('agentCenterTimeSwitch')
    timeDiv && setOffsetTop(timeDiv.clientHeight)
  }, [])

  return (
    <div className={styles['rebate-details-layout']}>
      <Sticky offsetTop={isApp() ? offsetTop : 46 + offsetTop}>
        <div className="rebate-filter-wrap">
          <div className="filter-cell">
            <div className="filter-label">{t`features_agent_agent_gains_stats_table_stats_table_header_index_t3k9nap4n6`}</div>
            <div className="flex items-center" onClick={() => setProductVisible(true)}>
              <div className="filter-label">
                {!rebateDetailForm.productCd
                  ? t`constants_market_market_list_market_module_index_5101071`
                  : `${getTextFromStoreEnums(
                      rebateDetailForm?.productCd,
                      agentCenterEnums.agentProductCdRatioEnum.enums
                    )}`}
              </div>
              <Icon name={productVisible ? 'icon_agent_away' : 'icon_agent_drop'} hasTheme className="sort-icon" />
            </div>
          </div>

          <Icon name="asset_record_filter" hasTheme className="filter-icon" onClick={() => setFilterVisible(true)} />
        </div>
      </Sticky>

      <div className="date-text">
        {formatDate(rebateDetailForm?.startTime || '') || '--'} ~ {formatDate(rebateDetailForm?.endTime || '') || '--'}
      </div>

      <CommonList
        finished={rebateFinished}
        onLoadMore={onGetAgentCenterRebateDetail}
        listChildren={rebateList?.map((rebateData: IAgentRebateList) => {
          return <RebateCell key={uuidGen()} data={rebateData} />
        })}
        showEmpty={rebateList?.length === 0}
        emptyClassName="!py-10"
      />

      {filterVisible && <RebateFilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} />}

      {productVisible && (
        <TypeSelectModal
          type={rebateDetailForm?.productCd || ''}
          typeList={rebateProductList}
          enums={agentCenterEnums.agentProductCdRatioEnum.enums}
          visible={productVisible}
          onClose={() => setProductVisible(false)}
          onScreen={(val: string | number) => {
            rebateDetailForm?.productCd !== val && updateRebateDetailForm({ productCd: `${val}` })
            setProductVisible(false)
          }}
        />
      )}
    </div>
  )
}

export { RebateDetailsLayout }
