import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import { SwipeCell } from '@nbit/vant'
import { useInmailStore } from '@/store/inmail'
import LazyImage from '@/components/lazy-image'
import { InmailMenuBodyDataType } from '@/typings/api/inmail'
import { formatDate, getDiff, getYearDiff } from '@/helper/date'
import { KLineChartType } from '@nbit/chart-utils'
import { InmailMessageEnum } from '@/constants/inmail'
import styles from './index.module.css'

type InmailSwiperType = {
  data: InmailMenuBodyDataType
  codeName: string
  onDelSwiper: (v) => void
}

export enum InmailString {
  one = '1',
  two = '2',
  three = '3',
  four = '4',
}
export enum InmailNum {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  seven = 7,
}

export enum SubscribeSource {
  Spot = 'spot',
  Perpetual = 'perpetual',
}

const InmailSwiper = ({ data, onDelSwiper, codeName }: InmailSwiperType) => {
  const { menuList } = useInmailStore()

  /** 除去行情异动和价格订阅的图标* */
  const showIcon = v => {
    /** 单独对合约预警的处理* */
    if (codeName === InmailMessageEnum.contract) {
      /** 强平预警'liquidateWarning',强平通知'liquidateNotice',交割通知'settlementNotice'* */
      if (v.eventType === 'liquidateWarning') {
        return 'liquidate_alert'
      } else if (v.eventType === 'liquidateNotice' || v.eventType === 'settlementNotice') {
        return 'msg_announcement_news'
      } else {
        return 'msg_system_notification'
      }
    }
    const iconList = menuList?.find(item => item.id === codeName)
    return iconList?.collapseIcon || ''
  }

  /** 不同模块涨跌* */
  const moduleDownUp = v => {
    return v?.extras?.type === InmailString.one || v?.extras?.type === InmailString.three ? 'rise1' : 'fall' || ''
  }

  /** 涨跌幅文字* */
  const downUpText = v => {
    if (v === InmailString.one) {
      return t`features_inmail_component_inmail_swiper_index_5101349`
    } else if (v === InmailString.two) {
      return t`features_inmail_component_inmail_swiper_index_5101350`
    } else if (v === InmailString.three) {
      return t`features_inmail_component_inmail_swiper_index_5101351`
    } else {
      return t`features_inmail_component_inmail_swiper_index_5101352`
    }
  }

  /** 显示的内容* */
  const showContent = v => {
    if (codeName === InmailMessageEnum.price) {
      return `${v.extras?.baseSymbolName}${data?.subscribeSource === SubscribeSource.Spot ? '/' : ''}${
        v.extras?.quoteSymbolName
      }`
    }
    return codeName === InmailMessageEnum.market ? v.describe : v.content || ''
  }

  /** 处理 icon 图标 * */
  const handleIcon = v => {
    if (codeName === InmailMessageEnum.market) {
      return <LazyImage src={v?.icon} className="wrap-header-image" />
    } else if (codeName === InmailMessageEnum.price) {
      return <Icon name={moduleDownUp(v)} className="wrap-header-image" />
    } else {
      return (
        <Icon
          name={showIcon(v) as string}
          className="wrap-header-image"
          hasTheme={v.eventType !== 'liquidateWarning'}
        />
      )
    }
  }

  /** 删除单条消息* */
  const onDelChange = () => {
    onDelSwiper && onDelSwiper(data?.id)
  }

  /** 取消提醒* */
  const onReminderChange = () => {
    data?.subscribeSource === SubscribeSource.Spot
      ? link(`/inmail/all-reminder/${KLineChartType.Quote}`)
      : link(`/inmail/all-reminder/${KLineChartType.Futures}`)
  }

  /** 行情异动跳转* */
  const onInmailChange = () => {
    if (codeName === InmailMessageEnum.market) {
      data?.subscribeSource === SubscribeSource.Spot
        ? link(`/trade/${data?.symbolName}`)
        : link(`/futures/${data?.symbolName}`)
    }
  }

  /** 时间格式化* */
  const formatTime = time => {
    let showTime: any = ''
    if (!time) return showTime
    if (getDiff(time, 'day', 'YYYY-MM-DD')) {
      getYearDiff(time) ? (showTime = formatDate(time, 'YYYY-MM-DD')) : (showTime = formatDate(time, 'MM-DD HH:mm'))
    } else {
      showTime = formatDate(time, 'HH:mm')
    }
    return showTime
  }

  return (
    <SwipeCell
      stopPropagation
      className="inmail-swiper"
      rightAction={
        <div className={`swiper-button-content`}>
          {codeName === InmailMessageEnum.price ? (
            <div onClick={onReminderChange} className="swiper-default-button">
              <span className="default-button-text">{t`features_inmail_component_inmail_swiper_index_5101310`}</span>
            </div>
          ) : null}
          <div onClick={onDelChange} className="swiper-danger-button">
            {t`common.delete`}
          </div>
        </div>
      }
      disabled={codeName === InmailMessageEnum.market}
    >
      <div className={styles.scoped} onClick={onInmailChange}>
        <div className="inmail-swiper-wrap">
          <div className="swiper-wrap-header">
            <div className="wrap-header-left">
              {codeName && handleIcon(data)}
              <div className="wrap-header-text">{data?.title}</div>
            </div>
            <div className="wrap-header-right">
              {codeName === InmailMessageEnum.market ? formatTime(data.time) : formatTime(data.eventTime)}
            </div>
          </div>
          <div className="swiper-wrap-body">
            <div className="wrap-body-first">{showContent(data)}</div>
            {codeName === InmailMessageEnum.price ? (
              <>
                <div
                  className={`wrap-body-second ${
                    data.extras?.type === InmailString.one || data.extras?.type === InmailString.three
                      ? 'rise-color'
                      : 'fall-color'
                  }`}
                >
                  {downUpText(data.extras?.type)}
                </div>
                <div
                  className={`wrap-body-three ${
                    data.extras?.type === InmailString.one || data.extras?.type === InmailString.three
                      ? 'rise-bg-color'
                      : 'fall-bg-color'
                  }`}
                >
                  {data.extras?.type === InmailString.three || data.extras?.type === InmailString.four
                    ? `${data.extras?.value}%`
                    : data.extras?.value}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </SwipeCell>
  )
}

export default InmailSwiper
