import Icon from '@/components/icon'
import { OnlyOneActionSheet } from '@/components/only-one-overlay'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { getC2cFastTradePageRoutePath, getC2cTradePageRoutePath } from '@/helper/route'

export function SwitchTradeMode() {
  const { path } = usePageContext()
  const [selectedMode, setSelectedMode] = useState(path.split('?')[0])
  const [visible, setVisible] = useState(false)
  const modes = [
    {
      name: t`features_assets_overview_c2c_overview_knro0veozagstcy9ungh3`,
      icon: 'c2c/c2c_fast_transaction',
      isRemoteUrl: true,
      desc: t`features_c2c_trade_switch_trade_mode_p85le0vah1u1irfnwhhgq`,
      value: getC2cFastTradePageRoutePath(),
    },
    {
      name: t`features_c2c_trade_index_25101626`,
      icon: 'home_c2c_transaction',
      desc: t`features_c2c_trade_switch_trade_mode_43eggsslz0lgnlyl8q8z3`,
      value: getC2cTradePageRoutePath(),
    },
  ]
  const selectedModeItem = modes.find(mode => mode.value === selectedMode)
  const onModeChange = (value: string) => {
    setVisible(false)
    link(value, {
      overwriteLastHistoryEntry: true,
    })
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center text-base" onClick={() => setVisible(true)}>
        {selectedModeItem?.name}{' '}
        <Icon name="regsiter_icon_drop" className="text-xs scale-75 translate-y-px ml-0.5" hasTheme />
      </div>
      <OnlyOneActionSheet onClose={() => setVisible(false)} closeOnClickOverlay visible={visible}>
        <div className="text-text_color_01">
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="text-base font-medium">{t`features_c2c_trade_switch_trade_mode_bd1mgvrlll-wwhbyqgjlr`}</div>
            <Icon hasTheme name="close" className="text-xl" onClick={() => setVisible(false)} />
          </div>
          <div className="mb-4">
            {modes.map(mode => (
              <div
                key={mode.value}
                className="flex items-center p-4"
                onClick={() => {
                  onModeChange(mode.value)
                }}
              >
                {mode.isRemoteUrl ? (
                  <LazyImage src={`${oss_svg_image_domain_address}${mode.icon}.png`} className="mr-4 w-6" />
                ) : (
                  <Icon name={mode.icon} isRemoteUrl={mode.isRemoteUrl} className="mr-4 text-2xl" />
                )}

                <div className="">
                  <div
                    className={classNames('text-base font-medium mb-1', {
                      // 'text-brand_color': mode.value === selectedMode,
                    })}
                  >
                    {mode.name}
                  </div>
                  <div className="text-xs text-text_color_02">{mode.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </OnlyOneActionSheet>
    </div>
  )
}
