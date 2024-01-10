/**
 * 一键锁仓 - 滑动条
 */
import Slider from '@/components/slider'
import { useState } from 'react'
import styles from './index.module.css'

interface ILockSliderProps {
  points?: number[]
  value: number
  onChange: (e) => void
  onChangeAfter: (e) => void
}

function LockSlider(props: ILockSliderProps) {
  const { points = [0, 25, 50, 75, 100], value, onChange, onChangeAfter } = props
  const [showSlider, setShowSlider] = useState(false)
  const rangeVal = value <= 15 ? 0 : value <= 40 ? 25 : value <= 65 ? 50 : value <= 90 ? 75 : 100

  return (
    <div className={styles['lock-slider-root']}>
      <div className={`slider-top ${showSlider && 'opacity-0'}`}>
        {points.map((sliderTopItem: number) => {
          return (
            <div
              key={sliderTopItem}
              className={`slider-top-dot ${rangeVal === sliderTopItem && 'active-slider-top-dot'}`}
            >
              {rangeVal === sliderTopItem ? value : sliderTopItem}
            </div>
          )
        })}
      </div>

      <div className="slide-bottom">
        <Slider
          value={value}
          activeColor="var(--buy_up_color)"
          hidePointText
          points={[0, 25, 50, 75, 100]}
          showTooltip
          onChange={onChange}
          onChangeAfter={onChangeAfter}
          onDragStart={() => setShowSlider(true)}
          onDragEnd={() => setShowSlider(false)}
          className={`${!showSlider && 'opacity-0'}`}
        />
      </div>
    </div>
  )
}

export { LockSlider }
