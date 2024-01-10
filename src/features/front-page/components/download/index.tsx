import { Button } from '@nbit/vant'
import FrontPageContainer from '@/features/front-page/common/container'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useLayoutStore } from '@/store/layout'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../../common/component-should-display'

function FrontPageDownload() {
  const { layoutProps, guidePageBasicWebInfo } = useLayoutStore() || {}
  const { businessName } = layoutProps || {}
  const { pageInfoAppDow } = guidePageBasicWebInfo || []

  const mainTitle = getGuidePageComponentInfoByKey('mainTitle', pageInfoAppDow)
  const subtitle = getGuidePageComponentInfoByKey('subtitle', pageInfoAppDow)
  const backgroundImage = getGuidePageComponentInfoByKey('backgroundImage', pageInfoAppDow)

  return (
    <FrontPageContainer
      title={
        <ShouldGuidePageComponentDisplay {...mainTitle}>
          {
            mainTitle?.value /* ||
            t({
              id: 'features_front_page_components_download_index_2cumxbidcv',
              values: { name: businessName || '' },
            }) */
          }
        </ShouldGuidePageComponentDisplay>
      }
      subTitle={
        <ShouldGuidePageComponentDisplay {...subtitle}>
          {subtitle?.value /* || t`features_front_page_components_download_index_lbmzn38msx` */}
        </ShouldGuidePageComponentDisplay>
      }
    >
      <div className={`download ${styles.scoped}`}>
        <div className="image">
          <ShouldGuidePageComponentDisplay {...backgroundImage}>
            <LazyImage src={backgroundImage?.value /* || `${oss_svg_image_domain_address}home_page/phone` */} />
          </ShouldGuidePageComponentDisplay>
        </div>

        <div className="btn">
          <Button
            className="bg-bg_color capitalize"
            onClick={() => link('/home-page')}
            type="default"
          >{t`features_front_page_components_download_index_95hvn2z8_w`}</Button>
          <Button
            className="capitalize"
            onClick={() => link('/download')}
            type="primary"
          >{t`features_front_page_components_download_index_dethgdik0p`}</Button>
        </div>
      </div>
    </FrontPageContainer>
  )
}

export default FrontPageDownload
