import { getHomeCarouselList } from '@/apis/home'
import { useRequest } from 'ahooks'
import { filter, map } from 'lodash'
import { Button, Swiper } from '@nbit/vant'
import { link } from '@/helper/link'
import { getC2cFastTradePageRoutePath } from '@/helper/route'
import { t } from '@lingui/macro'
import { HomeCarouselIsAppOnlyEnum } from '@/constants/common'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

export const HomeCarousel = () => {
  const { data } = useRequest(getHomeCarouselList)
  const list = data?.data?.list ?? []

  const carouselList = filter(list, i => i.isAppOnly === HomeCarouselIsAppOnlyEnum.no)
  const appOnlyList = filter(list, i => i.isAppOnly === HomeCarouselIsAppOnlyEnum.yes)

  return (
    <div className={styles.scoped}>
      {carouselList.length > 0 ? (
        <Swiper indicator key="home-carousel" className="flex-1 overflow-hidden" autoplay={3000}>
          {map(carouselList, i => (
            <Swiper.Item
              key={i.carouselTitle}
              className="item"
              style={{ backgroundImage: `url(${i.appImage})` }}
              onClick={() => {
                if (i.h5TargetUrl) link(i?.h5TargetUrl, { target: true })
              }}
            >
              <div className="title">{i.carouselTitle}</div>
              <div className="remarks">{i.remarks}</div>
              <Button type="primary" className="check-btn" text={t`features_home_carousel_index_dwfqxdgpoa`} />
            </Swiper.Item>
          ))}
        </Swiper>
      ) : null}
      <div className="flex-1 overflow-hidden">
        <div className="fast-buy" onClick={() => link(getC2cFastTradePageRoutePath())}>
          <div className="bold-title">{t`features_home_components_navigation_card_index_510103`}</div>
          <div className="sub-title">{t`features_home_components_navigation_card_index_510104`}</div>
          <LazyImage className="fast-buy-img" src={`${oss_svg_image_domain_address}fastbuy_bg.png`} hasTheme />
        </div>
        {appOnlyList.length > 0 ? (
          <Swiper indicator key="home-carousel-app-only" autoplay={3000}>
            {map(appOnlyList, i => (
              <Swiper.Item
                key={i.carouselTitle}
                className="item app-only"
                onClick={() => {
                  if (i.h5TargetUrl) link(i?.h5TargetUrl, { target: true })
                }}
                style={{ backgroundImage: `url(${i.appImage})` }}
              >
                <div className="title">{i.carouselTitle}</div>
                <div className="remarks">{i.remarks}</div>
              </Swiper.Item>
            ))}
          </Swiper>
        ) : null}
      </div>
    </div>
  )
}
