import { setAutoFreeze } from 'immer'
import { initServerApi } from './utils/init-server-api'
import { dynamicActivate } from '../i18n'

setAutoFreeze(false)

/**
 * 初始化 服务端能力
 */
export const onInstallForServer = async (pageContext: PageContext) => {
  const locale = pageContext.locale
  await dynamicActivate(locale!)
  /** 注册 api */
  pageContext = await initServerApi(pageContext)
  return pageContext
}
