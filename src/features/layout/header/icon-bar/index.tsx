import { Badge } from '@nbit/vant'
import Icon from '@/components/icon'
import Link from '@/components/link'
import { getIsLogin } from '@/helper/auth'
import { useState, useEffect } from 'react'
import { useLayoutStore } from '@/store/layout'
import { useInmailStore } from '@/store/inmail'
import { getUnReadNum } from '@/apis/inmail'
import { getAuthMarketsModuleStatus } from '@/helper/modal-dynamic'
import { MarketListRouteEnum } from '@/constants/market/market-list/market-module'
import styles from './index.module.css'

function IconBar() {
  const [unReadNum, setUnReadNum] = useState<number>(0)

  const isLogin = getIsLogin()
  const { changeNum } = useInmailStore()
  const { customerJumpUrl } = useLayoutStore().layoutProps || {}
  const search = {
    name: 'search',
    src: MarketListRouteEnum.search,
  }
  const service = {
    name: 'nav_service',
    src: customerJumpUrl || '/',
  }
  const inmail = {
    name: 'message',
    src: '/inmail',
  }
  const icons = getAuthMarketsModuleStatus() ? [search, service, inmail] : [service, inmail]

  /** 获取全部消息类型未读数量* */
  const getMessagesUnReadNum = async () => {
    const res = await getUnReadNum({})
    if (!res.isOk && !res.data) return
    setUnReadNum(res.data.unReadNum)
  }

  /** 获取未读数量* */
  useEffect(() => {
    isLogin && getMessagesUnReadNum()
  }, [changeNum])

  const renderIcons = icons.map((icon, index) => {
    if (icon.name === 'search' && getAuthMarketsModuleStatus())
      return (
        <Link href={icon.src} key={icon.name} className="search-bar">
          <Icon className="ml-3 search-icon" {...icon} hasTheme />
          <span className="ml-2 text-text_color_04">BTC</span>
        </Link>
      )

    return icon.name === 'message' ? (
      <Badge className="my-auto" content={unReadNum} dot={!!unReadNum} showZero={false} offset={[3, 4]} key={index}>
        <Link href={icon.src} key={icon.name}>
          <Icon {...icon} hasTheme />
        </Link>
      </Badge>
    ) : (
      <Link className="my-auto" href={icon.src} key={index}>
        <Icon {...icon} hasTheme />
      </Link>
    )
  })
  return <div className={styles.scoped}>{renderIcons}</div>
}

export default IconBar
