import { ThemeColorEnum, ThemeEnum } from '@/constants/base'
import { baseCommonStore } from '@/store/common'

/** 更新主题颜色 */
export function setThemeColor(color: ThemeColorEnum) {
  const store = baseCommonStore.getState()
  store._setThemeColor(color)
  if (color === ThemeColorEnum.blue) {
    store.setTheme(ThemeEnum.light)
  }
}
/** 设置 okx 主题色，锁定亮色 */
export function setOkxThemeColor() {
  setThemeColor(ThemeColorEnum.blue)
}
/** 设置默认主题色 */
export function setDefaultThemeColor() {
  setThemeColor(ThemeColorEnum.default)
}
export function initThemeColor() {
  const baseStore = baseCommonStore.getState()
  if (baseStore.isFusionMode) {
    setOkxThemeColor()
  }
}
