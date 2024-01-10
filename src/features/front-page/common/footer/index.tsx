import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../component-should-display'

function FrontPageFooter() {
  const { imgWebIcon, businessName, webCopyright } = useLayoutStore().layoutProps || {}

  const { pageInfoTopBar } = useLayoutStore().guidePageBasicWebInfo || {}

  const homeIcon = getGuidePageComponentInfoByKey('homeIcon', pageInfoTopBar)

  return (
    <div className={`header ${styles.scoped}`}>
      <div className="brand">
        <ShouldGuidePageComponentDisplay {...homeIcon}>
          <div className="logo">
            <LazyImage src={imgWebIcon} />
          </div>
        </ShouldGuidePageComponentDisplay>

        <div className="name">
          <label>{businessName}</label>
        </div>
      </div>

      <div className="describe">
        <label>
          {businessName} © {webCopyright}
        </label>
      </div>
    </div>
  )
}

export default FrontPageFooter
