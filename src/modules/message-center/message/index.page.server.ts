import { t } from '@lingui/macro'

async function onBeforeRender(pageContext: PageContext) {
  const pageProps = {}
  const layoutParams = {
    footerShow: false,
    fullScreen: true,
  }
  return {
    pageContext: {
      pageProps,
      layoutParams,
      documentProps: {
        title: `消息中心`,
      },
    },
  }
}

export { onBeforeRender }
