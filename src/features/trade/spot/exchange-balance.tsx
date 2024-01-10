import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { ActionSheet } from '@nbit/vant'
import { link } from '@/helper/link'
import { useCommonStore } from '@/store/common'
import { formatCurrency, formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { useUserStore } from '@/store/user'
import { replaceEmpty } from '@/helper/filters'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { useAssetsStore } from '@/store/assets/spot'
import { getCoinPrecision } from '@/helper/assets/spot'
import DomAutoScaleWrapper from '@/components/dom-auto-scale-wrapper'
import { decimalUtils } from '@nbit/utils'
import { useExchangeContext } from '../common/exchange/context'

export function SpotBalance() {
  const [rechargeVisible, setRechargeVisible] = useState(false)
  const onCancel = () => setRechargeVisible(false)
  const hasC2c = false
  const { isLogin } = useUserStore()
  const toRecharge = () => {
    link('/assets/recharge')
  }
  const clickRecharge = () => {
    if (hasC2c) {
      setRechargeVisible(true)
    } else {
      toRecharge()
    }
  }
  const actions = [
    {
      name: t`assets.financial-record.tabs.Deposit`,
      callback: () => {
        onCancel()
        toRecharge()
      },
    },
  ]
  const { tradeInfo, balance, symbol, isBuy, buyDigit, sellDigit, currentCoin } = useExchangeContext()
  const assetsStore = useAssetsStore()
  const { isFusionMode } = useCommonStore()
  const currentAssets = { ...assetsStore.userAssetsSpot }
  return (
    <>
      <div className="exchange-item justify-between flex items-center">
        <div className="flex flex-1 items-center text-xs">
          <span className="text-text_color_02 mr-1">{t`features_trade_spot_exchange_balance_510297`}</span>
          <DomAutoScaleWrapper
            minScale={0.8}
            dep={isBuy ? currentAssets.buyCoin?.availableAmount : currentAssets.sellCoin?.availableAmount}
            className="overflow-ellipsis-flex-1 font-medium text-text_color_01 "
            suffix={<span className="ml-0.5">{symbol}</span>}
          >
            {isLogin
              ? isBuy
                ? formatCurrency(
                    formatNumberDecimalWhenExceed(
                      currentAssets.buyCoin?.availableAmount,
                      getCoinPrecision(symbol || '')
                    )
                  )
                : formatCurrency(
                    formatNumberDecimalWhenExceed(
                      currentAssets.sellCoin?.availableAmount,
                      getCoinPrecision(symbol || '')
                    )
                  )
              : replaceEmpty()}
          </DomAutoScaleWrapper>
        </div>

        {!isFusionMode && (
          <div className="right text-text_color_01 flex ml-px items-center" onClick={clickRecharge}>
            <Icon name="available_information" className="ml-2 text-sm translate-y-px" />
          </div>
        )}
      </div>
      <div className="exchange-item justify-between flex items-center">
        <div className="flex flex-1 items-center text-xs">
          <span className="text-text_color_02 mr-1">
            {isBuy
              ? t`features_trade_spot_exchange_balance_xgjevwuhsw`
              : t`features_trade_spot_exchange_balance_achh0jrigs`}
          </span>
          <DomAutoScaleWrapper
            minScale={0.8}
            dep={balance}
            className="overflow-ellipsis-flex-1 font-medium text-text_color_01"
            suffix={<span className="ml-0.5">{isBuy ? currentCoin.baseSymbolName : currentCoin.quoteSymbolName}</span>}
          >
            {isLogin
              ? isBuy
                ? formatCurrency(
                    formatNumberDecimalWhenExceed(
                      decimalUtils.SafeCalcUtil.div(balance, tradeInfo.entrustPrice || currentCoin.last).toString(),
                      sellDigit
                    )
                  )
                : formatCurrency(
                    formatNumberDecimalWhenExceed(
                      decimalUtils.SafeCalcUtil.mul(balance, tradeInfo.entrustPrice || currentCoin.last).toString(),
                      buyDigit
                    )
                  )
              : replaceEmpty()}{' '}
          </DomAutoScaleWrapper>
        </div>
      </div>
      {/* 具体需要从资产那边用组件 */}
      <ActionSheet
        visible={rechargeVisible}
        onCancel={onCancel}
        actions={actions}
        cancelText={t`common.modal.cancel`}
        closeOnClickOverlay
      />
    </>
  )
}
