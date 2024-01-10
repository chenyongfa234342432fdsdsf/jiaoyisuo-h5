import Link from '@/components/link'
import Icon from '@/components/icon'
import { usePageContext } from '@/hooks/use-page-context'
import { Popup } from '@nbit/vant'
import { useEffect, useState } from 'react'
import { useBaseC2cOrderStore } from '@/store/c2c/order'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import {
  getC2cAdsHistoryPageRoutePath,
  getC2cMerchantPageRoutePath,
  getC2cOrdersPageRoutePath,
  getC2cPaymentsManagePageRoutePath,
  getC2cPostAdvPageRoutePath,
  getC2cSettingPageRoutePath,
} from '@/helper/route'
import { useC2CCenterStore } from '@/store/c2c/center'
import { link } from '@/helper/link'
import { queryCanPublishAd } from '@/apis/c2c/trade'
import styles from './index.module.css'
import { useTradeContext } from '../trade/trade-context'

type ITabBarItem = {
  title: string
  icon: string
  href: string
  hoverIcon: string
  badge?: number | string
  onlyIcon?: boolean
  iconClassName?: string
  invisible?: boolean
}
type IMorePopupProps = {
  visible: boolean
  tabs: ITabBarItem[]
  onVisibleChange: (val: boolean) => void
}
function MorePopup({ tabs, visible, onVisibleChange }: IMorePopupProps) {
  return (
    <Popup
      closeIconPosition="right"
      position="bottom"
      closeOnClickOverlay
      visible={visible}
      onClose={() => onVisibleChange(false)}
    >
      <div className={styles['more-popup-wrapper']}>
        <div className="flex justify-between p-4 pb-2 items-center">
          <span className="text-base font-medium">{t`features_home_more_toolbar_header_toolbar_index_510105`}</span>
          <Icon hasTheme name="close" className="text-xl" onClick={() => onVisibleChange(false)} />
        </div>
        <div>
          {tabs.map(item => {
            const toPage = () => {
              link(item.href)
            }
            return (
              <div onClick={toPage} className="cell-box rv-hairline--bottom" key={item.title}>
                <div>
                  <div className={'cell-content'}>
                    <Icon className="cell-icon" name={item.hoverIcon} />
                    <span>{item.title}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Popup>
  )
}

function C2cFooter() {
  const pageContext = usePageContext()
  const { openOrderModule, fetchOpenOrders, subscribe } = useBaseC2cOrderStore()
  const { c2cSelfUser } = useC2CCenterStore()
  const { params } = useTradeContext()
  const [canPublishAd, setCanPublishAd] = useState(false)
  const fetchCanPublishAd = async () => {
    if (!params.areaId) return
    const res = await queryCanPublishAd({
      areaId: params.areaId as any,
    })
    if (!res.isOk) {
      // 接口出错时做一个简单的备选判断
      setCanPublishAd(!!(c2cSelfUser.isMerchant || params?.currentTradeArea?.advertRequire === 'NONE'))
      return
    }
    setCanPublishAd(!!res?.data?.releaseAdvertSwitch)
  }
  useEffect(() => {
    fetchCanPublishAd()
  }, [params.areaId])

  const tabBars: ITabBarItem[] = [
    {
      title: 'C2C',
      icon: 'c2c',
      href: '/c2c/trade',
      hoverIcon: 'c2c_home_hover',
    },
    {
      title: t`features_c2c_footer_index_2225101635`,
      icon: 'c2c_icon_order',
      href: getC2cOrdersPageRoutePath(),
      hoverIcon: 'c2c_icon_order',
      iconClassName: '',
      badge: Number(openOrderModule.normal.total) > 99 ? '99+' : Number(openOrderModule.normal.total),
    },
    {
      title: '',
      onlyIcon: true,
      invisible: !canPublishAd,
      iconClassName: 'w-8',
      icon: '',
      href: getC2cPostAdvPageRoutePath(),
      hoverIcon: 'c2c_publish_ad',
    },
    {
      title: t`features_c2c_footer_ad`,
      icon: 'c2c_advertising_account',
      href: getC2cAdsHistoryPageRoutePath(),
      invisible: !canPublishAd,
      hoverIcon: '',
    },
    {
      title: t`features_c2c_footer_index_2225101636`,
      icon: 'quotes',
      href: getC2cPaymentsManagePageRoutePath(),
      hoverIcon: 'icon_equity_recharge',
    },
    {
      title: t`features_c2c_footer_index_2225101637`,
      icon: 'icon_equity_recharge',
      href: getC2cMerchantPageRoutePath(),
      hoverIcon: 'c2c_footer_merchant',
    },
    {
      title: t`features_c2c_footer_index_2225101638`,
      icon: 'quotes',
      href: '/c2c/center',
      hoverIcon: 'c2c_footer_user',
    },
    {
      title: t`user.pageContent.title_12`,
      icon: 'quotes',
      href: getC2cSettingPageRoutePath(),
      hoverIcon: 'c2c_footer_setting',
    },
  ].filter(item => !item.invisible)
  const max = canPublishAd ? 4 : 2
  const visibleTabs = tabBars.slice(0, max)
  const moreTabs = tabBars.slice(max)
  const moreVisible = tabBars.length > max
  const [morePopupVisible, setMorePopupVisible] = useState(false)

  const pathname = pageContext.path.split('?')[0]
  useEffect(() => {
    fetchOpenOrders()
    return subscribe()
  }, [])
  return (
    <footer className={styles['footer-wrapper']}>
      <div className="inner-content">
        {visibleTabs.map((item, index) => (
          <div
            className={classNames('tab-bar-box', {
              'is-active': index === 0,
            })}
            key={item.title}
          >
            <Link href={item.href}>
              <div className={classNames('tab-bar-content')}>
                <Icon
                  className={classNames('tab-bar-icon', item.iconClassName)}
                  hasTheme={!item.onlyIcon && index !== 0}
                  name={index === 0 || item.onlyIcon ? item.hoverIcon : item.icon}
                />
                <span className="text-xs scale-75">{item.title}</span>
                {!!item.badge && (
                  <span
                    className={classNames('tab-bar-badge', {
                      'small-badge': String(item.badge).length < 2,
                    })}
                  >
                    <span className="text-xs scale-75">{item.badge}</span>
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
        {moreVisible && (
          <div className={'tab-bar-box'} onClick={() => setMorePopupVisible(true)}>
            <div>
              <div className="tab-bar-content">
                <Icon className="tab-bar-icon" hasTheme name="contract_more" />
                <span className="text-xs scale-75">{t`features_home_more_toolbar_header_toolbar_index_510105`}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <MorePopup tabs={moreTabs} visible={morePopupVisible} onVisibleChange={setMorePopupVisible} />
    </footer>
  )
}

export default C2cFooter
