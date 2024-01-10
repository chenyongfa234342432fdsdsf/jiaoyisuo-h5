import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { useAutoAddMarginGroups } from '@/hooks/features/trade'
import styles from './index.module.css'

export function AutoAddMarginGroups() {
  const { groups, loading } = useAutoAddMarginGroups()

  const onAdd = () => {
    link('/future/settings/margin/adjust-coin')
  }

  return (
    <div className={styles['auto-add-margin-groups-wrapper']}>
      <div className="text-base font-normal">{t`features_trade_future_settings_margin_auto_detail_group_667`}</div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex-1 flex flex-wrap items-center">
          {groups?.length ? (
            groups.map(group => {
              return (
                <div key={group.id} className="group-item">
                  {group.name}
                </div>
              )
            })
          ) : loading ? null : (
            <span className="text-sm">{t`features_user_personal_center_settings_index_5101268`}</span>
          )}
        </div>
        <div onClick={onAdd} className="text-button">
          <span className="text-button-item">{t`features_trade_future_settings_margin_auto_detail_group_5101371`}</span>
        </div>
      </div>
    </div>
  )
}
