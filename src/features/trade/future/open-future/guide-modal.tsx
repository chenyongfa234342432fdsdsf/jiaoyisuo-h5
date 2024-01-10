import Icon from '@/components/icon'
import { OnlyOnePopup } from '@/components/only-one-overlay'
import PromptIcon from '@/components/prompt-icon'
import { useFutureTradeStore } from '@/store/trade/future'
import { Button } from '@nbit/vant'
import classNames from 'classnames'
import LazyImage from '@/components/lazy-image'
import { useState } from 'react'
import PopupHeader from '@/components/popup-header'
import { t } from '@lingui/macro'
import { getThemeSuffix } from '@/helper/common'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { usePageContext } from '@/hooks/use-page-context'
import { link } from '@/helper/link'
import styles from './guide-modal.module.css'

function getOptions() {
  return [
    {
      title: t`features_trade_future_open_future_guide_modal_udk13plmxf`,
      img: `image_contract_novice`,
      desc: [
        t`features_trade_future_open_future_guide_modal_v6m3ljijpx`,
        t`features_trade_future_open_future_guide_modal_zdi_oi_9da`,
      ],
      extra: 'guide',
      buttonText: t`features_trade_future_open_future_guide_modal_1uit5kentm`,
    },
    {
      title: t`features_trade_future_open_future_guide_modal_kblyusb5ol`,
      img: 'image_contract_professional',
      desc: [
        t`features_trade_future_open_future_guide_modal_2jo913nw2x`,
        t`features_trade_future_open_future_guide_modal_zl7t8qnnlt`,
      ],
      extra: '',
      buttonText: t`features_trade_future_open_future_guide_modal_xakpkvkhju`,
    },
  ]
}

export function GuideModal() {
  const options = getOptions()
  const { setIsTutorialMode } = useFutureTradeStore()
  const [selectedOptionTitle, setSelectedOptionTitle] = useState('')
  const selectedOption = options.find(item => item.title === selectedOptionTitle)
  const pageContext = usePageContext()
  const onOk = () => {
    link(pageContext.path.split('?')[0], {
      overwriteLastHistoryEntry: true,
    })
    setIsTutorialMode(selectedOption ? !!selectedOption.extra : false)
  }

  return (
    <OnlyOnePopup closeOnClickOverlay={false} position="bottom" visible>
      <div className={styles['guide-modal-wrapper']}>
        <PopupHeader title="" onClose={onOk} />
        <div className="options flex-1 h-0 overflow-y-auto">
          {options.map(item => {
            const isSelected = item.title === selectedOptionTitle
            const onSelect = () => {
              setSelectedOptionTitle(item.title)
            }

            return (
              <div
                className={classNames('option', {
                  'option-selected': isSelected,
                })}
                onClick={onSelect}
                key={item.title}
              >
                <div className="option-content">
                  {isSelected && <Icon name="contract_select" className="selected-icon" />}
                  <div className="option-title">{item.title}</div>
                  <div className="text-center">
                    <LazyImage
                      className="w-60"
                      src={`${oss_svg_image_domain_address}guide/future_user_category/${
                        item.img
                      }${getThemeSuffix()}.png`}
                      alt=""
                    />
                  </div>
                  <div className="-mt-2">
                    {item.desc.map(desc => (
                      <div className="text-text_color_02 mb-2 last:mb-0" key={desc}>
                        <PromptIcon /> {desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="px-4">
          <Button block onClick={onOk} type="primary" disabled={!selectedOptionTitle}>
            {selectedOption?.buttonText || options[0].buttonText}
          </Button>
        </div>
      </div>
    </OnlyOnePopup>
  )
}
