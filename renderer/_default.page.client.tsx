import ReactDOMClient from 'react-dom/client'
import { ThemeBusinessEnum, ThemeEnum } from '@/constants/base'
import { onInstallForApp } from '@/helper/lifecycle'
import { getSeo } from '@/helper/seo'
import { link } from '@/helper/link'
import AsyncSuspense from '@/components/async-suspense'
import { onInstallForClient } from '@/helper/lifecycle/client'
import { baseCommonStore } from '@/store/common'
import { isRouteInWhitePath } from '@/helper/fusion-api'
import { isAuthModalDynamicList } from '@/helper/modal-dynamic'
import { getRedirectUrl } from '@/helper/auth'
import LoadFail from '@/components/load-fail'
import { businessIsChainStar } from '@/helper/env'
import Layout from './layout'
import '@/style/layout.css'

export const clientRouting = true
export const prefetchStaticAssets = { when: 'VIEWPORT' }
export const hydrationCanBeAborted = true

let root: ReactDOMClient.Root

async function render(pageContext: PageContext) {
  const { Page, pageProps, needSeo, authTo, unAuthTo, path, isHydration, urlParsed } = pageContext
  const { isFusionMode } = baseCommonStore.getState()
  /** 融合模式下判断* */
  let isBlackList = isRouteInWhitePath(path)
  /** 如果不是融合模式，还需要进行* */
  if (!isFusionMode) {
    isBlackList = isAuthModalDynamicList(path)
  }
  const container = document.getElementById('page-view')!
  if (isHydration) {
    await onInstallForApp(pageContext)
    const isBlock = await onInstallForClient(pageContext)
    if (isBlock === true) {
      return
    }
    const redirectUrl = getRedirectUrl(authTo, unAuthTo, urlParsed.search?.go)
    const isRedirectTo = !!redirectUrl
    let appLayout = isBlackList ? (
      <Layout pageContext={pageContext}>
        <LoadFail />
      </Layout>
    ) : needSeo ? (
      <Layout pageContext={pageContext}>{!isRedirectTo && <Page {...pageProps} />}</Layout>
    ) : (
      <AsyncSuspense hasLoading>
        <Layout pageContext={pageContext}>{!isRedirectTo && <Page {...pageProps} />}</Layout>
      </AsyncSuspense>
    )
    root = ReactDOMClient.hydrateRoot(container, appLayout)
    if (isRedirectTo) {
      link(redirectUrl, { overwriteLastHistoryEntry: true })
    }
    return
  }
  const redirectUrl = getRedirectUrl(authTo, unAuthTo, urlParsed.search?.go)
  const isRedirectTo = !!redirectUrl
  let appLayout = isBlackList ? (
    <Layout pageContext={pageContext}>
      <LoadFail />
    </Layout>
  ) : needSeo ? (
    <Layout pageContext={pageContext}>{!isRedirectTo && <Page {...pageProps} />}</Layout>
  ) : (
    <AsyncSuspense hasLoading>
      <Layout pageContext={pageContext}>{!isRedirectTo && <Page {...pageProps} />}</Layout>
    </AsyncSuspense>
  )

  if (!root) {
    root = ReactDOMClient.createRoot(container)
  }
  root.render(appLayout)

  const { title, description } = getSeo(pageContext)
  document.title = title
  document?.querySelector('meta[name="description"]')?.setAttribute('content', description)
  const commonStore = baseCommonStore.getState()
  const theme = commonStore.theme
  document.body.setAttribute('theme', theme || ThemeEnum.light)
  document.body.setAttribute('theme-color', commonStore.themeColor)
  document.body.setAttribute('theme-business', businessIsChainStar ? ThemeBusinessEnum.chainstar : '')
  if (isRedirectTo) {
    link(redirectUrl, { overwriteLastHistoryEntry: true })
  }
}

function onHydrationEnd() {}

export { render, onHydrationEnd }
