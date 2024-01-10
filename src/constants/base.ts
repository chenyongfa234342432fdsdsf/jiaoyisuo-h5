/** 与业务无关的 基础模块 */
/** */

import { t } from '@lingui/macro'

/** 主题 */
export enum ThemeEnum {
  light = 'light',
  dark = 'dark',
}

export enum ThemeBusinessEnum {
  chainstar = 'chainstar',
}

export const ThemeChartMap = {
  light: 'Light',
  dark: 'Dark',
}

export enum ThemeColorEnum {
  default = 'default',
  orange = 'binance',
  blue = 'okx',
  green = 'kucoin',
}

export function getThemeColorEnumName(color = ThemeColorEnum.default) {
  return {
    [ThemeColorEnum.default]: t`features_agent_agent_manage_index_5101556`,
    [ThemeColorEnum.orange]: t`constants_base_faintgjfmj`,
    [ThemeColorEnum.blue]: t`constants_base_cgqsgxcing`,
    [ThemeColorEnum.green]: t`constants_base_ujvprrl8ro`,
  }[color]
}
export const ThemeBackGroundColor = {
  light: '#ffffff',
  dark: '#101014',
}

export const pageOmitKeys = [
  '_serverFiles',
  '_parseUrl',
  '_pageRoutes',
  '_pageIsomorphicFileDefault',
  '_pageIsomorphicFile',
  '_pageContextRetrievedFromServer',
  '_onBeforeRouteHook',
  '_onBeforeRouteHook',
  '_objectCreatedByVitePluginSsr',
  '_isFirstRender',
  '_comesDirectlyFromServer',
  '_baseUrl',
  '_allPageIds',
  '_allPageFiles',
  'exports',
  'Page',
  '_baseAssets',
  '_getPageAssets',
  '_isPageContextRequest',
  '_isPreRendering',
  '_pageClientPath',
  '_pageId',
  '_pageServerFile',
  '_pageServerFileDefault',
  '_passToClient',
  //
  '_pageFilesLoaded',
  '_pageFilesAll',
  '_pageFilesAll',
  'pageExports',
  'exportsAll',
]
