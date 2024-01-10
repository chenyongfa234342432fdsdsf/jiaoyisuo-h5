import FrontPageHeader from '@/features/front-page/common/header'
import FrontPageAdvertise from '@/features/front-page/common/advertise'
import FrontPagePopularCoin from '@/features/front-page/components/popular-coin'
import FrontPageBuyCoin from '@/features/front-page/components/buy-coin'
import FrontPageServiceAdvantage from '@/features/front-page/components/service-advantage'
import FrontPageDownload from '@/features/front-page/components/download'
import FrontPageCommunity from '@/features/front-page/components/community'
import FrontPageServiceSupport from '@/features/front-page/components/service-support'
import FrontPageFooter from '@/features/front-page/common/footer'
import DownloadPopUp from '@/features/front-page/components/download-pop-up'
import useScrollTrackerYAxis from '@/hooks/use-scroll-tracker'
import classNames from 'classnames'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'ahooks'
import useGuidePageInfo from '@/hooks/features/layout'
import { useLayoutStore } from '@/store/layout'
import { isEmpty } from 'lodash'
import ShouldGuidePageComponentDisplay from './common/component-should-display'

function FrontPage() {
  useGuidePageInfo()
  const { scroller, isBottomSub } = useScrollTrackerYAxis()
  const debouncedIsBottomSub = useDebounce(isBottomSub, { wait: 100 })
  const bottom = useRef<HTMLDivElement>(null)

  const [isPopupActive, setisPopupActive] = useState(true)

  useEffect(() => {
    debouncedIsBottomSub && bottom.current?.scrollIntoView()
  }, [debouncedIsBottomSub])

  const { guidePageBasicWebInfo } = useLayoutStore() || {}
  const { landingPageSectionCd } = guidePageBasicWebInfo || []
  const formattedLandingPageSection = landingPageSectionCd?.reduce((p, c) => {
    const key = Object.keys(c)[0]
    const value = c[key]
    p[key] = value
    return p
  }, {})

  // const shouldHeaderDisplayInfo = getGuidePageComponentInfoByKey('pageInfoTopBar', landingPageSectionCd)
  // const shouldAdvertiseDisplayInfo = getGuidePageComponentInfoByKey('pageInfoSlogan', landingPageSectionCd)
  // const shouldPopularCoinDisplayInfo = getGuidePageComponentInfoByKey('pageInfoPopularCurrency', landingPageSectionCd)
  // const shouldBuyCoinDisplayInfo = getGuidePageComponentInfoByKey('pageInfoPurchaseStep', landingPageSectionCd)
  // const shouldServiceAdvantageDisplayInfo = getGuidePageComponentInfoByKey('pageInfoAboutUs', landingPageSectionCd)
  // const shouldCommunityDisplayInfo = getGuidePageComponentInfoByKey('')

  const {
    pageInfoTopBar: header,
    pageInfoSlogan: advertise,
    pageInfoPopularCurrency: popularCoin,
    pageInfoPurchaseSteps: buyCoin,
    pageInfoAboutUs: serviceAdvantage,
    pageInfoCommunity: community,
    pageInfoAppDow: download,
    pageInfoServiceSupport: serviceSupport,
    pageInfoDownPopup: downloadPopup,
  } = formattedLandingPageSection || {}

  if (isEmpty(guidePageBasicWebInfo)) return <></>

  return (
    <section className="home-page h-screen overflow-y-hidden">
      <div
        ref={scroller as MutableRefObject<HTMLDivElement>}
        className="home-page-wrap px-4 max-h-full overflow-y-auto"
      >
        <ShouldGuidePageComponentDisplay {...header}>
          <FrontPageHeader />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...advertise}>
          <FrontPageAdvertise />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...popularCoin}>
          <FrontPagePopularCoin />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...buyCoin}>
          <FrontPageBuyCoin />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...serviceAdvantage}>
          <FrontPageServiceAdvantage />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...community}>
          <FrontPageCommunity />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...download}>
          <FrontPageDownload />
        </ShouldGuidePageComponentDisplay>

        <ShouldGuidePageComponentDisplay {...serviceSupport}>
          <FrontPageServiceSupport />
        </ShouldGuidePageComponentDisplay>

        <FrontPageFooter />

        <ShouldGuidePageComponentDisplay {...downloadPopup}>
          <DownloadPopUp
            onChange={setisPopupActive}
            // className={classNames({ '!static': debouncedIsBottomSub }, { '!fixed': !isPopupActive })}
          />
          {isPopupActive && <div ref={bottom} className="h-24"></div>}
        </ShouldGuidePageComponentDisplay>
      </div>
    </section>
  )
}

export default FrontPage
