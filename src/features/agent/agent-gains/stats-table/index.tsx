import Table from '@/components/table'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { getStatsDetailsTableCols, getStatsTableCols } from './stats-table-col'
import styles from './index.module.css'
import StatsTableHeader from './stats-table-header'

function StatsTable({ data, setData, apiStatus, refresh, finished }) {
  const { filterSetting } = useAgentStatsStore()

  return (
    <div className={styles.scoped}>
      <StatsTableHeader />
      <Table
        data={data}
        setData={setData}
        apiStatus={apiStatus}
        onPullRefresh={refresh}
        columns={filterSetting.columnDetails ? getStatsDetailsTableCols() : getStatsTableCols()}
        showLoader
        finished={finished}
      />
    </div>
  )
}

export default StatsTable
