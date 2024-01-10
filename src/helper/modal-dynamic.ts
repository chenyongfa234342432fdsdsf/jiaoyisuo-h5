import { modalDynamicRouter } from '@/helper/env'
import { MarketListRouteEnum } from '@/constants/market/market-list/market-module'

const moduleData = JSON.parse(modalDynamicRouter)
/** 根据模块 key 获取模块动态配置显示状态 */
export function getAuthModuleStatusByKey(key: AuthModuleEnum) {
  if (moduleData && key && moduleData[key]) {
    return true
  }
  return false
}

/** 根据 key 返回相应模块* */
export const getAuthModuleRoutes = data => {
  const resultRoutes: any[] = []
  for (let key in data) {
    if (moduleData[key] === false) {
      continue
    }
    resultRoutes.push(data[key])
  }
  return resultRoutes
}

/** 头部菜单枚举 */
export enum AuthModuleEnum {
  /** 现货 */
  spot = 'spot',
  /** 合约 */
  contract = 'contract',
  /** c2c */
  c2c = 'c2c',
  /** 娱乐区 */
  entertainment = 'entertainment',
  /** 三元期权 */
  options = 'options',
}

/** 获取行情模块显示状态 - 如果现货和合约都配置为不展示 */
export function getAuthMarketsModuleStatus() {
  if (moduleData && moduleData[AuthModuleEnum.spot] === false && moduleData[AuthModuleEnum.contract] === false) {
    return false
  }
  return true
}

export function getAuthModuleRouterStatus() {
  let moduleRouter: string[] = []
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    moduleRouter = [...moduleRouter, MarketListRouteEnum.spot]
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.contract)) {
    moduleRouter = [...moduleRouter, MarketListRouteEnum.futures]
  }
  if (getAuthModuleStatusByKey(AuthModuleEnum.spot)) {
    moduleRouter = [...moduleRouter, MarketListRouteEnum.sector]
  }
  return moduleRouter
}

/** 一下是动态路由模块化判断* */

/** 合约路由* */
const futuresRoutes = [
  '/futures',
  '/future/calculator',
  '/future/future-fundrecord-detail',
  '/future/groups',
  '/future/questionnaire',
  '/future/settings/additional-margin',
  '/future/settings/margin-coin',
  '/future/settings/margin/adjust-coin',
  '/future/settings/margin/auto-detail',
  '/future/settings/margin/records',
  '/future/settings/module-order',
  '/future/settings/order-confirm',
  '/future/settings/price-protect',
  '/future/settings/retrieval-method',
  '/future/settings/select-version',
  '/future/settings/settlement-currency',
  '/future/settings',
  '/future/stop-profitloss',
  '/futures/funding-history',
  '/futures/funding-history/quarterly',
  '/markets/futures',
]

/** 现货* */
const spotRoutes = [
  '/orders/spot',
  '/markets/spot',
  '/markets/sector',
  '/market/activity',
  '/my/futrue/detail',
  '/market/detail',
  '/markets/sector-detail',
  '/markets/sector-table',
]

/** 行情路由* */
const marketsRoutes = ['/markets', '/markets/search', '/trade/help/fee']

/** C2C 路由* */
const c2cRouters = [
  '/c2c/ads/history',
  '/c2c/adv/details/',
  '/c2c/center/account',
  '/c2c/center/capital-transfer',
  '/c2c/center/list-operation',
  '/c2c/center/set-up',
  '/c2c/center',
  '/c2c/fast-trade',
  '/c2c/merchant/application-success',
  '/c2c/merchant/application',
  '/c2c/merchant',
  '/c2c/orders/appeal-upload',
  '/c2c/orders/appeal',
  '/c2c/orders/cancel',
  '/c2c/orders/detail',
  '/c2c/orders/im',
  '/c2c/orders',
  '/c2c/payments/collection-account',
  '/c2c/payments/payment-details',
  '/c2c/payments',
  '/c2c/post/adv/result',
  '/c2c/post/adv',
  '/c2c/trade',
]

/** 判断路由是否在动态模块中放开* */
export function isAuthModalDynamicList(pathname: string) {
  const data = {
    [AuthModuleEnum.spot]: spotRoutes,
    [AuthModuleEnum.contract]: futuresRoutes,
    [AuthModuleEnum.c2c]: c2cRouters,
  }
  let resultRoutes: any[] = []
  for (let key in data) {
    if (moduleData[key] === false) {
      resultRoutes.push(...data[key])
    }
  }
  if (!getAuthMarketsModuleStatus()) {
    resultRoutes = [...resultRoutes, ...marketsRoutes]
  }
  for (let item of resultRoutes) {
    // true 代表需要禁止跳转
    if (
      pathname === item ||
      (pathname &&
        (pathname.startsWith(`${item}/`) || pathname.startsWith(`${item}?`)) &&
        pathname.length > item.length + 1)
    ) {
      return true
    }
  }
  return false
}
