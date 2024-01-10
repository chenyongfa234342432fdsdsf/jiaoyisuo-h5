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
      documentProps: getInmailDefaultSeoMeta(t`modules_future_settings_select_version_index_page_server_vpn1tnpsqp`),
    },
  }
}
