import { Button, Popup, Selector, Toast } from '@nbit/vant'
import { IncreaseTag } from '@nbit/react'
import { formatNumberDecimal } from '@/helper/decimal'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Dispatch, SetStateAction, useState } from 'react'
import { StopLimitTriggerPriceTypeEnum, getStopLimitTriggerPriceTypeName } from '@/constants/assets/futures'
import { decimalUtils } from '@nbit/utils'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil
interface UnrealizedProfitModalProps {
  showUnit?: boolean
  visible: boolean
  onClose: () => void
  currencySymbol: string
  unrealizedProfit: string
  offset: number
  lockFees: string
  priceType: StopLimitTriggerPriceTypeEnum
  setPriceType: Dispatch<SetStateAction<StopLimitTriggerPriceTypeEnum>>
}

export const UnrealizedProfitModal = ({
  visible,
  onClose,
  currencySymbol,
  unrealizedProfit,
  offset,
  lockFees,
  priceType: defaultPriceType,
  setPriceType: onChangePriceType,
  showUnit = true,
}: UnrealizedProfitModalProps) => {
  const [priceType, setPriceType] = useState(defaultPriceType)
  const priceTypeOptions = [StopLimitTriggerPriceTypeEnum.new, StopLimitTriggerPriceTypeEnum.mark].map(item => ({
    value: item,
    label: getStopLimitTriggerPriceTypeName(item),
  }))
  // 仓位盈亏：未实现盈亏 + 锁定利息
  const positionProfit = SafeCalcUtil.add(unrealizedProfit, lockFees)
  const handleChangePriceType = () => {
    onChangePriceType(priceType)
    onClose()
    Toast.info(t`features_assets_futures_common_unrealized_profit_modal_index_zgxanzqghs`)
  }
  return (
    <Popup className="rounded-t-lg px-4 pt-4 pb-10" position="bottom" visible={visible} onClose={onClose}>
      <div className="flex justify-between mb-6 items-center">
        <span className="text-base font-medium">{t`features_assets_futures_common_unrealized_profit_modal_index_snmny7m2mv`}</span>
        <Icon hasTheme name="close" className="text-xl" onClick={onClose} />
      </div>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: t({
            id: 'features_assets_futures_common_unrealized_profit_modal_index_z3xlwgyss3',
            values: {
              0: getStopLimitTriggerPriceTypeName(priceType),
            },
          }),
        }}
      />
      <Selector
        showCheckMark={false}
        className={styles.selector}
        value={[priceType]}
        onChange={v => {
          if (v.length === 0) return
          setPriceType(v[0])
        }}
        options={priceTypeOptions}
      />
      <div className="text-text_color_02 flex justify-between mt-1.5">
        {t`features_orders_future_holding_index_601`}
        <span>
          <IncreaseTag value={positionProfit} digits={offset} /> {showUnit && currencySymbol}
        </span>
      </div>
      {Number(lockFees) !== 0 ? (
        <div className="text-text_color_02 flex justify-between mt-1.5">
          {t`features_orders_future_holding_index_602`}
          <span>
            <IncreaseTag value={+formatNumberDecimal(lockFees, offset, true) > 0 ? -lockFees : 0} digits={2} isRound />{' '}
            {showUnit && currencySymbol}
          </span>
        </div>
      ) : null}
      <Button type="primary" block className="mt-8" onClick={handleChangePriceType}>
        {t`common.confirm`}
      </Button>
    </Popup>
  )
}
