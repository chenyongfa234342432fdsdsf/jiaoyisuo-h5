import UnderlineTip from '@/features/trade/common/underline-tip'
import PriceInput from '@/features/trade/common/price-input'
import { Checkbox, Dialog } from '@nbit/vant'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import { TernaryOptionTradeInputNameEnum } from '@/constants/ternary-option'
import { t } from '@lingui/macro'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useOptionExchangeContext } from './context'

export function OrderFormAdvance({ inputRefs }) {
  const { tradeInfo, onIsSmartDoubleChange, onMaxAmountChange, onMaxTriggerTimesChange } = useOptionExchangeContext()
  const { maxTriggerTimes, maxAmount, isSmartDouble } = tradeInfo

  return (
    <div>
      <div className="mb-4">
        <UnderlineTip
          id={OPTION_GUIDE_ELEMENT_IDS_ENUM.maxTriggerTimes}
          className="text-text_color_02 mb-2 inline-block"
          title={t`features_ternary_option_option_order_ternary_order_item_index_0zxr95sizg`}
          popup={t`features_ternary_option_trade_exhange_order_form_advance_yilqebh9ri`}
        >{t`features_ternary_option_option_order_ternary_order_item_index_0zxr95sizg`}</UnderlineTip>
        <PriceInput
          onlyInput
          value={maxTriggerTimes}
          onChange={onMaxTriggerTimesChange}
          digit={0}
          min={1}
          ref={com => {
            inputRefs.current[TernaryOptionTradeInputNameEnum.maxTriggerTimes] = com as any
          }}
          placeholder=""
        />
      </div>
      <div className="mb-4">
        <UnderlineTip
          id={OPTION_GUIDE_ELEMENT_IDS_ENUM.maxAmount}
          className="text-text_color_02 mb-2 inline-block"
          title={t`features_ternary_option_option_order_ternary_order_item_index_xilxi3n1bc`}
          popup={t`features_ternary_option_trade_exhange_order_form_advance_xreygvjqdc`}
        >{t`features_ternary_option_option_order_ternary_order_item_index_xilxi3n1bc`}</UnderlineTip>
        <PriceInput
          ref={com => {
            inputRefs.current[TernaryOptionTradeInputNameEnum.maxAmount] = com as any
          }}
          onlyInput
          value={maxAmount}
          onChange={onMaxAmountChange}
          digit={0}
          min={1}
          placeholder=""
        />
      </div>
      <div className="flex mb-4">
        <div id={OPTION_GUIDE_ELEMENT_IDS_ENUM.smartDouble}>
          <Checkbox
            checked={isSmartDouble}
            onChange={onIsSmartDoubleChange}
            shape="square"
            iconSize={14}
            iconRender={createCheckboxIconRender('text-sm')}
          >
            <div className="translate-y-0.5">
              {/* 给个下边距才能让下划线展示出来 */}
              <UnderlineTip
                className="text-text_color_02 mb-1"
                title={t`features_ternary_option_option_order_ternary_order_item_index_mc2tmv6njx`}
                popup={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t`features_ternary_option_trade_exhange_order_form_advance_rbucogg2e8`,
                    }}
                  ></span>
                }
              >{t`features_ternary_option_option_order_ternary_order_item_index_mc2tmv6njx`}</UnderlineTip>
            </div>
          </Checkbox>
        </div>
      </div>
    </div>
  )
}
