import { baseCommonStore } from '@/store/common'
import { fetchC2cModeToken } from '@/helper/store/common'
import { c2cBaseUrl, envIsServer } from '@/helper/env'
import { MarkcoinRequestConfig } from '@/plugins/request'
import { baseUserStore } from '@/store/user'
import { getIsLogin } from '@/helper/auth'
import { createRequestTargetInterceptor } from './create-request-target'

let fetchTokenPromise: undefined | Promise<void>

function awaitC2cLoaded() {
  return new Promise(resolve => {
    if (baseCommonStore.getState().c2cMode.loaded) {
      resolve(true)
      return
    }
    const unsubscribe = baseCommonStore.subscribe(
      a => a.c2cMode.loaded,
      () => {
        if (baseCommonStore.getState().c2cMode.loaded) {
          unsubscribe()
          resolve(true)
        }
      }
    )
  })
}
async function getHeaders(config: MarkcoinRequestConfig) {
  // 上面不会启用，所以可以 any
  if (envIsServer) {
    return {} as any
  }
  let c2cMode = baseCommonStore.getState().c2cMode
  let c2cUserInfo = baseUserStore.getState().c2cUserInfo
  // 默认为 undefined，不设置为 false 即为 true
  if (!c2cUserInfo.token && config.withFastPayToken !== false && getIsLogin()) {
    if (!fetchTokenPromise) {
      fetchTokenPromise = fetchC2cModeToken()
    }
    await fetchTokenPromise
  }
  c2cMode = baseCommonStore.getState().c2cMode
  c2cUserInfo = baseUserStore.getState().c2cUserInfo
  return {
    accessToken: c2cUserInfo.token,
    businessId: c2cMode.c2cBusinessId,
    accessKey: c2cMode.accessKey,
  }
}
async function getEnabled(config: MarkcoinRequestConfig) {
  if (envIsServer) {
    return false
  }
  if (!config.url?.startsWith('/v1/c2c') && !config.withFastPayServer) {
    return false
  }
  await awaitC2cLoaded()
  return baseCommonStore.getState().c2cMode.isPublic
}
export const fastPayRequestInterceptor = createRequestTargetInterceptor({
  baseURL: c2cBaseUrl,
  getEnabled,
  getHeaders,
  // 发生 401 的时候清空 token，触发重新获取，这里 401 并不需要重新登录，所以出错时直接回到首页
  whenAuthError() {
    fetchTokenPromise = undefined
    const { setC2cUserInfo } = baseUserStore.getState()
    setC2cUserInfo({
      token: '',
      uid: '',
    })
    return true
  },
})
