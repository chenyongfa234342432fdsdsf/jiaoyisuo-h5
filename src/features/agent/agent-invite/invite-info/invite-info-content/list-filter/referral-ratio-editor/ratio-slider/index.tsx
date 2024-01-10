import { useEffect, useState } from 'react'
import { getTaActivitiesSliderPoints } from '@/helper/agent/invite'
import Slider from '@/components/slider'
import { Toast } from '@nbit/vant'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export function InviteInfoRatioSlider({ value, max, onchange, originValue }) {
  const sliderRange = getTaActivitiesSliderPoints(max)
  const [currentValue, setcurrentValue] = useState(value)

  useEffect(() => {
    onchange && onchange(currentValue)
  }, [currentValue])

  if (max === 0) return <span></span>
  return (
    <div className="wrapper">
      <Slider
        // showTooltip
        hidePointText
        points={sliderRange}
        className={styles.scoped}
        value={currentValue}
        max={max}
        min={sliderRange[0]}
        onChange={v => {
          if (v < originValue) {
            Toast.info(
              t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_ratio_slider_index_sy19zpy7w9`
            )
            return
          }
          setcurrentValue(v)
        }}
        pointSuffix="%"
      />

      <div className="my-1 flex justify-between text-text_color_01 text-xs pt-2">
        <span>
          {t`features_agent_invite_operation_index_5101486`} {max - currentValue}%
        </span>
        <span>
          {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`} {currentValue}%
        </span>
      </div>
    </div>
  )
}
