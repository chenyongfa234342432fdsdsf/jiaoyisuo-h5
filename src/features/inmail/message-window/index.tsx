import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { getIsLogin } from '@/helper/auth'
import { useState, useRef } from 'react'
import { useMount, useCreation } from 'ahooks'
import { InmailMessageEnum, InmailMessageArray } from '@/constants/inmail'
import CommonList from '@/components/common-list/list'
import { usePageContext } from '@/hooks/use-page-context'
import { InmailMenuBodyDataType } from '@/typings/api/inmail'
import InmailList from '@/features/inmail/component/inmail-list'
import InmailSwiper from '@/features/inmail/component/inmail-swiper'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { AuthModuleEnum, getAuthModuleRoutes, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import { getPageMessage, getMarketActivities, setModuleAllRead, delModuleRead } from '@/apis/inmail'
import { Tabs } from '@nbit/vant'
import { KLineChartType } from '@nbit/chart-utils'
import styles from './index.module.css'

type PushSettingsType = {
  id: number
  name: string
  codeName: string
}
enum InmailNum {
  Quote,
  Futures,
}

const SourceMap = {
  [InmailNum.Quote]: 'spot',
  [InmailNum.Futures]: 'perpetual',
}

const MessageWindow = () => {
  const [page, setPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)
  const [navMessage, setNavMessage] = useState<PushSettingsType>()
  const [messageData, setMessageData] = useState<Array<InmailMenuBodyDataType>>([])
  const [currentTab, setCurrentTab] = useState<InmailNum>(
    getAuthModuleStatusByKey(AuthModuleEnum.spot) ? InmailNum.Quote : InmailNum.Futures
  )

  const size = useRef<number>(10)

  const isLogin = getIsLogin()
  const pageContext = usePageContext()

  const getRouterId = () => {
    const id = pageContext?.routeParams?.id
    const router = pageContext?.urlParsed?.search
    const name = router?.name
    const codeName = router?.code
    return { id, name, codeName }
  }

  const setAllRead = async () => {
    const { id, codeName } = await getRouterId()
    if (codeName === InmailMessageEnum.market) return
    setModuleAllRead({ moduleId: id })
  }

  /** 下拉刷新* */
  const onRefreshing = async () => {
    setPage(0)
    setFinished(false)
    setMessageData([])
    /** 将所有消息设为已读* */
    setAllRead()
  }

  /** 上拉加载更多* */
  const onLoadMore = async () => {
    setFinished(true)
    !finished && setPage(page + 1)
  }

  const getMessageList = () => {
    const { id, name, codeName } = getRouterId()
    setNavMessage({ id: Number(id), name, codeName })
  }

  const getInmailList = async (id: string, pageNum: number, tabChange?, name?: string) => {
    const params: {
      moduleId: string
      pageNum: number
      pageSize: number
      subscribeSource?: string
    } = {
      moduleId: id,
      pageNum,
      pageSize: size.current,
    }
    setLoading(true)
    if (name === InmailMessageEnum.price) {
      params.subscribeSource = SourceMap[currentTab]
    }
    const config = name === InmailMessageEnum.market ? getMarketActivities : getPageMessage
    const res = await config(params)
    setLoading(false)
    if (!res.isOk && !res.data) return
    if (!res.data.list?.length) {
      if (tabChange) {
        setMessageData([])
      }
      return setFinished(true)
    }
    const arr = tabChange ? [...res.data.list] : [...messageData, ...res.data.list]
    setFinished(arr?.length >= res.data.total)
    arr && setMessageData(arr)
  }

  /** 滑动单元格删除* */
  const onDelSwiper = async v => {
    await delModuleRead({ id: v })
    const data = messageData.filter(item => item.id !== v)
    setMessageData(data)
  }

  useMount(() => {
    isLogin && getMessageList()
  })

  useCreation(() => {
    const { id, codeName } = getRouterId()
    isLogin && page && getInmailList(id, page, false, codeName)
  }, [page])

  useCreation(() => {
    const { id, codeName } = getRouterId()
    isLogin && page && getInmailList(id, page, true, codeName)
  }, [currentTab])

  const onTabChange = name => {
    setCurrentTab(name)
  }

  const Quote = {
    title: t`constants_order_742`,
    id: KLineChartType.Quote,
  }

  const Futures = {
    title: t`assets.layout.tabs.contract`,
    id: KLineChartType.Futures,
  }

  const tabList = getAuthModuleRoutes({ [AuthModuleEnum.spot]: Quote, [AuthModuleEnum.contract]: Futures })

  return (
    <div className={styles['message-window']}>
      <NavBar title={navMessage?.name} />
      {navMessage?.codeName === InmailMessageEnum.price ? (
        <Tabs align="start" className="tab" active={currentTab} onChange={onTabChange}>
          {tabList?.map(item => {
            return (
              <Tabs.TabPane key={item.id} title={item.title}>
                <div
                  className={`message-window-wrap ${
                    InmailMessageArray?.includes(navMessage?.codeName as InmailMessageEnum) ? 'wrap-background' : ''
                  }`}
                >
                  <CommonList
                    refreshing
                    finished={finished}
                    onLoadMore={onLoadMore}
                    onRefreshing={onRefreshing}
                    listChildren={
                      navMessage?.id &&
                      messageData?.map(v => {
                        return (
                          <InmailSwiper
                            data={v}
                            key={v?.id}
                            onDelSwiper={onDelSwiper}
                            codeName={navMessage?.codeName}
                          />
                        )
                      })
                    }
                  />
                </div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      ) : (
        <div
          className={`message-window-wrap ${
            InmailMessageArray?.includes(navMessage?.codeName as InmailMessageEnum) ? 'wrap-background' : ''
          }`}
        >
          <CommonList
            refreshing
            finished={finished}
            onLoadMore={onLoadMore}
            onRefreshing={onRefreshing}
            listChildren={
              navMessage?.id &&
              messageData?.map(v => {
                return InmailMessageArray?.includes(navMessage?.codeName as InmailMessageEnum) ? (
                  <InmailList key={v?.id} data={v} />
                ) : (
                  <InmailSwiper key={v?.id} data={v} onDelSwiper={onDelSwiper} codeName={navMessage?.codeName} />
                )
              })
            }
          />
        </div>
      )}

      <FullScreenLoading mask isShow={loading} className="fixed" />
    </div>
  )
}
export default MessageWindow
