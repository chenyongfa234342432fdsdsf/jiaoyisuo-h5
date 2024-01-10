import { useEffect } from 'react'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import { Button } from '@nbit/vant'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useHomeStore } from '@/store/home'
import { link } from '@/helper/link'
import { getGuidePageComponentInfoByKey } from '@/helper/layout'
import styles from './index.module.css'
import ShouldGuidePageComponentDisplay from '../../common/component-should-display'

function DownloadPopUp({ onChange, className }: { onChange?: (v: boolean) => void; className?: string }) {
  const { isDownloadPopupActive, setIsDownloadPopupActive } = useHomeStore()

  const { imgWebIcon, businessName, slogan } = useLayoutStore().layoutProps || {}

  const { pageInfoTopBar } = useLayoutStore().guidePageBasicWebInfo || {}

  const homeIcon = getGuidePageComponentInfoByKey('homeIcon', pageInfoTopBar)

  useEffect(() => {
    onChange && onChange(isDownloadPopupActive)
  }, [isDownloadPopupActive])

  if (!isDownloadPopupActive) return <></>

  return (
    <div className={`download-pop-up ${styles.scoped} ${className}`}>
      <div className="download-pop-up-wrap">
        <div className="brand">
          <ShouldGuidePageComponentDisplay {...homeIcon}>
            <div className="logo">
              <LazyImage src={imgWebIcon} />
            </div>
          </ShouldGuidePageComponentDisplay>

          <div className="content">
            <div className="name">
              <label>{businessName} APP</label>
            </div>
            <div className="text">
              <label>{slogan}</label>
            </div>
          </div>
        </div>

        <div className="btn">
          <Button
            onClick={() => link('/download')}
            type="default"
          >{t`modules_download_index_page_server_5101267`}</Button>
        </div>

        <div className="btn-close" onClick={() => setIsDownloadPopupActive(false)}>
          <Icon name="close" hasTheme />
        </div>
      </div>
    </div>
  )
}

export default DownloadPopUp
