import { getMaintenanceRoutePath } from '@/constants/maintenance'
import { envIsClient, envIsServer } from '@/helper/env'
import { extractLocale, localeDefault } from '@/helper/i18n'
import { baseCommonStore } from '@/store/common'

export function onBeforeRoute(pageContext) {
  let { urlOriginal, locale, path } = pageContext
  const { maintenanceMode } = baseCommonStore.getState()
  const { urlWithoutLocale, locale: currentLocale } = extractLocale(urlOriginal)
  if (!path) {
    path = urlWithoutLocale
    locale = currentLocale || localeDefault
  }

  // overwrite to maintenance path on maintenance mode on client
  if (maintenanceMode.isMaintenance && envIsClient) path = getMaintenanceRoutePath()

  return {
    pageContext: {
      urlOriginal: envIsServer ? urlWithoutLocale : path,
      path,
      locale,
    },
  }
}
