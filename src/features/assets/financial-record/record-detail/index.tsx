import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { usePageContext } from '@/hooks/use-page-context'
import { Toast } from '@nbit/vant'
import NavBar from '@/components/navbar'
import {
  AssetsRecordTypeEnum,
  RecordC2CTypeList,
  RecordExpenseDetailsList,
  RecordFusionTypeList,
  RecordOptionTypeList,
  RecordRecreationTypeList,
  RecordTransactionDetailsList,
} from '@/constants/assets/common'
import { useCopyToClipboard, useMount } from 'react-use'
import Icon from '@/components/icon'
import { RecordDetailsInfo } from '@/features/assets/financial-record/record-detail/record-details-info'
import { TransactionDetails } from '@/features/assets/financial-record/record-detail/transaction-details'
import { getRecordsDetails } from '@/apis/assets/financial-records'
import { useAssetsStore } from '@/store/assets/spot'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { PerpetualMigrateTypeEnum, PerpetualOrderAcceptTypeEnum } from '@/constants/assets/futures'
import { useUnmount } from 'ahooks'
import { useOptionPositionStore } from '@/store/ternary-option/position'
import styles from './index.module.css'
import { RecordDetailState } from './record-state/index'
import { C2CDetails } from './c2c-details'
import { FusionDetails } from './fusion-details'
import { OptionDetails } from './option-details'
import { RecreationDetails } from './recreation-details'

export function RecordDetailLayout() {
  const pageContext = usePageContext()
  const { assetsRecordDetail, updateRecordModule } = useAssetsStore().recordModule || {}
  const { fetchOptionDictionaryEnums } = useOptionPositionStore()
  const [loading, setLoading] = useState(false)
  // 资产数据字典
  const { fetchAssetEnums } = useAssetsStore()
  useMount(fetchAssetEnums)
  useMount(fetchOptionDictionaryEnums)

  const [state, copyToClipboard] = useCopyToClipboard()
  const copyToClipbordFn = (info: string, val?: string) => {
    if (!val) {
      return
    }
    copyToClipboard(val)
    state.error ? Toast(t`assets.financial-record.copyFailure`) : Toast(info)
  }

  /**
   * 获取财务日志详情
   */
  const onLoadDate = async (id: string) => {
    setLoading(true)
    const res = await getRecordsDetails({ id })
    const { isOk, data, message = '' } = res || {}
    setLoading(false)

    if (!isOk) {
      Toast.info(message)
      return
    }

    updateRecordModule({
      assetsRecordDetail:
        data?.depositWithdraw ||
        data?.fee ||
        data?.perpetual ||
        data?.commission ||
        data?.c2cBillLogDetail ||
        data?.option ||
        {},
    })
  }

  useEffect(() => {
    // 根据记录 id 调接口
    const recordId = pageContext.urlParsed.search?.id
    recordId && onLoadDate(recordId)
  }, [])

  /**
   * 充值底部提示组件
   */
  function ContactItem() {
    // 复制地址及交易哈希，进入客服系统 - 要产品提供客服系统地址，复制的拼接规范：地址_交易哈希
    return (
      <div
        className="reminder"
        onClick={() =>
          copyToClipbordFn(
            t`features_assets_financial_record_record_detail_index_510297`,
            `${assetsRecordDetail.address || ''}_${assetsRecordDetail.txHash}`
          )
        }
      >
        {t`assets.financial-record.contact`}
      </div>
    )
  }

  useUnmount(() => {
    updateRecordModule({
      assetsRecordDetail: {},
    })
  })

  return (
    <div className={styles.scoped}>
      <NavBar title={t`assets.financial-record.recordDetail`} />
      <div className="detail-wrap">
        <div className="order-no">
          <div>{`${t`assets.financial-record.orderNo`}：${assetsRecordDetail?.serialNo || '--'}`}</div>
          <Icon
            name="copy"
            hasTheme
            onClick={() => copyToClipbordFn(t`assets.financial-record.copySuccess`, assetsRecordDetail?.serialNo)}
            className="copy-icon"
          />
        </div>

        <RecordDetailState />

        {/* 记录详情 */}
        {!RecordC2CTypeList.includes(assetsRecordDetail?.typeInd) &&
          !RecordFusionTypeList.includes(assetsRecordDetail?.typeInd) && <RecordDetailsInfo />}

        {/* C2C 记录详情 */}
        {RecordC2CTypeList.includes(assetsRecordDetail?.typeInd) && <C2CDetails />}

        {/* 三元期权记录详情 */}
        {RecordOptionTypeList.includes(assetsRecordDetail?.typeInd) && <OptionDetails />}

        {/* 娱乐区记录详情 */}
        {RecordRecreationTypeList.includes(assetsRecordDetail?.typeInd) && <RecreationDetails />}

        {/* 融合模式记录详情 */}
        {RecordFusionTypeList.includes(assetsRecordDetail?.typeInd) && <FusionDetails />}

        {/* 成交明细/资金明细 */}
        {(RecordExpenseDetailsList.indexOf(assetsRecordDetail?.typeInd) > -1 ||
          RecordTransactionDetailsList.indexOf(assetsRecordDetail?.typeInd) > -1 ||
          (assetsRecordDetail?.typeInd === AssetsRecordTypeEnum.migrate &&
            assetsRecordDetail?.migrateType !== PerpetualMigrateTypeEnum.merge &&
            assetsRecordDetail?.isAccept === PerpetualOrderAcceptTypeEnum.no)) && <TransactionDetails />}

        {assetsRecordDetail?.typeInd === AssetsRecordTypeEnum.recharge && <ContactItem />}
      </div>

      <FullScreenLoading isShow={loading} mask />
    </div>
  )
}
