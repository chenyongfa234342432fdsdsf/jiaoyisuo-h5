import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import NavBar from '@/components/navbar'
import { Notify, Toast } from '@nbit/vant'
import { formatDate } from '@/helper/date'
import { useCommonStore } from '@/store/common'
import { usePageContext } from '@/hooks/use-page-context'
import HelpCenterHeader from '@/features/help-center/header'
import { getNoticeCenterArticle } from '@/apis/announcement'
import { NoticeCenterType, NoticeCenterArticleList, CenterDateType } from '@/typings/api/help-center'
import { handleVideo } from '@/helper/help-center'
import { getV1WelfareActivityArticleApiRequest, postV1WelfareActivityJoinApiRequest } from '@/apis/welfare-center'
import { YapiGetV1WelfareActivityArticleListData } from '@/typings/yapi/WelfareActivityArticleV1GetApi'
import { ActivityStatusCode } from '@/constants/welfare-center/common'
import styles from './index.module.css'

function HelpCenterSupportSearch() {
  const pageContext = usePageContext()
  const { locale } = useCommonStore()
  const [loading, setLoading] = useState<boolean>(false)

  const firstClickRef = useRef<number>(0)
  const [noticeList, setNoticeList] = useState<NoticeCenterArticleList>()
  const [noticeArticle, setNoticeArticle] = useState<Array<NoticeCenterType>>([])

  const [curActivity, setCurActivity] = useState<YapiGetV1WelfareActivityArticleListData>()

  const getMenuId = () => {
    const host = pageContext?.host
    const locale = pageContext?.locale
    const id = pageContext?.routeParams?.id
    let path = pageContext?.path

    return { path, host, locale, id }
  }

  const getCurrentArticleList = async id => {
    if (id) {
      setLoading(true)
      const result = await Promise.all([
        getNoticeCenterArticle({ announceContentId: id }),
        getV1WelfareActivityArticleApiRequest({ article: id }),
      ])

      const res = result?.[0]
      const activityRes = result?.[1]?.data?.[0]
      setCurActivity(activityRes)
      setLoading(false)
      const dom = document.querySelector('#article') as HTMLDivElement
      const currentData = res.data?.announcementCenter?.contentJson?.[locale]?.content

      let _currentData = currentData

      const notStart = activityRes?.applyStatus === ActivityStatusCode.not_started

      const ends = activityRes?.applyStatus === ActivityStatusCode.ends

      const isSignUp = activityRes?.join?.toString() === 'true'
      if (activityRes?.activityId) {
        const signUpButton = document.createElement('div')

        signUpButton.innerHTML = isSignUp
          ? t`features_announcement_article_index_ovuebfi8li`
          : notStart
          ? t`features_announcement_article_index_ygwqupzdtx`
          : ends
          ? t`features_announcement_article_index_fgkfhkmc9o`
          : t`features_announcement_article_index_pxsnrvonfz`

        // 隐藏文本框，同时防止屏幕抖动
        signUpButton.className =
          notStart || ends ? 'article-not-start-button' : isSignUp ? 'article-done-button' : 'article-sign-up-button'

        signUpButton.id = 'activitySignButton'
        _currentData = currentData?.replace('<span id="SignUpBtn">{#SignUpBtn}</span>', signUpButton.outerHTML)
      }

      dom.innerHTML = _currentData || ''

      if (activityRes?.activityId) {
        document.getElementById('activitySignButton')?.addEventListener('click', function () {
          if (notStart || ends || isSignUp || firstClickRef.current) {
            return
          }

          postV1WelfareActivityJoinApiRequest({
            activityId: activityRes?.activityId,
          }).then(res => {
            if (res.isOk) {
              const getButton = document.getElementById('activitySignButton') as HTMLDivElement
              getButton.className = 'article-done-button'
              getButton.innerHTML = t`features_announcement_article_index_ovuebfi8li`
              firstClickRef.current += 1
            }
          })
        })
      }

      const video = dom.getElementsByTagName('video')
      if (video?.length) {
        const num = Array(video.length).fill(1)
        num.forEach((_, index) => {
          let videoEle = video[index]
          videoEle = handleVideo(videoEle)
        })
      }

      setNoticeList(res.data?.announcementCenter)
      setNoticeArticle(res.data?.announcementList?.slice(0, 5))
    }
  }

  /** 搜索* */
  const onSearchChange = v => {
    v && link(`/support/search?type=2&searchName=${v}#2`)
  }

  const onArticleChange = v => {
    link(`/announcement/article/${v.id}`, { keepScrollPosition: true })
  }

  /** 分享当前文章* */
  const shareCurrentArticle = () => {
    const { host, locale, path } = getMenuId()
    // 创建 text area
    const currentRouter = `${host}/${locale}${path}`
    const textArea = document.createElement('textarea')
    textArea.value = `${currentRouter}`
    // 隐藏文本框，同时防止屏幕抖动
    textArea.style.position = 'fixed'
    textArea.style.left = '0'
    textArea.style.top = '0'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select() // 选中文本
    const successful = document.execCommand('copy') // 执行 copy 操作
    if (successful) {
      Notify.show({ type: 'success', message: t`features_announcement_article_index_5101103` })
    } else {
      Notify.show({ type: 'danger', message: t`features_announcement_article_index_5101104` })
    }
    textArea.remove()
  }

  useEffect(() => {
    const { id } = getMenuId()
    getCurrentArticleList(id)
  }, [pageContext.urlOriginal])

  useEffect(() => {
    loading
      ? Toast.loading({
          duration: 0,
          message: t`features_assets_coin_details_coin_details_510157`,
        })
      : Toast.clear()
  }, [loading])

  return (
    <div className={styles.scoped}>
      <div className="help-center-support-article">
        <NavBar
          title={t`features_help_center_support_search_index_5101078`}
          left={<Icon name="back" hasTheme className="header-back" />}
        />
        <HelpCenterHeader onSearch={onSearchChange} placeholder={t`features_announcement_index_5101233`} />
        <div className="article-content-body">
          <div className="article-body-header">{noticeList?.name}</div>
          <div className="article-body-time">
            {formatDate(noticeList?.pushTimeStramp as string, CenterDateType.MinDate)}
          </div>
          <div id="article" className="article-body-title" />
          {curActivity?.activityId ? null : (
            <div className="article-share-button" onClick={shareCurrentArticle}>
              <Icon name="share" hasTheme className="mt-px object-contain h-4.5" />
              <span className="share-button-text">{t`features_help_center_support_article_index_5101083`}</span>
            </div>
          )}
        </div>
        <div className="article-content-right">
          <div className="content-right-header">
            <Icon name="latest_articles" className="header-icon" />
            <label>{t`features_announcement_article_index_5101255`}</label>
          </div>
          <div className="content-right-body">
            {noticeArticle?.map(v => {
              return (
                <div key={v?.id} className="new-article-text" onClick={() => onArticleChange(v)}>
                  <div className="new-article-content">{v?.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenterSupportSearch
