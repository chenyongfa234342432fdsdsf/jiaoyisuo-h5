import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import { createUpdateProp } from '@/helper/store'
import {
  NIM,
  browserAdapters,
  MsgService,
  MsgLogService,
  SessionService,
  TeamService,
  cloudStorageService,
} from 'nim-web-sdk-ng/dist/esm'
import { ImListType } from '@/features/c2c/im/common'
import { getImToken } from '@/apis/c2c/im'
import { baseUserStore } from '@/store/user'
import produce from 'immer'

type IStore = ReturnType<typeof getStore>

type BaseInfoStore = ReturnType<typeof getBaseInfoStore>

function getBaseInfoStore(set, get) {
  return {
    unreadMessagesNumber: 0,
    async InitC2CIm() {
      /** 获取配置信息 */
      const res = await getImToken({
        customConfig: {
          withFastPayServer: true,
        },
      })
      if (!res.isOk && !res.data) return

      const settings = res.data
      const userInfo = baseUserStore.getState()?.userInfo

      /** 设置浏览器适配器 */
      NIM.setAdapters(browserAdapters)
      /** 消息服务 */
      NIM.registerService(MsgService, 'msg')
      /** 云服务，上传图片 必须先注册此服务 */
      NIM.registerService(cloudStorageService, 'cloudStorage')
      /** 历史消息 */
      NIM.registerService(MsgLogService, 'msgLog')
      /** 本地 session 记录 */
      NIM.registerService(SessionService, 'session')
      /** 群组服务 */
      NIM.registerService(TeamService, 'team')

      /** 单例模式 */
      return NIM.getInstance({
        appkey: settings?.appKey,
        account: baseUserStore.getState().c2cUserInfo.uid || userInfo?.uid,
        token: settings?.token,
        // debugLevel: 'error',
      })
    },
    async getUnreadMessagesNumber(tid: string) {
      const state: IStore = get()
      const nimSDK: any = await state.InitC2CIm()

      nimSDK.on('msg', (res: ImListType) => {
        if (tid === res.target) {
          set((store: IStore) => {
            return produce(store, _store => {
              _store.unreadMessagesNumber += 1
            })
          })
        }
      })

      await nimSDK.connect()
    },
    resetUnreadMessagesNumber() {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.unreadMessagesNumber = 0
        })
      })
    },
  }
}

function getStore(set, get) {
  return {
    ...createUpdateProp<BaseInfoStore>(set),
    ...getBaseInfoStore(set, get),
  }
}

const baseC2cImStore = create(subscribeWithSelector(getStore))

const useC2cImStore = createTrackedSelector(baseC2cImStore)

export { useC2cImStore, baseC2cImStore }
