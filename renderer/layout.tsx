import React, { useEffect } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import Footer from '@/components/footer'
import { PageContextProvider } from '@/hooks/use-page-context'
import { ConfigProvider } from '@nbit/vant'
import '@/style/layout.css'
import { I18nsEnum } from '@/constants/i18n'
import enUS from '@nbit/vant/lib/locale/lang/en-US'
import { useMount } from 'ahooks'
import { useUnmount } from 'react-use'
import { useInmailStore } from '@/store/inmail'
import { setMemberSellProperty, setMemberBuyProperty } from '@/helper/handlecolor'
import zhCN from '@nbit/vant/lib/locale/lang/zh-CN'
import zhHK from '@nbit/vant/lib/locale/lang/zh-HK'
import { HistoryStack } from '@/typings/cache'
import { removeHistoryStack, setHistoryStack, getHistoryStack, getLineCssColor } from '@/helper/cache'
import { link as navigate } from '@/helper/link'
import { businessIsChainStar, envIsClient } from '@/helper/env'
import ErrorBoundary from '@/components/error-boundary'
import Header from '@/features/layout/header'
import InmailDialog from '@/features/inmail/component/inmail-dialog'
import AccountDialog from '@/features/inmail/component/account-dialog'
import { useViewportHeight } from '@/hooks/use-viewport-height'
import { useCommonStore } from '@/store/common'
import { isApp } from '@/helper/is-app'

export default Layout
function Layout({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  const {
    layout: { headerShow, footerShow },
    setLayout,
  } = useCommonStore()
  const pageFooterShow = !!pageContext?.layoutParams?.footerShow
  const pageHeaderShow = !!pageContext?.layoutParams?.headerShow
  useEffect(() => {
    setLayout({
      headerShow: pageHeaderShow,
      footerShow: pageFooterShow,
    })
  }, [pageFooterShow, pageHeaderShow])
  const footerHeight = 48 // 底部 footer 的高度
  const padding = 16 // 底部距离
  const style = {
    // paddingBottom: footerShow ? `${footerHeight + padding}px` : 0,
    paddingBottom: footerShow ? `${footerHeight}px` : 0,
  }
  const locale = pageContext.locale

  const { wsInmailDepthSubscribe, wsInmailDepthUnSubscribe, loginModal } = useInmailStore()

  const switchLocales = (current?: string) => {
    switch (current) {
      case I18nsEnum['en-US']:
        return enUS
      case I18nsEnum['zh-CN']:
        return zhCN
      case I18nsEnum['zh-HK']:
        return zhHK
      default:
        return enUS
    }
  }
  // 保存浏览器前进后退的栈
  const setHandleHistoryStack = () => {
    const historyPop: HistoryStack[] = []
    window.addEventListener('popstate', function (e) {
      const historyStack = (getHistoryStack() as any[]) || []
      // eslint-disable-next-line no-unsafe-optional-chaining
      const compare = historyStack?.[historyStack?.length - 1]?.timestamp - e?.state?.timestamp
      if (!historyStack?.length) {
        removeHistoryStack()
        navigate('/')
        return
      }
      if (compare >= 0) {
        // 后退
        historyPop.push(historyStack.pop())
        setHistoryStack([...historyStack])
      } else if (compare < 0) {
        // 前进
        setHistoryStack([...historyStack, historyPop[historyPop.length - 1]])
        historyPop.pop()
      }
    })
  }

  // 用于回显交易线的红涨绿跌或者绿涨红跌
  const setLineColor = () => {
    const { buyHandle, sellHandle } = getLineCssColor() || {}
    if (buyHandle && sellHandle) {
      setMemberSellProperty(sellHandle)
      setMemberBuyProperty(buyHandle)
    }
  }

  const setPageBeforeUnload = () => {
    window.onbeforeunload = function () {
      // const { cleanUpStack } = baseCommonStore.getState()
      const historyStack = getHistoryStack()
      const currentRoute = historyStack?.[historyStack?.length - 1]
      if (currentRoute && currentRoute?.url) {
        const showClean = currentRoute?.url?.indexOf('/personal-center/settings/language') === -1
        showClean && removeHistoryStack()
      }
      window.removeEventListener('popstate', () => {})
    }
  }
  // 初始化浏览器前进后退的栈
  const initHistoryStack = () => {
    // app 下进入页面时清除历史堆栈，否则会有 bug
    if (isApp()) {
      removeHistoryStack()
    }
  }

  useMount(() => {
    if (envIsClient) {
      setHandleHistoryStack()
      setLineColor()
      setPageBeforeUnload()
      initHistoryStack()
    }
    /** 订阅消息通知* */
    wsInmailDepthSubscribe()
  })

  useUnmount(() => wsInmailDepthUnSubscribe())
  useViewportHeight()
  return (
    <PageContextProvider pageContext={pageContext}>
      <I18nProvider i18n={i18n}>
        <ConfigProvider locale={switchLocales(locale)}>
          <ErrorBoundary>
            <div id="page-wrapper" className={businessIsChainStar ? 'chainstar-only' : ''}>
              <div id="page-content" style={style}>
                <Header isShow={headerShow} />
                {children}
              </div>
              <Footer isShow={footerShow} />
              {loginModal ? <InmailDialog /> : null}
              <AccountDialog />
            </div>
          </ErrorBoundary>
        </ConfigProvider>
      </I18nProvider>
    </PageContextProvider>
  )
}
