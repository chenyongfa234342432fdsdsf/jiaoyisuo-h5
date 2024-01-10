import { baseUserStore } from '@/store/user'
import ws from '@/plugins/ws'
import futuresWs from '@/plugins/ws/futures'
import { baseCommonStore } from '@/store/common'
import { fetchAndUpdateUserInfo } from '@/helper/auth'
import { baseFutureTradeStore } from '@/store/trade/future'
import { baseGuideMapStore } from '@/store/server'
import optionWs from '@/plugins/ws/option'
import { c2cWs } from '@/plugins/ws/c2c'
import { fetchC2cModeToken } from '@/helper/store/common'
import { wsUrl, wsFuturesUrl, wsC2cUrl, wsOptionUrl } from '../../env'

export async function initWS() {
  ws.setOptions({
    wsUrl,
    success() {
      if (baseUserStore.getState().isLogin) {
        ws.login()
      }
    },
    getToken: () => {
      return baseUserStore.getState().token?.accessToken as unknown as string
    },
  })
  ws.connect()

  ws.onAddWsDelayTimeChange(time => {
    baseCommonStore.getState().setwsDelayTime(time)
  })

  futuresWs.setOptions({
    wsUrl: wsFuturesUrl,
    success() {
      if (baseUserStore.getState().isLogin) {
        futuresWs.login()
      }
    },
    getToken: () => {
      return baseUserStore.getState().token?.accessToken as unknown as string
    },
  })
  futuresWs.connect()
  optionWs.setOptions({
    wsUrl: wsOptionUrl,
    success() {
      if (baseUserStore.getState().isLogin) {
        futuresWs.login()
      }
    },
    getToken: () => {
      return baseUserStore.getState().token?.accessToken as unknown as string
    },
  })
  optionWs.connect()

  if (wsC2cUrl) {
    c2cWs.setOptions({
      wsUrl: wsC2cUrl,
      success() {
        if (baseUserStore.getState().isLogin) {
          c2cWs.login()
        }
      },
      getToken: () => {
        return baseUserStore.getState().c2cUserInfo.token
      },
    })
    c2cWs.connect()
  }
}

/** 登录态改变之后需要全局加载的信息 */
export function fetchAfterLogin() {
  if (!baseUserStore.getState().isLogin) {
    return
  }
  baseFutureTradeStore.getState().getPreference()
  baseFutureTradeStore.getState().settings.fetchTradeUnitSetting()
  fetchAndUpdateUserInfo()
  // 获取 引导图接口
  baseGuideMapStore.getState().fetchGuideMapQueryAll()
  if (baseCommonStore.getState().c2cMode.isPublic) {
    fetchC2cModeToken()
  }
}

baseUserStore.subscribe(
  userState => userState.isLogin,
  () => {
    if (baseUserStore.getState().isLogin) {
      ws.login()
      futuresWs.login()
      optionWs.login()
    } else {
      ws.logout()
      futuresWs.logout()
      optionWs.logout()
      baseUserStore.getState().setC2cUserInfo({
        token: '',
        uid: '',
      })
    }
    fetchAfterLogin()
  }
)
if (wsC2cUrl) {
  baseUserStore.subscribe(
    userState => userState.c2cUserInfo.token,
    token => {
      if (token) {
        c2cWs.login()
      } else {
        c2cWs.logout()
      }
    }
  )
}
