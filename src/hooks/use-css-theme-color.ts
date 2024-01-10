import { useCommonStore } from '@/store/common'
import { useEffect, useState } from 'react'

// 从 css 变量中获取颜色
export function useCssThemeColors() {
  const { theme, themeColor } = useCommonStore()
  const [colors, setColors] = useState({
    brandColor: '',
    textColor03: '',
    textColor01: '',
    cardBgColor01: '',
    lineColor02: '',
    buttonText01: '',
  })

  useEffect(() => {
    const styles = getComputedStyle(document.body)

    setColors({
      brandColor: styles.getPropertyValue('--brand_color'),
      textColor03: styles.getPropertyValue('--text_color_03'),
      cardBgColor01: styles.getPropertyValue('--card_bg_color_01'),
      textColor01: styles.getPropertyValue('--text_color_01'),
      lineColor02: styles.getPropertyValue('--line_color_02'),
      buttonText01: styles.getPropertyValue('--button_text_01'),
    })
  }, [theme, themeColor])

  return colors
}
