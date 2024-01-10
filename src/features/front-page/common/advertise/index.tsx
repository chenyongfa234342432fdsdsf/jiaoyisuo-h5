import { Button } from '@nbit/vant'
import LazyImage, { Type } from '@/components/lazy-image'
import { t } from '@lingui/macro'
import { useUserStore } from '@/store/user'
import { link } from '@/helper/link'
import { useLayoutStore } from '@/store/layout'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../component-should-display'

function FrontPageAdvertise() {
  const { isLogin } = useUserStore()
  const { pageInfoSlogan = [] } = useLayoutStore().guidePageBasicWebInfo || {}
  const { slogan } = useLayoutStore().layoutProps || {}

  const backgroundImage = getGuidePageComponentInfoByKey('background_image', pageInfoSlogan)
  return (
    <div className={`advertise ${styles.scoped}`}>
      <div className="describe">
        <div>{slogan}</div>
      </div>
      <div className="btn">
        {isLogin ? (
          <Button onClick={() => link('/home-page')} type="primary">
            {t`features_front_page_common_advertise_index_0eajvc57an`}
          </Button>
        ) : (
          <Button onClick={() => link('/register')} type="primary">{t`user.login_02`}</Button>
        )}
      </div>
      <div className="image">
        <ShouldGuidePageComponentDisplay {...backgroundImage}>
          <LazyImage src={backgroundImage?.value /* || `${oss_svg_image_domain_address}home_page/advertise` */} />
        </ShouldGuidePageComponentDisplay>
      </div>
    </div>
  )
}

export default FrontPageAdvertise
