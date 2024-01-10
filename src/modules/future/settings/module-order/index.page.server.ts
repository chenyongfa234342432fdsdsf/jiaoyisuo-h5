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
      documentProps: getInmailDefaultSeoMeta(
        t`features_trade_future_settings_module_order_index_vhwl5qdm10cjk-o7pqrmk`
      ),
    },
  }
}
