import Icon from '@/components/icon'
import { SelectActionSheet } from '@/components/select-action-sheet'
import { TradeDirectionEnum } from '@/constants/trade'
import TradeButtonRadios from '@/features/trade-button-radios'
import classNames from 'classnames'
import { useState } from 'react'
import { getBuyDirectionOptions, getEntrustTypes } from '@/helper/trade'
import { GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import Exchange from '../common/exchange'
import { useExchangeContext } from '../common/exchange/context'
import { ActionSheetTypeEnum } from '../common/exchange/enum'
import TradeFormItemBox from '../common/form-item-box'
import { FutureBalance } from './exchange-balance'
import { FutureExtra } from './exchange-extra'
import { FutureMargin } from './exchange-margin'
import { OnOrder } from './exchange-order'
import { EntrustTypePriceInput } from './price-input'
import TradeEntrustModal from '../trade-entrust-modal'
import { FutureActionButton } from './exchange-action-button'
import styles from './common.module.css'
import DirectionButtons from '../common/direction-buttons'

function FutureExchange() {
  const { tradeInfo, onEntrustTypeChange, onOrder } = useExchangeContext()
  const entrustTypes = getEntrustTypes()
  const [visible, setVisible] = useState(-1) // 控制面板展示
  const PriceInputCom = EntrustTypePriceInput[tradeInfo.entrustType]
  return (
    <Exchange>
      <div className="operate-btn exchange-item">
        <DirectionButtons />
      </div>
      <FutureBalance />
      <div className="mb-2 flex justify-between items-center">
        <TradeFormItemBox className="flex-1 flex h-26 items-center">
          <Icon
            name="msg"
            hasTheme
            hiddenMarginTop
            className="mr-2"
            onClick={() => {
              setVisible(ActionSheetTypeEnum.entrustTip)
            }}
          />
          <div className="flex-1">
            <SelectActionSheet
              labelClassName="!text-sm font-medium"
              value={tradeInfo.entrustType}
              onChange={onEntrustTypeChange}
              actions={entrustTypes}
            />
          </div>
        </TradeFormItemBox>
      </div>
      <PriceInputCom />
      <FutureMargin />
      <FutureExtra />
      <div
        id={GUIDE_ELEMENT_IDS_ENUM.futureOrderButton}
        className={classNames('btn-item text-button_text_01 text-sm font-medium', {
          'bg-buy_up_color': tradeInfo.direction === TradeDirectionEnum.buy,
          'bg-sell_down_color': tradeInfo.direction === TradeDirectionEnum.sell,
        })}
        onClick={onOrder}
      >
        <FutureActionButton />
      </div>

      <TradeEntrustModal
        visible={visible === ActionSheetTypeEnum.entrustTip}
        onVisibleChange={() => {
          setVisible(-1)
        }}
      />
      <OnOrder />
    </Exchange>
  )
}

export default FutureExchange
