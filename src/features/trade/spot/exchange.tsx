import Icon from '@/components/icon'
import { SelectActionSheet } from '@/components/select-action-sheet'
import TradeButtonRadios from '@/features/trade-button-radios'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useState } from 'react'
import NotLogin from '@/components/not-login'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { getBuyDirectionOptions, getEntrustTypes, getTradeButtonText, getUserSpotTradeEnabled } from '@/helper/trade'
import { useUserStore } from '@/store/user'
import { EntrustTypeEnum, SpotStopLimitTypeEnum } from '@/constants/trade'
import Exchange from '../common/exchange'
import { useExchangeContext } from '../common/exchange/context'
import { ActionSheetTypeEnum } from '../common/exchange/enum'
import TradeFormItemBox from '../common/form-item-box'
import { SpotAmount } from './exchange-amount'
import { OnOrder } from './exchange-order'
import { EntrustTypePriceInput } from './price-input'
import { SpotBalance } from './exchange-balance'
import TradeEntrustModal from '../trade-entrust-modal'
import TradeSelect from '../common/select'
import DirectionButtons from '../common/direction-buttons'

function SpotExchange() {
  const { tradeInfo, isStopLimit, isBuy, onSpotStopLimitTypeChange, onEntrustTypeChange, onDirectionChange, onOrder } =
    useExchangeContext()
  const entrustTypes = getEntrustTypes([
    EntrustTypeEnum.market,
    EntrustTypeEnum.limit,
    EntrustTypeEnum.plan,
    EntrustTypeEnum.stop,
  ]).map(item => ({
    value: item.value,
    text: item.name,
  }))
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const [visible, setVisible] = useState(-1) // 控制面板展示
  const onCancel = () => setVisible(-1)
  const { isLogin } = useUserStore()
  const directionOptions = getBuyDirectionOptions()
  const PriceInputCom = EntrustTypePriceInput[tradeInfo.entrustType]
  const stopLimitTypeOptions = [
    {
      value: SpotStopLimitTypeEnum.single,
      text: t`features_trade_spot_exchange_5mmrnqaxvk`,
    },
    {
      value: SpotStopLimitTypeEnum.double,
      text: t`features_trade_spot_exchange_zzxgy20i50`,
    },
  ]
  return (
    <Exchange>
      <div className="operate-btn exchange-item">
        <DirectionButtons />
      </div>
      <div className="mb-2">
        <TradeSelect
          bgTradeParent
          dropdownTop="calc(100% + 4px)"
          prefix={
            <Icon
              name="property_icon_tips"
              hasTheme
              hiddenMarginTop
              className="mr-2 text-xs"
              onClick={() => {
                setVisible(ActionSheetTypeEnum.entrustTip)
              }}
            />
          }
          className="flex-1 py-2 bg-bg_sr_color rounded-lg sm-text"
          onChange={onEntrustTypeChange}
          options={entrustTypes}
          value={tradeInfo.entrustType}
        />
      </div>
      {isStopLimit && (
        <div className="mb-2">
          <TradeSelect
            bgTradeParent
            dropdownTop="calc(100% + 4px)"
            className="flex-1 py-2 bg-bg_sr_color rounded-lg sm-text"
            onChange={onSpotStopLimitTypeChange}
            options={stopLimitTypeOptions}
            value={tradeInfo.spotStopLimitType}
          />
        </div>
      )}
      <PriceInputCom />
      <SpotAmount />
      <SpotBalance />
      <div
        className={classNames('btn-item text-button_text_01 text-sm mt-4 font-medium', {
          'bg-buy_up_color': isBuy,
          'bg-sell_down_color': !isBuy,
        })}
        onClick={onOrder}
      >
        <NotLogin className="h-full" notLoginNode={getTradeButtonText(isLogin, currentSpotCoin.marketStatus!)}>
          {getTradeButtonText(
            isLogin,
            currentSpotCoin.marketStatus!,

            !getUserSpotTradeEnabled(isBuy)
              ? t`features_trade_future_exchange_action_button_iahscd3nrp`
              : isBuy
              ? t({
                  id: 'features_trade_spot_exchange_510220',
                  values: { 0: currentSpotCoin.baseSymbolName },
                })
              : t({
                  id: 'features_trade_spot_exchange_510221',
                  values: { 0: currentSpotCoin.baseSymbolName },
                })
          )}
        </NotLogin>
      </div>
      <TradeEntrustModal
        visible={visible === ActionSheetTypeEnum.entrustTip}
        whetherIsSpot
        onVisibleChange={() => {
          setVisible(-1)
        }}
      />
      <OnOrder />
    </Exchange>
  )
}

export default SpotExchange
