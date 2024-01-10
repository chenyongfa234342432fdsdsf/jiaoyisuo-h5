/**
 * 财务记录 - 三元期权详情
 */
import { t } from '@lingui/macro'
import { useAssetsStore } from '@/store/assets/spot'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import { formatDate } from '@/helper/date'
import { getTextFromStoreEnums } from '@/helper/store'
import { getOptionProductPeriodUnit } from '@/constants/ternary-option'
import styles from './index.module.css'

function OptionDetails() {
  const { assetsEnums, recordModule } = useAssetsStore()
  const { optionDictionaryEnums } = useOptionPositionStore()
  const {
    symbol,
    optionTypeInd = '',
    sideInd = '',
    amplitude = '',
    createdByTime = '--',
    updatedByTime = '--',
    periodDisplay,
    periodUnit = '',
  } = recordModule?.assetsRecordDetail || {}

  const infoList = [
    {
      label: t`features_ternary_option_option_order_ternary_history_spot_select_filters_tfw06fwkhu`,
      content: `${symbol} ${getTextFromStoreEnums(optionTypeInd, assetsEnums.financialRecordTypeSwapList.enums)}`,
    },
    {
      label: t`features_orders_spot_spot_filters_modal_510258`,
      content: `${getTextFromStoreEnums(sideInd, optionDictionaryEnums.optionsSideIndEnum.enums)} ${
        amplitude !== null ? amplitude : ''
      }`,
    },
    {
      label: t`features_ternary_option_option_order_ternary_order_item_index_v_orp_rzdo`,
      content: `${periodDisplay} ${getOptionProductPeriodUnit(periodUnit)}`,
    },
    { label: t`assets.financial-record.creationTime`, content: formatDate(createdByTime) },
    { label: t`assets.financial-record.completionTime`, content: formatDate(updatedByTime) },
  ]
  return (
    <div className={styles['option-details-root']}>
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

export { OptionDetails }
