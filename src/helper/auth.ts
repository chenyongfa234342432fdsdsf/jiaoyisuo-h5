import { baseUserStore } from '@/store/user'
import { getMemberBaseSettingsInfo, getMemberUserInfo } from '@/apis/user'
import { UserInfoType } from '@/typings/api/user'
import { link } from './link'
import { removeCookieToken, setCookieToken } from './cookie'

export const setToken = tokenObj => {
  if (tokenObj?.token) {
    setCookieToken(tokenObj.token)
    const userStore = baseUserStore.getState()
    userStore.setToken({
      accessToken: tokenObj.token,
      refreshToken: tokenObj.refreshToken,
      accessTokenExpireTime: tokenObj.tokenExpireTime,
      refreshTokenExpireTime: tokenObj.refreshTokenExpireTime,
    })
    userStore.setLogin(true)
  }
  if (tokenObj?.accessToken) {
    setCookieToken(tokenObj.accessToken)
    const userStore = baseUserStore.getState()
    userStore.setToken(tokenObj)
    userStore.setLogin(true)
  }
}

export const removeToken = async () => {
  removeCookieToken()
  const userStore = baseUserStore.getState()
  await userStore.setToken(null)
}

/**
 * @description: 获取是否是非登录状态
 */
export function getIsUnLogin() {
  const userStore = baseUserStore.getState()
  return !userStore.isLogin
}

/**
 * @description: 获取是否登录状态
 */
export function getIsLogin() {
  const userStore = baseUserStore.getState()
  return userStore.isLogin
}

/**
 * 间接重定向逻辑 更具 authTo unAuthTo 和登录态拿到重定向路由
 * 直接重定向逻辑 go
 */
export function getRedirectUrl(authTo, unAuthTo, go) {
  if (!!authTo && getIsLogin()) {
    return authTo
  }
  if (!!unAuthTo && getIsUnLogin()) {
    return unAuthTo
  }
  if (go) {
    return go
  }
}

/**
 * @description:获取登录状态，如果没登录会跳登录页，常用于资金页、交易页前置校验
 * @return isLogin
 */
export function checkLogin() {
  /** 未登录跳首页 */
  if (!getIsLogin()) {
    link('/login')
    return false
  }
  return true
}
/**
 * 拉取并更新用户信息到 store
 */
export function fetchAndUpdateUserInfo() {
  const userState = baseUserStore.getState()
  if (!userState.isLogin) {
    return
  }
  getMemberBaseSettingsInfo({}).then(res => {
    if (!res.isOk || !res.data) {
      return
    }
    userState.setPersonalCenterSettings(res.data)
    userState.setMemberBaseColor(res.data.marketSetting)
  })
  getMemberUserInfo({}).then(res => {
    if (res.isOk) {
      userState.setUserInfo(res.data as UserInfoType)
    }
  })
}
