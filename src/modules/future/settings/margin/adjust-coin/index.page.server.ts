import { t } from '@lingui/macro'
import { getInmailDefaultSeoMeta } from '@/helper/inmail'

export async function onBeforeRender() {
  const pageProps = {}
  const layoutParams = {
    footerShow: false,
    fullScreen: true,
  }
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: getInmailDefaultSeoMeta(t`features_trade_future_settings_margin_auto_detail_adjust_coin_5101381`),
    },
  }
}