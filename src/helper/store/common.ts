import { baseCommonStore } from '@/store/common'
import { baseUserStore } from '@/store/user'
import { loginWithFastPayApiRequest } from '@/apis/c2c/mode'

export async function fetchC2cModeToken() {
  const res = await loginWithFastPayApiRequest({})
  if (!res.isOk || !res.data) return
  baseCommonStore.getState().setC2cMode({
    accessKey: res.data.h5AccessKey,
  })
  baseUserStore.getState().setC2cUserInfo({
    token: res.data.token,
    uid: res.data.uid?.toString(),
  })
}
