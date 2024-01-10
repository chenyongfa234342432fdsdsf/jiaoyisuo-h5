import { useState, useImperativeHandle, forwardRef, memo, useRef, useMemo } from 'react'
import { useMount } from 'ahooks'
import Slider from '@/components/slider'
import Icon from '@/components/icon'
import { setPerpetualPlanOrders } from '@/apis/future/common'
import { ActionSheet, Input, Popover, PopoverInstance, Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import { useOrderFutureStore } from '@/store/order/future'
import { formatNumberDecimal, removeDecimalZero } from '@/helper/decimal'
import { decimalUtils } from '@nbit/utils'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useFutureQuoteDisplayDigit } from '@/hooks/features/assets'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type Props = {
  totalMargin: number
  initMargin: number
  id: number
  setShowBond?: React.Dispatch<React.SetStateAction<number | undefined>>
}

function ContractAdjustmentModal(props: Props, ref) {
  const { totalMargin: total, initMargin, id, setShowBond } = props

  const { userAssetsFutures } = useAssetsFuturesStore()

  const offset = useFutureQuoteDisplayDigit()

  const { tradePairDefaultQuote } = useOrderFutureStore()

  const [sliderValue, setSliderValue] = useState<number | undefined>(0)

  const contractPopovertRef = useRef<PopoverInstance | null>(null)

  const [actionSheetVisible, setActionSheetVisible] = useState<boolean>(false)

  const [showTriangle, setShowTriangle] = useState<boolean>(false)

  const [totalMarginValue, setTotalMarginValue] = useState<number>()

  const totalMargin = useMemo(() => totalMarginValue || total, [totalMarginValue, total])

  const formatCurrencyNumber = item => {
    return removeDecimalZero(formatNumberDecimal(item, Number(offset)))
  }

  useImperativeHandle(ref, () => ({
    setContractSheetVisible() {
      setActionSheetVisible(true)
    },
  }))

  const getTotalAsset = () => {
    return Number(formatCurrencyNumber(Number(userAssetsFutures.availableBalanceValue)))
  }

  const setModalVisible = () => {
    contractPopovertRef.current?.hide()
    setSliderValue((Number(formatNumberDecimal(totalMargin, Number(offset))) as number) || 0)
    setActionSheetVisible(false)
  }

  const onExtraMarginPercentChange = e => {
    // 验证是否是数字的小数点
    const percentTest = /^\d+(\.\d+)?$/
    if (Number(e) > Number(getTotalAsset())) {
      setSliderValue(getTotalAsset())
    } else {
      let sliderValues
      if (percentTest.test(e)) {
        if (e?.toString()?.match(/\.(\d+)/)?.[1]?.length >= offset) {
          sliderValues = String(formatNumberDecimal(Number(e), Number(offset)))
        } else {
          if (e.indexOf('.') !== -1) {
            sliderValues = e
          } else {
            sliderValues = Number(e)
          }
        }
        setSliderValue(sliderValues)
      } else {
        if (!isNaN(Number(e[0])) || !e) setSliderValue(e)
      }
    }
  }

  const setAdjustmentValue = async () => {
    setActionSheetVisible(false)
    const sliderValueSafeNum = SafeCalcUtil.sub(sliderValue, initMargin)
    const additionalMargin = formatNumberDecimal(Number(sliderValueSafeNum), Number(offset))
    const { isOk } = await setPerpetualPlanOrders({
      id,
      params: {
        initMargin,
        additionalMargin,
      },
    })

    if (isOk) {
      Toast.info(t`features_trade_contract_contract_adjustment_modal_index_5101514`)
      const showBondValue = Number(SafeCalcUtil.add(additionalMargin, initMargin))
      setShowBond && setShowBond(showBondValue)
      setSliderValue(showBondValue)
      setTotalMarginValue(showBondValue)
      setActionSheetVisible(false)
    } else {
      Toast.info(t`features_trade_contract_contract_adjustment_modal_index_5101515`)
    }
  }

  const onExtraMarginChange = () => {
    if (Number(sliderValue) < Number(initMargin) || !sliderValue) {
      setSliderValue(initMargin)
      return
    }
    setSliderValue(Number(formatNumberDecimal(sliderValue, Number(offset))))
  }

  const setformatNumberDecimalChange = data => {
    return formatNumberDecimal(data * 100, 2) || 0
  }

  const setMarginShowStartChange = () => {
    setShowTriangle(true)
  }

  const setMarginShowEndChange = () => {
    setShowTriangle(false)
  }

  const setActionSheetChange = () => {
    setSliderValue((totalMargin as number) || 0)
    contractPopovertRef.current?.hide()
    setActionSheetVisible(false)
  }

  useMount(() => {
    setSliderValue(Number(formatNumberDecimal(totalMargin, Number(offset))) || 0)
  })

  return (
    <div>
      <ActionSheet
        onCancel={setActionSheetChange}
        className={styles['action-sheet-container']}
        visible={actionSheetVisible}
      >
        <div className="adjustment-modal-title">
          <span>{t`features_trade_contract_contract_adjustment_modal_index_5101516`}</span>
          <span onClick={setModalVisible}>{t`assets.financial-record.cancel`}</span>
        </div>
        <div className="adjustment-modal-entrustmoney">
          <div>
            <span>{t`features_trade_contract_contract_adjustment_modal_index_5101517`}</span>
            <Popover
              theme="dark"
              ref={contractPopovertRef}
              duration={0}
              className={styles['action-sheet-popover']}
              placement="bottom"
              reference={<Icon name="msg" />}
            >
              {t`features_trade_contract_contract_adjustment_modal_index_5101518`}
            </Popover>
          </div>
          <div>
            {formatNumberDecimal(totalMargin, Number(offset))}
            {tradePairDefaultQuote}≈
            {totalMargin / getTotalAsset() > 0.01 ? parseInt(((totalMargin / getTotalAsset()) * 100).toString()) : 1}%
          </div>
        </div>
        <div className="adjustment-input-title">{t`features_trade_contract_contract_adjustment_modal_index_5101519`}</div>
        <div className="adjustment-input">
          <Input
            type="number"
            onChange={onExtraMarginPercentChange}
            onBlur={onExtraMarginChange}
            value={sliderValue?.toString()}
          />
          <span>{tradePairDefaultQuote}</span>
        </div>
        <div className="adjustment-input-bond">{t`features_trade_contract_contract_adjustment_modal_index_5101520`}</div>
        <div className="h-1">
          <Slider
            showTooltip
            onChange={onExtraMarginPercentChange}
            onDragStart={setMarginShowStartChange}
            onDragEnd={setMarginShowEndChange}
            button={
              <div className="w-4 h-4 border-4 ml-2 mr-2 bg-white rounded-full relative border-buy_up_color">
                {showTriangle && (
                  <span className="absolute w-12 -top-7 text-card_bg_color_03 text-xs bg-buy_up_color flex justify-center py-0.5 -left-5 rounded">
                    {setformatNumberDecimalChange(
                      (Number(sliderValue) - Number(initMargin)) / (getTotalAsset() - Number(initMargin))
                    )}
                    %<span className="triangle"></span>
                  </span>
                )}
              </div>
            }
            step={Number(offset) > 0 ? Number(parseFloat('0').toFixed(Number(offset) - 1) + 1) : 1}
            value={sliderValue}
            min={Number(initMargin)}
            max={getTotalAsset()}
          />
        </div>
        <div className="adjustment-slider-num">
          <span>{formatCurrencyNumber(initMargin)}</span>
          <span>{getTotalAsset()}</span>
        </div>

        <div className="adjustment-slider-button" onClick={setAdjustmentValue}>
          {t`common.confirm`}
        </div>
      </ActionSheet>
    </div>
  )
}

export default memo(forwardRef(ContractAdjustmentModal))
