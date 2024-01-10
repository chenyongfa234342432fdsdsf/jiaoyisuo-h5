import { baseUserStore } from '@/store/user'
import { baseCommonStore } from '@/store/common'
import { businessId as businessIdEnv } from '@/helper/env'
import { FusionWhiteRouterApi } from '@/constants/fusion-api'
import { getIsFusionModeCache, getBusinessIdCache, getAccessKeyCache } from '@/helper/cache'
import { FusionModeLoginInvalidPopUp } from '@/features/user/utils/common'
import { setCookieBid } from '@/helper/cookie'

// 聚合判断是否是融合模式的方法
export function getAggregationFusion() {
  const isFusionApi = getIsFusionModeCache() || getAccessKeyCache()
  if (isFusionApi) {
    return true
  }
  return false
}

const keywordBlocking = ['c2c', 'withdraw', 'markets/spot', 'orders/spot']

/** 判断路由是否在白名单（融合模式下）* */
export function isRouteInWhileList(pathname: string) {
  // 返回 false 表示不拦截
  const isTrue = keywordBlocking.some(keyword => pathname.includes(keyword))
  if (isTrue) return true
  const whiteList = FusionWhiteRouterApi
  for (let item of whiteList) {
    if (
      pathname === item ||
      (pathname &&
        (pathname.startsWith(`${item}/`) || pathname.startsWith(`${item}?`)) &&
        pathname.length > item.length + 1)
    ) {
      return false
    }
  }
  return true
}

// 融合模式判断路由白名单
export function isRouteInWhitePath(path: string) {
  const { isFusionMode } = baseCommonStore.getState()
  return isFusionMode ? isRouteInWhileList(path) : false
}

// 判断是否为融合模式获取 bid
export function getAggregationBusinessId() {
  return getBusinessIdCache() || businessIdEnv
}

/** 判断当前路由是否带 refreshToken* */
export async function isRouteWithRefreshToken(pageContext) {
  const { isLogin, clearUserCacheData } = baseUserStore.getState()
  const {
    isFusionMode,
    restockToken,
    setFusionMode,
    setAccessKey,
    setBusinessId,
    updateMerchantToken,
    setRestockToken,
  } = baseCommonStore.getState()

  const { urlParsed } = pageContext
  const fusionModalToken = urlParsed?.search ?? {}
  /** 参数判断融合模式状态* */
  const { refreshToken, businessId, h5AccessKey } = fusionModalToken
  const isMerge = !!refreshToken && !!businessId && !!h5AccessKey
  /** 设置融合参数并调用接口更新 token* */
  async function handleMergeModeUserInfo() {
    await clearUserCacheData()
    await setRestockToken(refreshToken)
    await setBusinessId(businessId)
    await setAccessKey(h5AccessKey)
    await updateMerchantToken(refreshToken, urlParsed?.pathname)
  }
  /** 判断是否是融合模式并设置状态* */
  !isFusionMode && setFusionMode(isMerge)
  /** 登录态判断 */
  if (isLogin) {
    if (refreshToken && restockToken) {
      if (refreshToken === restockToken) {
        history?.pushState({}, '', urlParsed?.pathname)
        return false
      }

      await handleMergeModeUserInfo()
      return false
    }
  }

  /** 融合模式更新信息 */
  if (isMerge) {
    setCookieBid(businessId)
    await handleMergeModeUserInfo()
    return false
  }

  /** 融合商户未登录处理 */
  if (isFusionMode && !isMerge && !isLogin) {
    FusionModeLoginInvalidPopUp()
  }

  return false
}

export const isFusionApiImage = (name?: string) => {
  const { isFusionMode } = baseCommonStore.getState()
  if (isFusionMode) {
    return 'fusion_api/fusion_api_no_data'
  }
  return name || 'icon_default_no_order'
}
