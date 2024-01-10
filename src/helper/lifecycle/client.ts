import { addGlobalLibrary } from '@/helper/externals'
import { setAutoFreeze } from 'immer'
import { isRouteWithRefreshToken } from '@/helper/fusion-api'
import { logGitCommitId } from '../common'
import { initSentry } from './utils/sentry'
import { getDeviceId } from './utils/client-device-id'
import { initCache } from '../cache/common'
import { fetchAfterLogin, initWS } from './utils/init-ws'
import { initClientApi } from './utils/init-client-api'
import { initVConsoleOnDev } from '../log'
import { clientInjectFirst } from './utils/inject'
import { IsWebClip } from './utils/init-web-clip'
import { IsVestBag } from './utils/init-vest-bag'
import { dynamicActivate } from '../i18n'
import { initThemeColor } from '../theme'
import { initObserver } from './utils/init-observer'

setAutoFreeze(false)

/**
 * 初始化 客户端能力，例如注册 ws
 */
export const onInstallForClient = async (pageContext: PageContext) => {
  const locale = pageContext.locale
  initSentry()
  initObserver()
  await dynamicActivate(locale!)
  await getDeviceId()
  /** 判断是否是 web clip */
  IsWebClip(pageContext)
  /** 判断是否是 马甲包 */
  IsVestBag(pageContext)
  /** 判断是否要进入融合模式* */
  const isFusion = await isRouteWithRefreshToken(pageContext)
  /** 高优先级任务，例如打通 webview token */
  const isBlock = await clientInjectFirst(pageContext)
  /** 探测持久化储存 */
  initCache()
  /** 添加全局库 */
  addGlobalLibrary()
  /** 注册 WS */
  initWS()
  /** 注册 api */
  initClientApi()
  /** vconsole logger on dev env */
  initVConsoleOnDev()
  logGitCommitId()
  initThemeColor()
  if (isFusion === undefined) {
    return true
  }
  if (isBlock === true) {
    return true
  }
  /** 额外功能 */
  fetchAfterLogin()
}
