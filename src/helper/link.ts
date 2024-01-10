import { I18nsEnum } from '@/constants/i18n'
import { baseCommonStore } from '@/store/common'
import { setHistoryStack, getHistoryStack } from '@/helper/cache'
import { navigate } from 'vite-plugin-ssr/client/router'
import { isAbsoluteUrl } from '@/helper/common'
import { isRouteInWhileList } from '@/helper/fusion-api'
import { isAuthModalDynamicList } from '@/helper/modal-dynamic'
import { basePluginStore } from '@/store/plugin'
import { JsbridgeCommandsEnum } from '@/constants/js-bridge'
import { removeLocale } from './i18n'
import { isApp } from './is-app'
import { envIsClient } from './env'

export interface ILinkConfig {
  /** 保持登录位置 */
  keepScrollPosition?: boolean | undefined
  /** 不要在浏览器的历史记录中创建新条目；新 URL 将替换当前 URL（这有效地从历史记录中删除当前 URL */
  overwriteLastHistoryEntry?: boolean | undefined
  /** 打开新页面 */
  target?: boolean
}

function addUrlSuffixIsOpen(url: string) {
  return `${url}${url.includes('?') ? '&' : '?'}isOpen=true`
}
function getUrlSuffixIsOpen(url: string) {
  return url.includes('isOpen')
}
// 直接引入会有循环依赖的问题
const requestWithLoadingDynamicImport = import('./order').then(res => res.requestWithLoading)

export const link = (url?: string, goConfig?: ILinkConfig) => {
  const { locale, isFusionMode } = baseCommonStore.getState()
  const { timestamp = Date.now() } = window.history.state || {}
  const historyStackList = getHistoryStack() ? [...getHistoryStack(), { timestamp, url }] : [{ timestamp }]
  if (!goConfig?.overwriteLastHistoryEntry) {
    setHistoryStack(historyStackList)
  }
  const _lang = locale
  const lang = _lang === I18nsEnum['en-US'] ? '' : `/${_lang}`
  const sanitisedUrl = removeLocale(url)
  let _url = `${lang}${sanitisedUrl}`
  if (isAbsoluteUrl(url)) _url = url as string
  if (goConfig?.target) {
    // 不加 random 多次打开会是同一个页面
    return window.open(addUrlSuffixIsOpen(_url), `target_${Math.random()}`)
  }
  // 如何是融合模式，且路由在黑名单中，则不跳转
  if (isFusionMode && sanitisedUrl) {
    const isTrue = isRouteInWhileList(sanitisedUrl)
    if (isTrue) {
      return
    }
  }

  if (sanitisedUrl && isAuthModalDynamicList(sanitisedUrl)) return

  const promise = navigate(_url, {
    overwriteLastHistoryEntry: !!goConfig?.overwriteLastHistoryEntry,
    keepScrollPosition: !!goConfig?.keepScrollPosition,
  })
  if (envIsClient) {
    requestWithLoadingDynamicImport.then(requestWithLoading => requestWithLoading(promise))
  }
  return promise
}

export const navigateBackHelper = () => {
  function closeWebview() {
    // app 下尝试关闭
    if (isApp()) {
      basePluginStore.getState().jsBridge?.call(JsbridgeCommandsEnum.finishPage)
    }
  }
  const historyStack = getHistoryStack() || []
  // historyStack 是同 url 缓存的，新开窗口时存在一些问题
  if (historyStack.length === 0) {
    closeWebview()
    link('/')
    return
  }
  if (getUrlSuffixIsOpen(window.location.href)) {
    closeWebview()
    // 关闭了
    window.close()
    // 不能关闭的话，跳转到首页兜底，实测确实关闭不了
    link('/')
    return
  }

  history.back()
}
