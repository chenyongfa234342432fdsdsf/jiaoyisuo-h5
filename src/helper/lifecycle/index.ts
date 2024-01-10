import { ThemeEnum, ThemeColorEnum } from '@/constants/base'
import { baseCommonStore } from '@/store/common'
import { initializeLayoutStore } from '@/helper/layout'
import { setThemeColor } from '../theme'

/**
 * 初始化 客户端、服务端能力
 */
export const onInstallForApp = async (pageContext: PageContext) => {
  const locale = pageContext.locale
  /** 同步初始化 common store 信息 */
  const commonStore = baseCommonStore.getState()

  commonStore.setLocale(locale)
  commonStore.setTheme(pageContext.theme || ThemeEnum.light)
  if (pageContext.themeColor) {
    setThemeColor(pageContext.themeColor as ThemeColorEnum)
  }

  /** Layout store */
  initializeLayoutStore(pageContext)
}
