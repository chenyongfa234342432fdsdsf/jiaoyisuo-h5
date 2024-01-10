import { TradeModeEnum } from '@/constants/trade'
import NotificationSettings from '@/features/trade/common/notification/notification-settings'
import { getTradeDefaultSeoMeta } from '@/helper/trade'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'

export function Page() {
  const { routeParams } = usePageContext()

  return <NotificationSettings mode={(routeParams.mode as any) || TradeModeEnum.spot} />
}

export async function onBeforeRender(pageContext: PageContext) {
  return {
    pageContext: {
      documentProps: getTradeDefaultSeoMeta(t`features_trade_common_notification_notification_settings_510274`),
    },
  }
}
