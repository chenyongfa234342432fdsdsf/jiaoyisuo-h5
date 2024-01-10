import { getNotices } from '@/apis/home'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { Dialog } from '@nbit/vant'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'
import Notification from '@/components/notification'
import { queryTradeNotifications } from '@/apis/trade'
import { ITradeNotification } from '@/typings/api/trade'
import { useTradeCurrentFutureCoin, useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { link } from '@/helper/link'
import { TradeModeEnum } from '@/constants/trade'
import classNames from 'classnames'
import { FutureSettingKLinePositionEnum } from '@/constants/future/settings'
import { useSpotTradeStore } from '@/store/trade/spot'
import { useFutureTradeStore } from '@/store/trade/future'
import { useAnnouncementStore } from '@/store/announcement'

type ITradeNotificationProps = {
  mode?: TradeModeEnum
}

function TradeNotification({ mode = TradeModeEnum.spot }: ITradeNotificationProps) {
  const currentSpotCoin = useTradeCurrentSpotCoin()
  const currentFutureCoin = useTradeCurrentFutureCoin()
  const { settings: spotTradeSettings } = useSpotTradeStore()
  const { settings: futureTradeSettings } = useFutureTradeStore()
  const { seenNoticeIdsCache, setSeenNoticeId } = useAnnouncementStore()
  const currentCoin = mode === TradeModeEnum.spot ? currentSpotCoin : currentFutureCoin
  const settings = mode === TradeModeEnum.spot ? spotTradeSettings : futureTradeSettings
  const { generalSettings } = useTradeStore()
  const [notifications, setNotifications] = useState<ITradeNotification[]>([])
  const close = async () => {
    settings.updateNoticeBarVisible(false)
    if (generalSettings.firstCloseNoticeBar) {
      Dialog.alert({
        message: t`features_trade_common_notification_index_510276`,
        title: t`features_trade_common_notification_index_510277`,
        confirmButtonText: t`features_trade_common_notification_index_5101066`,
        className: 'dialog-confirm-wrapper confirm-black',
      })
      generalSettings.updateFirstCloseNoticeBar(false)
    }
  }
  const fetchNotifications = async () => {
    if (!currentCoin.id) {
      return
    }
    const res = await queryTradeNotifications({
      operateType: 3,
      symbol: mode === TradeModeEnum.spot ? 'spot' : 'swap',
      coindIdList: [currentCoin.id],
    } as any)
    if (!res.data || !res.isOk) {
      settings.updateNotificationLoaded(true)
      return
    }
    setNotifications(res.data!.lampList || [])
    settings.updateNotificationLoaded(true)
    const targetNotifications =
      res.data!.lampList?.filter?.(item => {
        return item.forceViewModal === 1
      }) || []

    // 页面初次进入如果应该弹窗，那么弹窗 => 切换币対，应该弹窗也弹窗
    // 从其它页面回退但是币対没有改变，不弹窗
    if (settings.preCoinIdForNotifications === currentCoin.id) {
      return
    }
    settings.updatePreCoinIdForNotifications(currentCoin.id!)
    for (let i = 0; i < targetNotifications.length; i += 1) {
      const targetNotification = targetNotifications[i]
      const noticeId = targetNotification.id
      if (seenNoticeIdsCache.includes(noticeId)) continue
      const helpLink = `/announcement/article/${noticeId}`
      // eslint-disable-next-line no-await-in-loop
      await Dialog.confirm({
        title: t`features_trade_common_notification_index_5101065`,
        // 一行居中，多行左对齐
        message: (
          <div className="text-center">
            <p className="inline-block text-left">{targetNotification.name}</p>
          </div>
        ),
        className: 'dialog-confirm-wrapper',
        confirmButtonText: helpLink ? t`common.confirm` : t`features_trade_common_notification_index_5101066`,
        showCancelButton: !!helpLink,
        confirmButtonColor: 'var(--text_color_01)',
        cancelButtonColor: 'var(--brand_color)',
        cancelButtonText: t`features_trade_future_settings_margin_index_650`,
        onCancel() {
          setSeenNoticeId(noticeId)
          link(helpLink, {
            target: true,
          })
        },
        onConfirm() {
          setSeenNoticeId(noticeId)
        },
      }).catch(() => {})
    }
  }
  useEffect(() => {
    setNotifications([])
    fetchNotifications()
  }, [currentCoin.id])
  if (!settings.noticeBarVisible || notifications.length === 0) {
    return null
  }

  return (
    <div
      className={classNames({
        'mb-2.5': generalSettings.kLinePosition !== FutureSettingKLinePositionEnum.top,
      })}
    >
      <Notification notifications={notifications} onClose={close} />
    </div>
  )
}

export default TradeNotification
