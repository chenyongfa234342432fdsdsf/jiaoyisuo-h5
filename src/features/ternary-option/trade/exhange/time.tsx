import { useEffect } from 'react'
import TradeButtonRadios from '@/features/trade-button-radios'
import { formatTimeLabel } from '@/helper/ternary-option'
import { useOptionExchangeContext } from './context'

export function OptionTimes() {
  const { tradeInfo, times, onTimeChange } = useOptionExchangeContext()
  const timesOptions = times.map(item => {
    return {
      label: formatTimeLabel(item.period),
      value: item.id,
    }
  })
  const onChange = (id: any) => {
    const time = times.find(item => item.id === id)
    if (!time) return
    onTimeChange(time)
  }

  return (
    <div>
      <div className="flex px-4 pt-2 pb-2 mb-2 overflow-x-auto">
        <TradeButtonRadios
          hasGap
          bothClassName="text-sm h-30 font-medium rounded px-3 !mr-3 !last:mr-0  border-0.5 border-solid"
          inactiveClassName="text-text_color_02 border-transparent bg-bg_sr_color border-bg_sr_color"
          activeClassName="bg-brand_color_special_02 text-brand_color border-brand_color"
          options={timesOptions}
          onChange={onChange}
          value={tradeInfo.time?.id || ''}
        />
      </div>
    </div>
  )
}
