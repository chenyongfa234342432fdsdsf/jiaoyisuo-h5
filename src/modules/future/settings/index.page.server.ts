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
      documentProps: getInmailDefaultSeoMeta(t`features/trade/future/exchange-14`),
    },
  }
}
