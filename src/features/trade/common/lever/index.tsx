import Icon from '@/components/icon'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { t } from '@lingui/macro'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'
import { Button } from '@nbit/vant'
import { ITradePairLever } from '@/typings/api/trade'
import { getCurrentLeverConfig } from '@/helper/trade'
import { useTradeCurrentFutureCoinWithMarkPrice } from '@/hooks/features/trade'
import { decimalUtils } from '@nbit/utils'
import Link from '@/components/link'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import { FutureHelpCenterEnum } from '@/constants/future/future-const'
import classNames from 'classnames'
import BaseLever from '@/components/lever'
import TradeBottomModal from '../bottom-modal'
import TradeFormItemBox from '../form-item-box'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export type ILeverProps = {
  name: string
  value: number
  buySymbol: string
  sellSymbol: string
  onChange: (v: number) => void
  onOk: () => void
  leverList: ITradePairLever[]
  currentValue: number
}

function Lever({ buySymbol, currentValue, leverList, onOk, sellSymbol, name, value, onChange }: ILeverProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [initWindowHeight, setInitWindowHeight] = useState(0)
  const [currentWindowHeight, setCurrentWindowHeight] = useState(0)
  // 至少要 5 否则杠杆展示会有问题
  const max = leverList[0]?.maxLever || 5
  useMount(() => {
    setInitWindowHeight(window.innerHeight)
    setCurrentWindowHeight(window.innerHeight)
  })
  useEffect(() => {
    function onResize() {
      setCurrentWindowHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  const withKeyboard = false // currentWindowHeight < initWindowHeight
  const onVisibleChange = (v: boolean) => {
    setShowPopup(v)
    if (!v) {
      setTimeout(() => {
        onChange(currentValue)
      }, 200)
    }
  }
  const onConfirm = () => {
    setShowPopup(false)
    onOk()
  }
  const currentLeverConfig = getCurrentLeverConfig(value, leverList)
  const currentFutureCoin = useTradeCurrentFutureCoinWithMarkPrice()

  function getBalance(leverMaxAmount: number) {
    const maxBalance = SafeCalcUtil.mul(leverMaxAmount, currentFutureCoin.last)
    return formatCurrency(formatNumberDecimalWhenExceed(maxBalance.toString(), currentFutureCoin.priceOffset as number))
  }
  const liquidationRuleUrl = useHelpCenterUrl(FutureHelpCenterEnum.liquidationRule)

  return (
    <TradeFormItemBox
      className="w-16 h-26 text-sm flex justify-between items-center"
      onClick={() => setShowPopup(true)}
    >
      <div className="font-medium">{`${currentValue}x`}</div>
      <Icon hiddenMarginTop name="regsiter_icon_drop" className="text-xs scale-75" hasTheme />
      <TradeBottomModal
        visible={showPopup}
        onVisibleChange={onVisibleChange}
        title={t`features/trade/common/lever/index-0`}
      >
        <div className={classNames(styles['lever-modal-wrapper'], 'text-sm')}>
          <div className="name rv-hairline--bottom">{name}</div>
          <div className="px-4">
            <div className="mb-5">
              <BaseLever currentValue={currentValue} value={value} onChange={onChange} leverList={leverList} />
            </div>

            {!withKeyboard && (
              <div>
                <div className="px-3 py-2 rounded bg-card_bg_color_01">
                  <div className="mb-1 text-sm">
                    <Icon name="prompt-symbol" className="text-xs origin-left scale-50" />
                    <span className="text-text_color_02">{t`features/trade/common/lever/index-2`}</span>
                    <span className="">
                      {formatCurrency(currentLeverConfig.maxLimitAmount)} {sellSymbol}
                    </span>
                  </div>
                  <div className="text-sm">
                    <Icon name="prompt-symbol" className="text-xs origin-left scale-50" />
                    <span className="text-text_color_02">{t`features/trade/common/lever/index-3`}</span>
                    <span className="">
                      {getBalance(currentLeverConfig.maxLimitAmount!)} {buySymbol}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {value > 20 && (
            <div className="px-4 mt-2">
              <div className="text-brand_color text-xs">
                <span className="text-warning_color">{t`features/trade/common/lever/index-4`}</span>
                <Link
                  href={liquidationRuleUrl}
                  className="text-brand_color underline decoration-dashed"
                >{t`features_trade_common_lever_index_5101538`}</Link>
              </div>
            </div>
          )}
          <div className="px-4 py-8">
            <Button onClick={onConfirm} block className="h-10 rounded" type="primary">{t`common.confirm`}</Button>
          </div>
        </div>
      </TradeBottomModal>
    </TradeFormItemBox>
  )
}

export default Lever
