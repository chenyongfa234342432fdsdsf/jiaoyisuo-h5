/**
 * 卡券信息
 */
import Icon from '@/components/icon'
import { useState } from 'react'
import { Button, Popup } from '@nbit/vant'
import { IncreaseTag } from '@nbit/react'
import { IFuturesPositionHistoryList } from '@/typings/api/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCurrency } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { t } from '@lingui/macro'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils?.SafeCalcUtil

function RevenueDetails({ data }: { data: IFuturesPositionHistoryList }) {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()

  const infoList = [
    {
      label: t`features_assets_futures_futures_position_revenue_details_index_0gtaeswcdz`,
      value: (
        <IncreaseTag
          value={SafeCalcUtil.sub(
            SafeCalcUtil.sub(data?.profit, data?.voucherDeductionAmount),
            data?.insuranceDeductionAmount
          )}
          right={` ${data?.quoteSymbolName}`}
          hasPrefix={false}
          kSign
          digits={offset}
        />
      ),
    },
    {
      label: t`features_assets_futures_futures_position_revenue_details_index_rqalxxws5y`,
      value: `${formatCurrency(data?.voucherDeductionAmount, offset)} ${data?.quoteSymbolName}`,
      isHide: !(data?.voucherDeductionAmount && +data?.voucherDeductionAmount > 0),
    },
    {
      label: t`features_assets_futures_futures_position_revenue_details_index_3m6np_ipgh`,
      value: `${formatCurrency(data?.insuranceDeductionAmount, offset)} ${data?.quoteSymbolName}`,
      isHide: !(data?.insuranceDeductionAmount && +data?.insuranceDeductionAmount > 0),
    },
  ]

  return (
    <>
      <Icon
        name="msg"
        hasTheme
        className={styles['coupon-icon']}
        onClick={e => {
          e.stopPropagation()
          setDetailsVisible(true)
        }}
      />

      <Popup visible={detailsVisible} onClose={() => setDetailsVisible(false)} className={styles['coupon-modal-root']}>
        <div className="modal-title">{t`features_assets_futures_futures_position_revenue_details_index_w4vqfu_8q_`}</div>

        <div className="modal-content">
          {infoList.map((info, i: number) => {
            if (info?.isHide) return
            return (
              <div className="info-cell" key={i}>
                <span>{info.label}</span>
                <span>{info.value}</span>
              </div>
            )
          })}
        </div>

        <Button type="primary" className="modal-button" onClick={() => setDetailsVisible(false)}>
          {t`features_trade_common_notification_index_5101066`}
        </Button>
      </Popup>
    </>
  )
}

export { RevenueDetails }
