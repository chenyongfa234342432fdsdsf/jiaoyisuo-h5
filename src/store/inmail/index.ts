import { create } from 'zustand'
import produce from 'immer'
import ws from '@/plugins/ws'
import { t } from '@lingui/macro'
import { baseUserStore } from '@/store/user'
import { createTrackedSelector } from 'react-tracked'
import { InmailMessageEnum } from '@/constants/inmail'
import { WsThrottleTimeEnum, InmailTypeEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { envIsDev, envIsSGDev } from '@/helper/env'

type IStore = ReturnType<typeof getStore>
function getStore(set, get) {
  const getSettingDefault = () => [
    {
      id: InmailMessageEnum.market,
      name: t`features_message_index_5101225`,
      icon: 'msg_quotes_changes',
    },
    {
      id: InmailMessageEnum.price,
      name: t`features_message_index_5101226`,
      icon: 'msg_price_subscription',
    },
    {
      id: InmailMessageEnum.contract,
      name: t`features_message_index_5101227`,
      icon: 'msg_contract_alert',
      collapseIcon: 'msg_announcement_news',
    },
    {
      id: InmailMessageEnum.information,
      name: t`features_message_index_5101230`,
      icon: 'msg_system_notification',
      collapseIcon: 'msg_system_notification',
    },
    {
      id: InmailMessageEnum.announcement,
      name: t`features_inmail_push_settings_index_5101303`,
      icon: 'msg_announcement_news',
      collapseIcon: 'msg_announcement_news',
    },
    {
      id: InmailMessageEnum.currency,
      name: t`features_inmail_push_settings_index_5101304`,
      icon: 'msg_latest_activity',
      collapseIcon: 'msg_latest_activity',
    },
    {
      id: InmailMessageEnum.activity,
      name: t`features_inmail_push_settings_index_5101305`,
      icon: 'msg_new_currency',
      collapseIcon: 'msg_new_currency',
    },
  ]
  return {
    changeNum: 0,
    loginData: {
      action: 0,
      latestDeviceNo: '',
      isForceWindow: false,
      title: '',
      content: '',
    },
    loginModal: false,
    menuList: getSettingDefault(),
    setModalClose: value =>
      set(
        produce((draft: IStore) => {
          draft.loginModal = value
        })
      ),
    /** 通知站内信有 ws 推送来数据进行更新* */
    wsInmailDepthCallback: value =>
      set(
        produce((draft: IStore) => {
          value?.forEach(item => {
            const data = item?.noticeData
            if (data?.inboxMsgData) {
              // 站内信消息
              draft.changeNum += value.length
            } else if (data?.bizActionData) {
              const { deviceId, multipleLoginTime, clearUserCacheData, clearMultipleLoginTime } =
                baseUserStore.getState()
              /** 多点登录弹框提示* */
              const params = data?.bizActionData
              const eventTime = Number(item?.time || 0)
              const latestDeviceNo = params?.latestDeviceNo || ''
              /** 如果没有存时间，那代表第一次登录，不走下面逻辑 */
              if (!multipleLoginTime) return
              const isEventTime = multipleLoginTime < eventTime
              const isDeviceId = deviceId !== latestDeviceNo
              if (deviceId && isDeviceId && multipleLoginTime && isEventTime && params?.isForceWindow) {
                if (envIsSGDev || envIsDev) return
                /** 弹多点要把时间戳和用户信息清除 */
                clearUserCacheData()
                clearMultipleLoginTime()
                draft.loginData = params
                draft.loginModal = params?.isForceWindow
              }
            }
          })
        })
      ),
    wsInmailDepthSubscribe: () => {
      const state: IStore = get()
      ws.subscribe({
        subs: {
          biz: InmailTypeEnum.spot,
          type: InmailTypeEnum.type,
        },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.increment,
        callback: state.wsInmailDepthCallback,
      })
    },
    wsInmailDepthUnSubscribe: () => {
      const state: IStore = get()
      ws.unsubscribe({
        subs: {
          biz: InmailTypeEnum.spot,
          type: InmailTypeEnum.type,
        },
        callback: state.wsInmailDepthCallback,
      })
    },
  }
}

const baseInmailStore = create(getStore)
const useInmailStore = createTrackedSelector(baseInmailStore)

export { useInmailStore, baseInmailStore }
