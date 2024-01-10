/**
 * 财务记录 - 列表 - 筛选组件
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useAssetsStore } from '@/store/assets/spot'
import { getTextFromStoreEnums } from '@/helper/store'
import { AssetsRecordTypeEnum } from '@/constants/assets/common'
import { FinancialRecordRouteEnum } from '@/constants/assets'
import styles from '../record.module.css'

interface RecordListScreenProps {
  showCurrency?: boolean
  showType?: boolean
  onCurrency: () => void
  onType: () => void
}

function RecordListScreen(props: RecordListScreenProps) {
  const { assetsEnums } = useAssetsStore()
  const { showCurrency = false, showType = false, onCurrency, onType } = props
  const recordModule = useAssetsStore().recordModule
  const formData: any = recordModule.assetsRecord[recordModule.activeTab]

  return (
    <div className={styles['record-list-screen-root']}>
      {showCurrency && (
        <div className="screen-item" onClick={onCurrency}>
          <span>{t`features/assets/financial-record/record-list/record-list-screen/index-0`}：</span>
          <span>{formData?.coinId ? formData.coinName : t`assets.withdraw.form.count.withdraw-all`}</span>
          <Icon className="screen-icon" hasTheme name="icon_agent_drop" />
        </div>
      )}

      {showType && (
        <div className="screen-item !mb-0" onClick={onType}>
          <span>
            {recordModule.activeTab === FinancialRecordRouteEnum.commission
              ? t`features_assets_financial_record_record_list_record_list_screen_index__3qc4hos4m`
              : t`features/assets/financial-record/record-list/record-list-screen/index-1`}
            ：
          </span>
          <span>
            {formData?.type === AssetsRecordTypeEnum.all
              ? t`assets.withdraw.form.count.withdraw-all`
              : getTextFromStoreEnums(formData?.type, assetsEnums.financialRecordTypeEnum.enums)}
          </span>
          <Icon className="screen-icon" hasTheme name="icon_agent_drop" />
        </div>
      )}
    </div>
  )
}

export { RecordListScreen }
