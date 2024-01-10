/**
 * 财务记录 - 娱乐区详情
 */
import { t } from '@lingui/macro'
import { useAssetsStore } from '@/store/assets/spot'
import { formatDate } from '@/helper/date'
import styles from '../index.module.css'

function RecreationDetails() {
  const { recordModule } = useAssetsStore()
  const { createdByTime = '--', updatedByTime = '--', projectName = '--' } = recordModule?.assetsRecordDetail || {}

  const infoList = [
    {
      label: t`features_assets_financial_record_record_detail_recreation_details_index_p9y9eq7ekv`,
      content: projectName,
    },
    { label: t`assets.financial-record.creationTime`, content: formatDate(createdByTime) },
    { label: t`assets.financial-record.completionTime`, content: formatDate(updatedByTime) },
  ]
  return (
    <div className={styles['record-details-content-root']}>
      {infoList.map((info, i: number) => {
        return (
          <div className="details-cell" key={i}>
            <div className="info-label">{info.label}</div>
            <div className="info-content">{info.content}</div>
          </div>
        )
      })}
    </div>
  )
}

export { RecreationDetails }
