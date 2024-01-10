import { getIsWebClipCache, getIsVestBagCache } from '@/helper/cache/common'
import classNames from 'classnames'
import { useLayoutStore } from '@/store/layout'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import { useState } from 'react'
import { getAuthModuleStatusByKey, AuthModuleEnum } from '@/helper/modal-dynamic'
import { businessIsChainStar } from '@/helper/env'
import Banner from './components/banner'
import styles from './index.module.css'
import QuoteBoxGrid from './components/quote-box-grid'
import NavigationCard from './components/navigation-card'
import MoreToolbar from './more-toolbar'
import ToolbarGrid from './components/toolbar-grid'
import MarketFavoritesEditing from '../market/market-quatation/common/market-favorites-editing'
import UserTotalAsset from './components/user-total-asset'
import AnnouncementList from './components/announcement-list'
import DownloadPopUp from '../front-page/components/download-pop-up'
import ShouldGuidePageComponentDisplay from '../front-page/common/component-should-display'
import { MarketHomeInfo } from '../market/market-home-info'
import { HomeCarousel } from './carousel'

export default IndexPage

function IndexPage() {
  const isWebClip = getIsWebClipCache()
  const isVestBag = getIsVestBagCache()

  const { landingPageSectionCd } = useLayoutStore().guidePageBasicWebInfo || {}
  const formattedLandingPageSection = landingPageSectionCd?.reduce((p, c) => {
    const key = Object.keys(c)[0]
    const value = c[key]
    p[key] = value
    return p
  }, {})

  const { pageInfoDownPopup: downloadPopup } = formattedLandingPageSection || {}

  const [isPopupActive, setisPopupActive] = useState(true)

  return (
    <div className={styles.scoped}>
      <div
        className={classNames('bg-bg_color', {
          'mt-11': isVestBag || isWebClip,
        })}
      >
        {!businessIsChainStar ? isVestBag ? <Banner /> : isWebClip ? null : <Banner /> : null}
        <UserTotalAsset />
        <ToolbarGrid />
      </div>

      <div className="section">
        {businessIsChainStar ? <HomeCarousel /> : <NavigationCard />}
        <QuoteBoxGrid />
        <div className="table-section">
          <MarketHomeInfo />
          <AnnouncementList />

          {getAuthModuleStatusByKey(AuthModuleEnum.spot) && isPopupActive && <div className="h-16"></div>}
        </div>
      </div>
      <MoreToolbar />
      <MarketFavoritesEditing />
      {isVestBag || isWebClip ? null : (
        <ShouldGuidePageComponentDisplay {...downloadPopup}>
          <DownloadPopUp onChange={setisPopupActive} />
        </ShouldGuidePageComponentDisplay>
      )}
    </div>
  )
}
