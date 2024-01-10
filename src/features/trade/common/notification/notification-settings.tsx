import NavBar from '@/components/navbar'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'
import { Cell, Switch } from '@nbit/vant'
import { TradeModeEnum } from '@/constants/trade'
import { useFutureTradeStore } from '@/store/trade/future'
import { useSpotTradeStore } from '@/store/trade/spot'
import styles from './index.module.css'
import FullTip from '../full-tip'

function SettingCell({ mode }: { mode: TradeModeEnum }) {
  const { settings: spotTradeSettings } = useSpotTradeStore()
  const { settings: futureTradeSettings } = useFutureTradeStore()
  const settings = mode === TradeModeEnum.spot ? spotTradeSettings : futureTradeSettings

  const onChange = async (value: boolean) => {
    settings.updateNoticeBarVisible(value)
  }

  return (
    <Cell>
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">
          <span>{t`features_trade_common_notification_notification_settings_510274`}</span>
        </div>
        <Switch onChange={onChange} checked={settings.noticeBarVisible} size={24} />
      </div>
    </Cell>
  )
}

function NotificationSettings({ mode }: { mode: TradeModeEnum }) {
  return (
    <div className={styles['index-page-wrapper']}>
      <NavBar title={t`features_trade_common_notification_notification_settings_510274`} />
      <FullTip message={t`features_trade_common_notification_notification_settings_510275`} />
      <div>
        <SettingCell mode={mode} />
      </div>
    </div>
  )
}

export default NotificationSettings
