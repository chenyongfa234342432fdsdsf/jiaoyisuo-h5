import Icon from '@/components/icon'
import PopupHeader from '@/components/popup-header'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { Button, Popup, Selector } from '@nbit/vant'
import { useState } from 'react'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import styles from './common-amount-options.module.css'

type IOptionsPopupProps = {
  visible: boolean
  onClose: () => void
}
function OptionsPopup({ visible, onClose }: IOptionsPopupProps) {
  const { tradeEnums, cacheData, setCommonAmountOptions } = useOptionTradeStore()
  let cacheOptions = cacheData.commonAmountOptions
  const amountOptions = tradeEnums.amountOptions.enums
  if (cacheOptions.length === 0) {
    cacheOptions = amountOptions.slice(0, 4).map(val => val.value as number)
  }
  const [value, setValue] = useState(cacheOptions.filter(val => amountOptions.some(v => v.value === val)))

  const onOk = () => {
    setCommonAmountOptions(value)
    onClose()
  }

  const onChange = (newValue: number[]) => {
    if (newValue.length > 4) {
      return
    }
    setValue(newValue.sort((a, b) => a - b))
  }

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div className={classNames(styles['common-amount-options-popup-wrapper'], 'text-sm text-leading-1-5')}>
        <PopupHeader
          onClose={onClose}
          title={t`features_ternary_option_trade_exhange_common_amount_options_cpggzam4g8`}
        />
        <div className="px-4 pt-2">
          <div className="text-xs mb-2 text-text_color_02">
            {t`features_ternary_option_trade_exhange_common_amount_options_uiye7skxxh`}
          </div>
          <Selector
            value={value}
            onChange={onChange}
            className="size-small"
            multiple
            showCheckMark={false}
            options={amountOptions as any}
          />
          <div className="pt-8 pb-10">
            <Button disabled={value.length < 4} onClick={onOk} block type="primary" round className="button">
              {t`user.field.reuse_17`}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  )
}

/** 常用的金额选项框 */
export function CommonAmountOptions() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <div onClick={() => setVisible(true)} className="flex items-center">
        <span className="text-text_color_02">{t`features_ternary_option_trade_exhange_common_amount_options_cpggzam4g8`}</span>
        <Icon hiddenMarginTop className="ml-1 text-xs translate-y-px" name="rebate_edit" hasTheme />
      </div>
      <OptionsPopup visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}
