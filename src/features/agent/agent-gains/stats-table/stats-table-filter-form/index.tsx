import Icon from '@/components/icon'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { t } from '@lingui/macro'
import { Popup } from '@nbit/vant'
import FilterForm from './filter-form'
import styles from './index.module.css'

function StatsTableFilterForm() {
  const { isFilterFormOpen, toggleFilterForm } = useAgentStatsStore()
  return (
    <div className={styles.scoped}>
      <Icon name="asset_record_filter" hasTheme onClick={toggleFilterForm} />
      <Popup
        className={styles['filter-form-popup']}
        visible={isFilterFormOpen}
        title={t`features/assets/financial-record/record-screen-modal/index-0`}
        closeable
        style={{ height: '50%' }}
        position="bottom"
        round
        onClose={toggleFilterForm}
        closeIcon={<Icon name="close" hasTheme />}
      >
        <FilterForm />
      </Popup>
    </div>
  )
}

export default StatsTableFilterForm
