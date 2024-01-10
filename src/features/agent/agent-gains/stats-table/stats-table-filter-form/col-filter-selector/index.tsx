import CommonSelector from '@/components/common-selector'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { t } from '@lingui/macro'
import { isEqual } from 'lodash'
import styles from './index.module.css'

const selectorOptions = () => [
  {
    label: t`features_agent_agent_gains_stats_table_stats_table_filter_form_col_filter_selector_index_5101388`,
    value: 1,
  },
  {
    label: t`assets.coin.overview.detail`,
    value: 2,
  },
]

function ColFilterSelector() {
  const { filterSetting, setFilterSetting } = useAgentStatsStore()
  return (
    <CommonSelector
      className={styles.scoped}
      options={selectorOptions()}
      defaultValue={filterSetting.columnDetails ? [2] : [1]}
      onChange={(arr, extend) => {
        setFilterSetting({ columnDetails: isEqual(arr, [2]) })
      }}
    />
  )
}

export default ColFilterSelector
