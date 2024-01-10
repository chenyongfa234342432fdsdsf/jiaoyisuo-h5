import cn from 'classnames'
import { useState, memo } from 'react'
import { useMount } from 'ahooks'
import { getFundingRateDetail } from '@/apis/future/common'
import Icon from '@/components/icon'
import { Toast } from '@nbit/vant'
import LazyImage from '@/components/lazy-image'
import { useCopyToClipboard } from 'react-use'
import { formatDate } from '@/helper/date'
import { IncreaseTag } from '@nbit/react'
import { replaceEmpty } from '@/helper/filters'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { t } from '@lingui/macro'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useContractElements } from '../contract-elements/useContractElements'
import styles from './index.module.css'

const FundrecordItem = memo((props: Partial<Record<'label' | 'value' | 'className', string | number>>) => {
  return (
    <div className={cn('flex justify-between items-center my-4', props.className)}>
      <span className="text-sm text-text_color_02">{props.label}</span>
      <span className="text-sm text-text_color_01">{props.value}</span>
    </div>
  )
})

type Props = {
  fundingRateId: string
  positionId: string
  createTime: string
  endTime: string
  symbol: string
  symbolType: string
}

export default function ContractGeneratePicture(props: Props) {
  const { fundingRateId, positionId, createTime, endTime, symbol, symbolType } = props

  const { getTypeIndName } = useContractElements()

  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()

  const [fundingRate, setFundingRate] = useState<any>({})

  const [, copyToClipboard] = useCopyToClipboard()

  const copy = serialNo => {
    copyToClipboard(serialNo)
    Toast(t`features_orders_order_detail_5101067`)
  }

  const getFundingRateDetailRequest = async () => {
    const { isOk, data } = await getFundingRateDetail({ fundingRateId, positionId })
    if (isOk) {
      setFundingRate(data)
    }
  }

  useMount(() => {
    getFundingRateDetailRequest()
  })

  return (
    <div className={styles.scoped}>
      <div className="future-fundrecord-container">
        <div className="w-full mb-6 mt-2">
          <div className="future-no">
            <div>
              <span>{t`features_trade_contract_contract_fundrecord_detail_index_zk3wfr1ylgtybuqs81f53`}</span>
              <span>{fundingRate?.serialNo}</span>
            </div>
            <div onClick={() => copy(fundingRate?.serialNo)}>
              <Icon name="copy" hasTheme />
            </div>
          </div>
        </div>
        <div className="future-record-tip">
          <LazyImage src={`${oss_svg_image_domain_address}recharge_icon_success.png`} />
          <div className="future-record-detail">
            <div>{t`constants/assets/common-8`}</div>
            <div>{t`assets.financial-record.search.success`}</div>
          </div>
          <div className="future-record-detail">
            <div>
              {symbol} {symbolType && getTypeIndName[symbolType]}
            </div>
            <div className="text-right">
              <IncreaseTag digits={Number(offset)} value={Number(fundingRate?.amount)} />
            </div>
          </div>
        </div>
        <FundrecordItem
          label={t`features_assets_financial_record_record_detail_record_details_info_index_qlxkmuwdvjiibzzhbgurg`}
          value={fundingRate?.groupName}
          className="mt-6"
        />
        <FundrecordItem label={t`assets.financial-record.creationTime`} value={formatDate(Number(createTime))} />
        <FundrecordItem
          label={t`assets.financial-record.completionTime`}
          value={formatDate(Number(endTime))}
          className="mb-8"
        />
      </div>
      <div className="future-record-title">{t`features/assets/financial-record/record-detail/expense-details/index-0`}</div>
      {fundingRate?.fundingRate?.map((item, index) => {
        return (
          <div className="future-record-list" key={Math.random() + index}>
            <FundrecordItem label={t`future.funding-history.funding-rate.column.time`} value={formatDate(item?.time)} />
            <FundrecordItem
              label={t`features/trade/spot/price-input-0`}
              value={`${replaceEmpty(item?.amount)} ${item?.coinName}`}
            />
          </div>
        )
      })}
    </div>
  )
}
